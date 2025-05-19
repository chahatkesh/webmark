import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import StoreContextProvider from "./context/StoreContext.jsx";
import "./index.css";
import { setupGlobalErrorHandlers } from "./utils/errorHandling.js";

// Set up global error handlers
setupGlobalErrorHandlers();

// Create a React Query client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      onError: (error) => {
        console.error("Query error:", error);
      },
    },
    mutations: {
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    },
  },
});

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
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <StoreContextProvider>
        <RouterProvider router={router} />
      </StoreContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
