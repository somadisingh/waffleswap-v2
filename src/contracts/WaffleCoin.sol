// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

contract Token {
    string public name = "Waffle Coin";
    string public symbol = "WFL";
    uint256 public totalSupply = 1000000000000000000000000; // 1 million coins are sent to the user who deployed the contract
    uint8 public decimals = 18; // 1 WFL = 1 ETH

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf; //tells your balance
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() public {
        //ignore warning
        balanceOf[msg.sender] = totalSupply;
    }

    //send coins from one entity to another
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    //spend
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}
