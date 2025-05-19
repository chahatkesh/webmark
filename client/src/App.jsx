import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Tools from "./pages/Tools";
import Help from "./pages/Help";
import ReportProblem from "./pages/ReportProblem";
import Auth from "./pages/Auth"; // Google Auth component
import Onboarding from "./pages/Onboarding"; // Onboarding component
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import Loader from "./components/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorBoundary } from "./components/ErrorComponents";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const App = () => {
  return (
    <ErrorBoundary>
      <div className="app bg-white overflow-hidden flex flex-col min-h-[100vh]">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Protected Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/more-tools"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Tools />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/how-to-use"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Help />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/report-problem"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ReportProblem />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <ToastContainer />
    </ErrorBoundary>
  );
};

export default App;
