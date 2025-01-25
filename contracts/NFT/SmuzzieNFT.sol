// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmuzzieNFT is ERC721, ERC721Enumerable, Ownable {
  string private _baseTokenURI;
  uint256 private _currentTokenId = 0;

  constructor(
    address initialOwner,
    string memory name,
    string memory symbol,
    string memory baseURI
  ) ERC721(name, symbol) Ownable(initialOwner) {
    _baseTokenURI = baseURI;
  }

  function mint(address to) public returns (uint256) {
    _currentTokenId++;
    _safeMint(to, _currentTokenId);
    return _currentTokenId;
  }

  function _baseURI() internal view override returns (string memory) {
    return _baseTokenURI;
  }

  function setBaseURI(string memory baseURI) public onlyOwner {
    _baseTokenURI = baseURI;
  }

  // Required overrides
  function supportsInterface(
    bytes4 interfaceId
  ) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _increaseBalance(
    address account,
    uint128 amount
  ) internal virtual override(ERC721, ERC721Enumerable) {
    super._increaseBalance(account, amount);
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal virtual override(ERC721, ERC721Enumerable) returns (address) {
    return super._update(to, tokenId, auth);
  }
}
