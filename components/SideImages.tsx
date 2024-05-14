"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import { useTokenURIs } from "./useTokenURIs";

function SideImages() {
  const { address } = useAccount();
  const { tokenURIs, isLoadingTokenIds } = useTokenURIs(address);

  return (
    <div className="col-start-2 absolute right-20 top-20">
      <div className="flex flex-col gap-7">
        {isLoadingTokenIds ? (
          <div>Loading...</div>
        ) : tokenURIs.length === 0 ? (
          <div>No NFTs found</div>
        ) : (
          tokenURIs.map((uri, index) => (
            <div
              key={index}
              className="relative w-[400px] h-[400px] rounded-lg overflow-hidden"
            >
              <Image
                src={uri}
                layout="fill"
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

export default SideImages;
