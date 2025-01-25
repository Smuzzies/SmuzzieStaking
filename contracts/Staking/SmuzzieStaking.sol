// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmuzzieStaking is ReentrancyGuard, Ownable {
  IERC721Enumerable public immutable smuzzieNFT;
  IERC20 public immutable rewardToken;
  uint256 public immutable totalRewards;
  uint256 public immutable distributionDays;
  uint256 public startTime;
  uint256 public distributedRewards;
  mapping(uint256 => uint256) public lastClaimTime;

  event Claimed(uint256 indexed tokenId, uint256 amount);

  constructor(
    address nftAddress,
    address tokenAddress,
    uint256 _totalRewards,
    uint256 _distributionDays,
    address initialOwner
  ) Ownable(initialOwner) {
    require(_distributionDays > 0, "Distribution days must be > 0");
    require(_totalRewards > 0, "Total rewards must be > 0");

    smuzzieNFT = IERC721Enumerable(nftAddress);
    rewardToken = IERC20(tokenAddress);
    totalRewards = _totalRewards;
    distributionDays = _distributionDays;
    startTime = block.timestamp;

    // Ensure the contract receives the reward tokens
    require(
      rewardToken.transferFrom(msg.sender, address(this), _totalRewards),
      "Failed to transfer reward tokens to contract"
    );
  }

  function getCurrentDay() public view returns (uint256) {
    return (block.timestamp - startTime) / 1 days;
  }

  function getRemainingDays() public view returns (uint256) {
    uint256 currentDay = getCurrentDay();
    return currentDay >= distributionDays ? 0 : distributionDays - currentDay;
  }

  function getDailyRewardPerNFT() public view returns (uint256) {
    uint256 remainingDays = getRemainingDays();
    if (remainingDays == 0) return 0;

    uint256 remainingRewards = totalRewards - distributedRewards;
    uint256 actualBalance = rewardToken.balanceOf(address(this));
    if (actualBalance < remainingRewards) {
      remainingRewards = actualBalance;
    }

    uint256 supply = smuzzieNFT.totalSupply();
    return (remainingRewards / remainingDays) / supply;
  }

  function canClaim(uint256 tokenId) public view returns (bool) {
    if (getCurrentDay() >= distributionDays) return false;
    uint256 lastClaim = lastClaimTime[tokenId];
    if (lastClaim == 0) return true;
    return (block.timestamp - lastClaim) >= 1 days;
  }

  function getClaimableAmount(uint256 tokenId) public view returns (uint256) {
    if (!canClaim(tokenId)) return 0;
    uint256 remainingDays = getRemainingDays();
    if (remainingDays == 0) return 0;
    uint256 totalNFTs = smuzzieNFT.totalSupply();
    return (totalRewards / distributionDays) / totalNFTs;
  }

  function claim(uint256 tokenId) external {
    require(canClaim(tokenId), "Cannot claim yet");
    uint256 amount = getClaimableAmount(tokenId);
    require(amount > 0, "No rewards available");

    lastClaimTime[tokenId] = block.timestamp;
    require(rewardToken.transfer(msg.sender, amount), "Transfer failed");

    distributedRewards += amount;
    emit Claimed(tokenId, amount);
  }

  // Batch claim for multiple NFTs
  function claimRewards(uint256[] calldata tokenIds) external nonReentrant {
    require(getCurrentDay() < distributionDays, "Distribution ended");
    uint256 currentDay = getCurrentDay();
    uint256 totalReward = 0;
    uint256 reward = getDailyRewardPerNFT();
    require(reward > 0, "No rewards available");

    for (uint256 i = 0; i < tokenIds.length; i++) {
      uint256 tokenId = tokenIds[i];
      if (lastClaimTime[tokenId] < currentDay) {
        lastClaimTime[tokenId] = currentDay;
        totalReward += reward;
      }
    }

    if (totalReward > 0) {
      distributedRewards += totalReward;
      require(rewardToken.transfer(msg.sender, totalReward), "Transfer failed");
      emit Claimed(tokenIds[0], totalReward);
    }
  }

  // View functions
  function getNextClaimTime(uint256 tokenId) external view returns (uint256) {
    return startTime + (lastClaimTime[tokenId] + 1) * 1 days;
  }

  // Owner functions
  function withdrawRemainingTokens() external onlyOwner {
    require(getCurrentDay() >= distributionDays, "Distribution period not ended");
    uint256 remainingBalance = rewardToken.balanceOf(address(this));
    require(remainingBalance > 0, "No tokens to withdraw");
    require(rewardToken.transfer(owner(), remainingBalance), "Transfer failed");
  }
}
