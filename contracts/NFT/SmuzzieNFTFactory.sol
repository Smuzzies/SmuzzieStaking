// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./SmuzzieNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmuzzieNFTFactory is Ownable {
  event NFTCreated(address nftAddress, string name, string symbol);

  mapping(address => bool) public isNFTCreatedByFactory;

  constructor(address initialOwner) Ownable(initialOwner) {}

  function createNFT(
    string memory name,
    string memory symbol,
    string memory baseURI
  ) external returns (address) {
    SmuzzieNFT nft = new SmuzzieNFT(msg.sender, name, symbol, baseURI);

    isNFTCreatedByFactory[address(nft)] = true;
    emit NFTCreated(address(nft), name, symbol);
    return address(nft);
  }
}
