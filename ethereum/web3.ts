import Web3 from "web3";

let web3: Web3;

declare global {
  interface Window {
    ethereum?: any;
  }
}

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(
    process.env.NEXT_PUBLIC_RINKEBY_DEPLOY_NETWORK!
  );
  web3 = new Web3(provider);
}

export default web3;
