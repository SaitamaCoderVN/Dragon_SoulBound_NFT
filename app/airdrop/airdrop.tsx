"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Hero, Highlight } from "../../components/ui/hero";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { array, z } from "zod";
import airdropImage from "@/assets/money.gif";
import Image from "next/image";
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
import { formatUnits } from "viem";
// import { serialize } from "wagmi";
// import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check } from "lucide-react";
import { useChainId } from "wagmi";
import { erc20Abi } from "@/components/erc20-abi";
import { abi } from "@/components/abi";
import { Label } from "@/components/ui/label";
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
import Stepbox from "@/components/stepbox";

const formSchema = z.object({
  airdropAmounts: z.string(),
  totalAirdropAmount: z.string(),
});

const setAllowanceFormSchema = z.object({
  amount: z.string(),
});

function Airdrop() {
  const { toast } = useToast();
  const account = useAccount();
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

  const [erc20TokenAddress, setErc20TokenAddress] = useState<string>("");
  const [erc20TokenSymbol, setErc20TokenSymbol] = useState<string>("");
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
        abi: erc20Abi,
        functionName: "allowance",
        address: erc20TokenAddress
          ? (erc20TokenAddress as `0x${string}`)
          : undefined,
        args: [
          account.address as `0x${string}`,
          chainId === 1001 ? CONTRACT_ADDRESS_BAOBAB : CONTRACT_ADDRESS_CYPRESS,
        ],
      },
      {
        abi: erc20Abi,
        functionName: "symbol",
        address: erc20TokenAddress as `0x${string}`,
      },
      {
        abi: erc20Abi,
        functionName: "name",
        address: erc20TokenAddress as `0x${string}`,
      },
      {
        abi: erc20Abi,
        functionName: "decimals",
        address: erc20TokenAddress as `0x${string}`,
      },
    ],
  });

  useEffect(() => {
    if (tokenInfoSuccess) {
      setErc20TokenSymbol(tokenInfoData[1]?.result?.toString() ?? "");
    }
  }, [tokenInfoData, tokenInfoSuccess]);

  const setAllowanceForm = useForm<z.infer<typeof setAllowanceFormSchema>>({
    resolver: zodResolver(setAllowanceFormSchema),
  });

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
    console.log("onSubmit called with values:", values); // Thêm dòng này
    const tokenAddress: `0x${string}` = erc20TokenAddress as `0x${string}`;
    const totalAirdropAmount: bigint = parseEther(
      values.totalAirdropAmount.toString()
    );

    const airdropAmounts: bigint[] = values.airdropAmounts
      .split(",")
      .map((amount) => parseEther(amount));

    console.log(tokenAddress);
    console.log(airdropAmounts);
    console.log(totalAirdropAmount);
    writeContract({
      abi,
      address: contractAddress,
      functionName: "airdropTokens",
      args: [tokenAddress, airdropAmounts, totalAirdropAmount],
    });
  }

  function onApprove(values: z.infer<typeof setAllowanceFormSchema>) {
    const amount: bigint = parseEther(values.amount.toString());
    approveWriteContract({
      abi: erc20Abi,
      address: erc20TokenAddress as `0x${string}`,
      functionName: "approve",
      args: [contractAddress, amount],
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

  const { data: addressSoulBoundNFT, isLoading } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "getAddressSoulBoundNFT",
    query: {
      enabled: !!account.address,
    },
  });

  return (
    <div className="bg-gradient-bg pb-20 w-full row-start-2">
      <div className="h-full text-[#101010] pt-20">
        <div className=" flex flex-row justify-center gap-8">
          <Card className="bg-dark-bg text-white w-full border-0 shadow-lg lg:max-w-3xl">
            <CardHeader>
              <CardTitle className="text-4xl text-">
                Airdrop ERC20 Token For{" "}
                <span className="text-gray">SoulBound NFT</span> Community. Use
                this form:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-5 items-center">
                  <Stepbox>Step 1</Stepbox>
                  <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Select a token
                  </h3>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="tokenAddress">ERC20 Token address</Label>
                    <Input
                      name="tokenAddress"
                      type="text"
                      className="
                      bg-secondary-bg text-dark-text
                      border-none
                      focus:outline-none
                      placeholder-dark-text
                        "
                      placeholder="Paste address of the token here"
                      value={erc20TokenAddress}
                      onChange={(e) => setErc20TokenAddress(e.target.value)}
                    />
                  </div>
                  {tokenInfoData ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row gap-4 items-center">
                        <div className="bg-gray-300 rounded-full h-12 w-12 flex justify-center items-center">
                          <p>
                            {tokenInfoData[1]?.result?.toString().charAt(0)}
                          </p>
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
                        Approval amount:{" "}
                        {formatUnits(
                          BigInt(tokenInfoData[0]?.result ?? 0),
                          tokenInfoData[3]?.result ?? 0
                        )}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-4">No results found.</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex flex-row gap-5 items-center">
                  <Stepbox>Step 2</Stepbox>
                  <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Set approval amount for the airdrop contract
                  </h3>
                </div>
                <div className="">
                  <Form {...setAllowanceForm}>
                    <form
                      onSubmit={setAllowanceForm.handleSubmit(onApprove)}
                      className="space-y-8"
                    >
                      <FormField
                        control={setAllowanceForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Approval amount</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                className="
                                bg-secondary-bg text-dark-text
                                border-none
                                focus:outline-none
                              placeholder-dark-text
                                "
                                placeholder="Enter the amount to be approved"
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>
                              This allows the airdrop contract to be able to
                              transfer your tokens on your behalf.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {approveIsPending ? (
                        <Button disabled>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Please wait
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="default"
                          className="bg-primary text-white rounded-xl"
                          type="submit"
                        >{`Approve ${erc20TokenSymbol}`}</Button>
                      )}
                    </form>
                  </Form>
                  <div className="flex flex-col gap-4 mt-4">
                    {approveHash ? (
                      <div className="flex flex-row gap-2">
                        Hash:
                        <a
                          target="_blank"
                          className="text-blue-500 underline"
                          href={`${blockexplorer + approveHash}`}
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
                <div className="flex flex-row gap-5 items-center">
                  <Stepbox>Step 3</Stepbox>
                  <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Enter the airdrop details
                  </h3>
                </div>
                <div className="flex flex-col">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      <FormField
                        control={form.control}
                        name="totalAirdropAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total ERC20 amount</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                className="
                                bg-white text-[#383737]
                                border
                                focus:outline-none
                                placeholder-zinc-400
                                w-[100%]
                                "
                                placeholder="Enter an amount in token symbol"
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>
                              You will send to the contract with this amount
                              then the contract will airdrop.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormItem
                        className="outline outline-primary bg-[#4E416B] rounded-lg"
                        style={{ padding: "0 10px" }}
                      >
                        <FormLabel>Addresses that owns SoulBoundNFT</FormLabel>
                        {isLoading ? (
                          <p>Loading...</p>
                        ) : addressSoulBoundNFT?.length === 0 ? (
                          <div>No Addresses found</div>
                        ) : (
                          addressSoulBoundNFT?.map((_, index) => (
                            <div key={index}>
                              <FormDescription>
                                {addressSoulBoundNFT[index]}
                              </FormDescription>
                            </div>
                          ))
                        )}
                        <FormMessage />
                      </FormItem>
                      <FormField
                        control={form.control}
                        name="airdropAmounts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter amounts"
                                type="text"
                                className="
                                bg-secondary-bg text-dark-text
                                border-none
                                focus:outline-none
                              placeholder-dark-text
                                "
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>Amounts</FormDescription>
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
                        <Button
                          variant="default"
                          size="default"
                          className="bg-primary text-white rounded-xl"
                          type="submit"
                        >
                          Airdrop ERC20
                        </Button>
                      )}
                    </form>
                  </Form>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 items-start h-fit">
              <div className="flex flex-row gap-5 items-center">
                <Stepbox>Step 4</Stepbox>
                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  Check monitor airdrop status
                </h3>
              </div>
              <div className="flex flex-col gap-4">
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
          <div className="flex item-left">
            {/* <Image
              className="cursor-pointer w-full  object-cover"
              src={airdropImage}
              alt="airdropImage"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Airdrop), {
  ssr: false,
});
