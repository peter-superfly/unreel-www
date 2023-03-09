import React from "react";

export function MobileView(props) {
  console.log(props);
  const { children } = props;
  return <div className={"hide-desktop"}>{children}</div>;
}

export function DesktopView(props) {
  const { children } = props;
  return <div className={"hide-mobile"}>{children}</div>;
}
