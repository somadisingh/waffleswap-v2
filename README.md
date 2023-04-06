# WaffleSwap

## A Decentralized-Exchange on Ethereum

WaffleSwap is a DEX built on ethereum with a custom token called Waffle Coin. You can use this DApp to buy or sell Waffle Coin in exchange for Ethereum.

## Technologies Used

1. Nextjs and Tailwind CSS for the Frontend Application
2. Ganache Blockchain
3. Truffle and Web3.js for building and testing Smart Contracts
4. Solidity for defining the Smart Contracts backend

## How to run:
1. Clone the repo and install the required dependencies using "yarn -install"
2. Download [Ganache Suite](https://trufflesuite.com/ganache/index.html)
3. Install [Metamask](https://metamask.io/) for your browser
4. Create a custom RPC server in Metamask and copy the RPC URL from ganache. Chain ID is 1337. (For RPC: Either 7545 or 8545 should work). (Custom server should already exist on Metamask, delete that.)
5. Import test accounts from Ganache to Metamask by copying the account private keys from Ganache and import on Metamask via private key option.
6. With ganache running and metamask on stand-by, run cmd command "truffle migrate --reset" in the folder. This migrates all the contracts over to the blockchain. Then run command "truffle test". This command tests all the smart contracts to ensure their integrity.
7. After both the commands execute successfully, run command "yarn dev" to start the project.

### [Connect Metamask and Ganache](https://www.youtube.com/watch?v=lv4HEyiw4EQ)

### [Click Here to Checkout the Demo Video](https://drive.google.com/file/d/1jOtR8McN3XfYdVrPisttgKcJSZ2Mq5nJ/view?usp=sharing)

## Screenshots
![image](https://user-images.githubusercontent.com/78269625/158023103-d1b3b5c4-1d73-4c67-acec-26bdc6e61048.png)
![image](https://user-images.githubusercontent.com/78269625/158023112-528a4f51-dd22-4a18-a3f7-75dfadb5a794.png)

The repo is now deployed to the following links, thanks to @ditholease:
[Link 1](https://dex-xi-six.vercel.app)
[Link 2](https://dex-ditholease.vercel.app)
[Link 3](https://dex-git-main-ditholease.vercel.app)
