// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Tools from "./pages/Tools";
import Steps from "./pages/Steps";
import ReportProblem from "./pages/ReportProblem";
import Auth from "./pages/Auth";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";

const App = () => {
  const token = localStorage.getItem("token");
  return (
    <div className="app bg-white overflow-hidden flex flex-col min-h-[100vh]">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

        {/* Protected Routes */}
        {token && (
          <>
            <Route
              path="/user/dashboard"
              element={
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              }
            />
            <Route
              path="/user/more-tools"
              element={
                <AuthenticatedLayout>
                  <Tools />
                </AuthenticatedLayout>
              }
            />
            <Route
              path="/user/how-to-use"
              element={
                <AuthenticatedLayout>
                  <Steps />
                </AuthenticatedLayout>
              }
            />
            <Route
              path="/user/report-problem"
              element={
                <AuthenticatedLayout>
                  <ReportProblem />
                </AuthenticatedLayout>
              }
            />
          </>
        )}

        {/* Redirect to Auth if not logged in */}
        {!token && (
          <>
            <Route path="/user/dashboard" element={<Auth />} />
            <Route path="/user/more-tools" element={<Auth />} />
            <Route path="/user/how-to-use" element={<Auth />} />
            <Route path="/user/report-problem" element={<Auth />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;
