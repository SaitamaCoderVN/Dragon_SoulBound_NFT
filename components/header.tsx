import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/assets/logo.png";

function Header() {
  const navItems = [
    { href: "/mint", label: "Mint" },
    { href: "/airdrop", label: "Airdrop" },
  ];

  return (
    <>
      <section className="flex lg:absolute top-0 z-[100] items-center justify-between bg-gradient-bg w-full px-10 py-1 text-nowrap text-xs ">
        <div >
          <Link href="/" className="flex">

            <Image
              className="cursor-pointer w-[4rem]  h-auto"
              src={logo}
              alt="logo"
            />
            <div className="mt-[3vh] hidden lg:flex text-primary -top-9 font-bold text-xl md:text-xl lg:text-xl lg:font-semibold  max-w-4xl leading-relaxed lg:leading-snug text-left mx-auto">
              DragonSoulBoundNFT
            </div>
          </Link>
        </div>

        <div className="flex gap-10">
          <ul className="flex gap-10  text-xl px-4 md:text-xl font-semibold text-neutral-700 dark:text-zinc-400 max-w-4xl leading-relaxed lg:leading-snug text-left mx-auto">
            {navItems.map((item, index) => (
              <li key={index} className="py-1">
                <Link href={item.href}>
                  <div className="text-secondary">{item.label}</div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="connect-btn">
            <ConnectButton accountStatus="avatar" />
          </div>
        </div>
      </section>
    </>
  );
}

export default Header;
