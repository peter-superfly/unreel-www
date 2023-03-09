import React, { useState, useEffect } from "react";
import { defaultData } from "./defaults";

export const GlobalContext = React.createContext();
const GlobalProvider = GlobalContext.Provider;

export default ({ children }) => {
  const [globalData, setGlobalData] = useState({
    ...defaultData,
  });

  return (
    <GlobalProvider value={{ globalData, setGlobalData }}>
      {children}
    </GlobalProvider>
  );
};
