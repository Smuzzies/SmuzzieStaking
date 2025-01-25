// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./SmuzzieStaking.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmuzzieStakingFactory is Ownable {
  event StakingCreated(address stakingAddress, address nftAddress, address tokenAddress);

  mapping(address => bool) public isStakingCreatedByFactory;

  constructor(address initialOwner) Ownable(initialOwner) {}

  function createStaking(
    address nftAddress,
    address tokenAddress,
    uint256 totalRewards,
    uint256 distributionDays
  ) external returns (address) {
    SmuzzieStaking staking = new SmuzzieStaking(
      nftAddress,
      tokenAddress,
      totalRewards,
      distributionDays,
      msg.sender
    );

    isStakingCreatedByFactory[address(staking)] = true;
    emit StakingCreated(address(staking), nftAddress, tokenAddress);
    return address(staking);
  }
}
