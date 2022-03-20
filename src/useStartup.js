import { ethers } from "ethers";
import { useEffect, useState } from "react";
import nftAbi from "./utils/MyEpicNft.json";

export const useStartup = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== "0x4") {
        alert("Вы не в сети rinkeby");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
    } else {
      console.log("Get metamask");
    }
  };

  useEffect(() => {
    (async () => {
      if (window.ethereum) {
        console.log("OK!");

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          "0xaFf7F3C68793e54779D80a1386AD7Fb194e4Ad07",
          nftAbi.abi,
          signer
        );
        setContract(contract);

        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        if (chainId !== "0x4") {
          alert("Вы не в сети rinkeby");
          return;
        }

        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          setAccount(accounts[0]);
          console.log("Аккаунт авторизован", accounts[0]);
        } else {
          console.log("Нет авторизованных аккантов");
        }
      } else {
        console.log("Get metamask");
      }
    })();
  }, []);

  return { contract, account, connectWallet };
};
