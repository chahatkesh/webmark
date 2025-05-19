import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assests";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { reportError } from "../utils/errorReporter";
import { useEffect } from "react";
import SEO from "../components/SEO";

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Report 404 error for analytics
  useEffect(() => {
    reportError(new Error("404 Page Not Found"), {
      source: "NotFoundPage",
      path: window.location.pathname,
    });
  }, []);

  return (
    <>
      <SEO
        title="Page Not Found - 404 Error"
        description="Sorry, the page you are looking for does not exist or has been moved."
        canonicalUrl="https://webmark.site/404"
        keywords="404, page not found, error, webmark"
        indexPage={false}
      />
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

          {/* 404 Illustration */}
          <div className="relative mx-auto mb-8">
            <div className="text-[10rem] leading-none font-bold text-gray-200">
              404
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <Search className="h-16 w-16 text-blue-500" />
            </div>
          </div>

          {/* Error Status */}
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Page not found
          </h1>

          {/* Error Message */}
          <p className="mt-4 text-base text-gray-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved, deleted, or the URL may have been mistyped.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full sm:w-auto flex gap-2 items-center">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>

            <Button
              asChild
              className="w-full sm:w-auto flex gap-2 items-center">
              <Link to={isAuthenticated ? "/user/dashboard" : "/"}>
                <Home className="h-4 w-4" />
                {isAuthenticated ? "Go to Dashboard" : "Return Home"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
