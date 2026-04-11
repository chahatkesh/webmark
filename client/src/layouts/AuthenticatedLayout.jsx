// src/layouts/AuthenticatedLayout.jsx
import React from "react";
import Header from "../components/Header";
import useProfile from "../hooks/useProfile";

const AuthenticatedLayout = ({ children }) => {
  useProfile(); // seeds aiSortsRemaining + importsRemainingThisMonth into localStorage on every route
  return (
    <div className="authenticated-layout">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default AuthenticatedLayout;
