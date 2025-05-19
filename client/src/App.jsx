import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { Helmet } from "react-helmet";
import { lazy, Suspense } from "react";
// Import core components directly
import Home from "./pages/Home";
import Loader from "./components/Loader";
import Prefetcher from "./components/Prefetcher"; // Prefetcher component for performance
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Use the enhanced error components
import { ErrorBoundary } from "./components/enhanced/ErrorComponents";

// Lazy load non-critical routes
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Docs = lazy(() => import("./pages/Docs"));
const Auth = lazy(() => import("./pages/Auth"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Profile = lazy(() => import("./pages/Profile"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const AuthenticatedLayout = lazy(() => import("./layouts/AuthenticatedLayout"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

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
        {/* Global SEO defaults */}
        <Helmet>
          {/* DNS prefetching */}
          <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
          <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />

          {/* Preconnect to important domains */}
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />

          {/* Add additional global meta tags */}
          <meta name="application-name" content="Webmark" />
          <meta name="google-site-verification" content="verify_code_here" />
        </Helmet>

        {/* Performance optimization component */}
        <Prefetcher />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/auth"
            element={
              <Suspense fallback={<Loader />}>
                <Auth />
              </Suspense>
            }
          />
          <Route
            path="/onboarding"
            element={
              <Suspense fallback={<Loader />}>
                <Onboarding />
              </Suspense>
            }
          />
          <Route
            path="/terms"
            element={
              <Suspense fallback={<Loader />}>
                <TermsAndConditions />
              </Suspense>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <Suspense fallback={<Loader />}>
                <PrivacyPolicy />
              </Suspense>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<Loader />}>
                  <AuthenticatedLayout>
                    <Dashboard />
                  </AuthenticatedLayout>
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/docs"
            element={
              <ProtectedRoute>
                <Suspense fallback={<Loader />}>
                  <AuthenticatedLayout>
                    <Docs />
                  </AuthenticatedLayout>
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute>
                <Suspense fallback={<Loader />}>
                  <AuthenticatedLayout>
                    <Profile />
                  </AuthenticatedLayout>
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for 404 pages */}
          <Route
            path="*"
            element={
              <Suspense fallback={<Loader />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Routes>
      </div>
      <ToastContainer />
    </ErrorBoundary>
  );
};

export default App;
