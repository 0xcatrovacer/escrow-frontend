import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import AskInterface from "../Components/AskInterface";
import HomeNfts from "../Components/HomeNfts";

import "./HomePage.css";

function HomePage({ setPublicKey, connection }) {
    const { publicKey } = useWallet();

    useEffect(() => {
        setPublicKey(publicKey);
    });

    const [selectedNft, setSelectedNft] = useState(null);
    return (
        <div className="homepage">
            <HomeNfts
                setSelectedNft={setSelectedNft}
                publicKey={publicKey}
                connection={connection}
            />
            <AskInterface selectedNft={selectedNft} />
        </div>
    );
}

export default HomePage;
