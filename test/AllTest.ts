import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SepoliaFaucet", function () {
  async function deployContracts() {
    const [owner, user1, user2] = await ethers.getSigners();
    const BlockLabToken = await ethers.getContractFactory("BlockfuseNFT");
    const baseURI = "https://ipfs.io/ipfs/QmZQ8662Q1KQ8978z234567890";
    const nft = await BlockLabToken.deploy(baseURI);
    const Faucet = await ethers.getContractFactory("SepoliaFaucet");
    const faucet = await Faucet.deploy(await nft.getAddress());
    await owner.sendTransaction({
      to: await faucet.getAddress(),
      value: ethers.parseEther("1.0"),
    });

    return { faucet, nft, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set the correct owner ...", async function () {
      const { faucet, owner } = await loadFixture(deployContracts);
      expect(await faucet.owner()).to.equal(owner.address);
    });
  });

  describe("check nft Ownership Check", function () {
    it("Should return not true for the address with no nft", async function () {
      const { faucet, user1 } = await loadFixture(deployContracts);
      expect(await faucet.ownsNFT(user1.address)).to.be.false;
    });

    it("Should return a true for address with an nft", async function () {
      const { faucet, nft, user1 } = await loadFixture(deployContracts);
      await nft.mint(user1.address);
      expect(await faucet.ownsNFT(user1.address)).to.be.true;
    });
  });

  describe("eth Claims from the faucet", function () {
    it("Should not allow claims without nft ownership", async function () {
      const { faucet, user1 } = await loadFixture(deployContracts);
      await expect(faucet.connect(user1).claimETH()).to.be.revertedWith(
        "You must own an NFT to claim ETH"
      );
    });

    it("Should not allow claims within 24 hours ..... ", async function () {
      const { faucet, nft, user1 } = await loadFixture(deployContracts);
      await nft.mint(user1.address);
      await faucet.connect(user1).claimETH();
      await expect(faucet.connect(user1).claimETH()).to.be.revertedWith(
        "You can only claim once every 24 hours"
      );
    });

    it("Should not allow claims when faucet is empty", async function () {
      const { faucet, nft, user1, owner } = await loadFixture(deployContracts);
      await nft.mint(user1.address);
      await faucet.connect(owner).withdrawFunds();
      await expect(faucet.connect(user1).claimETH()).to.be.revertedWith(
        "Faucet is empty"
      );
    });
  });

  describe("withdrawals", function () {
    it("Should allow owner to withdraw funds", async function () {
      const { faucet, owner } = await loadFixture(deployContracts);
      const initialBalance = await ethers.provider.getBalance(owner.address);

      await faucet.connect(owner).withdrawFunds();

      expect(await faucet.getBalance()).to.equal(0);
    });

    it("Should not allow non-owner to withdraw funds", async function () {
      const { faucet, user1, owner, nft } = await loadFixture(deployContracts);
      await expect(
        faucet.connect(user1).withdrawFunds()
      ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });
  });
});
