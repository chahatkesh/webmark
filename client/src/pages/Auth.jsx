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
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    login: "",
  });
  const [errors, setErrors] = useState({
    usernameError: "",
    passwordError: "",
    passwordStrong: "",
    emailError: "",
  });

  const { username, password, email, login: loginField } = formData;
  const { usernameError, passwordError, passwordStrong, emailError } = errors;

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/user/dashboard");
    }
    // Initial loading timeout
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validation logic
    if (name === "username") {
      const usernameRegex = /^[a-z0-9]*$/;
      setErrors({
        ...errors,
        usernameError: usernameRegex.test(value)
          ? ""
          : "Username must be in lowercase & not contain any spaces or special characters.",
      });
    } else if (name === "password") {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      setErrors({
        ...errors,
        passwordError: passwordRegex.test(value)
          ? ""
          : "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        passwordStrong: passwordRegex.test(value)
          ? "Your Password is Strong"
          : "",
      });
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors({
        ...errors,
        emailError: emailRegex.test(value)
          ? ""
          : "Please enter a valid email address.",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form before submission
    if (currState === "Sign Up") {
      if (usernameError || emailError || passwordError) {
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
        alert(result.message || "An error occurred during authentication");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-[100vw] h-[100vh] grid lg:grid-cols-2 justify-center items-center">
      {/* Left side - visible only on large screens */}
      <div className="hidden lg:flex w-[50vw] h-full bg-blue-500 flex-col justify-center items-center">
        <img src={assets.small_logo_white} width={210} alt="Webmark Logo" />
        <h1 className="mt-8 text-5xl font-[500] text-center text-white max-w-[440px] leading-[1.15]">
          Welcome back to Webmark!
        </h1>
      </div>

      {/* Right side - Auth form */}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 items-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            onClick={() => navigate("/")}
            alt="Webmark Logo"
            src={assets.logo_color}
            className="mx-auto h-14 w-auto cursor-pointer"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {currState === "Sign Up"
              ? "Create a New Account"
              : "Sign in to your account"}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {currState === "Sign Up" && (
              <>
                <InputField
                  id="username"
                  label="Username"
                  type="text"
                  value={username}
                  onChange={handleChange}
                  error={usernameError}
                  disabled={submitting}
                />
                <InputField
                  id="email"
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  error={emailError}
                  disabled={submitting}
                />
              </>
            )}
            {currState !== "Sign Up" && (
              <InputField
                id="login"
                label="Email/Username"
                type="text"
                value={loginField}
                onChange={handleChange}
                disabled={submitting}
              />
            )}

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-blue-500 hover:text-blue-700">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 pl-4 pr-4"
                />
                {passwordError && (
                  <p className="text-[12px] max-w-[220px] lg:max-w-full pl-1 lg:pl-2 text-red-600">
                    {passwordError}
                  </p>
                )}
                {passwordStrong && (
                  <p className="text-[12px] mt-[2px] pl-2 text-green-500">
                    {passwordStrong}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className={`flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                  submitting ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                {submitting ? "Processing..." : currState}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            {currState === "Sign Up" ? (
              <>
                Already have Account?{" "}
                <button
                  onClick={() => setCurrState("Login")}
                  disabled={submitting}
                  className="font-semibold leading-6 text-blue-500 hover:text-blue-600">
                  Login Here
                </button>
              </>
            ) : (
              <>
                Create a New Account?{" "}
                <button
                  onClick={() => setCurrState("Sign Up")}
                  disabled={submitting}
                  className="font-semibold leading-6 text-blue-500 hover:text-blue-600">
                  Click Here
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ id, label, type, value, onChange, error, disabled }) => (
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
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 pl-4 pr-4"
      />
      {error && <p className="text-[12px] pl-2 text-red-600">{error}</p>}
    </div>
  </div>
);

export default Auth;
