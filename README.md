Legacy Vault Frontend

Frontend for Legacy Vault, a decentralized crypto inheritance application built for Ethereum Sepolia.

Overview

Legacy Vault provides a web interface for interacting with a non-custodial inheritance smart contract. The frontend allows users to connect a wallet, view vault information, deposit ETH, perform a proof-of-life check-in, configure a beneficiary and guardian, and claim funds when the smart contract allows it.

The frontend is only the user interface. The smart contract remains responsible for the inheritance rules, access control, vault state, and custody of funds.

Tech Stack

React

Vite

Wagmi

Injected browser wallet

Solidity smart contract

Ethereum Sepolia testnet

Custom CSS

Features

Wallet

Connect a browser wallet

Display the connected wallet address

Disconnect the wallet

Interact with the Ethereum Sepolia network

Vault Dashboard

Displays:

Vault balance

Vault state

Owner address

Beneficiary address

Guardian address

Inactivity timeout

Grace period

Contract address

Check In

The owner can perform a Check In transaction to record continued activity and reset the relevant inactivity timer defined by the smart contract.

Deposit

Users can enter an ETH amount and deposit it directly into the vault.

The frontend converts the entered ETH amount to wei before sending the transaction.

Beneficiary

The owner can set the wallet address that receives the vault funds when the inheritance becomes claimable.

Guardian

The owner can configure the guardian wallet supported by the smart contract.

Claim

The claim action can be used when the vault reaches the state in which the smart contract permits claiming.

The frontend does not determine whether a claim is valid; the smart contract enforces the rules.

Project Structure

legacy-vault-frontend/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── wagmi.js
│   └── Vault.abi.json
├── public/
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md

Adjust the structure above if your local project uses different filenames or folders.

Requirements

Node.js

npm

A browser Ethereum wallet such as MetaMask

Ethereum Sepolia enabled in the wallet

Deployed Legacy Vault contract

Contract ABI

Installation

Clone the repository:

git clone <your-repository-url>

Enter the project directory:

cd legacy-vault-frontend

Install dependencies:

npm install

Configuration

Make sure the frontend is configured with:

Network: Ethereum Sepolia
Contract: Legacy Vault deployed contract
Wallet: Injected browser wallet

The contract ABI should match the deployed Solidity contract.

Never place private keys, seed phrases, or wallet credentials in frontend code.

Run Locally

Start the development server:

npm run dev

Then open:

http://localhost:5173

Connect your wallet and make sure it is switched to Ethereum Sepolia.

Build

Create a production build:

npm run build
