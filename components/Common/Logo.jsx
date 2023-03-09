import React from "react";
import Link from "next/link";

function Logo({ homepage }) {
  return (
    <div className={"main-logo"}>
      <Link href={`${homepage}`}>
        <a href={`${homepage}`}>
          <img src="/logo.svg" />
        </a>
      </Link>
    </div>
  );
}

export default Logo;
