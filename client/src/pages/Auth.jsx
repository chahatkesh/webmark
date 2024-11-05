import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assests";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { url } = React.useContext(StoreContext);
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${url}/api/user/verify-email/${token}`
        );

        if (response.data.success) {
          setVerificationStatus("success");
          setMessage("Email verified successfully! Logging you in...");

          // Save token and redirect to dashboard
          localStorage.setItem("token", response.data.token);

          // Start countdown
          let count = 2;
          const timer = setInterval(() => {
            count--;
            setCountdown(count);
            if (count === 0) {
              clearInterval(timer);
              navigate("/user/dashboard");
            }
          }, 1000);

          return () => clearInterval(timer);
        } else {
          setVerificationStatus("error");
          setMessage(response.data.message || "Verification failed");
        }
      } catch (error) {
        setVerificationStatus("error");
        setMessage("An error occurred during verification");
      }
    };

    verifyEmail();
  }, [token, url, navigate]);

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          src={assets.logo_color}
          alt="Webmark Logo"
          className="mx-auto h-14 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Email Verification
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div
          className={`p-4 rounded-md ${
            verificationStatus === "verifying"
              ? "bg-blue-50 text-blue-700"
              : verificationStatus === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}>
          {verificationStatus === "verifying" && (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Verifying your email...
            </div>
          )}

          <div className="text-center">
            <p>{message}</p>
            {verificationStatus === "success" && (
              <p className="mt-2 font-medium">
                Redirecting in {countdown} seconds...
              </p>
            )}
            {verificationStatus === "error" && (
              <button
                onClick={() => navigate("/auth")}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Back to Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResendVerification = ({ email, onClose }) => {
  const { url } = React.useContext(StoreContext);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    setStatus("sending");
    setMessage("");

    try {
      const response = await axios.post(`${url}/api/user/resend-verification`, {
        email,
      });
      if (response.data.success) {
        setStatus("success");
        setMessage(
          "Verification email sent successfully. Please check your inbox."
        );
      } else {
        setStatus("error");
        setMessage(
          response.data.message || "Failed to send verification email"
        );
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="text-center p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Email Verification Required
      </h3>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Please verify your email address to continue. Check your inbox for the
          verification link.
        </p>

        {/* Add spam notice */}
        <div className="text-sm bg-yellow-50 p-3 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="ml-2 text-yellow-700">
              If you don't see the email in your inbox, please check your
              spam/junk folder.
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-md ${
              status === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}>
            {message}
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={handleResend}
            disabled={status === "sending"}
            className="w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50">
            {status === "sending" ? "Sending..." : "Resend Verification Email"}
          </button>

          <button
            onClick={onClose}
            className="w-full text-sm text-gray-500 hover:text-gray-700 underline">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

const ForgotPassword = () => {
  const { url } = React.useContext(StoreContext);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${url}/api/user/forgot-password`, {
        email,
      });

      if (response.data.success) {
        setIsSuccess(true);
        setMessage("Please check your email for password reset instructions.");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Reset your password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        ) : null}

        {message && (
          <div
            className={`mt-4 p-4 rounded-md ${
              isSuccess
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

const ResetPassword = () => {
  const { url } = React.useContext(StoreContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get token from URL
  const token = window.location.pathname.split("/").pop();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${url}/api/user/reset-password`, {
        token,
        newPassword: password,
      });

      if (response.data.success) {
        setIsSuccess(true);
        setMessage("Password successfully reset. Redirecting to login...");
        setTimeout(() => navigate("/auth"), 3000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Set New Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900">
                New Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium leading-6 text-gray-900">
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50">
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        ) : null}

        {message && (
          <div
            className={`mt-4 p-4 rounded-md ${
              isSuccess
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export { ForgotPassword, ResetPassword, EmailVerification, ResendVerification };

const Auth = () => {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useAuth();
  const [currState, setCurrState] = useState("Sign Up");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    login: "",
  });
  const [errors, setErrors] = useState({
    usernameError: "",
    passwordError: "",
    passwordStrength: {
      score: 0,
      message: "",
      color: "gray",
    },
    emailError: "",
  });

  const { username, password, email, login: loginField } = formData;
  const { usernameError, passwordError, passwordStrength, emailError } = errors;

  // Check authentication status
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/user/dashboard");
    }
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);
  useEffect(() => {
    if (location.state?.verified) {
      setVerificationSuccess(true);
      // Clear the state after showing the message
      setTimeout(() => {
        setVerificationSuccess(false);
        navigate("/auth", { replace: true, state: {} });
      }, 5000);
    }
  }, [location.state, navigate]);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("Uppercase letter");
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("Lowercase letter");
    if (/[0-9]/.test(password)) score += 1;
    else feedback.push("Number");
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push("Special character");

    const strengthMap = {
      0: {
        message: "Very Weak",
        colorBar: "bg-red-500",
        colorText: "text-red-600",
      },
      1: {
        message: "Weak",
        colorBar: "bg-orange-500",
        colorText: "text-orange-600",
      },
      2: {
        message: "Fair",
        colorBar: "bg-yellow-500",
        colorText: "text-yellow-600",
      },
      3: {
        message: "Good",
        colorBar: "bg-blue-500",
        colorText: "text-blue-600",
      },
      4: {
        message: "Strong",
        colorBar: "bg-green-500",
        colorText: "text-green-600",
      },
      5: {
        message: "Very Strong",
        colorBar: "bg-green-500",
        colorText: "text-green-600",
      },
    };

    return {
      score,
      message: score === 5 ? "Perfect!" : `Missing: ${feedback.join(", ")}`,
      colorBar: strengthMap[score].colorBar,
      colorText: strengthMap[score].colorText,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Enhanced validation logic
    switch (name) {
      case "username":
        const usernameRegex = /^[a-z0-9][a-z0-9_-]*$/;
        setErrors({
          ...errors,
          usernameError:
            value.length != 6
              ? "Username must be of 6 characters"
              : !usernameRegex.test(value)
              ? "Use lowercase letters, numbers, underscore or hyphen"
              : "",
        });
        break;

      case "password":
        const strength = checkPasswordStrength(value);
        setErrors({
          ...errors,
          passwordStrength: strength,
          passwordError:
            value.length < 8 ? "Password must be at least 8 characters" : "",
        });
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setErrors({
          ...errors,
          emailError:
            !emailRegex.test(value) && value.length > 0
              ? "Please enter a valid email address"
              : "",
        });
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (submitting) return;

    // Form validation
    if (currState === "Sign Up") {
      if (
        usernameError ||
        emailError ||
        passwordError ||
        passwordStrength.score < 3
      ) {
        setErrorMessage("Please fix the form errors before submitting.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const result =
        currState === "Login"
          ? await login({ login: loginField, password })
          : await signup({ username, email, password });

      if (!result.success) {
        // Check if verification is required
        if (result.requiresVerification) {
          setVerificationEmail(result.email || email);
          setShowVerification(true);
        } else {
          const errorMessage =
            result.message || "Authentication failed. Please try again.";
          throw new Error(errorMessage);
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setErrorMessage(
        error.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2 justify-center items-center bg-gray-50">
      {/* Left side */}
      <div className="hidden lg:flex w-full h-full bg-gradient-to-br from-indigo-600 via-blue-700 to-blue-900 flex-col justify-center items-center relative overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgb3BhY2l0eT0iMC4xIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        </div>

        {/* Content container with glass effect */}
        <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-300">
          <img
            src={assets.small_logo_white}
            width={180}
            alt="Webmark Logo"
            className="mx-auto animate-fade-in-up"
          />

          <div className="mt-8 space-y-6">
            <h1 className="text-5xl font-bold text-center text-white max-w-[440px] leading-tight animate-fade-in-up delay-100">
              Welcome to Your
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                Digital Library
              </span>
            </h1>

            <div className="space-y-4 animate-fade-in-up delay-200">
              <p className="text-lg text-white/90 text-center max-w-[400px]">
                Organize your bookmarks smarter, access them anywhere.
              </p>

              {/* Feature list */}
              <ul className="mt-6 space-y-3">
                {[
                  "Smart Bookmarking",
                  "Advanced Customization",
                  "With Smart Search",
                  "Access from any device",
                ].map((feature, index) => (
                  <li
                    key={feature}
                    className={`flex items-center text-white/80 animate-fade-in-up`}
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}>
                    <svg
                      className="w-5 h-5 mr-2 text-blue-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 items-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            onClick={() => navigate("/")}
            alt="Webmark Logo"
            src={assets.logo_color}
            className="mx-auto h-14 w-auto cursor-pointer hover:opacity-90 transition-opacity"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {currState === "Sign Up" ? "Create a New Account" : "Welcome Back!"}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {currState === "Sign Up" && (
            <div
              className={`mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 ${
                errorMessage ? "hidden" : ""
              }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Important Note
                  </h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Enter your correct email for verification.
                  </p>
                </div>
              </div>
              {verificationSuccess && (
                <div className="mb-6 p-4 rounded-md bg-green-50 text-green-700 animate-fade-in">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">
                        Email verified successfully! You can now log in with
                        your credentials.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-md bg-red-50 text-red-700">
              {errorMessage}
            </div>
          )}
          {showVerification && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <ResendVerification
                  email={verificationEmail}
                  onClose={() => {
                    setShowVerification(false);
                    setCurrState("Login");
                  }}
                />
              </div>
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 w-full max-w-[400px] mx-auto relative">
            {currState === "Sign Up" && (
              <>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Username
                  </label>
                  <div className="mt-2">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={username}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      autoComplete="username"
                      placeholder="johndoe"
                      className={`
              block w-full rounded-md border-0 py-1.5 px-4
              text-gray-900 shadow-sm ring-1 ring-inset 
              ${usernameError ? "ring-red-300" : "ring-gray-300"}
              placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 
              disabled:bg-gray-50 disabled:text-gray-500
              transition-colors duration-200
              sm:text-sm sm:leading-6
            `}
                    />
                    {usernameError && (
                      <p className="mt-1 text-sm text-red-600 animate-fade-in">
                        {usernameError}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                      autoComplete="email"
                      placeholder="john@example.com"
                      className={`
              block w-full rounded-md border-0 py-1.5 px-4
              text-gray-900 shadow-sm ring-1 ring-inset 
              ${emailError ? "ring-red-300" : "ring-gray-300"}
              placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 
              disabled:bg-gray-50 disabled:text-gray-500
              transition-colors duration-200
              sm:text-sm sm:leading-6
            `}
                    />
                    {emailError && (
                      <p className="mt-1 text-sm text-red-600 animate-fade-in">
                        {emailError}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {currState !== "Sign Up" && (
              <div>
                <label
                  htmlFor="login"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Email or Username
                </label>
                <div className="mt-2">
                  <input
                    id="login"
                    name="login"
                    type="text"
                    value={loginField}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    autoComplete="username"
                    placeholder="Enter your email or username"
                    className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-blue-500 hover:text-blue-700 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`
          block w-full rounded-md border-0 py-1.5 text-gray-900 
          shadow-sm ring-1 ring-inset 
          ${passwordError ? "ring-red-300" : "ring-gray-300"}
          placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
          focus:ring-blue-500 sm:text-sm sm:leading-6 pl-4 pr-10
        `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {currState === "Sign Up" && password && (
                <div className="absolute left-0 right-0 mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <div
                        key={score}
                        className={`h-1 w-full rounded-full transition-colors duration-300 ${
                          score <= passwordStrength.score
                            ? passwordStrength.colorBar
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs ${passwordStrength.colorText} truncate`}>
                    {passwordStrength.message}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={submitting}
                className={`
        flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 
        text-sm font-semibold text-white shadow-sm transition-all
        hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 
        focus-visible:outline-offset-2 focus-visible:outline-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        group relative overflow-hidden
      `}>
                <span className="relative z-10">
                  {submitting ? "Processing..." : currState}
                </span>
                <div className="absolute inset-0 bg-blue-600 transform translate-y-full transition-transform group-hover:translate-y-0" />
              </button>
            </div>

            <p className="mt-10 text-center text-sm text-gray-500">
              {currState === "Sign Up" ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setCurrState("Login")}
                    disabled={submitting}
                    className="font-semibold text-blue-500 hover:text-blue-600 transition-colors focus:outline-none focus:underline">
                    Login here
                  </button>
                </>
              ) : (
                <>
                  New to Webmark?{" "}
                  <button
                    onClick={() => setCurrState("Sign Up")}
                    disabled={submitting}
                    className="font-semibold text-blue-500 hover:text-blue-600 transition-colors focus:outline-none focus:underline">
                    Create an account
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
  error,
  disabled,
  autoComplete,
  placeholder,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium leading-6 text-gray-900">
      {label}
    </label>
    <div className="mt-2">
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`
          block w-full rounded-md border-0 py-1.5 px-4
          text-gray-900 shadow-sm ring-1 ring-inset 
          ${error ? "ring-red-300" : "ring-gray-300"}
          placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 
          disabled:bg-gray-50 disabled:text-gray-500
          transition-colors duration-200
          sm:text-sm sm:leading-6
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-fade-in">{error}</p>
      )}
    </div>
  </div>
);

// Add these CSS keyframes to your global styles
const globalStyles = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.5s ease-out forwards;
  }

  .delay-100 {
    animation-delay: 100ms;
  }

  .delay-200 {
    animation-delay: 200ms;
  }
`;

export default Auth;
