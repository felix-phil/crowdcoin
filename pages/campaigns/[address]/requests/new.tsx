import React, { useState } from "react";
import { Form, Input, Button, Message, Grid, Label } from "semantic-ui-react";
import Router from "next/router";
import { NextPage } from "next";
import web3 from "../../../../ethereum/web3";
import Campaign from "../../../../ethereum/campaign";
import Link from "next/link";

interface State {
  form: {
    description: string;
    value: string;
    recipient: string;
  };
  error: {
    description: string | null;
    value: string | null;
    recipient: string | null;
  };
  submitClick: boolean;
  loading: boolean;
  errorMessage: string;
}
interface Props {
  address: string;
}
const NewRequestPage: NextPage<Props> = (props) => {
  const [state, setState] = useState<State>({
    form: {
      description: "",
      value: "",
      recipient: "",
    },
    error: {
      description: null,
      value: null,
      recipient: null,
    },
    submitClick: false,
    loading: false,
    errorMessage: "",
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validate();
    setState((prev) => {
      return { ...prev, submitClick: true, errorMessage: "" };
    });
    if (Object.values(state.error).some((value) => value !== null)) {
      return;
    }
    setState((prev) => {
      return { ...prev, loading: true };
    });
    const campaign = Campaign(props.address);
    try {
      const accounts = await web3.eth.getAccounts();
      const { description, value, recipient } = state.form;
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0],
        });

      Router.push(`/campaigns/${props.address}/requests`);
    } catch (err: any) {
      setState((prev) => {
        return { ...prev, errorMessage: err.message };
      });
    }
    setState((prev) => {
      return { ...prev, loading: false };
    });
  };
  const validate = (input?: string) => {
    const form = state.form;
    const error = state.error;
    if (!input || input === "value") {
      error.value =
        form.value === "" || isNaN(parseFloat(form.value))
          ? "This field is required"
          : null;
    }
    if (!input || input === "description") {
      error.description =
        form.description === "" ? "This field is required" : null;
    }
    if (!input || input === "recipient") {
      error.recipient = form.recipient === "" ? "This field is required" : null;
    }
    setState((prev) => {
      return { ...prev, error: error };
    });
  };
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Link
            href={`/campaigns/${props.address}/requests`}
            style={{ marginBottom: "5%" }}
          >
            <a>Go Back</a>
          </Link>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column computer={13} mobile={16} tablet={16}>
          <Label attached="top left">CREATE NEW REQUEST</Label>
          <Form
            onSubmit={handleSubmit}
            error={!!state.errorMessage}
            loading={state.loading}
          >
            <Form.Field style={{ marginTop: "4%" }}>
              <label>Description</label>
              <Input
                type="text"
                placeholder="To buy microscope"
                value={state.form.description}
                onChange={(e) => {
                  setState((prev) => {
                    return {
                      ...prev,
                      form: { ...prev.form, description: e.target.value },
                    };
                  });
                  state.submitClick && validate();
                }}
                error={state.error.description !== null}
              />
            </Form.Field>
            <Form.Field>
              <label>Value in Ether</label>
              <Input
                label="ether"
                labelPosition="right"
                type="number"
                placeholder="0.1 ether"
                value={state.form.value}
                onChange={(e) => {
                  setState((prev) => {
                    return {
                      ...prev,
                      form: { ...prev.form, value: e.target.value },
                    };
                  });
                  state.submitClick && validate();
                }}
                error={state.error.value !== null}
              />
            </Form.Field>
            <Form.Field>
              <label>Recipient Address</label>
              <Input
                type="text"
                placeholder="0x134..."
                value={state.form.recipient}
                onChange={(e) => {
                  setState((prev) => {
                    return {
                      ...prev,
                      form: { ...prev.form, recipient: e.target.value },
                    };
                  });
                  state.submitClick && validate();
                }}
                error={state.error.recipient !== null}
              />
            </Form.Field>
            <Message error header="Oops!" content={state.errorMessage} />

            <Button
              primary
              type="submit"
              disabled={Object.values(state.error).some(
                (value) => value !== null
              )}
            >
              Create Request
            </Button>
          </Form>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
NewRequestPage.getInitialProps = (context) => {
  const address = context.query.address as string;
  return {
    address: address,
  };
};
export default NewRequestPage;
