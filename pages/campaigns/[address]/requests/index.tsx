import { NextPage, GetServerSideProps } from "next";
import React from "react";
import { Button, Grid, Label, Table } from "semantic-ui-react";
import Link from "next/link";
import Campaign from "../../../../ethereum/campaign";
import RequestRow from "../../../../components/RequestRow";

interface Request {
  description: string;
  value: string;
  recipient: boolean;
  approvalCount: string;
  complete: boolean;
}
interface Props {
  address: string;
  requestsCount: number;
  requests: Request[];
  approversCount: number;
}
const RequestsPage: NextPage<Props> = (props) => {
  const renderTableRows = () => {
    return props.requests.map((request, index) => (
      <RequestRow
        request={request}
        index={index}
        address={props.address}
        key={index.toString()}
        approversCount={props.approversCount}
      />
    ));
  };
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Link href={`/campaigns/${props.address}/requests/new`}>
            <a>
              <Button primary>Add Request</Button>
            </a>
          </Link>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Label attached="top left">OPEN REQUESTS</Label>
        <Grid.Column width={16}>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Amount (ether)</Table.HeaderCell>
                <Table.HeaderCell>Recipient (Address)</Table.HeaderCell>
                <Table.HeaderCell>Approval Count</Table.HeaderCell>
                <Table.HeaderCell>Approve</Table.HeaderCell>
                <Table.HeaderCell>Finalize</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{renderTableRows()}</Table.Body>
          </Table>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>Found {props.requestsCount} request(s)</Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const address = context.query.address as string;
  const campaign = Campaign(address);

  const requestsCount = (await campaign.methods
    .getRequestsCount()
    .call()) as string;
  const approversCount = (await campaign.methods
    .approversCount()
    .call()) as string;

  const requests = await Promise.all(
    Array(parseInt(requestsCount))
      .fill(requestsCount)
      .map(
        (element, index) => campaign.methods.requests(index).call() as Request
      )
  );

  return {
    props: {
      address: address,
      requests: requests,
      requestsCount: parseInt(requestsCount),
      approversCount: parseInt(approversCount),
    },
  };
};

export default RequestsPage;
