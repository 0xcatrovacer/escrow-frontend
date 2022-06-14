import React, { useEffect, useState } from "react";
import {
    resolveToWalletAddress,
    getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";
import Nft from "./Nft";

function HomeNfts({ setSelectedNft, publicKey, connection }) {
    const [userNfts, setUserNfts] = useState(null);

    const ueCallFn = async () => {
        const publicAddress =
            publicKey &&
            (await resolveToWalletAddress({
                text: publicKey.toBase58(),
                connection,
            }));

        const nfts = await getParsedNftAccountsByOwner({
            publicAddress,
            connection,
        });

        setUserNfts(nfts);

        console.log(nfts);
    };

    useEffect(() => {
        ueCallFn();
    }, [publicKey]);

    return (
        <div className="home-nfts">
            <div className="nft-content-head">Your NFTs</div>

            <div className="nfts-list">
                {userNfts &&
                    userNfts.map((nft) => (
                        <Nft
                            nft={nft}
                            key={nft.mint}
                            setSelectedNft={setSelectedNft}
                        />
                    ))}
            </div>
        </div>
    );
}

export default HomeNfts;
