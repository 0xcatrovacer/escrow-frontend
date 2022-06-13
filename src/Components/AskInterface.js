import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BN, web3 } from "@project-serum/anchor";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";

function AskInterface({
    selectedNft,
    publicKey,
    connection,
    program,
    provider,
}) {
    const [ask, setAsk] = useState("");
    const [imgLink, setImgLink] = useState(null);

    const usdcMint = new PublicKey(process.env.REACT_APP_USDC_MINT);
    const usdcDecimals = 1000000;

    const getNftImage = async () => {
        const nft_metadata = await axios.get(selectedNft.data.uri);

        setImgLink(nft_metadata.data.image);
    };

    const handleCreateListing = async (e) => {
        e.preventDefault();

        const escrowAccount = web3.Keypair.generate();

        const nftMint = new PublicKey(selectedNft.mint);

        try {
            const [vault_account_pda, _vault_account_bump] =
                await PublicKey.findProgramAddress(
                    [publicKey.toBuffer(), nftMint.toBuffer()],
                    program.programId
                );

            const initializerAssociatedNftAccount =
                await getAssociatedTokenAddress(nftMint, publicKey);

            const initializerAssociatedReceiveAccount =
                await getAssociatedTokenAddress(usdcMint, publicKey);

            await program.methods
                .initializeEscrow(new BN(ask * usdcDecimals))
                .accounts({
                    vaultAccount: vault_account_pda,
                    escrowAccount: escrowAccount.publicKey,
                    initializer: publicKey,
                    initializerNftMint: nftMint,
                    initializerDepositTokenAccount:
                        initializerAssociatedNftAccount,
                    initializerReceiveMint: usdcMint,
                    initializerReceiveTokenAccount:
                        initializerAssociatedReceiveAccount,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    rent: web3.SYSVAR_RENT_PUBKEY,
                    systemProgram: web3.SystemProgram.programId,
                })
                .preInstructions([
                    await program.account.escrowAccount.createInstruction(
                        escrowAccount
                    ),
                ])
                .signers([escrowAccount])
                .rpc();

            let _escrowAccount = await program.account.escrowAccount.fetch(
                escrowAccount.publicKey
            );

            console.log(_escrowAccount);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        selectedNft && getNftImage();
    }, [selectedNft]);

    return (
        <div className="ask-interface">
            <div className="ask-interface-head">Quote a Price</div>
            {selectedNft && (
                <div className="nft-ask-inner">
                    {selectedNft.data && (
                        <div className="nft-ask-data">
                            <img src={imgLink} className="selected-nft-img" />
                            <div className="nft-ask-name">
                                {selectedNft.data.name}
                            </div>
                        </div>
                    )}
                    <div className="nft-ask-form">
                        <input
                            name="ask"
                            placeholder="0.00"
                            type="number"
                            className="price-input"
                            min={0}
                            value={ask}
                            required
                            onChange={(e) => {
                                setAsk(e.target.value);
                            }}
                        />
                        <div className="ask-usdc">USDC</div>
                    </div>
                    <div className="create-listing">
                        <button
                            className="create-listing-button"
                            onClick={handleCreateListing}
                        >
                            Create Listing
                        </button>
                    </div>
                </div>
            )}
            {!selectedNft && (
                <div className="no-nft-selected">Please Select and NFT</div>
            )}
        </div>
    );
}

export default AskInterface;
