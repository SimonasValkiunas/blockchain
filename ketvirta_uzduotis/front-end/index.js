const Web3 = require('web3');
const web3 = new Web3('ws://localhost:8545');
// const deal = require('../build/contracts/Deal.json');
const eth = web3.eth;
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');

app.use(cors());
app.use(bodyParser());

const _gas = 4000000;
const _gasPrice = 2000000;

const Accounts = async () => {
    return await eth.getAccounts();;
}

const Contracts = async (deal) =>{
    let myContract = new eth.Contract(deal.abi);
    return myContract;
}

const DeployContract = async (contract,args, owner) => {
    let deployed = await contract.deploy({data : deal.bytecode, arguments : args}).send({
        from: owner,
        gas: _gas,
        gasPrice: _gasPrice,
      });
    return deployed;
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

//add query order
//add query contracts
//add query invoices
//add get shipping price
//add order the shipment

app.get('/balances', async (req,res)=>{
    let response = await GetBalance();
    res.send(response);
});

//global variables

let deployed_contract;
let accounts;

app.post('/deploy_contract', async (req,res)=>{

    if(req.body.contract_name){
        const deal = require(`../build/contracts/${req.body.contract_name}.json`);

        let contract = await Contracts(deal);
        deployed_contract = await DeployContract(contract,);


    }else res.send("No such contract found");

    



});



app.listen(3000, ()=> console.log("API started on port 3000"));




























async function main(){

    // let contract = await Contracts();
    // let accounts = await Accounts();
    // let deployed = await DeployContract(contract, [accounts[1]], accounts[0]);

    // console.log(deployed.options.address);


    // deployed.once("OrderSent", (error, event) => { 
    //     console.log(event);
    // });
    // deployed.once("PriceSent", (error, event) => { 
    //     console.log(event);
    // });

    // deployed.once("SafepaySent", (error, event) => { 
    //     console.log(event);
    // });

    // deployed.once("InvoiceSent", (error, event) => { 
    //     console.log(event);
    // });

    // deployed.once("OrderDelivered", (error, event) => { 
    //     console.log(error);
    //     console.log('---------------------------------------');

    // });


    // let manufacturer = await deployed.methods.owner().call();
    // let buyer = await deployed.methods.buyerAddr().call();


    // const orderprice = 1000000000000000;
    // const senderprice = 10000000000000;
    // const safeprice = orderprice + senderprice;

    // await SendOrder(deployed,["Test_goods",1],buyer);
    // await SendPrice(deployed,[1,orderprice,1],manufacturer);
    // await SendPrice(deployed,[1,senderprice,2],manufacturer);
    // await SendSafePay(deployed, 1, safeprice, buyer);
    // await SendInvoice(deployed, [1, 20200220, accounts[4]], manufacturer);

    // for(let acc of accounts){
    //     console.log(`${acc}: ${await(eth.getBalance(acc))}`);
    // };


    // await DoneDelivery(deployed, [1, Date.now()], accounts[4]);



    // for(let acc of accounts){
    //     console.log(`${acc}: ${await(eth.getBalance(acc))}`);
    // };

    console.log(await GetBalance());
}