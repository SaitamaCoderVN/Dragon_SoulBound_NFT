"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";

import { useToast } from "@/components/ui/use-toast";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { abi } from "./abi";
import { Hero, Highlight } from "./ui/hero";
import dynamic from "next/dynamic";
import { useChainId } from "wagmi";
import { CONTRACT_ADDRESS_BAOBAB, CONTRACT_ADDRESS_CYPRESS } from "./contract";
import { Button } from "./ui/button";
import Link from "next/link";

const formSchema = z.object({
  to: z.coerce.string({
    required_error: "Address is required",
    invalid_type_error: "Address must be a string",
  }),
  uri: z.coerce.string({
    required_error: "uri is required",
    invalid_type_error: "uri must be a number",
  }),
});

function HomePage() {
  const { toast } = useToast();
  let chainId = useChainId();
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Convert 'to' address to appropriate format
    try {
      await writeContract({
        abi,
        address:
          chainId === 1001 ? CONTRACT_ADDRESS_BAOBAB : CONTRACT_ADDRESS_CYPRESS,
        functionName: "safeMint",
        args: [`0x${values.to.slice(2)}`, values.uri.toString()], // Pass the 'to' and 'uri' values as arguments
      });
      toast({
        variant: "default",
        className: "bg-white",
        title: "Transaction successful",
        description: "SoulBound NFT minted successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Transaction reverted",
        description: `${(error as BaseError).shortMessage.split(":")[1]}`,
      });
    }
  }

  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div className="w-full">
      <div>
        <Hero className="px-10">
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: [20, -5, 0],
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="text-xl md:text-xl lg:text-xl font-semibold text-neutral-700 dark:text-zinc-400 max-w-4xl leading-relaxed lg:leading-snug text-left"
          >
            <Highlight className="mb-2.5 text-7xl -top-9 font-bold">
              Mint SoulBound NFT
            </Highlight>
            {/* break line */} <br />
            The{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
              SoulBoundNFT
            </span>{" "}
            minter dapp will leverage the robust infrastructure of the Klaytn
            blockchain, renowned for its scalability, security, and
            developer-friendly environment. Through this dapp, users will have
            the power to immortalize their digital creations, whether it be
            artwork, music, or any other form of digital content, as
            SoulBoundNFTs, imbued with a sense of authenticity and exclusivity.
          </motion.h1>
          <Button
            variant="outline"
            size="default"
            className="bg-gradient-to-r from-sky-400 to-blue-600 flex mt-6   text-white">
            <Link href="/mint">Mint SoulBound NFT Now</Link>
          </Button>
        </Hero>
        
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(HomePage), {
  ssr: false,
});
