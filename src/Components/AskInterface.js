import React from "react";

function AskInterface({ selectedNft }) {
    const SelectedNftHandler = () => {
        return (
            <div className="nft-ask-inner">
                <div className="nft-ask-data">
                    <img
                        src={selectedNft.data.uri}
                        className="selected-nft-img"
                    />
                    <div className="nft-ask-name">{selectedNft.data.name}</div>
                </div>
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

    return (
        <div className="ask-interface">
            <div className="ask-interface-head">Quote a Price</div>
            {selectedNft ? (
                <SelectedNftHandler />
            ) : (
                <div>Please Select and NFT</div>
            )}
        </div>
    );
}

export default AskInterface;
