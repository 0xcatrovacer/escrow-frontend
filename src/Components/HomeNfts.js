import React from "react";

const userNFTs = [
    {
        img: "https://www.arweave.net/PShUK1uSCVszk8XfY-hLaiXhoxT91_Qmsz_FvbKzWLo?ext=jpg",
        name: "Degen Ape #4269",
    },
    {
        img: "https://arweave.net/2LBuacRI_sVHbEJwLz_jh9m116smpJeArx01vYep7Xk",
        name: "Degen Ape #4270",
    },
    {
        img: "https://www.degenape.academy/images/framed_apes/14.jpg",
        name: "Degen Ape #4271",
    },
    {
        img: "https://www.degenape.academy/images/framed_apes/33.jpg",
        name: "Degen Ape #4272",
    },
    {
        img: "https://arweave.net/12oSAVNB-zbBDLaejqRUIyOGSgkogrgZeI-g7uFaPaw",
        name: "Degen Ape #4273",
    },
];

function HomeNfts({ setSelectedNft }) {
    return (
        <div className="home-nfts">
            <div className="nft-content-head">Your NFTs</div>

            <div className="nfts-list">
                {userNFTs.map((nft) => (
                    <div
                        className="each-user-nft"
                        onClick={() => setSelectedNft(nft)}
                    >
                        <img src={nft.img} className="user-nft-image" />
                        <div className="nft-data-text">{nft.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomeNfts;
