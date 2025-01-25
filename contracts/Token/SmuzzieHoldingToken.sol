// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmuzzieHoldingToken is ERC20, Ownable {
  constructor(
    address initialOwner,
    string memory name,
    string memory symbol,
    uint256 initialSupply
  ) ERC20(name, symbol) Ownable(initialOwner) {
    _mint(msg.sender, initialSupply);
  }

  function mint(address to, uint256 amount) public {
    _mint(to, amount);
  }
}
