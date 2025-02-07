import { expect } from "chai";
import { ethers } from "hardhat";
import { BlockfuseNFT, BlockfuseNFT__factory, SepoliaFaucet, SepoliaFaucet__factory } from "../typechain-types";

describe("BlockfuseNFT & SepoliaFaucet", function () {
  let blockfuseNFT: BlockfuseNFT;
  let faucet: SepoliaFaucet;
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

    const SepoliaFaucetFactory: SepoliaFaucet__factory = <SepoliaFaucet__factory>(
      await ethers.getContractFactory("SepoliaFaucet")
    );
    faucet = await SepoliaFaucetFactory.deploy(blockfuseNFT.getAddress());
    await faucet.deploymentTransaction();


    await owner.sendTransaction({
      to: await faucet.getAddress(),
      value: ethers.parseEther("1.0"),
    });
  });

  describe("Faucet Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await faucet.owner()).to.equal(owner.address);
    });

    it("Should set the correct NFT contract address", async function () {
      expect(await faucet.nftContract()).to.equal(await blockfuseNFT.getAddress());
    });

    it("Should have the correct initial balance", async function () {
      expect(await faucet.getBalance()).to.equal(ethers.parseEther("1.0"));
    });
  });

  describe("NFT Ownership Check", function () {
    it("Should return false for address with no NFT", async function () {
      expect(await faucet.ownsNFT(addr1.address)).to.be.false;
    });

    it("Should return true for address with NFT", async function () {
      await blockfuseNFT.mint(addr1.address);
      expect(await faucet.ownsNFT(addr1.address)).to.be.true;
    });
  });

  describe("ETH Claims", function () {
    it("Should fail if user doesn't own an NFT", async function () {
      await expect(faucet.connect(addr1).claimETH())
        .to.be.revertedWith("You must own an NFT to claim ETH");
    });

    it("Should allow claim with NFT ownership", async function () {
      await blockfuseNFT.mint(addr1.address);
      const initialBalance = await ethers.provider.getBalance(addr1.address);
      await faucet.connect(addr1).claimETH();
      const finalBalance = await ethers.provider.getBalance(addr1.address);
      expect(finalBalance - initialBalance).to.be.greaterThan(0);
    });

    it("Should prevent claims within 24 hours", async function () {
      await blockfuseNFT.mint(addr1.address);
      await faucet.connect(addr1).claimETH();
      await expect(faucet.connect(addr1).claimETH())
        .to.be.revertedWith("You can only claim once every 24 hours");
    });

    it("Should allow claims after 24 hours", async function () {
      await blockfuseNFT.mint(addr1.address);
      await faucet.connect(addr1).claimETH();
      await ethers.provider.send("evm_increaseTime", [86401]);
      await ethers.provider.send("evm_mine");
      await expect(faucet.connect(addr1).claimETH()).to.not.be.reverted;
    });

    it("Should fail if faucet is empty", async function () {
      const EmptyFaucetFactory: SepoliaFaucet__factory = <SepoliaFaucet__factory>(
        await ethers.getContractFactory("SepoliaFaucet")
      );
      const emptyFaucet = await EmptyFaucetFactory.deploy(await blockfuseNFT.getAddress());
      await emptyFaucet.deploymentTransaction();
      
      await blockfuseNFT.mint(addr1.address);
      await expect(emptyFaucet.connect(addr1).claimETH())
        .to.be.revertedWith("Faucet is empty");
    });
  });

  describe("Fund Management", function () {
    it("Should accept ETH transfers", async function () {
      const initialBalance = await faucet.getBalance();
      await owner.sendTransaction({
        to: await faucet.getAddress(),
        value: ethers.parseEther("0.5"),
      });
      expect(await faucet.getBalance()).to.equal(initialBalance + ethers.parseEther("0.5"));
    });

    it("Should allow owner to withdraw funds", async function () {
      const initialBalance = await ethers.provider.getBalance(owner.address);
      const faucetBalance = await faucet.getBalance();
      
      await faucet.withdrawFunds();
      
      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(await faucet.getBalance()).to.equal(0);
      expect(finalBalance).to.be.greaterThan(initialBalance);
    });

    it("Should prevent non-owner from withdrawing funds", async function () {
      await expect(faucet.connect(addr1).withdrawFunds())
        .to.be.revertedWithCustomError(faucet, "OwnableUnauthorizedAccount");
    });
  });
});
