import "./styles/App.css";

import React, { useEffect, useState } from "react";
import { useStartup } from "./useStartup.js";

import twitterLogo from "./assets/twitter-logo.svg";

// Constants
const TWITTER_HANDLE = "maksim_krisanov";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [totalNft, setTotalNft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { account, contract, connectWallet } = useStartup();

  const mintNFT = async () => {
    try {
      setIsLoading(true);
      contract.on("NewApicNFTMinted", (from, nftId, totalNftCount) => {
        console.log(from, nftId.toNumber());
        setTotalNft(totalNftCount.toNumber());
      });

      const tnx = await contract.makeAnEpicNFT();

      await tnx.wait();

      const totalNftCount = await contract.getTotalNftCount();
      setTotalNft(totalNftCount.toNumber());

      console.log(
        "Transaction address",
        `https://rinkeby.etherscan.io/tx/${tnx.hash}`
      );
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (contract) {
        setIsLoading(true);
        const totalNftCount = await contract.getTotalNftCount();
        setTotalNft(totalNftCount.toNumber());
        setIsLoading(false);
      }
    })();
  }, [contract]);

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
        </div>
        {!account ? (
          renderNotConnectedContainer()
        ) : (
          <button
            className="cta-button connect-wallet-button"
            onClick={mintNFT}
          >
            {isLoading ? "Loading..." : `Mint new NFT. ${totalNft} / 50`}
          </button>
        )}
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
