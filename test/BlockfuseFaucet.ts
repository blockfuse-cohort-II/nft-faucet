import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("Faucet Deployment", function () {
  async function deployNFT() {
    const [owner, user1] = await ethers.getSigners();
    const wnerBalanceBeforeMiniting = await ethers.provider.getBalance(owner); 
    console.log(wnerBalanceBeforeMiniting, 'ownerBalanceBeforeMini222ting');
    const baseURI = "https://gateway.pinata.cloud/ipfs/bafkreiez33gazduuhbovvo6g2n6p7gwqxyannea3g7fxqmamryodsy25re";

    // Deploy Token contract
    const BlockfuseNFT = await ethers.getContractFactory("BlockfuseNFT");
    const nft = (await BlockfuseNFT.deploy(baseURI));
    await nft.waitForDeployment();

  

    return { owner, nft };
  }

  async function deployFaucet() {
    const [owner, user1, user2] = await ethers.getSigners();

    const { nft } = await deployNFT();

    //Deoply Faucet Contract
    const BlockfuseFaucet = await ethers.getContractFactory("SepoliaFaucet");
    const faucet = (await BlockfuseFaucet.deploy(nft));
    await faucet.waitForDeployment();

    return { owner, user1, user2, nft, faucet };
  }

  describe("Second Describe Deployment", function () {

    // it("Should deploy the Faucet contract", async function  () {

    //   const [owner, user1] = await ethers.getSigners();
  
    //   // Deploy Token contract
    //   const baseURI = "https://gateway.pinata.cloud/ipfs/bafkreiez33gazduuhbovvo6g2n6p7gwqxyannea3g7fxqmamryodsy25re";
  
  
    //   // Deploy Token contract
    //   const BlockfuseNFT = await ethers.getContractFactory("BlockfuseNFT");
    //   const nft = (await BlockfuseNFT.deploy(baseURI));
    //   await nft.waitForDeployment();
  
    //   //Deoply Faucet Contract
    //   const BlockfuseFaucet = await ethers.getContractFactory("SepoliaFaucet");
    //   const faucet = (await BlockfuseFaucet.deploy(nft));
    //   await faucet.waitForDeployment();
  
    //   const balanceBeforeMintingFirstTest = await ethers.provider.getBalance(user1.address);
    //   console.log(balanceBeforeMintingFirstTest, 'balanceBeforeMintingFirstTEst');
  
  
    //   // Ensure owner has all the tokens
    //   expect(await faucet.owner()).to.equal(owner.address);
    //   expect(await nft.owner()).to.equal(owner.address);
    // });
  
  
    // it("Should deploy the faucet with the correct NFT contract", async function () {
    //   const [owner, user1] = await ethers.getSigners();
  
    //   const NFTFactory = await ethers.getContractFactory("BlockfuseNFT");
    //   const nft = (await NFTFactory.deploy("ipfs://QmExampleHash/"));
    //   await nft.waitForDeployment();
  
    //   // Deploy Faucet Contract
    //   const FaucetFactory = await ethers.getContractFactory("SepoliaFaucet");
    //   const faucet = (await FaucetFactory.deploy(await nft.getAddress()));
    //   await faucet.waitForDeployment();
  
    //   const balanceBeforeMintingFirstTest = await ethers.provider.getBalance(user1.address);
    //   console.log(balanceBeforeMintingFirstTest, 'bbmtSecondTEst');
  
    //   expect(await faucet.nftContract()).to.equal(await nft.getAddress());
    // });
  
  
  
    // it("Should prevent users without an NFT from claiming ETH", async function () {
    //   const [owner, user1] = await ethers.getSigners();
  
    //   // Deploy NFT Contract
    //   const NFTFactory = await ethers.getContractFactory("BlockfuseNFT");
    //   const nft = (await NFTFactory.deploy("ipfs://QmExampleHash/"));
    //   await nft.waitForDeployment();
  
    //   // Deploy Faucet Contract
    //   const FaucetFactory = await ethers.getContractFactory("SepoliaFaucet");
    //   const faucet = (await FaucetFactory.deploy(await nft.getAddress()));
    //   await faucet.waitForDeployment();
  
    //   // User1 does NOT have an NFT, should revert
    //   await expect(faucet.connect(user1).claimETH()).to.be.revertedWith("You must own an NFT to claim ETH");
    // });
  
  
    it("Should allow users with an NFT to claim ETH", async function () {
      const {faucet, owner, user1, nft} = await loadFixture(deployFaucet);
      const ownerBalanceBeforeMiniting = await ethers.provider.getBalance(owner);
      console.log(ownerBalanceBeforeMiniting, 'owner balance before minting');
      const fundFaucetAmount = hre.ethers.parseEther("23");
      await owner.sendTransaction({ to: faucet, value: fundFaucetAmount });
      const claimAmount = ethers.parseEther("0.001");

      
  
      //deploy faucet and fund faucet
      const faucetBalance = await faucet.getBalance();
      console.log(faucetBalance, 'faucetBalance');
  
      const balanceBeforeMinting = await ethers.provider.getBalance(user1.address);
      console.log(balanceBeforeMinting, 'balanceBeforeMinting');
  
      await nft.connect(user1).mint(user1.address);
  
      const balanceBefore = await ethers.provider.getBalance(user1.address);
      console.log(balanceBefore, 'balanceBefore');
  
      const tx = await faucet.connect(user1).claimETH();
      await tx.wait();
  
      // Get user1's ETH balance after claiming
      const balanceAfter = await ethers.provider.getBalance(user1.address);
      console.log(balanceAfter, "balanceAfter");
  
      expect(balanceAfter).to.equal(balanceBefore + claimAmount);
    });
})
})

// describe("Second Describe Deployment", function () {
//   it("Should allow users with an NFT to claim ETH", async function () {
//     const [owner, user1] = await ethers.getSigners();
//     const fundFaucetAmount = ethers.parseEther("0.001");
//     const claimAmount = ethers.parseEther("0.001");

//     // Deploy NFT Contract
//     const NFTFactory = await ethers.getContractFactory("BlockfuseNFT");
//     const nft = (await NFTFactory.deploy("ipfs://QmExampleHash/"));
//     await nft.waitForDeployment();

//     const balanceBeforeMintingBV = await ethers.provider.getBalance(user1.address);
//     console.log(balanceBeforeMintingBV, 'balanceBeforeMintingBefore81');

//     const FaucetFactory = await ethers.getContractFactory("SepoliaFaucet");
//     const faucet = (await FaucetFactory.deploy(await nft.getAddress()));
//     await faucet.waitForDeployment();
//     await owner.sendTransaction({ to: faucet, value: fundFaucetAmount });

//     const balanceBeforeMinting = await ethers.provider.getBalance(user1.address);
//     console.log(balanceBeforeMinting, 'balanceBeforeMinting');

//     await nft.connect(user1).mint(user1.address);

//     const balanceBefore = await ethers.provider.getBalance(user1.address);
//     console.log(balanceBefore, 'balanceBefore');

//     const tx = await faucet.connect(user1).claimETH();
//     await tx.wait();

//     // Get user1's ETH balance after claiming
//     const balanceAfter = await ethers.provider.getBalance(user1.address);
//     console.log(balanceAfter, "balanceAfter");

//     expect(balanceAfter).to.equal(balanceBefore + claimAmount);
//   });

// })