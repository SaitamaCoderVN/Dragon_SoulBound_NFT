"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
} from "wagmi";
import { useReadContract } from "wagmi";
import { abi } from "./abi";
import { parseEther } from "viem";
import { formatEther } from "viem";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check } from "lucide-react";

const formSchema = z.object({
  amount: z.coerce
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive({ message: "Amount must be positive" }),
});

export default function FundCard() {
  const { toast } = useToast();
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    writeContract({
      abi,
      address: "0x85bb6d27571C3175c81fe212c0decCA2202147b9",
      functionName: "fund",
      value: parseEther(values.amount.toString()),
    });
    if (error) {
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
    <Card className="w-full border-0 shadow-lg lg:max-w-3xl">
      <CardHeader>
        <CardTitle>Mint SoulBound NFT</CardTitle>
        <CardDescription>
          The SoulBoundNFT minter dapp will leverage the robust infrastructure
          of the Klaytn blockchain, renowned for its scalability, security, and
          developer-friendly environment. Through this dapp, users will have the
          power to immortalize their digital creations, whether it be artwork,
          music, or any other form of digital content, as SoulBoundNFTs, imbued
          with a sense of authenticity and exclusivity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <div>
                    <FormLabel>
                      Give me the url containing the NFT metadata you want to
                      save as a souvenir with SoulBound NFT. I encourage you to
                      use Pinata Cloud.
                    </FormLabel>
                  </div>
                  <div>
                    <FormLabel>Link URL Metadata : </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter url link"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                  </div>
                  <div>
                    <FormLabel>
                      The wallet address you want to send the SoulBound NFT to:{" "}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Address"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                  </div>
                  <FormDescription>Mint your SoulBound NFT now</FormDescription>
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
              <Button type="submit">Mint SoulBound NFT now</Button>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-start h-fit">
        <h3 className="scroll-m-20 text-lg font-semibold tracking-tight">
          Transaction status
        </h3>
        {hash ? (
          <div className="flex flex-row gap-2">
            Hash:
            <a
              target="_blank"
              className="text-blue-500 underline"
              href={`https://sepolia.etherscan.io/tx/${hash}`}
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
      </CardFooter>
    </Card>
  );
}
