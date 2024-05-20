"use client";

import Image from "next/image";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import dynamic from "next/dynamic";
import { abi } from "./abi";
import nft404 from "../assets/NFT404.jpg";
import { useChainId } from "wagmi";
import { CONTRACT_ADDRESS_BAOBAB, CONTRACT_ADDRESS_CYPRESS } from "./contract";

function SideImages() {
  const account = useAccount();
  let chainId = useChainId();
  const { data: tokenURIs } = useReadContract({
    abi,
    address:
      chainId === 1001 ? CONTRACT_ADDRESS_BAOBAB : CONTRACT_ADDRESS_CYPRESS,
    functionName: "getSoulboundNFTs",
    args: [account.address ?? "0x0"],
    query: {
      enabled: !!account.address,
    },
  });

  interface NFTuri {
    abi: any; // Thay thế 'any' bằng kiểu thực sự của abi nếu bạn biết
    address: `0x${string}`;
    functionName: string;
    args: readonly unknown[]; // Thay thế 'any' bằng kiểu thực sự của args nếu bạn biết
  }

  const NFTuris: NFTuri[] = [];

  if (tokenURIs === undefined) {
    console.error("Haven't NFT");
  } else {
    tokenURIs.forEach((tokenURI) => {
      NFTuris.push({
        abi,
        address:
          chainId === 1001 ? CONTRACT_ADDRESS_BAOBAB : CONTRACT_ADDRESS_CYPRESS,
        functionName: "tokenURI",
        args: [tokenURI] as const,
      });
    });
  }

  const { data: result, isLoading } = useReadContracts({
    contracts: NFTuris,
  });
  // const MintNFT = dynamic(() => import("./mint"), { ssr: false });
  // console.log(result);
  //uri ? uri.result : nft404.src;
  return (
    <div className="col-start-2 absolute right-20 top-20">
      {/* <MintNFT /> */}
      <div className="flex flex-col gap-7 overflow-y-scroll h-[40rem] w-[27rem] space-y-4 p-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : result?.length === 0 ? (
          <div>No NFTs found</div>
        ) : (
          result?.map((uri, index) => (
            <div key={index} className="relative h-[40rem] ">
              <Image
                src={
                  uri && typeof uri.result === "string"
                    ? uri.result
                    : nft404.src
                }
                layout="responsive"
                width={400}
                height={400}
                objectFit="cover"
                alt={`NFT ${index}`}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(SideImages), { ssr: false });
