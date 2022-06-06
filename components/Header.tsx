import React from "react";
import { Menu } from "semantic-ui-react";
import { useRouter } from "next/router";
import Link from "next/link";
const Header = () => {
  const router = useRouter();
  return (
    <Menu style={{ marginTop: "1rem" }}>
      <Link href="/">
        <a className={`item ${router.pathname === "/" && "active"}`}>
          CrowdCoin
        </a>
      </Link>
      <Menu.Menu position="right">
        <Link href="/">
          <a className={`item ${router.pathname === "/" && "active"}`}>
            Campaigns
          </a>
        </Link>
        <Link href="/campaigns/new">
          <a
            className={`item ${
              router.pathname === "/campaigns/new" && "active"
            }`}
          >
            +
          </a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
