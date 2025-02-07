# KATERA FAUCET

## Overview

This project consists of two Solidity smart contracts: **SepoliaFaucet** and **BlockfuseNFT**. These contracts allow users to claim Sepolia testnet ETH if they own an NFT from the **BlockfuseNFT** collection. The faucet distributes ETH once every 24 hours to eligible users.

## Contracts

### 1. **BlockfuseNFT** (ERC-721 NFT Contract)

This contract implements an ERC-721 NFT collection where each address can mint one unique NFT.

#### Features:

- **Minting:** Users can mint a single NFT to their address.
- **Ownership Check:** Ensures each address can only mint one NFT.
- **Token Existence Check:** Provides a function to check if a token ID exists.

#### Functions:

- `mint(address to)`: Mints an NFT to the given address.
- `exists(uint256 tokenId)`: Checks if a given token ID exists.

### 2. **SepoliaFaucet** (ETH Faucet)

This contract distributes Sepolia ETH to users who own a **BlockfuseNFT**.

#### Features:

- **NFT Ownership Check:** Only users who own an NFT can claim ETH.
- **Claim Restriction:** Users can only claim once every 24 hours.
- **ETH Withdrawal:** The contract owner can withdraw all funds from the faucet.
- **Funding Mechanism:** Allows anyone to send ETH to the contract to fund the faucet.

#### Functions:

- `claimETH()`: Allows NFT holders to claim **0.001 ETH** once every 24 hours.
- `ownsNFT(address user)`: Checks if the user owns at least one NFT.
- `withdrawFunds()`: Allows the owner to withdraw the contract's balance.
- `getBalance()`: Returns the contract's ETH balance.
- `receive()`: Accepts ETH deposits to fund the faucet.

## Deployment

### 1. Deploy **BlockfuseNFT**

Deploy the `BlockfuseNFT` contract first, as its address is required for deploying `SepoliaFaucet`.

### 2. Deploy **SepoliaFaucet**

Deploy the `SepoliaFaucet` contract, passing the address of `BlockfuseNFT` as an argument to the constructor.

## Usage

1. **Mint an NFT:** Call `mint(address)` on `BlockfuseNFT` to receive an NFT.
2. **Fund the Faucet:** Send ETH to the `SepoliaFaucet` contract.
3. **Claim ETH:** Call `claimETH()` on `SepoliaFaucet` if you own an NFT.
4. **Withdraw Funds:** The owner can call `withdrawFunds()` to withdraw all funds from the faucet.

## Requirements

- Solidity `^0.8.28`
- OpenZeppelin Contracts (`ERC721`, `Ownable`, `IERC721`)
- A funded Sepolia account for deployment
- A blockchain development environment like Hardhat or Foundry

## 🛠️ Installation
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-username/nft-faucet.git
cd nft-faucet

### **2️⃣ Install Dependencies
```sh
npm install
```

### **3️⃣Compile Smart Contracts
```sh
npx hardhat compile
```

### **4️⃣ Run Tests
```sh
npx hardhat test
```

### 🚀 Deploying to Sepolia Testnet
### **1️⃣ Configure Environment Variables
Create a .env file in the root directory and add:
```sh
PRIVATE_KEY=your_wallet_private_key
ALCHEMY_API_KEY=your_alchemy_api_key
```

### **2️⃣ Deploy the Contract
```sh
npx hardhat run scripts/deploy.ts --network sepolia
```

### **🤝 Contributing
1. Fork the repository
2. Create a feature branch (git checkout -b feature-name)
3. Commit your changes (git commit -m "Add feature X")
4. Push to the branch (git push origin feature-name)
5. Create a Pull Request


## License

This project is licensed under the **MIT License**.

