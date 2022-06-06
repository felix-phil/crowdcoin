import { NextPage } from "next";
import React, { useState } from "react";
import { Button, Form, Grid, Label, Input, Message } from "semantic-ui-react";
import Router from "next/router";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

interface Props {}
interface State {
  form: {
    contribution: string;
  };
  error: {
    contribution: string | null;
  };
  submitClick: boolean;
  loading: boolean;
  errorMessage: string;
}
const CampaignNew: NextPage<Props> = () => {
  const [state, setState] = useState<State>({
    form: {
      contribution: "",
    },
    error: {
      contribution: null,
    },
    submitClick: false,
    loading: false,
    errorMessage: "",
  });
  const validate = (input?: string) => {
    const form = state.form;
    const error = state.error;
    if (!input || input === "contribution") {
      error.contribution =
        form.contribution === "" || isNaN(parseFloat(form.contribution))
          ? "This field is required"
          : null;
    }
    setState((prev) => {
      return { ...prev, error: error };
    });
  };
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
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(state.form.contribution).send({
        from: accounts[0],
      });
      Router.push("/");
    } catch (err: any) {
      setState((prev) => {
        return { ...prev, errorMessage: err.message };
      });
    }
    setState((prev) => {
      return { ...prev, loading: false };
    });
  };
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column mobile={16} tablet={12}>
          <Label attached="top left">Create a Campaign</Label>
          <Form
            onSubmit={handleSubmit}
            error={!!state.errorMessage}
            loading={state.loading}
          >
            <Form.Field style={{ marginTop: "7%" }}>
              <label>Minimum Contribution</label>
              <Input
                label="wei"
                type="number"
                labelPosition="right"
                placeholder="1000 wei"
                value={state.form.contribution}
                onChange={(e) => {
                  setState((prev) => {
                    return { ...prev, form: { contribution: e.target.value } };
                  });
                  state.submitClick && validate();
                }}
                error={state.error.contribution !== null}
              />
            </Form.Field>
            <Message error header="Oops!" content={state.errorMessage} />

            <Button
              primary
              type="submit"
              disabled={state.error.contribution !== null}
            >
              Create
            </Button>
          </Form>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default CampaignNew;
