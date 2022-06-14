import {
    getParsedAccountByMint,
    getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import Listing from "../Components/Listing";

import "./ListingsPage.css";

function ListingsPage({ setPublicKey, connection, program, provider }) {
    const [nftListings, setListings] = useState([]);
    const [parsedNfts, setParsedNfts] = useState([]);

    const { publicKey } = useWallet();

    const getAllListings = async () => {
        const listings = await program.account.escrowAccount.all([
            {
                memcmp: {
                    offset: 8,
                    bytes: publicKey.toBase58(),
                },
            },
        ]);

        const parsedAccount = await getParsedAccountByMint({
            mintAddress: listings[0].account.initializerNftMint.toBase58(),
            connection,
        });

        const nfts = await getParsedNftAccountsByOwner({
            publicAddress: parsedAccount.account.data.parsed.info.owner,
            connection,
        });

        console.log(nfts);

        setListings(listings);
        setParsedNfts(nfts);
    };

    useEffect(() => {
        setPublicKey(publicKey);
        getAllListings();
    }, []);

    return (
        <div>
            {(nftListings.length == 0 || parsedNfts.length == 0) && (
                <div>No Listings Available</div>
            )}
            <div className="all-listings">
                {nftListings &&
                    parsedNfts.map((nft, index) => (
                        <Listing
                            nft={nft}
                            listing={nftListings[index]}
                            connection={connection}
                            key={nft.mint}
                        />
                    ))}
            </div>
        </div>
    );
}

export default ListingsPage;
