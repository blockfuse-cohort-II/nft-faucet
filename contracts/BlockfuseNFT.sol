// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.28;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// contract BlockfuseNFT is ERC721, Ownable {
//     uint256 public tokenCounter;
//     mapping(address => bool) public hasMinted;

//     constructor() ERC721("BlockfuseNFT", "BFN") Ownable(msg.sender) {
//         tokenCounter = 0;
//     }

//     function mint(address to) public {
//         require(!hasMinted[to], "You already own an NFT");
//         hasMinted[to] = true;
//         uint256 tokenId = tokenCounter;
//         _safeMint(to, tokenId);
//         tokenCounter += 1;
//     }

// }

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockfuseNFT is ERC721, Ownable {
    uint256 public tokenCounter;
    mapping(address => bool) public hasMinted;
    string private baseURI;

    constructor(
        string memory _baseURI
    ) ERC721("Katera NFT", "KFT") Ownable(msg.sender) {
        tokenCounter = 0;
        baseURI = _baseURI; // Set IPFS base URI during deployment
    }

    function mint(address to) public {
        require(!hasMinted[to], "You already own an NFT");
        hasMinted[to] = true;
        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);
        tokenCounter += 1;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);

        // string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string.concat(baseURI) : "";
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        try this.ownerOf(tokenId) {
            return true;
        } catch {
            return false;
        }
    }
}
