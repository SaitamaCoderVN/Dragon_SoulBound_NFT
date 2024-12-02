"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { trustWallet, ledgerWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";

const { wallets } = getDefaultWallets();


// Define the Kaia chain
const kaia = {
  id: 8_217,
  name: 'Kaia',
  nativeCurrency: {
    decimals: 18,
    name: 'Kaia',
    symbol: 'KAIA',
  },
  rpcUrls: {
    default: { http: ['https://public-en.node.kaia.io'] },
  },
  blockExplorers: {
    default: {
      name: 'KaiaScan',
      url: 'https://kaiascan.io',
      apiUrl: 'https://api-cypress.klaytnscope.com/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11' as `0x${string}`,
      blockCreated: 96002415,
    },
  },
};

// Define the Kairos chain
const kairos = {
  id: 1_001,
  name: 'Kairos Testnet',
  network: 'kairos',
  nativeCurrency: {
    decimals: 18,
    name: 'Kairos KAIA',
    symbol: 'KAIA',
  },
  rpcUrls: {
    default: { http: ['https://public-en-kairos.node.kaia.io'] },
  },
  blockExplorers: {
    default: {
      name: 'KaiaScan',
      url: 'https://kairos.kaiascan.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11' as `0x${string}`,
      blockCreated: 123390593,
    },
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
  chains: [kaia, kairos], // Thêm uniqueChain vào mảng chains
  transports: {
    [kaia.id]: http("https://public-en.node.kaia.io"),
    [kairos.id]: http("https://kaia-kairos.blockpi.network/v1/rpc/public"),
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
