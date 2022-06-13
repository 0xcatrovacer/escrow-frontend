import React from "react";
import AskInterface from "../Components/AskInterface";
import HomeNfts from "../Components/HomeNfts";

import "./HomePage.css";

function HomePage() {
    return (
        <div className="homepage">
            <HomeNfts />
            <AskInterface />
        </div>
    );
}

export default HomePage;
