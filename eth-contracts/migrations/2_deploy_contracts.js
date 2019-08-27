// // migrating the appropriate contracts
var SquareVerifier = artifacts.require("./SqVerifier");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier");

module.exports = function(deployer) {
    deployer.deploy(SquareVerifier)
        .then(() => {
            return deployer.deploy(SolnSquareVerifier, SquareVerifier.address);
        })


};