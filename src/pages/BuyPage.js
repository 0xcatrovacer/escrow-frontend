import {
    getParsedAccountByMint,
    getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";
import { PublicKey, Transaction } from "@solana/web3.js";
import { utils } from "@project-serum/anchor";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./BuyPage.css";
import {
    createAssociatedTokenAccountInstruction,
    getAccount,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";

function BuyPage({ connection, program, provider }) {
    const [nft, setNft] = useState([]);
    const [imageLink, setImageLink] = useState("");
    const [nftEscrowAccount, setEscrowAccount] = useState(null);

    const { listingKey } = useParams();

    const { publicKey } = useWallet();

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

            console.log(escrowAccount);
            setEscrowAccount(escrowAccount);

            const img = await axios.get(nft[0].data.uri);
            setImageLink(img.data.image);
        }
    };

    useEffect(() => {
        callFn();
    }, [program]);

    const handleBuyNft = async () => {
        const [vault_account_pda, _vault_account_bump] =
            await PublicKey.findProgramAddress(
                [
                    nftEscrowAccount.initializerKey.toBuffer(),
                    nftEscrowAccount.initializerNftMint.toBuffer(),
                ],
                program.programId
            );

        const [vault_authority_pda, _vault_authority_bump] =
            await PublicKey.findProgramAddress(
                [Buffer.from(utils.bytes.utf8.encode("escrow"))],
                program.programId
            );

        const transaction = new Transaction();

        const takerDepositTokenAccount = await getAssociatedTokenAddress(
            new PublicKey(process.env.REACT_APP_USDC_MINT),
            publicKey
        );

        try {
            await getAccount(connection, takerDepositTokenAccount);
        } catch (e) {
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    publicKey,
                    takerDepositTokenAccount,
                    publicKey,
                    new PublicKey(process.env.REACT_APP_USDC_MINT)
                )
            );
        }

        const takerReceiveNftAccount = await getAssociatedTokenAddress(
            nftEscrowAccount.initializerNftMint,
            publicKey
        );

        try {
            await getAccount(connection, takerReceiveNftAccount);
        } catch {
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    publicKey,
                    takerReceiveNftAccount,
                    publicKey,
                    nftEscrowAccount.initializerNftMint
                )
            );
        }

        const feeAccount = await getAssociatedTokenAddress(
            new PublicKey(process.env.REACT_APP_USDC_MINT),
            new PublicKey("HePXu2ch5nXC82t7sgMCuQVi6QDhjU7q4TR48zhgXvcR")
        );

        await provider.sendAndConfirm(transaction);

        await program.methods
            .exchange()
            .accounts({
                escrowAccount: new PublicKey(listingKey),
                vaultAccount: vault_account_pda,
                vaultAuthority: vault_authority_pda,
                initializer: nftEscrowAccount.initializerKey,
                taker: publicKey,
                initializerDepositTokenAccount:
                    nftEscrowAccount.initializerDepositTokenAccount,
                initializerReceiveTokenAccount:
                    nftEscrowAccount.initializerReceiveTokenAccount,
                takerDepositTokenAccount: takerDepositTokenAccount,
                takerReceiveTokenAccount: takerReceiveNftAccount,
                feeAccount: feeAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([])
            .rpc();
    };

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
                        {nftEscrowAccount.initializerReceiveAmount.toNumber() /
                            1000000}{" "}
                        USDC
                    </div>
                    <div className="buy-button-container">
                        <button className="buy-button" onClick={handleBuyNft}>
                            Buy NFT
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuyPage;
