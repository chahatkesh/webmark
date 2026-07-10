import React from "react";
import Header from "../components/Header";
import { useBookmarkSync } from "../hooks/useBookmarkSync";

const AuthenticatedLayout = ({ children }) => {
  useBookmarkSync();

  return (
    <div className="authenticated-layout">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default AuthenticatedLayout;
