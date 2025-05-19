import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { assets } from "../assets/assests";
import { useAuth } from "../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";
import { Checkbox } from "../components/ui/checkbox";
import Loader from "../components/Loader";

const Auth = () => {
  const { googleLogin, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    // Redirect to dashboard if user is already authenticated
    if (isAuthenticated && !isLoading) {
      navigate("/user/dashboard");
    }
    
    // Handle direct token passing (from Google OAuth callback)
    if (token) {
      localStorage.setItem("token", token);
      navigate("/user/dashboard");
    }

    // Handle auth error
    if (error) {
      toast.error(error || "Authentication failed");
    }
  }, [token, error, navigate, isAuthenticated, isLoading]);

  const handleGoogleLogin = () => {
    if (!agreedToTerms) {
      toast.error(
        "Please agree to the Terms and Conditions and Privacy Policy to continue"
      );
      return;
    }
    googleLogin();
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-14 w-auto"
          src={assets.logo_color}
          alt="Webmark"
        />
        <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <Button
            onClick={handleGoogleLogin}
            type="button"
            className="flex w-full justify-center items-center gap-3 rounded-md bg-white px-3 py-6 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <FcGoogle className="h-6 w-6" />
            Continue with Google
          </Button>

          <div className="flex items-start mt-6">
            <div className="flex items-center h-5">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={setAgreedToTerms}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                I agree to the{" "}
                <Link
                  to="/terms-and-conditions"
                  className="font-semibold text-blue-600 hover:text-blue-500">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy-policy"
                  className="font-semibold text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">
            By signing in, you acknowledge that you have read and understood our
            Terms and Conditions and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
