import { ConnectButton } from "@rainbow-me/rainbowkit";
import logo from "@/assets/logo.png";
import Image from "next/image";
import SideImages from "@/components/SideImages";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Hero, Highlight } from "@/components/ui/hero";
import Homepage from "@/components/homepage";

function Home() {
  return (
    <Homepage/>
  );
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });
