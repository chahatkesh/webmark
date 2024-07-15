import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";

const App = () => {
  const token = localStorage.getItem("token");
  return (
    <div className="app overflow-hidden flex flex-col min-h-[100vh]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Auth />} />
      </Routes>
    </div>
  );
};

export default App;
