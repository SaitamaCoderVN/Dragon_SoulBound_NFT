import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const SoulBoundNFT = await ethers.getContractFactory("SoulBoundNFT");
    const soulBoundNFT = await SoulBoundNFT.deploy();

    console.log("SoulBoundNFT deployed to:", soulBoundNFT.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });