import React, { useState } from "react";
import AskInterface from "../Components/AskInterface";
import HomeNfts from "../Components/HomeNfts";

import "./HomePage.css";

function HomePage() {
    const [selectedNft, setSelectedNft] = useState({});
    return (
        <div className="homepage">
            <HomeNfts setSelectedNft={setSelectedNft} />
            <AskInterface selectedNft={selectedNft} />
        </div>
    );
}

export default HomePage;
