import React, { createContext, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  //local host
  const url = "http://localhost:4000";
  // deployed
  // const url = "https://webmark-server.onrender.com";
  const [token, setToken] = useState("");
  const contextValue = {
    url,
    token,
    setToken,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
