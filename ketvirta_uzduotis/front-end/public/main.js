
const _gas = 4000000;
const _gasPrice = 2000000;

// const deal = require('/Deal.json');

const Accounts = async (eth) => {
    return await eth.getAccounts();;
}

const Contracts = async (eth) =>{
    let myContract = new eth.Contract(deal.abi);
    return myContract;
}

const DeployContract = async (contract,args, owner) => {
    let d = await contract.deploy({data : deal.bytecode, arguments : [args]}).send({
        from: owner,
        gas: _gas,
        gasPrice: _gasPrice,
      });
    return d;
}

const SendOrder = async (contract,args,buyer) =>{

    return await contract.methods.sendOrder(args[0],args[1]).send({from : buyer, 
        gas: _gas,
        gasPrice: _gasPrice});
}

const SendPrice = async (contract, args, owner) => {
    return await contract.methods.sendPrice(args[0],args[1],args[2]).send({
        from : owner,
        gas: _gas,
        gasPrice: _gasPrice
    });
};


const SendSafePay = async (contract, args, amount ,buyer) =>{
    return await contract.methods.sendSafepay(args).send({
        from : buyer,
        gas: _gas,
        gasPrice: _gasPrice,
        value : amount,
    })
}

const SendInvoice = async (contract,args,owner) => {
    return await contract.methods.sendInvoice(args[0],args[1],args[2]).send({
        from : owner,
        gas: _gas,
        gasPrice: _gasPrice,
    });
};

const DoneDelivery = async (contract,args,courier) =>{
    return await contract.methods.delivery(args[0],args[1]).send({
        from : courier,
        gas: _gas,
        gasPrice: _gasPrice,
    });
}


const GetBalance = async () =>{
    let accounts = await Accounts();
    let balances = [];
    for(let acc of accounts){
        let balance = {account : acc, money : await(eth.getBalance(acc))};
        balances.push(balance);
    };
    return balances;
}

const QueryOrders = async (contract, args) =>{
    return await contract.methods.queryOrder(args).call();

}

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

const eth = web3.eth;

let deal;
let manufacturer;
let buyer;
let deployed;
// var deployed;

document.addEventListener("DOMContentLoaded", async ()=>{

    const accounts = await Accounts(eth);

        // ------------ Add goods --------------//
        if (document.addEventListener) {
            document.addEventListener("click", handleClick, false);
        }
        else if (document.attachEvent) {
            document.attachEvent("onclick", handleClick);
        }
        // -------------------------------------//
    

    // DEPLOY CONTRACT

    document.querySelector('#deploy').addEventListener('click', async ()=>{

        let contract_name = document.querySelector('#contract_select').value;

        let response = await fetch(contract_name);
        deal = await response.json();

        let contract = await Contracts(eth);


        deployed = await DeployContract(contract, accounts[1], accounts[0]);
        
        document.querySelector('.address').innerHTML = `<h5>${deployed.options.address}</h5>`;

        manufacturer = await deployed.methods.owner().call();
        buyer = await deployed.methods.buyerAddr().call();
    });

    // SEND ORDER

    document.querySelector('#send_order').addEventListener('click', async ()=>{
        let goods = document.querySelector('.good');
        SendOrder(deployed,[goods.querySelector('.goods').value, goods.querySelector('input').value],buyer);

        let order = await QueryOrders(deployed,1);

        let order_template = `<h5>Buyer: ${order.buyer} </br> Product: ${order.goods} </br> Quantity: ${order.quantity} </br> Order number: ${1} </br><h5>`;
        document.querySelector('.orders').innerHTML += order_template;
    });

    //SEND PRICE

    document.querySelector('#set_price').addEventListener('click',async()=>{
        let orderprice = parseInt(document.querySelector('#order_price').value);
        let senderprice = parseInt(document.querySelector('#shipment_price').value);
        let safeprice = orderprice + senderprice;

        let op = await SendPrice(deployed,[1,orderprice,1],manufacturer);
        let sp = await SendPrice(deployed,[1,senderprice,2],manufacturer);

        // console.log(op);
        // console.log(sp);
        document.querySelector('.price_to_pay').innerHTML += `<h5>${safeprice} wei</h5>`
    });


    //SAFE PAY

    document.querySelector('#safepay').addEventListener('click',async () =>{
        let orderprice = parseInt(document.querySelector('#order_price').value);
        let senderprice = parseInt(document.querySelector('#shipment_price').value);
        let safeprice = orderprice + senderprice;

        await SendSafePay(deployed, 1, safeprice, buyer);

    });


    //SEND INVOICE

    document.querySelector('#send_invoice').addEventListener('click', async ()=>{
        await SendInvoice(deployed, [1, 20200220, accounts[4]], manufacturer);
    });


    // DONE DELIVERY

    document.querySelector('#done').addEventListener('click', async () =>{
        await DoneDelivery(deployed, [1, Date.now()], accounts[4]);
    });
    


    let account_template = '';
    for(let acc of accounts){
        let temp = `<h3 class="account_text">Account address: ${acc} </br> Eth: ${await(eth.getBalance(acc))} </h3> </br>`
        account_template += temp;
    };
    document.querySelector('.account_info').innerHTML = account_template;


    document.querySelector('#ask_price').addEventListener('click', ()=>{
        let order_info = document.querySelector('.orders').innerHTML;
        document.querySelector('.orders_courier').innerHTML = order_info;
    });

    document.querySelector('#send_price').addEventListener('click', ()=>{
        let price = document.querySelector('#shipment_price_courier').value;
        document.querySelector('#shipment_price').value = price;
    });


})

//Add later maybe????

const handleClick = async (event) => {
    event = event || window.event;
    event.target = event.target || event.srcElement;

    var element = event.target;

    // Climb up the document tree from the target of the event
    while (element) {
        if (element.nodeName === "BUTTON") {
        // ----------- Account info -----------//
        let accounts = await Accounts(eth);
        let account_template = '';
        for(let acc of accounts){
            let temp = `<h3 class="account_text">Account address: ${acc} </br> Eth: ${await(eth.getBalance(acc))} </h3> </br>`
            account_template += temp;
        };
        document.querySelector('.account_info').innerHTML = account_template;
        // -------------------------------------//
            break;
        }

        element = element.parentNode;
    }
}


