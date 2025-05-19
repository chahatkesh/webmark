import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Docs from "./pages/Docs";
import Auth from "./pages/Auth"; // Google Auth component
import Onboarding from "./pages/Onboarding"; // Onboarding component
import Profile from "./pages/Profile"; // Profile page component
import TermsAndConditions from "./pages/TermsAndConditions"; // Terms and Conditions page
import PrivacyPolicy from "./pages/PrivacyPolicy"; // Privacy Policy page
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import NotFoundPage from "./pages/NotFoundPage"; // 404 page component
import Loader from "./components/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Use the enhanced error components
import { ErrorBoundary } from "./components/enhanced/ErrorComponents";

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
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

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
            path="/user/docs"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Docs />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          {/* Report Problem page removed as requested */}
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Profile />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for 404 pages */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <ToastContainer />
    </ErrorBoundary>
  );
};

export default App;
