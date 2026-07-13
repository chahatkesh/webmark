import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Helmet } from "react-helmet";
import { lazy, Suspense } from "react";
// Import core components directly
import Home from "./pages/Home";
import Loader, { PageContentLoader } from "./components/Loader";
import Prefetcher from "./components/Prefetcher"; // Prefetcher component for performance
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import { ToastContainer, Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { playToastSound } from "./utils/toastSound";
import smallLogoColor from "./assets/small_logo_color.svg";

const TYPE_DOT = {
  success: "#22c55e",
  error: "#ef4444",
  info: "#3b82f6",
  warning: "#f59e0b",
  default: "#a3a3a3",
};

const ToastAppIcon = ({ type }) => (
  <div className="relative shrink-0">
    <img src={smallLogoColor} alt="" className="h-5 w-5 rounded-md block" />
    <span
      style={{ background: TYPE_DOT[type] ?? TYPE_DOT.default }}
      className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white/20"
    />
  </div>
);

// Patch toast methods globally so every call site gets audio feedback
// without touching 47 call sites individually.
(function patchToast() {
  const _success = toast.success.bind(toast);
  const _error = toast.error.bind(toast);
  const _info = toast.info.bind(toast);
  toast.success = (msg, opts) => {
    playToastSound("success");
    return _success(msg, opts);
  };
  toast.error = (msg, opts) => {
    playToastSound("error");
    return _error(msg, opts);
  };
  toast.info = (msg, opts) => {
    playToastSound("info");
    return _info(msg, opts);
  };
})();
// Use the enhanced error components
import { ErrorBoundary } from "./components/enhanced/ErrorComponents";

// Lazy load non-critical routes
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Bookmarklet = lazy(() => import("./pages/Bookmarklet"));
const Auth = lazy(() => import("./pages/Auth"));
const AuthDevices = lazy(() => import("./pages/AuthDevices"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Profile = lazy(() => import("./pages/Profile"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const BookmarkletSave = lazy(() => import("./pages/BookmarkletSave"));
const BookmarkletSync = lazy(() => import("./pages/BookmarkletSync"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
    <AuthenticatedLayout>
      {isLoading ? <PageContentLoader /> : children}
    </AuthenticatedLayout>
  );
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
            path="/auth/devices"
            element={
              <Suspense fallback={<Loader />}>
                <AuthDevices />
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
          <Route
            path="/admin"
            element={
              <Suspense fallback={<Loader />}>
                <Admin />
              </Suspense>
            }
          />

          {/* Bookmarklet relay page — opens as a popup from any domain */}
          <Route
            path="/save"
            element={
              <Suspense fallback={<Loader />}>
                <BookmarkletSave />
              </Suspense>
            }
          />

          {/* Hidden iframe target — refreshes dashboard cache after bookmarklet saves */}
          <Route
            path="/bookmarklet-sync"
            element={
              <Suspense fallback={null}>
                <BookmarkletSync />
              </Suspense>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageContentLoader />}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/bookmarklet"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageContentLoader />}>
                  <Bookmarklet />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/profile"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageContentLoader />}>
                  <Profile />
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
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        transition={Slide}
        limit={3}
        toastClassName={() => "webmark-toast"}
        bodyClassName="!text-[13px] !font-normal !text-white/90 !p-0 !m-0"
        closeButton={false}
        icon={({ type }) => <ToastAppIcon type={type} />}
      />
    </ErrorBoundary>
  );
};

export default App;
