import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Message,
  Container,
  Label,
} from "semantic-ui-react";
import Router from "next/router";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

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
  successMessage: string;
}
interface Props {
  address: string;
}
const ContributeForm: React.FC<Props> = (props) => {
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
    successMessage: "",
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
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(state.form.contribution, "ether"),
      });
      setState((prev) => {
        return {
          ...prev,
          successMessage: "Contribution has been added!",
          form: { contribution: "" },
        };
      });
      Router.replace(`/campaigns/${props.address}`);
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
  return (
    <Container>
      <Label attached="top left">CONTRIBUTE TO THIS CAMPAIGN</Label>
      <Form
        onSubmit={handleSubmit}
        error={!!state.errorMessage}
        loading={state.loading}
        success={!!state.successMessage}
      >
        <Message content={state.successMessage} header="success" success />
        <Form.Field style={{ marginTop: "7%" }}>
          <label>Amount to contirbute</label>
          <Input
            label="ether"
            type="number"
            labelPosition="right"
            placeholder="0.1 ether"
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
          Contribute!
        </Button>
      </Form>
    </Container>
  );
};

export default ContributeForm;
