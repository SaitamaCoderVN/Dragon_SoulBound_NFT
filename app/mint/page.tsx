import dynamic from "next/dynamic";
import Mint from "./mint";
import { motion } from "framer-motion";
import { Hero, Highlight } from "@/components/ui/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HeroImage from "@/components/svgcomponents/HeroImage";

function MintNFTPage() {
  return (
    <>
      <div className="flex flex-col justify-between items-center w-full relative">
        <Hero className="flex items-center w-full px-10">
          <div>
            <h1
              className="text-sm md:text-xl  lg:text-xl font-semibold text-white  dark:text-zinc-400 max-w-4xl leading-relaxed lg:leading-snug text-left"
            >
              <Highlight className="mb-2.5 text-4xl lg:text-7xl -top-9 font-bold">
                Mint SoulBound NFT
              </Highlight>
              {/* break line */} <br />
              The{" "}
              <span className="bg-primary bg-clip-text text-transparent">
                SoulBoundNFT
              </span>{" "}
              minter dapp will leverage the robust infrastructure of the Klaytn
              blockchain, renowned for its scalability, security, and
              developer-friendly environment. Through this dapp, users will have
              the power to immortalize their digital creations, whether it be
              artwork, music, or any other form of digital content, as
              SoulBoundNFTs, imbued with a sense of authenticity and exclusivity.
            </h1>
          </div>
          <div className="w-[40%] hidden lg:block">
            <HeroImage />
          </div>
        </Hero>
        <Mint />
      </div>
    </>
  );
}
export default dynamic(() => Promise.resolve(MintNFTPage), { ssr: false });
