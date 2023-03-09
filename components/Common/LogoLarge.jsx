import React from "react";
import Link from "next/link";

function Logo({ homepage }) {
  return (
    <Link href="/">
      <a>
        <img className={"info-page main-logo"} src="/logo.svg" />
      </a>
    </Link>
  );
}

export default Logo;
