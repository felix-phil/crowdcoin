import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";
import Address from "./build/address.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi as any,
  Address.address
);

export default instance;
