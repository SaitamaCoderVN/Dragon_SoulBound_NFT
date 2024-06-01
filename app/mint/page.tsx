import dynamic from "next/dynamic";
import Mint from "./mint";

function MintNFTPage() {
  return (
    <div className="justify-between items-center w-full flex flex-col relative">
      <Mint />
    </div>
  );
}
export default dynamic(() => Promise.resolve(MintNFTPage), { ssr: false });
