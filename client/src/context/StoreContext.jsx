/* eslint-disable react-refresh/only-export-components -- context module exports provider + context */
import React, { createContext, useState } from "react";

// Keep the same context instance across Vite HMR
export const StoreContext =
  import.meta.hot?.data?.StoreContext ?? createContext(null);
if (import.meta.hot) {
  import.meta.hot.data.StoreContext = StoreContext;
}

const StoreContextProvider = (props) => {
  // Use environment variable with fallback for API URL
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  const contextValue = {
    url,
    token,
    setToken,
    user,
    setUser,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
