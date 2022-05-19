//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Staking {

    mapping(address => uint256) stakedBalance;
    mapping(address => uint256) rewardBalance;
    mapping(address => uint256) lastUpdate;

    Token public lpToken;
    Token public rewardToken;

    uint256 private claimDuration;
    uint256 private rewardPercent;

    constructor(Token _lpToken, Token _rewardToken, uint256 _claimDuration, uint256 _rewardPercent) {
        lpToken = _lpToken;
        rewardToken = _rewardToken;
        claimDuration = _claimDuration;
        rewardPercent = _rewardPercent;
    }

    function stake(uint256 _amount) external {
        require(lpToken.balanceOf(msg.sender) >= _amount, "Account doesn't have enough tokens");

        lpToken.transferFrom(msg.sender, address(this), _amount);

        updateReward();
        stakedBalance[msg.sender] += _amount;
    }

    function claim() external {
        updateReward();
        uint256 reward = rewardBalance[msg.sender];
        rewardBalance[msg.sender] = 0; // avoiding reentrancy
        lastUpdate[msg.sender] = block.timestamp;

        rewardToken.transfer(msg.sender, reward);
    }

    function unstake() external {
        updateReward();
        uint256 staked = stakedBalance[msg.sender];
        stakedBalance[msg.sender] = 0; // avoiding reentrancy
        lpToken.transfer(msg.sender, staked);
    }

    function updateReward() internal {
        rewardBalance[msg.sender] += calcReward(stakedBalance[msg.sender], lastUpdate[msg.sender], block.timestamp);
        lastUpdate[msg.sender] = block.timestamp;
    }

    function calcReward(uint256 staked, uint256 timeFrom, uint256 timeTo) view internal returns (uint256) {
        if (timeFrom == 0) {
            return 0;
        }

        return staked * (timeTo - timeFrom) / claimDuration * rewardPercent / 100; 
    }
}