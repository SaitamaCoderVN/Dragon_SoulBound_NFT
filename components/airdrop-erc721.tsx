"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { array, z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
  useAccount,
  useReadContract,
  useReadContracts,
} from "wagmi";
import { parseEther } from "viem";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check } from "lucide-react";
import { abi } from "./abi";
import { erc721Abi } from "./erc721-abi";
import { useChainId } from "wagmi";
import {
  BLOCK_EXPLORER_BAOBAB,
  BLOCK_EXPLORER_CYPRESS,
  CHAINID,
  CONTRACT_ADDRESS_BAOBAB,
  CONTRACT_ADDRESS_CYPRESS,
} from "./contract";

const formSchema = z.object({
  addresses: z.string(),
  airdropNftIds: z.string(),
});

export function AirdropNFTs() {
  const { toast } = useToast();
  const account = useAccount();
  const chainId = useChainId();
  let blockexplorer;
  switch (chainId) {
    case CHAINID.BAOBAB:
      blockexplorer = BLOCK_EXPLORER_BAOBAB;
      break;

    case CHAINID.CYPRESS:
      blockexplorer = BLOCK_EXPLORER_CYPRESS;
      break;

    default:
      break;
  }
  const [erc721TokenAddress, setErc721TokenAddress] = useState<string>("");
  const [erc721TokenSymbol, setErc721TokenSymbol] = useState<string>("");
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const {
    data: approveHash,
    error: approveError,
    isPending: approveIsPending,
    writeContract: approveWriteContract,
  } = useWriteContract();

  const {
    data: tokenInfoData,
    error: tokenInfoError,
    isPending: tokenInfoIsPending,
    isSuccess: tokenInfoSuccess,
  } = useReadContracts({
    contracts: [
      {
        abi: erc721Abi,
        functionName: "isApprovedForAll",
        address: erc721TokenAddress
          ? (erc721TokenAddress as `0x${string}`)
          : undefined,
        args: [
          account.address as `0x${string}`,
          chainId === 1001 ? CONTRACT_ADDRESS_BAOBAB : CONTRACT_ADDRESS_CYPRESS,
        ],
      },
      {
        abi: erc721Abi,
        functionName: "symbol",
        address: erc721TokenAddress as `0x${string}`,
      },
      {
        abi: erc721Abi,
        functionName: "name",
        address: erc721TokenAddress as `0x${string}`,
      },
    ],
  });

  useEffect(() => {
    if (tokenInfoSuccess) {
      setErc721TokenSymbol(tokenInfoData[1]?.result?.toString() ?? "");
    }
  }, [tokenInfoData, tokenInfoSuccess]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Transaction reverted",
        description: `${(error as BaseError).shortMessage || error.message}`,
      });
    }
  }, [error, toast]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const tokenAddress: `0x${string}` = erc721TokenAddress as `0x${string}`;
    const addresses: `0x${string}`[] = values.addresses
      .split(",")
      .map((address) => address.replace(/\s/g, "") as `0x${string}`);
    const airdropNftIds: bigint[] = values.airdropNftIds
      .split(",")
      .map((id) => BigInt(id));
    writeContract({
      abi,
      address:
        chainId === 1001 ? CONTRACT_ADDRESS_BAOBAB : CONTRACT_ADDRESS_CYPRESS,
      functionName: "airdropNFTs",
      args: [tokenAddress, airdropNftIds],
    });
    if (error) {
      toast({
        variant: "destructive",
        title: "Transaction reverted",
        description: `${(error as BaseError).shortMessage.split(":")[1]}`,
      });
    }
  }

  function onApprove() {
    approveWriteContract({
      abi: erc721Abi,
      address: erc721TokenAddress as `0x${string}`,
      functionName: "setApprovalForAll",
      args: [
        chainId === 1001 ? CONTRACT_ADDRESS_BAOBAB : CONTRACT_ADDRESS_CYPRESS,
        true,
      ],
    });
  }

  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  return (
    <Card className="w-full border-0 shadow-lg lg:max-w-3xl">
      <CardHeader>
        <CardTitle>Aidrop ERC721 Token</CardTitle>
        <CardDescription>
          Use this form to airdrop ERC721 tokens to multiple addresses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 items-center">
            <div className="bg-primary text-secondary rounded-full h-8 w-8 flex justify-center items-center">
              <p>1</p>
            </div>
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Select a token
            </h3>
          </div>
          <div className="flex flex-col gap-4 pl-8">
            <div className="flex flex-col gap-3">
              <Label htmlFor="tokenAddress">ERC721 Token address</Label>
              <Input
                name="tokenAddress"
                type="text"
                placeholder="Paste address of the token here"
                value={erc721TokenAddress}
                onChange={(e) => setErc721TokenAddress(e.target.value)}
              />
            </div>
            {tokenInfoData ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-4 items-center">
                  <div className="bg-gray-300 rounded-full h-12 w-12 flex justify-center items-center">
                    <p>{tokenInfoData[1]?.result?.toString().charAt(0)}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-lg">
                      {tokenInfoData[2]?.result?.toString()}
                    </p>
                    <p className="font-mono text-sm">
                      {tokenInfoData[1]?.result?.toString()}
                    </p>
                  </div>
                </div>
                <p>
                  Is approval for transfer:{" "}
                  {tokenInfoData[0]?.result?.toString() ?? "false"}
                </p>
              </div>
            ) : (
              <p className="mt-4">No results found.</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex flex-row gap-4 items-center">
            <div className="bg-primary text-secondary rounded-full h-8 w-8 flex justify-center items-center">
              <p>2</p>
            </div>
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Set approval for the airdrop contract
            </h3>
          </div>
          <div className="pl-8">
            {approveIsPending ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                onClick={onApprove}
              >{`Approve ${erc721TokenSymbol}`}</Button>
            )}
            <div className="flex flex-col gap-4 mt-4">
              {approveHash ? (
                <div className="flex flex-row gap-2">
                  Hash:
                  <a
                    target="_blank"
                    className="text-blue-500 underline"
                    href={chainId === 1001 ? `${approveHash}` : `${hash}`}
                  >
                    {truncateAddress(approveHash)}
                  </a>
                </div>
              ) : (
                <>
                  <div className="flex flex-row gap-2">
                    Hash: no transaction hash until after submission
                  </div>
                  <Badge className="w-fit" variant="outline">
                    No approval yet
                  </Badge>
                </>
              )}
              {isApproveConfirming && (
                <Badge className="w-fit" variant="secondary">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Waiting for confirmation...
                </Badge>
              )}
              {isApproveConfirmed && (
                <Badge className="flex flex-row items-center w-fit bg-green-500 cursor-pointer">
                  <Check className="mr-2 h-4 w-4" />
                  Approval confirmed!
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex flex-row gap-4 items-center">
            <div className="bg-primary text-secondary rounded-full h-8 w-8 flex justify-center items-center">
              <p>3</p>
            </div>
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Enter the airdrop details
            </h3>
          </div>
          <div className="flex flex-col pl-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="airdropNftIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Airdrop NFT IDs</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter NFT IDs"
                          type="text"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>
                        IDs of the NFT that you will airdrop
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
                  <Button type="submit">Airdrop ERC721</Button>
                )}
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-start h-fit">
        <div className="flex flex-row gap-4 items-center">
          <div className="bg-primary text-secondary rounded-full h-8 w-8 flex justify-center items-center">
            <p>4</p>
          </div>
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Monitor airdrop status
          </h3>
        </div>
        <div className="flex flex-col gap-4 pl-8">
          {hash ? (
            <div className="flex flex-row gap-2">
              Hash:
              <a
                target="_blank"
                className="text-blue-500 underline"
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
              <Badge className="w-fit" variant="outline">
                No transaction yet
              </Badge>
            </>
          )}
          {isConfirming && (
            <Badge className="w-fit" variant="secondary">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Waiting for confirmation...
            </Badge>
          )}
          {isConfirmed && (
            <Badge className="flex flex-row items-center w-fit bg-green-500 cursor-pointer">
              <Check className="mr-2 h-4 w-4" />
              Transaction confirmed!
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
