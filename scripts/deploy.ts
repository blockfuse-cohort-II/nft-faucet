import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // Define your IPFS base URI
  const baseURI =
    "https://gateway.pinata.cloud/ipfs/bafkreiez33gazduuhbovvo6g2n6p7gwqxyannea3g7fxqmamryodsy25re";

  // Deploy BlockfuseNFT with baseURI
  const BlockfuseNFT = await ethers.getContractFactory("BlockfuseNFT");
  const blockfuseNFT = await BlockfuseNFT.deploy(baseURI);
  await blockfuseNFT.waitForDeployment(); 
  console.log(`BlockfuseNFT deployed at: ${await blockfuseNFT.getAddress()}`);

  // Deploy SepoliaFaucet with NFT contract address
  const SepoliaFaucet = await ethers.getContractFactory("SepoliaFaucet");
  const sepoliaFaucet = await SepoliaFaucet.deploy(
    await blockfuseNFT.getAddress()
  );
  await sepoliaFaucet.waitForDeployment();
  console.log(`SepoliaFaucet deployed at: ${await sepoliaFaucet.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
