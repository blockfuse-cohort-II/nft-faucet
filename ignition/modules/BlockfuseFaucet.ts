// SPDX-License-Identifier: UNLICENSED
import { IgnitionModule, buildModule } from "@nomicfoundation/ignition-core";

export default buildModule("BlockfuseFaucet", (m) => {
  // Get the deployed NFT contract (Dependency Injection)
  const blockfuseNFT = m.contract("BlockfuseNFT", []);

  // Deploy the BlockfuseFaucet contract using the NFT contract address
  const blockfuseFaucet = m.contract("BlockfuseFaucet", [blockfuseNFT]);

  return { blockfuseNFT, blockfuseFaucet };
});
