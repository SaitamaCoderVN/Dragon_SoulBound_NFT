import dynamic from "next/dynamic";
import Homepage from "@/components/homepage";

function Home() {
  return (
    <Homepage />
  );
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });
