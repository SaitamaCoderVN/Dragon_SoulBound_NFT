"use client";

import dynamic from "next/dynamic";
import MintForm from "./mintForm";
import Image from "next/image";
import MintImage from "@/assets/Mint.png";

function MintNFT() {
  return (
    <div className="bg-gradient-bg pt-4 pb-20  lg:px-10 w-full">

      <div className="bg-[#100F27] px-2 lg:px-5 py-8 rounded-2xl">
        <div className="bg-gradient bg-clip-text text-transparent text-xl lg:text-4xl font-extrabold">
          Give me the url containing the NFT metadata you want to
          save as a souvenir with{" "}
          <span className="text-white">SoulBound NFT</span>. I
          encourage you to use Pinata Cloud.
        </div>
        <div className="flex w-full">
          <div className="w-full lg:w-[55%]"><MintForm /></div>
          <div className="w-[45%] hidden lg:block">
            <Image
              src={MintImage}
              alt="Mint"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(MintNFT), {
  ssr: false,
});
