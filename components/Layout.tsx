import Head from "next/head";
import React, { FC, ReactNode } from "react";
import { Container } from "semantic-ui-react";
import Header from "./Header";

const Layout: FC<{ children: ReactNode }> = ({ children }) => (
  <Container>
    <Head>
      <title> CrowdCoin </title>
    </Head>
    <Header />
    <Container fluid style={{ marginTop: "5%" }}>
      {children}
    </Container>
  </Container>
);

export default Layout;
