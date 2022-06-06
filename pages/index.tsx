import { NextPage, GetStaticProps } from "next";
import React from "react";
import { Button, Card, Grid, Label } from "semantic-ui-react";
import Link from "next/link";
import factory from "../ethereum/factory";

interface Props {
  campaigns: string[];
}

const IndexPage: NextPage<Props> = ({ campaigns }) => {
  const renderCampaigns = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link href="/campaigns/[address]" as={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
        link: true,
      };
    });
    return <Card.Group items={items} />;
  };

  return (
    <Grid divided={"vertically"}>
      <Grid.Row>
        <Grid.Column width={12}>
          <Label attached="top left">OPEN CAMPAIGNS</Label>
          {renderCampaigns()}
        </Grid.Column>
        <Grid.Column width={4}>
          <Link href="/campaigns/new">
            <a>
              <Button
                content={"Create Campaign"}
                icon="add circle"
                labelPosition="left"
                primary
              />
            </a>
          </Link>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

IndexPage.getInitialProps = async () => {
  const campaigns: string[] = await factory.methods
    .getDeployedCampaigns()
    .call();

  return {
    campaigns: campaigns,
  };
};

export default IndexPage;
