const Token = artifacts.require("Token");
const WaffleSwap = artifacts.require("WaffleSwap");


module.exports = async function (deployer) {
    //deploy coin
    await deployer.deploy(Token);
    const token = await Token.deployed()

    //deploy waffleswap contract
    await deployer.deploy(WaffleSwap, token.address);
    const waffleSwap = await WaffleSwap.deployed()

    //transfer all tokens to waffleswap contract (exchange)
    await token.transfer(waffleSwap.address, '1000000000000000000000000')

};
//this migration file puts a smart contract on the blockchan

