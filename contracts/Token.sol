//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
    address public owner;
    uint256 public totalSupply;

    string public constant name = "ZashheCoin";
    string public constant symbol = '#';
    uint8 public constant decimals = 18;

    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;

    constructor() {
        owner = msg.sender;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    function balanceOf(address _owner) external view returns (uint256 balance) {
        return balances[_owner];
    }

    function allowance(address _owner, address _spender) external view returns (uint256) {
        return allowances[_owner][_spender];
    }

    function transfer(address _to, uint256 _value) external returns (bool) {
        return _transfer(msg.sender, _to, _value);
    }

    function _transfer(address _from, address _to, uint256 _value) internal returns (bool) {
        require(balances[_from] >= _value, "Account doesn't have enough tokens");
        balances[_to] += _value;
        balances[_from] -= _value;            

        emit Transfer(_from, _to, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool) {
        require(allowances[_from][msg.sender] >= _value, "Account don't have enough allowance");
        allowances[_from][msg.sender] -= _value;

        return _transfer(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value) external returns (bool) {
        allowances[msg.sender][_spender] = _value;
        
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function mint(address to, uint256 amount) external isOwner returns (bool success) {
        totalSupply += amount;
        balances[to] += amount;
        return true;
    }

    function burn(address from, uint256 amount) external isOwner returns (bool success) {
        totalSupply -= amount;
        balances[from] -= amount;
        return true;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Access denied");
        _;
    }
}