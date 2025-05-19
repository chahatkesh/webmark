import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  RefreshCcw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { reportError } from "../../utils/errorReporter";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Report the error to our error reporting service
    reportError(error, {
      componentStack: errorInfo.componentStack,
      react: true,
    });

    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={() =>
            this.setState({ hasError: false, error: null, errorInfo: null })
          }
        />
      );
    }

    return this.props.children;
  }
}

export const ErrorFallback = ({ error, errorInfo, resetError }) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  // Safely extract error information
  const errorMessage =
    error?.message || "An unexpected error occurred. Please try again.";
  const errorStack = error?.stack
    ? error.stack.split("\n").slice(0, 3).join("\n")
    : "";

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-semibold text-gray-900">
          Something went wrong
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">{errorMessage}</p>

        {/* Toggle error details */}
        <div className="w-full max-w-md mx-auto mt-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm flex items-center justify-center gap-1 text-gray-500 hover:text-gray-700 mx-auto">
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showDetails ? "Hide technical details" : "Show technical details"}
          </button>

          {showDetails && (
            <div className="mt-3 p-3 text-xs text-left bg-gray-50 rounded border border-gray-200 max-h-48 overflow-auto">
              <pre className="whitespace-pre-wrap break-all">
                {errorStack}
                {errorInfo?.componentStack && (
                  <>
                    <hr className="my-2 border-gray-200" />
                    <p className="font-semibold">Component Stack:</p>
                    {errorInfo.componentStack}
                  </>
                )}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={resetError} className="w-full sm:w-auto">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/user/report-problem")}
            className="w-full sm:w-auto">
            Report issue
          </Button>
        </div>
      </div>
    </div>
  );
};

// Simple error message component for displaying inline errors
export const InlineError = ({ message }) => {
  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md mt-2">
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
};
