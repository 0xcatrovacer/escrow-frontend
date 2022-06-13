import React from "react";

const userNFTs = [
    {
        img: "https://www.arweave.net/PShUK1uSCVszk8XfY-hLaiXhoxT91_Qmsz_FvbKzWLo?ext=jpg",
        name: "Degen Ape #4269",
    },
    {
        img: "https://www.arweave.net/PShUK1uSCVszk8XfY-hLaiXhoxT91_Qmsz_FvbKzWLo?ext=jpg",
        name: "Degen Ape #4270",
    },
    {
        img: "https://www.arweave.net/PShUK1uSCVszk8XfY-hLaiXhoxT91_Qmsz_FvbKzWLo?ext=jpg",
        name: "Degen Ape #4271",
    },
    {
        img: "https://www.arweave.net/PShUK1uSCVszk8XfY-hLaiXhoxT91_Qmsz_FvbKzWLo?ext=jpg",
        name: "Degen Ape #4272",
    },
    {
        img: "https://www.arweave.net/PShUK1uSCVszk8XfY-hLaiXhoxT91_Qmsz_FvbKzWLo?ext=jpg",
        name: "Degen Ape #4273",
    },
];

function HomeNfts() {
    return (
        <div className="home-nfts">
            <div className="nft-content-head">Your NFTs</div>

            <div className="nfts-list">
                {userNFTs.map((nft) => (
                    <div className="each-user-nft">
                        <img src={nft.img} className="user-nft-image" />
                        <div className="nft-data-text">{nft.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomeNfts;
