# Legacy Vault — Frontend

A React interface for interacting with the Legacy Vault smart contract — a non-custodial, inactivity-triggered inheritance vault for crypto assets, deployed on Sepolia testnet.

## What it does

- Connects to MetaMask (or any injected wallet)
- Reads live on-chain data: vault state (Active / Pending / Claimable), balance, owner, guardian, and heir
- Lets the connected wallet:
  - Deposit a custom ETH amount into the vault
  - Check in (reset the inactivity clock)
  - Claim the vault's funds (once Claimable)
  - Designate a heir (beneficiary)
  - Designate a guardian

All actions are real transactions signed through MetaMask and confirmed on Sepolia — nothing is mocked or simulated.

## How it connects to the contract

This frontend does not deploy or modify the smart contract — it only reads from and writes to an already-deployed instance. The contract itself lives in a separate repo: [legacy-vault](https://github.com/nikhilcommits/legacy-vault).

- **Deployed contract:** `0xFE1651a4e76847480C455e27071714E83f7aEC90`
- **Network:** Sepolia testnet
- **Verified source:** [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0xfe1651a4e76847480c455e27071714e83f7aec90#code)

## Tech Stack

- React + Vite
- [wagmi](https://wagmi.sh/) — React hooks for Ethereum
- [viem](https://viem.sh/) — low-level Ethereum client wagmi is built on
- @tanstack/react-query — async state management (required by wagmi)

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in a browser with MetaMask installed. Switch MetaMask to the **Sepolia** test network before connecting.

## Project structure

- `App.jsx` — Main UI (vault status, actions, wallet connect)
- `wagmi.js` — wagmi config: chains, connectors, contract address
- `Vault.abi.json` — Contract ABI (generated from Foundry build output)
- `main.jsx` — App entry point, wraps App in WagmiProvider
