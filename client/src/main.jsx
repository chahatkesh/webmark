import React from "react";
import ReactDOM from "react-dom/client";
import { SWRConfig } from "swr";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import StoreContextProvider from "./context/StoreContext.jsx";
import "./index.css";
import { setupGlobalErrorHandlers } from "./utils/errorHandling.js";

// Set up global error handlers
setupGlobalErrorHandlers();

// Create router with error handling
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <App />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        errorRetryCount: 1,
        dedupingInterval: 5000,
        onError: (error) => {
          console.error("SWR error:", error);
        },
      }}
    >
      <StoreContextProvider>
        <RouterProvider router={router} />
      </StoreContextProvider>
    </SWRConfig>
  </HelmetProvider>
);
