"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import mintImage from "@/assets/Mint.png";
import Image from "next/image";
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
import { abi } from "../../components/abi";
import { parseEther } from "viem";
import { formatEther } from "viem";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check } from "lucide-react";
import { Hero, Highlight } from "../../components/ui/hero";
import MintButton from "../../components/ui/mint-btn";
import dynamic from "next/dynamic";
import { useChainId } from "wagmi";
import {
  BLOCK_EXPLORER_BAOBAB,
  BLOCK_EXPLORER_CYPRESS,
  BLOCK_EXPLORER_OPAL,
  BLOCK_EXPLORER_QUARTZ,
  BLOCK_EXPLORER_UNIQUE,
  CHAINID,
  CONTRACT_ADDRESS_BAOBAB,
  CONTRACT_ADDRESS_CYPRESS,
  CONTRACT_ADDRESS_OPAL,
  CONTRACT_ADDRESS_QUARTZ,
  CONTRACT_ADDRESS_UNIQUE,
} from "../../components/contract";

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

export default function MintForm() {
  const { toast } = useToast();
  let chainId = useChainId();
  let contractAddress: any;
  switch (chainId) {
    case CHAINID.BAOBAB:
      contractAddress = CONTRACT_ADDRESS_BAOBAB;
      break;

    case CHAINID.CYPRESS:
      contractAddress = CONTRACT_ADDRESS_CYPRESS;
      break;

    case CHAINID.UNIQUE:
      contractAddress = CONTRACT_ADDRESS_UNIQUE;
      break;

    case CHAINID.QUARTZ:
      contractAddress = CONTRACT_ADDRESS_QUARTZ;
      break;
    case CHAINID.OPAL:
      contractAddress = CONTRACT_ADDRESS_OPAL;
      break;
    default:
      break;
  }
  let blockexplorer;
  switch (chainId) {
    case CHAINID.BAOBAB:
      blockexplorer = BLOCK_EXPLORER_BAOBAB;
      break;

    case CHAINID.CYPRESS:
      blockexplorer = BLOCK_EXPLORER_CYPRESS;
      break;

    case CHAINID.UNIQUE:
      blockexplorer = BLOCK_EXPLORER_UNIQUE;
      break;

    case CHAINID.QUARTZ:
      blockexplorer = BLOCK_EXPLORER_QUARTZ;
      break;
    case CHAINID.OPAL:
      blockexplorer = BLOCK_EXPLORER_OPAL;
      break;
    default:
      break;
  }
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
        address: contractAddress,
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
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 text-white"
        >
          <FormField
            control={form.control}
            name="uri"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-8">
                <div></div>
                <div>
                  <div>
                    <FormLabel className="text-md font-semibold">
                      Link URL Metadata :{" "}
                    </FormLabel>
                  </div>
                  <div className="text-md">
                    We recommend using{" "}
                    <a
                      className="text-md font-semibold bg-gradient-2 bg-clip-text text-transparent"
                      href="https://pinata.cloud"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Pinata.cloud
                    </a>{" "}
                    to store your NFT metadata. Read more about{" "}
                    <a
                      className="text-md font-semibold bg-gradient-2 bg-clip-text text-transparent"
                      href="https://docs.opensea.io/docs/metadata-standards"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Opensea's metadata standards.
                    </a>
                  </div>

                  <FormControl className="my-1.5">
                    <Input
                      type="text"
                      placeholder="Enter URL Link"
                      {...field}
                      value={field.value ?? ""}
                      className="
                                            bg-secondary-bg text-dark-text
                                            border-none
                                            focus:outline-none
                                            placeholder-dark-text
                                            "
                    />
                  </FormControl>
                  <div>
                    <FormLabel
                      style={{ fontStyle: "italic" }}
                      className="text-xs"
                    >
                      Example :
                      https://peach-realistic-spider-498.mypinata.cloud/ipfs/Qmdpt98UhmExzU29MFfsYTX2ph47UqU82Wu9BcRyZAFfSJ
                    </FormLabel>
                  </div>
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
                                            bg-secondary-bg text-dark-text
                                            border-none
                                            focus:outline-none
                                            placeholder-dark-text
                                            "
                    />
                  </FormControl>
                </div>
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
      <div className="bg-secondary-bg p-6 mt-10 inline-block w-[60%] rounded-xl">
        <h3 className="scroll-m-20 text-lg font-semibold tracking-tight">
          Transaction status
        </h3>
        {hash ? (
          <div className="flex flex-row gap-2">
            Hash:
            <a
              target="_blank"
              className="text-blue-500 underline"
              // href={`https://baobab.klaytnfinder.io/tx/${hash}`}
              href={`${blockexplorer + hash}`}
            >
              {truncateAddress(hash)}
            </a>
          </div>
        ) : (
          <>
            <div className="flex flex-row gap-2">
              Hash: no transaction hash until after submission
            </div>
            <Badge variant="outline" className="border-[#2B233C]">
              No transaction yet
            </Badge>
          </>
        )}
        {isConfirming && (
          <Badge variant="secondary">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Waiting for confirmation...
          </Badge>
        )}
        {isConfirmed && (
          <Badge className="flex flex-row items-center w-[40%] bg-green-500 cursor-pointer">
            <Check className="mr-2 h-4 w-4" />
            Transaction confirmed!
          </Badge>
        )}
      </div>
    </>
  );
}
