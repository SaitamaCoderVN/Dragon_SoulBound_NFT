import dynamic from "next/dynamic";
import Airdrop from "@/app/airdrop/airdrop";

function AirdropPage() {
  return (
    <div className="justify-between items-center w-full flex flex-col relative">
      <Airdrop />
    </div>
  );
}

export default dynamic(() => Promise.resolve(AirdropPage), { ssr: false });
