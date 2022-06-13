import React, { useEffect, useState } from "react";
import {
    resolveToWalletAddress,
    getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";
import axios from "axios";
import Nft from "./Nft";

const tempUserNFTs = [
    {
        img: "https://www.arweave.net/PShUK1uSCVszk8XfY-hLaiXhoxT91_Qmsz_FvbKzWLo?ext=jpg",
        name: "Degen Ape #4269",
    },
    {
        img: "https://arweave.net/2LBuacRI_sVHbEJwLz_jh9m116smpJeArx01vYep7Xk",
        name: "Degen Ape #4270",
    },
    {
        img: "https://www.degenape.academy/images/framed_apes/14.jpg",
        name: "Degen Ape #4271",
    },
    {
        img: "https://www.degenape.academy/images/framed_apes/33.jpg",
        name: "Degen Ape #4272",
    },
    {
        img: "https://arweave.net/12oSAVNB-zbBDLaejqRUIyOGSgkogrgZeI-g7uFaPaw",
        name: "Degen Ape #4273",
    },
];

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
