import assert from "assert";
import ganache from "ganache";
import Web3 from "web3";

const provider = ganache.provider();
const web3 = new Web3(provider as any);

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts: string[];
let factory: any;
let campaignAdrress: string;
let campaign: any;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
    })
    .send({ gas: 10000000, from: accounts[0] });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: 10000000,
  });
  [campaignAdrress] = await factory.methods.getDeployedCampaigns().call();

  campaign = new web3.eth.Contract(compiledCampaign.abi, campaignAdrress);
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", async () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
  it("marks account[0] (caller) as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });
  it("allows people to contribut and marks them as apporover", async () => {
    await campaign.methods.contribute().send({
      value: 200,
      from: accounts[1],
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });
  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "5",
        gas: "1000000",
        from: accounts[4],
      });
      assert(false);
    } catch (error) {
      assert(true);
    }
  });
  it("allows manager to create payment request", async () => {
    await campaign.methods
      .createRequest("Buy a kubernetes cluster", "100", accounts[5])
      .send({
        gas: "1000000",
        from: accounts[0],
      });
    const request = await campaign.methods.requests(0).call();
    assert.equal("Buy a kubernetes cluster", request.description);
  });
  it("processes requests", async () => {
    await campaign.methods.contribute().send({
      value: web3.utils.toWei("10", "ether"),
      gas: "1000000",
      from: accounts[4],
    });

    await campaign.methods
      .createRequest(
        "Buy a kubernetes cluster",
        web3.utils.toWei("5", "ether"),
        accounts[5]
      )
      .send({
        gas: "1000000",
        from: accounts[0],
      });
    await campaign.methods.approveRequest(0).send({
      gas: "1000000",
      from: accounts[4],
    });
    await campaign.methods.finalizeRequest(0).send({
      gas: "1000000",
      from: accounts[0],
    });

    let balance = await web3.eth.getBalance(accounts[5]);
    balance = web3.utils.fromWei(balance, "ether");
    const balanceFloat = parseFloat(balance);
    console.log(balanceFloat);
    assert(balanceFloat >= 1004);
  });
});
