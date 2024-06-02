"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { trustWallet, ledgerWallet } from "@rainbow-me/rainbowkit/wallets";
import { klaytn, klaytnBaobab } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";

const { wallets } = getDefaultWallets();

// Define the Unique chain
const uniqueChain = {
  id: 8880, // Sửa thành 8880 hoặc "0x22b0"
  name: "Unique",
  network: "unique",
  nativeCurrency: {
    name: "Unique",
    symbol: "UNQ",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.unique.network"],
      websocket: ["wss://ws.unique.network"],
    },
    public: {
      http: ["https://rpc.unique.network"],
      websocket: ["wss://ws.unique.network"],
    },
  },
  blockExplorers: {
    default: { name: "UniqueScan", url: "https://unique.subscan.io/" },
  },
  testnet: false,
};

// Define the Unique chain
const quartzMainnet = {
  id: 8881, // Sửa thành 8880 hoặc "0x22b0"
  name: "Quartz",
  network: "quartz",
  nativeCurrency: {
    name: "Quartz",
    symbol: "QTZ",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-quartz.unique.network"],
      websocket: ["wss://ws-quartz.unique.network"],
    },
    public: {
      http: ["https://rpc-quartz.unique.network"],
      websocket: ["wss://ws-quartz.unique.network"],
    },
  },
  blockExplorers: {
    default: { name: "Quartz", url: "https://quartz.subscan.io/" },
  },
  testnet: false,
};

// Define the Unique chain
const opalTestnet = {
  id: 8882, // Sửa thành 8880 hoặc "0x22b0"
  name: "Opal",
  network: "opal",
  nativeCurrency: {
    name: "Opal",
    symbol: "OPL",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-opal.unique.network"],
      websocket: ["wss://ws-opal.unique.network"],
    },
    public: {
      http: ["https://rpc-opal.unique.network"],
      websocket: ["wss://ws-opal.unique.network"],
    },
  },
  blockExplorers: {
    default: { name: "Opal", url: "https://opal.subscan.io/" },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: "DApp Bootcamp Frontends",
  projectId: "b735f0d8b8e242fb3e26f7c8dd1062b1",
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [trustWallet, ledgerWallet],
    },
  ],
  chains: [uniqueChain, quartzMainnet, opalTestnet, klaytn, klaytnBaobab], // Thêm uniqueChain vào mảng chains
  transports: {
    [8880]: http("https://rpc.unique.network"),
    [8881]: http("https://rpc-quartz.unique.network"),
    [8882]: http("https://rpc-opal.unique.network"),
    [klaytn.id]: http("https://public-en-cypress.klaytn.net"),
    [klaytnBaobab.id]: http("https://rpc.ankr.com/klaytn_testnet"),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
