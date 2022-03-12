const { assert } = require('chai')
const { default: Web3 } = require('web3')

// writing tests for the smart contracts
const Token = artifacts.require("Token")
const WaffleSwap = artifacts.require("WaffleSwap")

//chai will be used to help run tests
require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) { //convert wei to ether
    return web3.utils.toWei(n, 'ether');
}

//test to ensure that contract was deployed to the network
contract('WaffleSwap', ([deployer, investor]) => {
    let token, waffleSwap

    before(async () => {
        token = await Token.new()
        waffleSwap = await WaffleSwap.new(token.address)
        await token.transfer(waffleSwap.address, tokens('1000000'))
    })

    //check WaffleCoin.sol contract
    describe('Token deployment', async () => {
        it('contract has a name', async () => {
            const name = await token.name()
            assert.equal(name, 'Waffle Coin')
        })
    })

    //check WaffleSwap.sol contract
    describe('WaffleSwap deployment', async () => {
        it('contract has a name', async () => {
            const name = await waffleSwap.name()
            assert.equal(name, 'WaffleSwap DEX')
        })
        //check if the contract has tokens
        it('contract has tokens', async () => {
            let balance = await token.balanceOf(waffleSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('buyTokens()', async () => {
        let result

        before(async () => {
            //purchase tokens before each example
            result = await waffleSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether') })
        })
        it('Allows user to instantly purchase tokens from DEX at market price', async () => {
            //check if investor receives tokens after purchase
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))

            //check contract balance after purchase
            let waffleSwapBalance
            waffleSwapBalance = await token.balanceOf(waffleSwap.address)
            assert.equal(waffleSwapBalance.toString(), tokens('999900'))
            waffleSwapBalance = await web3.eth.getBalance(waffleSwap.address)
            assert.equal(waffleSwapBalance.toString(), web3.utils.toWei('1', 'Ether'))

            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')

        })
    })

    describe('sellTokens()', async () => {
        let result

        before(async () => {
            //investor must approve the sale
            await token.approve(waffleSwap.address, tokens('100'), { from: investor })
            //tokens are sold
            result = await waffleSwap.sellTokens(tokens('100'), { from: investor })
        })
        it('Allows user to instantly sell tokens to DEX at market price', async () => {
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('0'))

            let waffleSwapBalance
            waffleSwapBalance = await token.balanceOf(waffleSwap.address)
            assert.equal(waffleSwapBalance.toString(), tokens('1000000'))
            waffleSwapBalance = await web3.eth.getBalance(waffleSwap.address)
            assert.equal(waffleSwapBalance.toString(), web3.utils.toWei('0', 'Ether'))

            //check logs to ensure that the event was emitted with correct data
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')

            //failure: investor can't sell more tokens than they have
            await waffleSwap.sellTokens(tokens('500'), { from: investor }).should.be.rejected;
        })

    })

}) 