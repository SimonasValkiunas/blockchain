const Deal = artifacts.require("./Deal.sol");

module.exports = (deployer,network,accounts) =>{
    deployer.deploy(Deal, accounts[1]);
}