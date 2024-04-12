import { ConnectButton } from "@rainbow-me/rainbowkit";
import MintNFT from "@/components/mint";
import logo from "@/assets/logo.png";
import Image from "next/image";
import SideImages from "@/components/SideImages";

export default function Home() {
  return (
    <div className="bg-[#101010] w-full h-[100vh]  flex flex-col relative">
      <section className="absolute top-0 z-[100] flex items-center justify-between w-full px-20 col-start-1 row-start-1 col-span-1">
        <Image className="cursor-pointer" src={logo} width={70} height={70} alt="logo"/>
        <div className="connect-btn">
          <ConnectButton />
        </div>
      </section>
      <MintNFT />
      <SideImages/>
    </div>
  );
}
