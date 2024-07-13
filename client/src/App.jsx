import React from "react";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div className="app overflow-hidden flex flex-col min-h-[100vh]">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
