import { ethers } from "hardhat";
import { expect } from "chai";

describe("SoulBoundNFT", function () {
    let SoulBoundNFT;
    let soulBoundNFT: any;

    beforeEach(async function () {
        SoulBoundNFT = await ethers.getContractFactory("SoulBoundNFT");
        soulBoundNFT = await SoulBoundNFT.deploy();
        await soulBoundNFT.deployed();
    });

    it("Should deploy and mint a token", async function () {
        const [owner] = await ethers.getSigners();
        const uri = "https://example.com/token/1";

        await soulBoundNFT.safeMint(owner.address, uri);
        const tokenURI = await soulBoundNFT.tokenURI(0);

        expect(await soulBoundNFT.ownerOf(0)).to.equal(owner.address);
        expect(tokenURI).to.equal(uri);
    });

    it("Should prevent token transfer", async function () {
        const [owner, recipient] = await ethers.getSigners();
        const uri = "https://example.com/token/1";

        await soulBoundNFT.safeMint(owner.address, uri);

        await expect(soulBoundNFT.transferFrom(owner.address, recipient.address, 0))
            .to.be.revertedWith("Err: token transfer is BLOCKED");
    });
});
