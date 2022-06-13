import React, { useEffect, useState } from "react";
import { Metaplex } from "@metaplex-foundation/js-next";
import { Connection } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import {
    resolveToWalletAddress,
    getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";

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
    const [userNfts, setUserNfts] = useState([]);

    const ueCallFn = async () => {
        const publicAddress = await resolveToWalletAddress({
            text: publicKey.toBase58(),
            connection,
        });

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
                        <div
                            key={nft.data.mint}
                            className="each-user-nft"
                            onClick={() => setSelectedNft(nft)}
                        >
                            <img
                                src={nft.data.uri}
                                className="user-nft-image"
                            />
                            <div className="nft-data-text">{nft.data.name}</div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default HomeNfts;
