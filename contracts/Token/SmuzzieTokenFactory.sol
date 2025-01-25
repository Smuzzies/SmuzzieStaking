// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./SmuzzieHoldingToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmuzzieTokenFactory is Ownable {
  event TokenCreated(address tokenAddress, string name, string symbol);

  mapping(address => bool) public isTokenCreatedByFactory;

  constructor(address initialOwner) Ownable(initialOwner) {}

  function createToken(
    string memory name,
    string memory symbol,
    uint256 initialSupply
  ) external returns (address) {
    SmuzzieHoldingToken token = new SmuzzieHoldingToken(msg.sender, name, symbol, initialSupply);

    isTokenCreatedByFactory[address(token)] = true;
    emit TokenCreated(address(token), name, symbol);
    return address(token);
  }
}
