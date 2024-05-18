import { ConnectButton } from "@rainbow-me/rainbowkit";
import MintNFT from "@/components/mint";
import logo from "@/assets/logo.png";
import Image from "next/image";
import SideImages from "@/components/SideImages";
import dynamic from "next/dynamic";
import Link from "next/link";

function Home() {
  return (
    <div className="bg-[#101010] w-full h-[100vh]  flex flex-col relative">
      <section className="absolute top-0 z-[100] flex items-center justify-between w-full px-20 col-start-1 row-start-1 col-span-1">
        <div className="absolute top-0 mt-[1vh] flex item-left">
          <Image
            className="cursor-pointer"
            src={logo}
            width={70}
            height={70}
            alt="logo"
          />
          <Link href="/">
            <div className="mt-[3vh] text-pink-500 mb-2.5 text-7xl -top-9 font-bold text-xl px-4 md:text-xl lg:text-xl font-semibold text-neutral-700 dark:text-zinc-400 max-w-4xl leading-relaxed lg:leading-snug text-left mx-auto ">
              DragonSoulBoundNFT
            </div>
          </Link>
        </div>

        <div className="absolute right-0 top-0 flex item-right">
          <ul className="mt-[4vh] flex space-x-4 mb-2.5 text-7xl -top-9 font-bold text-xl px-4 md:text-xl lg:text-xl font-semibold text-neutral-700 dark:text-zinc-400 max-w-4xl leading-relaxed lg:leading-snug text-left mx-auto">
            <li>
              <Link href="/">
                <div className="text-red-500">Mint</div>
              </Link>
            </li>
            <li>
              <Link href="/airdrop">
                <div className="text-green-500">Airdrop</div>
              </Link>
            </li>
          </ul>
          <div className="mt-[3vh] connect-btn">
            <ConnectButton />
          </div>
        </div>
      </section>
      <MintNFT />
      <SideImages />
    </div>
  );
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });
