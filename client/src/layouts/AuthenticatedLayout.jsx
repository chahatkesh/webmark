// src/layouts/AuthenticatedLayout.jsx
import React from "react";
import Header from "../components/Header";

const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="authenticated-layout">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default AuthenticatedLayout;
