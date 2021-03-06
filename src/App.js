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
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ListingsPage from "./pages/ListingsPage";
import idl from "./idls/idl.json";
import BuyPage from "./pages/BuyPage";

require("@solana/wallet-adapter-react-ui/styles.css");

const networkUrl = "https://api.mainnet-beta.solana.com";

const programID = new PublicKey(idl.metadata.address);
const network = WalletAdapterNetwork.Mainnet;
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
        try {
            const provider = getProvider();

            const program = new Program(idl, programID, provider);
            setProvider(provider);
            console.log(provider);
            setProgram(program);
            console.log(program);
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
        const navigate = useNavigate();
        return (
            <div className="navbar-div">
                <div className="navbar-text">P2P NFTs</div>
                <div className="navbar-routes">
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        Home
                    </span>
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/listings")}
                    >
                        My Listings
                    </span>
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
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <div>
                                    <Navbar />
                                    <HomePage
                                        setPublicKey={setPublicKey}
                                        connection={newConnection}
                                        program={web3Program}
                                        provider={web3Provider}
                                    />
                                </div>
                            }
                        />
                        <Route
                            path="/listings"
                            element={
                                <div>
                                    <Navbar />
                                    <ListingsPage
                                        setPublicKey={setPublicKey}
                                        connection={newConnection}
                                        program={web3Program}
                                        provider={web3Provider}
                                    />
                                </div>
                            }
                            connection={newConnection}
                            program={web3Program}
                            provider={web3Provider}
                        />
                        <Route
                            path="/listing/:listingKey"
                            element={
                                <div>
                                    <Navbar />
                                    <BuyPage
                                        connection={newConnection}
                                        program={web3Program}
                                        provider={web3Provider}
                                    />
                                </div>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default App;
