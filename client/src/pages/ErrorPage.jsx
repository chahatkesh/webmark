import { useState, useEffect } from "react";
import { Link, useNavigate, useRouteError } from "react-router-dom";
import { assets } from "../assets/assests";
import {
  AlertCircle,
  Home,
  ArrowLeft,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { reportError } from "../utils/errorReporter";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [countdown, setCountdown] = useState(10);
  const [showDetails, setShowDetails] = useState(false);

  // Log the error to our reporting service
  useEffect(() => {
    if (error) {
      reportError(error, { source: "ErrorPage", router: true });
    }
  }, [error]);

  // Get appropriate error message based on the error type
  const getErrorMessage = () => {
    if (error?.status === 404) {
      return "The page you're looking for doesn't exist or has been moved.";
    } else if (error?.message) {
      // Filter out sensitive error information
      const cleanMessage = error.message.replace(
        /\b(?:password|token|key|secret)\b/gi,
        "***"
      );
      return cleanMessage;
    } else {
      return "Something went wrong. Please try again later.";
    }
  };

  // Start countdown for automatic navigation
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate(isAuthenticated ? "/user/dashboard" : "/");
    }
  }, [countdown, navigate, isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={assets.logo_color}
            alt="Webmark Logo"
            className="h-12 md:h-16 w-auto"
          />
        </div>

        {/* Error Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mb-8">
          <AlertCircle className="h-10 w-10 text-red-600" aria-hidden="true" />
        </div>

        {/* Error Status */}
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {error?.status === 404
            ? "404 - Page Not Found"
            : "Oops, something went wrong"}
        </h1>

        {/* Error Message */}
        <p className="mt-4 text-base text-gray-600 sm:mt-6">
          {getErrorMessage()}
        </p>

        {/* Countdown message */}
        <p className="mt-2 text-sm text-gray-500">
          Auto-redirecting in {countdown} seconds...
        </p>

        {/* Technical Details */}
        {error && (
          <div className="w-full max-w-md mx-auto mt-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm flex items-center justify-center gap-1 text-gray-500 hover:text-gray-700 mx-auto">
              {showDetails ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
              {showDetails
                ? "Hide technical details"
                : "Show technical details"}
            </button>

            {showDetails && (
              <div className="mt-3 p-3 text-xs text-left bg-gray-50 rounded border border-gray-200 max-h-48 overflow-auto">
                <pre className="whitespace-pre-wrap break-all">
                  <p>
                    <strong>Error Type:</strong> {error.name || "Unknown Error"}
                  </p>
                  <p>
                    <strong>Status:</strong> {error.status || "Unknown"}
                  </p>
                  <p>
                    <strong>URL:</strong> {window.location.href}
                  </p>
                  {error.stack && (
                    <>
                      <hr className="my-2 border-gray-200" />
                      <p>
                        <strong>Stack Trace:</strong>
                      </p>
                      {error.stack.split("\n").slice(0, 5).join("\n")}
                    </>
                  )}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full sm:w-auto flex gap-2 items-center">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full sm:w-auto flex gap-2 items-center">
            <RefreshCw className="h-4 w-4" />
            Reload Page
          </Button>

          <Button asChild className="w-full sm:w-auto flex gap-2 items-center">
            <Link to={isAuthenticated ? "/user/dashboard" : "/"}>
              <Home className="h-4 w-4" />
              {isAuthenticated ? "Go to Dashboard" : "Go Home"}
            </Link>
          </Button>
        </div>

        {/* Help text */}
        <p className="mt-8 text-sm text-gray-500">
          If you continue to see this error, please{" "}
          <Link
            to="/user/report-problem"
            className="text-blue-600 hover:text-blue-800 font-medium">
            report the problem
          </Link>{" "}
          or contact support.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
