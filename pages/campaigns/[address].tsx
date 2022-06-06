import React from "react";
import { NextPage, GetServerSideProps } from "next";
import Campaign from "../../ethereum/campaign";
import { Button, Card, Grid, Label } from "semantic-ui-react";
import ContributeForm from "../../components/ContributeForm";
import { useRouter } from "next/router";
import web3 from "../../ethereum/web3";
import Link from "next/link";

interface Props {
  minimumContribution: string;
  balance: string;
  requestsCount: string;
  approversCount: string;
  manager: string;
}
const CampaignPage: NextPage<Props> = (props) => {
  const router = useRouter();

  const renderCampaignAttributes = () => {
    const {
      minimumContribution,
      balance,
      requestsCount,
      approversCount,
      manager,
    } = props;
    const items = [
      {
        header: manager,
        meta: "Manager's Address",
        description:
          "This manager created this campaign, only the manager can create and finalize requests",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to become an approver of this campaign.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from this campaign contract. Requests can only be make by manager.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description:
          "Number of people who has already donated to this campaign.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ether)",
        description: "The balance is the payable amount left in this campaign.",
        style: { overflowWrap: "break-word" },
      },
    ];
    return <Card.Group items={items} itemsPerRow={2} />;
  };
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column mobile={16} tablet={16} computer={10} largeScreen={10}>
          <Label attached="top left">CAMPAIGN DETAILS</Label>
          {renderCampaignAttributes()}
        </Grid.Column>
        <Grid.Column
          mobile={16}
          tablet={16}
          computer={6}
          largeScreen={6}
          style={{ marginTop: "5%" }}
        >
          <ContributeForm address={router.query.address as string} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Link href={`/campaigns/${router.query.address}/requests`}>
            <a>
              <Button content="View Requests" primary />
            </a>
          </Link>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const address = context.query.address as string;
  const campaign = Campaign(address);

  const summary = await campaign.methods.getSummary().call();
  return {
    props: {
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    },
  };
};

export default CampaignPage;
