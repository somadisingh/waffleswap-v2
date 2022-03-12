// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;
import "./WaffleCoin.sol";

//truffle compile: compile contracts to check for errors
//truffle test: test the contracts

contract WaffleSwap {
    string public name = "WaffleSwap DEX";
    Token public token; //keep track of tokens in the contract
    uint256 public rate = 100; //1 eth = 100 WFL

    event TokensPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    event TokensSold(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        //transfer tokens from contract to buyer

        //eth amount * redemption rate
        //redemption rate: no. of tokens received per 1 eth
        uint256 tokenAmount = msg.value * rate;

        require(token.balanceOf(address(this)) >= tokenAmount); //purchase amount should be less than exchange balance

        //transfers tokens to user after checking above condition == True
        token.transfer(msg.sender, tokenAmount);

        //emit an event
        emit TokensPurchased((msg.sender), address(token), tokenAmount, rate);
    }

    function sellTokens(uint256 _amount) public {
        //user cant sell more tokens than they have
        require(token.balanceOf(msg.sender) >= _amount);

        //calculate the amount of eth to redeem
        uint256 etherAmount = _amount / rate;

        //check if waffleswap has enough eth before performing sale
        require(address(this).balance >= (etherAmount));

        //transfer tokens from seller to contract
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount); //ignore error as solidity v0.5.0

        emit TokensSold((msg.sender), address(token), _amount, rate);
    }
}
