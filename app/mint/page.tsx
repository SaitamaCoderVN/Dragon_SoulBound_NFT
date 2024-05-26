"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import mintImage from "@/assets/godzilla3.gif";
import Image from "next/image";
import { abi } from "../../components/abi";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check } from "lucide-react";
import dynamic from "next/dynamic";
import { useChainId } from "wagmi";
import {
  CONTRACT_ADDRESS_BAOBAB,
  CONTRACT_ADDRESS_CYPRESS,
} from "@/components/contract";
import { Hero, Highlight } from "@/components/ui/hero";
import MintButton from "@/components/ui/mint-btn";

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

export default function MintNFTPage() {
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
    <div className="w-full row-start-2">
      <div>
        <Hero className="">
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
            className="text-xl px-4 md:text-xl lg:text-xl font-semibold text-neutral-700 dark:text-zinc-400 max-w-4xl leading-relaxed lg:leading-snug text-left mx-auto"
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
        </Hero>
      </div>
      <div className="bg-[#101010] flex flex-row h-[700px] text-zinc-300 pt-20 gap-20">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-[57%] px-10"
          >
            <FormField
              control={form.control}
              name="uri"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-8">
                  <div>
                    <FormLabel className="text-4xl text-zinc-400">
                      Give me the url containing the NFT metadata you want to
                      save as a souvenir with{" "}
                      <span className="text-white">SoulBound NFT</span>. I
                      encourage you to use Pinata Cloud.
                    </FormLabel>
                  </div>
                  <div>
                    <div>
                      <FormLabel className="text-md">
                        Link URL Metadata :{" "}
                      </FormLabel>
                    </div>
                    <div>
                      <FormLabel className="text-md">
                        We recommend using{" "}
                        <a
                          className="text-md font-semibold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent"
                          href="https://pinata.cloud"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Pinata.cloud
                        </a>{" "}
                        to store your NFT metadata. Read more about{" "}
                        <a
                          className="text-md font-semibold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent"
                          href="https://docs.opensea.io/docs/metadata-standards"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Opensea's metadata standards.
                        </a>
                      </FormLabel>
                    </div>
                    <div>
                      <FormLabel
                        style={{ fontStyle: "italic" }}
                        className="text-xs"
                      >
                        Example :
                        https://peach-realistic-spider-498.mypinata.cloud/ipfs/Qmdpt98UhmExzU29MFfsYTX2ph47UqU82Wu9BcRyZAFfSJ
                      </FormLabel>
                    </div>
                    <FormControl className="my-1.5">
                      <Input
                        type="text"
                        placeholder="Enter url link"
                        {...field}
                        value={field.value ?? ""}
                        className="
                        bg-[#383737] text-white
                        border-none
                        focus:outline-none
                        placeholder-zinc-400
                        w-[70%]
                        "
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-8">
                  <div>
                    <FormLabel className="text-md ">
                      The wallet address you want to send the SoulBound NFT to:{" "}
                    </FormLabel>
                    <FormControl className="my-1.5">
                      <Input
                        type="text"
                        placeholder="Enter Address"
                        {...field}
                        value={field.value ?? ""}
                        className="
                        bg-[#383737] text-white
                        border-none
                        focus:outline-none
                        placeholder-zinc-400
                        w-[70%]
                        "
                      />
                    </FormControl>
                  </div>
                  <FormDescription className="text-md font-semibold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
                    Mint your SoulBound NFT now
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isPending ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <MintButton />
            )}
          </form>
        </Form>
        <div className="flex item-left">
          <Image
            className="cursor-pointer"
            src={mintImage}
            width={600}
            height={400}
            alt="mintImage"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start h-fit bg-[#101010] text-zinc-300">
        <div className="bg-zinc-700 ml-10 mb-10 p-7 rounded-xl">
          <h3 className="scroll-m-20 text-lg font-semibold tracking-tight">
            Transaction status
          </h3>
          {hash ? (
            <div className="flex flex-row gap-2">
              Hash:
              <a
                target="_blank"
                className="text-blue-500 underline"
                href={`https://baobab.klaytnfinder.io/tx/${hash}`}
              >
                {truncateAddress(hash)}
              </a>
            </div>
          ) : (
            <>
              <div className="flex flex-row gap-2">
                Hash: no transaction hash until after submission
              </div>
              <Badge variant="outline">No transaction yet</Badge>
            </>
          )}
          {isConfirming && (
            <Badge variant="secondary">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Waiting for confirmation...
            </Badge>
          )}
          {isConfirmed && (
            <Badge className="flex flex-row items-center bg-green-500 cursor-pointer">
              <Check className="mr-2 h-4 w-4" />
              Transaction confirmed!
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
