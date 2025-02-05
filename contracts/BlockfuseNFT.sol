// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockfuseNFT is ERC721, Ownable {
    uint256 public tokenCounter;
    mapping(address => bool) public hasMinted;

    constructor() ERC721("BlockfuseNFT", "BFN") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function mint() public {
        require(!hasMinted[msg.sender], "You already own an NFT");
        hasMinted[msg.sender] = true;
        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        tokenCounter = tokenId + 1;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        if this.ownerOf(tokenId) {
            return true;
        } else {
            return false;
        }
    }
}
