import {
    getParsedAccountByMint,
    getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./BuyPage.css";

function BuyPage({ connection, program, provider }) {
    const [nft, setNft] = useState([]);
    const [imageLink, setImageLink] = useState("");
    const [escrowAccount, setEscrowAccount] = useState(null);

    const { listingKey } = useParams();

    const callFn = async () => {
        if (program) {
            const escrowAccount = await program.account.escrowAccount.fetch(
                new PublicKey(listingKey)
            );

            const parsedAccount = await getParsedAccountByMint({
                mintAddress: escrowAccount.initializerNftMint.toBase58(),
                connection,
            });

            const nfts = await getParsedNftAccountsByOwner({
                publicAddress: parsedAccount.account.data.parsed.info.owner,
                connection,
            });

            const nft = nfts.filter(
                (nft) => escrowAccount.initializerNftMint.toBase58() == nft.mint
            );

            console.log(nft);
            setNft(nft);

            setEscrowAccount(escrowAccount);

            const img = await axios.get(nft[0].data.uri);
            setImageLink(img.data.image);
        }
    };

    useEffect(() => {
        callFn();
    }, [program]);

    return (
        <div className="buy-page">
            <div className="no-listing-found">
                {nft.length == 0 && (
                    <div className="no-listing-text">No Listing Found</div>
                )}
            </div>
            {nft[0] && (
                <div className="buy-container">
                    <div className="buy-nft-data">
                        <div className="buy-image-container">
                            <img src={imageLink} className="buy-image" />
                        </div>
                        <div className="buy-nft-name">{nft[0].data.name}</div>
                    </div>
                    <div className="buy-ask-amt">
                        Ask Price:{" "}
                        {escrowAccount.initializerReceiveAmount.toNumber() /
                            1000000}{" "}
                        USDC
                    </div>
                    <div className="buy-button-container">
                        <button className="buy-button">Buy NFT</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuyPage;
