import axios from "axios";
import React, { useEffect, useState } from "react";

function AskInterface({ selectedNft }) {
    const [imgLink, setImgLink] = useState(null);

    const getNftImage = async () => {
        const nft_metadata = await axios.get(selectedNft.data.uri);

        setImgLink(nft_metadata.data.image);
    };

    const SelectedNftHandler = () => {
        return (
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
                        placeholder="0.00"
                        type={"number"}
                        className="price-input"
                    />
                    <div className="ask-usdc">USDC</div>
                </div>
                <div className="create-listing">
                    <button className="create-listing-button">
                        Create Listing
                    </button>
                </div>
            </div>
        );
    };

    useEffect(() => {
        selectedNft && getNftImage();
    }, [selectedNft]);

    return (
        <div className="ask-interface">
            <div className="ask-interface-head">Quote a Price</div>
            {selectedNft ? (
                <SelectedNftHandler />
            ) : (
                <div className="no-nft-selected">Please Select and NFT</div>
            )}
        </div>
    );
}

export default AskInterface;
