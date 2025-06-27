// src/config/wagmi.ts
import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { type Chain } from "wagmi/chains"
import { avalancheFuji } from "wagmi/chains"

// Monad Testnet Configuration
const monadTestnet: Chain = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "MON",
    symbol: "MON",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.monad.xyz/"],
    },
    public: {
      http: ["https://testnet-rpc.monad.xyz/"],
    },
  },
  blockExplorers: {
    default: {
      name: "MonadScan",
      url: "https://testnet.monadexplorer.com",
    },
  },
  testnet: true,
}

export const config = getDefaultConfig({
  appName: "Fund Ur Memory",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [avalancheFuji, monadTestnet],
  ssr: true,
})