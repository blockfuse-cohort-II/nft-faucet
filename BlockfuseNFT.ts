// SPDX-License-Identifier: UNLICENSED
import { IgnitionModule, buildModule } from "@nomicfoundation/ignition-core";

export default buildModule("BlockfuseNFT", (m) => {
  // Deploy the BlockfuseNFT contract
  const blockfuseNFT = m.contract("BlockfuseNFT", []);

  return { blockfuseNFT };
});
