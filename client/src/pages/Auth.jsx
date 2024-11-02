import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assests";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader";

const Auth = () => {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useAuth();
  const [currState, setCurrState] = useState("Sign Up");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

    if (submitting) return;

    // Form validation
    if (currState === "Sign Up") {
      if (
        usernameError ||
        emailError ||
        passwordError ||
        passwordStrength.score < 3
      ) {
        alert("Please fix the form errors before submitting.");
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
        // Enhanced error handling with specific messages
        const errorMessage =
          result.message || "Authentication failed. Please try again.";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      // Show error in a more user-friendly way
      const errorMessage =
        error.message || "An unexpected error occurred. Please try again.";
      alert(errorMessage);
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
                  <a
                    href="#"
                    className="font-semibold text-blue-500 hover:text-blue-700 transition-colors">
                    Forgot password?
                  </a>
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
