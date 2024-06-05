import dynamic from "next/dynamic";
import Airdrop from "@/app/airdrop/airdrop";
import { Hero, Highlight } from "@/components/ui/hero";
import HeroImage from "@/components/svgcomponents/HeroImage";

function AirdropPage() {
  return (
    <div className=" w-full flex flex-col justify-between items-center relative">
      <Hero className="flex items-center  px-10">
        <div>
          <h1
            className="text-sm lg:text-xl font-semibold  text-white w-[95%] dark:text-zinc-400 max-w-4xl leading-relaxed lg:leading-snug  lg:text-left"
          >
            <Highlight className="text-left mb-2.5 text-4xl lg:text-7xl -top-9 font-bold">
              Airdrop ERC20 Token For SoulBoundNFT Community
            </Highlight>
            {/* break line */} <br />

            We are thrilled to announce a special airdrop event exclusively for the The{" "}
            <span className="bg-primary bg-clip-text text-transparent ">
              SoulBoundNFT
            </span>{" "}community. As part of our ongoing commitment to support and develop the community, we will be distributing a large number of ERC20 tokens to all members. This is a fantastic opportunity for you not only to increase your holdings but also to engage more deeply with our innovative and dynamic ecosystem. Join us in this event and become a part of this rewarding and meaningful experience!
          </h1>
        </div>
        <div className="w-[40%] hidden lg:block">
          <HeroImage />
        </div>
      </Hero>
      <Airdrop />
    </div>
  );
}

export default dynamic(() => Promise.resolve(AirdropPage), { ssr: false });
