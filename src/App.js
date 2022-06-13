import { useEffect, useMemo, useState } from "react";
import "./App.css";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    WalletModalProvider,
    WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import {
    GlowWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { AnchorProvider } from "@project-serum/anchor";

require("@solana/wallet-adapter-react-ui/styles.css");

const networkUrl = "https://api.devnet.solana.com";

const network = WalletAdapterNetwork.Devnet;
const opts = {
    preflightCommitment: "processed",
};

function App() {
    const [web3Program, setProgram] = useState("null");
    const [web3Provider, setProvider] = useState("null");

    const getProvider = () => {
        const connection = new Connection(networkUrl);

        const provider = new AnchorProvider(
            connection,
            window.solana,
            opts.preflightCommitment
        );

        return provider;
    };

    const callFn = () => {
        const provider = getProvider();

        try {
            setProvider(provider);
            console.log(provider);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        callFn();
    }, []);

    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new GlowWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                    <WalletMultiButton />
                </WalletModalProvider>
                {/* Rest of the code */}
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default App;
