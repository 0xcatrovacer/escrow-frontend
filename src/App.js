import { useEffect, useMemo, useState } from "react";
import "./App.css";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    WalletModalProvider,
    WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
    ConnectionProvider,
    useWallet,
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
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ListingsPage from "./pages/ListingsPage";

require("@solana/wallet-adapter-react-ui/styles.css");

const networkUrl = "https://api.devnet.solana.com";

const network = WalletAdapterNetwork.Devnet;
const opts = {
    preflightCommitment: "processed",
};

function App() {
    const [web3Program, setProgram] = useState(null);
    const [web3Provider, setProvider] = useState(null);
    const [newConnection, setConnection] = useState(null);
    const [publicKey, setPublicKey] = useState(null);
    const getProvider = () => {
        const connection = new Connection(networkUrl);
        const provider = new AnchorProvider(
            connection,
            window.solana,
            opts.preflightCommitment
        );

        setConnection(connection);
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
    }, [publicKey]);

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

    const Navbar = () => {
        return (
            <div className="navbar-div">
                <div className="navbar-text">P2P NFTs</div>
                <div className="navbar-routes">
                    <span>Home</span>
                    <span>My Listings</span>
                </div>
                <WalletModalProvider>
                    <WalletMultiButton />
                </WalletModalProvider>
            </div>
        );
    };

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <Navbar />
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <HomePage
                                    setPublicKey={setPublicKey}
                                    connection={newConnection}
                                />
                            }
                        />
                        <Route path="/listings" element={<ListingsPage />} />
                    </Routes>
                </BrowserRouter>
                {/* Rest of the code */}
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default App;
