import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
  },
})

// Your deployed contract's address on Sepolia
export const VAULT_ADDRESS = '0xFE1651a4e76847480C455e27071714E83f7aEC90'