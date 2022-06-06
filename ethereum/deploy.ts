import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import fs from "fs-extra";
import path from "path";

const compiledFactory = require("./build/CampaignFactory.json");

if (!process.env.ETH_ACCOUNT_PHRASE) {
  throw new Error("ETH_ACCOUNT_PHRASE env required");
}
if (!process.env.RINKEBY_DEPLOY_NETWORK) {
  throw new Error("RINKEBY_DEPLOY_NETWORK env required");
}
const provider = new HDWalletProvider(
  process.env.ETH_ACCOUNT_PHRASE,
  process.env.RINKEBY_DEPLOY_NETWORK
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account: ", accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: 10000000 });

  console.log("Deployed contract to address: ", result.options.address);

  //   Write deployed address to a file
  const buildPath = path.resolve(__dirname, "build");
  const addressPath = path.resolve(buildPath, "address.json");
  fs.ensureDir(buildPath);
  fs.removeSync(addressPath);
  fs.outputJSONSync(addressPath, {
    address: result.options.address,
  });
  //   cleanup
  provider.engine.stop();
};
deploy();
