import React, { FC, useState } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import Router from "next/router";

interface Request {
  description: string;
  value: string;
  recipient: boolean;
  approvalCount: string;
  complete: boolean;
}
interface Props {
  request: Request;
  index: number;
  address: string;
  approversCount: number;
}
const RequestRow: FC<Props> = (props) => {
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [finalizeLoading, setFinalizeLoading] = useState<boolean>(false);
  const readyToFinalize =
    parseInt(props.request.approvalCount) > props.approversCount / 2;

  const handleApprove = async () => {
    const campaign = Campaign(props.address);
    setApproveLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(props.index).send({
        from: accounts[0],
      });
      Router.replace(`/campaigns/${props.address}/requests`);
    } catch (err) {}
    setApproveLoading(false);
  };
  const handleFinalize = async () => {
    const campaign = Campaign(props.address);
    setFinalizeLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(props.index).send({
        from: accounts[0],
      });
      Router.replace(`/campaigns/${props.address}/requests`);
    } catch (err) {}
    setFinalizeLoading(false);
  };
  return (
    <Table.Row
      disabled={props.request.complete}
      positive={readyToFinalize && !props.request.complete}
    >
      <Table.Cell>{props.index}</Table.Cell>
      <Table.Cell>{props.request.description}</Table.Cell>
      <Table.Cell>
        {web3.utils.fromWei(props.request.value, "ether")}
      </Table.Cell>
      <Table.Cell>{props.request.recipient}</Table.Cell>
      <Table.Cell>
        {props.request.approvalCount}/{props.approversCount}
      </Table.Cell>
      <Table.Cell>
        {!props.request.complete && (
          <Button
            type="button"
            positive
            basic
            onClick={handleApprove}
            loading={approveLoading}
            disabled={approveLoading}
          >
            Approve
          </Button>
        )}
      </Table.Cell>
      <Table.Cell>
        {!props.request.complete && (
          <Button
            type="button"
            color="teal"
            basic
            onClick={handleFinalize}
            loading={finalizeLoading}
            disabled={!readyToFinalize || finalizeLoading}
          >
            Finalize
          </Button>
        )}
      </Table.Cell>
    </Table.Row>
  );
};

export default RequestRow;
