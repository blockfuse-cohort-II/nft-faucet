import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("NFT Deployment", function () {
  
  it("Should deploy the NFT contract and set base url", async function () {
    const [owner] = await ethers.getSigners();
    const baseURI = "https://gateway.pinata.cloud/ipfs/bafkreiez33gazduuhbovvo6g2n6p7gwqxyannea3g7fxqmamryodsy25re";


    // Deploy Token contract
    const BlockfuseNFT = await ethers.getContractFactory("BlockfuseNFT");
    const nft = (await BlockfuseNFT.deploy(baseURI));
    await nft.waitForDeployment();

    const ownerBalance = await nft.balanceOf(owner.address);

    // Ensure owner has all the tokens
    expect(await nft.tokenCounter()).to.equal(0);
    expect(await nft.owner()).to.equal(owner.address);
  });

it("Should allow users to mint only once", async function () {
    const [owner, user1, user2] = await ethers.getSigners();
    const baseURI = "xxcccc";

    // Deploy NFT Contract
    const NFTFactory = await ethers.getContractFactory("BlockfuseNFT");
    const nft = (await NFTFactory.deploy(baseURI));
    await nft.waitForDeployment();

    await nft.connect(user1).mint(user1.address);
    expect(await nft.balanceOf(user1.address)).to.equal(1);

    await nft.connect(user2).mint(user2.address);
    expect(await nft.balanceOf(user2.address)).to.equal(1);

    // Attempt to mint again for user1 (should fail)
    await expect(nft.connect(user1).mint(user1.address)).to.be.revertedWith(
      "You already own an NFT"
    );
  });

  it("Should return the correct token URI", async function () {
    const [owner, user1] = await ethers.getSigners();
    const baseURI = "ipfs://QmExampleHash/";

    // Deploy NFT Contract
    const NFTFactory = await ethers.getContractFactory("BlockfuseNFT");
    const nft = (await NFTFactory.deploy(baseURI));
    await nft.waitForDeployment();

    // Mint NFT
    await nft.connect(user1).mint(user1.address);
    expect(await nft.tokenURI(0)).to.equal(baseURI);
  });
})