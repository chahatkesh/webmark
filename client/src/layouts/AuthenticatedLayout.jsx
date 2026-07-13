import React from "react";
import Header from "../components/Header";
import { useBookmarkSync } from "../hooks/useBookmarkSync";

const AuthenticatedLayout = ({ children }) => {
  useBookmarkSync();

  return (
    <div className="authenticated-layout">
      <Header />
      <main className="fixed inset-x-0 bottom-0 top-14 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
