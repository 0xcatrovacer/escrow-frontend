import axios from "axios";
import React, { useEffect, useState } from "react";

function Nft({ nft, setSelectedNft }) {
    const [imgLink, setImgLink] = useState(null);

    const getNftImage = async () => {
        const nft_metadata = await axios.get(nft.data.uri);
        setImgLink(nft_metadata.data.image);
    };

    useEffect(() => {
        getNftImage();
    }, []);

    return (
        <div
            key={nft.mint}
            className="each-user-nft"
            onClick={() => setSelectedNft(nft)}
        >
            <img src={imgLink} className="user-nft-image" />
            <div className="nft-data-text">{nft.data.name}</div>
        </div>
    );
}

export default Nft;
