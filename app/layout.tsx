import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SoulBoundNFT",
  description: "Welcome to the SoulBoundNFT Minter Dapp, a groundbreaking decentralized application (dapp) built on the Kaia blockchain network. Our mission is to redefine digital ownership by enabling users to mint SoulBound Non-Fungible Tokens (NFTs) that encapsulate emotional connection and uniqueness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} >
        <Providers>
          <Header />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
