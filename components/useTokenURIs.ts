import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { abi } from "./abi";

const contractAddress = '0x98E4a7105034c991125576ef5aB6187D5831d12d';

export function useTokenURIs(address: `0x${string}` | undefined) {
    const [tokenURIs, setTokenURIs] = useState<string[]>([]);
    const [isLoadingTokenIds, setIsLoadingTokenIds] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!address) return;

            setIsLoadingTokenIds(true);
            try {
                const { data: tokenIds } = useReadContract({
                    address: contractAddress,
                    abi: abi,
                    functionName: 'getSoulboundNFTs',
                    args: address ? [address] : undefined,
                });

                const uris: string[] = [];
                if (tokenIds && tokenIds.length > 0) {
                    for (const tokenId of tokenIds) {
                        const { data: uri } = await useReadContract({
                            address: contractAddress,
                            abi: abi,
                            functionName: "tokenURI",
                            args: [tokenId],
                        });
                        uris.push(uri as string);
                    }
                }
                setTokenURIs(uris.filter(uri => uri)); // Filter out undefined URIs
            } catch (error) {
                console.error("Error fetching token URIs:", error);
            } finally {
                setIsLoadingTokenIds(false);
            }
        };

        fetchData();
    }, [address]);

    return { tokenURIs, isLoadingTokenIds };
}
