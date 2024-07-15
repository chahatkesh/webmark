import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assests";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";

const Auth = () => {
  const { url, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const [currState, setCurrState] = useState("Sign Up");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrong, setPasswordStrong] = useState("");
  const [emailError, setEmailError] = useState("");

  const data = {
    username: username,
    password: password,
    email: email,
    login: login,
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);

    // Regular expression to match only alphanumeric characters
    const usernameRegex = /^[a-zA-Z0-9]*$/;

    if (!usernameRegex.test(value)) {
      setUsernameError(
        "Username must not contain any spaces or special characters."
      );
    } else {
      setUsernameError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Regular expression for password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(value)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      setPasswordStrong("");
    } else {
      setPasswordError("");
      setPasswordStrong("Your Password is Strong");
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };
  const handleLoginChange = (e) => {
    const value = e.target.value;
    setLogin(value);
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }
    const response = await axios.post(newUrl, data);
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      navigate("../dashboard");
    } else {
      alert(response.data.message);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);
  return (
    <div className="w-[100vw] h-[100vh] grid lg:grid-cols-2 justify-center items-center">
      <div className="hidden lg:flex w-[50vw] h-full bg-blue-500  flex-col justify-center items-center">
        <img src={assets.small_logo_white} width={210} alt="" />
        <h1 className="mt-8 text-5xl font-[500] text-center text-white max-w-[440px] leading-[1.15]">
          Welcome back to Webmark!
        </h1>
      </div>

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 items-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            onClick={() => navigate("/")}
            alt="Your Company"
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
          <form onSubmit={onLogin} className="space-y-6">
            {currState === "Sign Up" ? (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                    name="username"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 pl-4 pr-4"
                  />
                  <p className="text-[12px] pl-2 text-red-600">
                    {usernameError}
                  </p>
                </div>
              </div>
            ) : (
              <></>
            )}
            {currState === "Sign Up" ? (
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
                    onChange={handleEmailChange}
                    required
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 pl-4 pr-4"
                  />
                  <p className="text-[12px] pl-2 text-red-600">{emailError}</p>
                </div>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="login"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Email/Username
                </label>
                <div className="mt-2">
                  <input
                    id="login"
                    name="login"
                    type="text"
                    value={login}
                    onChange={handleLoginChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 pl-4 pr-4"
                  />
                  <p className="text-[12px] pl-2 text-red-600">{emailError}</p>
                </div>
              </div>
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
                  onChange={handlePasswordChange}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 pl-4 pr-4"
                />
                <p className="text-[12px] pl-2 text-red-600">{passwordError}</p>
                <p className="text-[12px] mt-[2px] pl-2  text-green-500">
                  {passwordStrong}
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                {currState}
              </button>
            </div>
          </form>
          {currState === "Sign Up" ? (
            <p className="mt-10 text-center text-sm text-gray-500">
              Already have Account?{" "}
              <a
                onClick={() => setCurrState("Login")}
                href="#"
                className="font-semibold leading-6 text-blue-500 hover:text-blue-600">
                Login Here
              </a>
            </p>
          ) : (
            <p className="mt-10 text-center text-sm text-gray-500">
              Create a New Account?{" "}
              <a
                onClick={() => setCurrState("Sign Up")}
                href="#"
                className="font-semibold leading-6 text-blue-500 hover:text-blue-600">
                Click Here
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
