// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockfuseNFT is ERC721, Ownable {
   uint256 public tokenCounter;
    mapping(address => bool) public hasMinted;
    mapping(uint256 => string) private _tokenURIs;

    string private constant _imageURI = "https://res.cloudinary.com/mbrag/image/upload/v1739118203/logo2_ylvo4v.png";  // Hardcoded image URL

    constructor() ERC721("Katera NFT", "KFT") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://res.cloudinary.com/mbrag/image/upload/";  // Cloudinary URL or IPFS URL
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(this.exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        
        return string(
            abi.encodePacked(
                "{",
                '"name": "Katera NFT #', uint2str(tokenId), '",',
                '"description": "A unique NFT from the Katera Faucet",',
                '"image": "', _imageURI, '"',
                "}"
            )
        );
    }

    function exists(uint256 tokenId) public view returns (bool) {
        try this.ownerOf(tokenId) {
            return true;
        } catch {
            return false;
        }
    }

    function mint(address to) public {
        require(!hasMinted[to], "You already own an NFT");
        hasMinted[to] = true;

        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);

        _tokenURIs[tokenId] = _imageURI;

        tokenCounter += 1;
    }

    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        str = string(bstr);
    }

}


