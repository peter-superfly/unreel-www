import React from "react";

const PrivateLayoutContext = React.createContext({});
const PrivateLayoutProvider = PrivateLayoutContext.Provider;

export {
  PrivateLayoutContext,
  PrivateLayoutProvider
};