import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/assets/logo.png";

function Header() {
  return (
    <>
      <section className="absolute top-0 z-[100] flex items-center justify-between w-full px-10 ">
        <div className="flex">
          <Image
            className="cursor-pointer"
            src={logo}
            width={70}
            height={70}
            alt="logo"
          />
          <Link href="/">
            <div className="mt-[3vh] text-pink-500 mb-2.5  -top-9 font-bold text-xl  md:text-xl lg:text-xl lg:font-semibold  dark:text-zinc-400 max-w-4xl leading-relaxed lg:leading-snug text-left mx-auto ">
              DragonSoulBoundNFT
            </div>
          </Link>
        </div>

        <div className="flex">
          <ul className="mt-[4vh] flex space-x-4 mb-2.5 -top-9 text-xl px-4 md:text-xl lg:text-xl font-semibold text-neutral-700 dark:text-zinc-400 max-w-4xl leading-relaxed lg:leading-snug text-left mx-auto">
            <li>
              <Link href="/mint">
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
    </>
  );
}

export default Header;
