import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // Deploy BlockfuseNFT
  const BlockfuseNFT = await ethers.getContractFactory("BlockfuseNFT");
  const blockfuseNFT = await BlockfuseNFT.deploy(); // ✅ Removed .deployed()
  console.log(`BlockfuseNFT deployed at: ${await blockfuseNFT.getAddress()}`); // ✅ Use getAddress()

  // Deploy SepoliaFaucet with NFT contract address
  const SepoliaFaucet = await ethers.getContractFactory("SepoliaFaucet");
  const sepoliaFaucet = await SepoliaFaucet.deploy(await blockfuseNFT.getAddress()); // ✅ Use getAddress()
  console.log(`SepoliaFaucet deployed at: ${await sepoliaFaucet.getAddress()}`); // ✅ Use getAddress()
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
