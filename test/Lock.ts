import { expect } from "chai";
import { ethers } from "hardhat";
import { BlockfuseNFT, BlockfuseNFT__factory } from "../typechain-types";

describe("BlockfuseNFT", function () {
  let blockfuseNFT: BlockfuseNFT;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const BlockfuseNFTFactory: BlockfuseNFT__factory = <BlockfuseNFT__factory>(
      await ethers.getContractFactory("BlockfuseNFT")
    );
    blockfuseNFT = await BlockfuseNFTFactory.deploy();
    await blockfuseNFT.deploymentTransaction();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await blockfuseNFT.name()).to.equal("BlockfuseNFT");
      expect(await blockfuseNFT.symbol()).to.equal("BFN");
    });

    it("Should initialize tokenCounter to 0", async function () {
      expect(await blockfuseNFT.tokenCounter()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should allow an address to mint an NFT if they haven't already", async function () {
      const initialTokenCounter = await blockfuseNFT.tokenCounter(); 
      await blockfuseNFT.mint(addr1.address);
      expect(await blockfuseNFT.tokenCounter()).to.equal(initialTokenCounter + 1n); // Use 1n for bigint addition
      expect(await blockfuseNFT.ownerOf(0)).to.equal(addr1.address);
      expect(await blockfuseNFT.hasMinted(addr1.address)).to.equal(true);
    });

    it("Should prevent an address from minting more than one NFT", async function () {
      await blockfuseNFT.mint(addr1.address);
      await expect(blockfuseNFT.mint(addr1.address)).to.be.revertedWith("You already own an NFT");
    });

    it("Should allow multiple addresses to mint unique NFTs", async function () {
      await blockfuseNFT.mint(addr1.address);
      await blockfuseNFT.mint(addr2.address);

      expect(await blockfuseNFT.ownerOf(0)).to.equal(addr1.address);
      expect(await blockfuseNFT.ownerOf(1)).to.equal(addr2.address);
      expect(await blockfuseNFT.hasMinted(addr1.address)).to.equal(true);
      expect(await blockfuseNFT.hasMinted(addr2.address)).to.equal(true);
    });
  });

  describe("Token Existence", function () {
    it("Should return true for existing tokens", async function () {
      await blockfuseNFT.mint(addr1.address);
      expect(await blockfuseNFT.exists(0)).to.equal(true);
    });

    it("Should return false for non-existing tokens", async function () {
      expect(await blockfuseNFT.exists(0)).to.equal(false);
      await blockfuseNFT.mint(addr1.address);
      expect(await blockfuseNFT.exists(1)).to.equal(false);
    });
  });

  // describe("Ownership", function () {
  //   it("Should restrict minting to the owner only if desired (optional)", async function () {
  //     /*
  //     Uncomment the following lines if you modify the `mint` function to be `onlyOwner`
      
  //     await expect(blockfuseNFT.connect(addr1).mint(addr1.address)).to.be.revertedWith("Ownable: caller is not the owner");

  //     // Owner can mint
  //     await blockfuseNFT.mint(addr1.address);
  //     expect(await blockfuseNFT.ownerOf(0)).to.equal(addr1.address);
  //     */
  //   });
  // });
});