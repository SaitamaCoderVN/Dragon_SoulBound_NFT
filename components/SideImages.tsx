import Image from "next/image";
import go2 from "@/assets/godzilla.png"
import go1 from "@/assets/godzilla2.jpeg"
import go from "@/assets/godzilla3.gif"

const imageArray = [go, go1, go2]

function SideImages() {
    return (
        <div className="col-start-2 absolute right-20 top-20">
            <div className="flex flex-col gap-7">
                {imageArray.map((image, index) => (
                    <div key={index} className="relative w-[400px] h-[400px] rounded-lg overflow-hidden">
                        <Image src={image} layout="fill" objectFit="cover" alt="nft images"/>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SideImages;