import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { assets } from "../assets/assests";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/ui/input";
import { toast } from "react-toastify";
import LoaderButton from "../components/ui/LoaderButton";
import Loader from "../components/Loader";

const Onboarding = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    completeOnboarding,
    isAuthenticated,
    isLoading: authLoading,
    user,
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    // Handle token passed in URL
    if (token) {
      localStorage.setItem("token", token);
    }

    // Check if user is already authenticated and has a username (completed onboarding)
    if (isAuthenticated && !authLoading && user?.username) {
      // User already has a username, redirect to dashboard
      navigate("/user/dashboard");
      return;
    }

    // Check if user already has a token (should be authenticated)
    const existingToken = localStorage.getItem("token");
    if (!existingToken) {
      navigate("/auth");
    }
  }, [token, navigate, isAuthenticated, authLoading, user]);

  // Show a loader while checking authentication status
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader type="spinner" size="lg" />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      setIsLoading(false);
      return;
    }

    const usernameRegex = /^[a-z0-9][a-z0-9_-]{2,29}$/;
    if (!usernameRegex.test(username)) {
      setError(
        "Username must start with a lowercase letter or number, followed by 29(max) lowercase letters, numbers, underscores, or hyphens"
      );
      setIsLoading(false);
      return;
    }

    const result = await completeOnboarding(username);
    setIsLoading(false);

    if (result.success) {
      toast.success("Welcome to Webmark! Your account is ready.");
    } else {
      setError(result.message || "Failed to complete setup");
    }
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
          One last step!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose a username for your Webmark account
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Choose a unique username"
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <div>
            <LoaderButton
              type="submit"
              isLoading={isLoading}
              loadingText="Setting up..."
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Complete Setup
            </LoaderButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
