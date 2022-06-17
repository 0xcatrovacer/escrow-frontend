import axios from "axios";
import React, { useEffect, useState } from "react";
import { utils } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

function Listing({ nfts, listing, program }) {
    const [imageLink, setImageLink] = useState("");
    const [escrowAccount, setEscrowAccount] = useState(null);

    const { publicKey } = useWallet();

    const callFn = async () => {
        console.log(listing);
        console.log(nfts);

        const nft = nfts.filter(
            (nft) => listing.account.initializerNftMint.toBase58() == nft.mint
        );

        const img = await axios.get(nft[0].data.uri);

        setImageLink(img.data.image);
        setEscrowAccount(listing.publicKey);
    };

    useEffect(() => {
        callFn();
    }, [listing]);

    const handleCancelListing = async () => {
        const initializerAssociatedNftAccount = await getAssociatedTokenAddress(
            listing.account.initializerNftMint,
            publicKey
        );

        const [vault_account_pda, _vault_account_bump] =
            await PublicKey.findProgramAddress(
                [
                    publicKey.toBuffer(),
                    listing.account.initializerNftMint.toBuffer(),
                ],
                program.programId
            );

        const [vault_authority_pda, _vault_authority_bump] =
            await PublicKey.findProgramAddress(
                [Buffer.from(utils.bytes.utf8.encode("escrow"))],
                program.programId
            );

        try {
            await program.methods
                .cancel()
                .accounts({
                    vaultAccount: vault_account_pda,
                    escrowAccount: new PublicKey(escrowAccount),
                    initializerDepositTokenAccount:
                        initializerAssociatedNftAccount,
                    vaultAuthority: vault_authority_pda,
                    initializer: publicKey,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .signers([])
                .rpc();

            // alert(`Listing for ${nft.data.name} cancelled`);
        } catch (e) {
            console.log(e);
        }
    };

    const handleListingLink = () => {
        navigator.clipboard.writeText(
            `${
                process.env.REACT_APP_PROD_LINK
            }/listing/${listing.publicKey.toBase58()}`
        );
    };

    return (
        <div className="listing">
            <div className="listed-nft">
                <div className="listed-nft-data">
                    <div className="listed-nft-image-container">
                        <img src={imageLink} className="listed-nft-image" />
                    </div>
                    <div className="listed-nft-name">{}</div>
                </div>
                <div className="listing-ask">
                    Asked:{" "}
                    {listing.account.initializerReceiveAmount.toNumber() /
                        1000000}{" "}
                    USDC
                </div>
                <div className="listing-buttons">
                    <button className="copy-link" onClick={handleListingLink}>
                        Copy Listing Link
                    </button>

                    <button
                        className="cancel-listing"
                        onClick={handleCancelListing}
                    >
                        Cancel Listing
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Listing;
