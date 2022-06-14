import axios from "axios";
import React, { useEffect, useState } from "react";

function Listing({ nft, listing }) {
    const [imageLink, setImageLink] = useState("");

    console.log(listing);

    const callFn = async () => {
        if (listing.account.initializerNftMint.toBase58() !== nft.mint) {
            alert("Something Went wrong");
        }

        const img = await axios.get(nft.data.uri);

        setImageLink(img.data.image);
    };

    useEffect(() => {
        callFn();
    }, []);

    return (
        <div className="listing">
            <div className="listed-nft">
                <div className="listed-nft-data">
                    <div className="listed-nft-image-container">
                        <img src={imageLink} className="listed-nft-image" />
                    </div>
                    <div className="listed-nft-name">{nft.data.name}</div>
                </div>
                <div className="listing-ask">
                    Asked:{" "}
                    {listing.account.initializerReceiveAmount.toNumber() /
                        1000000}{" "}
                    USDC
                </div>
                <div className="listing-buttons">
                    <button className="copy-link">Copy Listing Link</button>

                    <button className="cancel-listing">Cancel Listing</button>
                </div>
            </div>
        </div>
    );
}

export default Listing;
