import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assests";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import Loader from "../components/Loader";

const Auth = () => {
  const { url, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const [currState, setCurrState] = useState("Sign Up");
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

  const { username, password, email, login } = formData;
  const { usernameError, passwordError, passwordStrong, emailError } = errors;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

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

  const onLogin = async (event) => {
    event.preventDefault();
    const newUrl = `${url}/api/user/${
      currState === "Login" ? "login" : "register"
    }`;
    const response = await axios.post(newUrl, formData);
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      navigate("../user/dashboard");
    } else {
      alert(response.data.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/user/dashboard");
    }
  }, [navigate]);

  // loader start
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  // loder ends

  return loading ? (
    <Loader />
  ) : (
    <div className="w-[100vw] h-[100vh] grid lg:grid-cols-2 justify-center items-center">
      <div className="hidden lg:flex w-[50vw] h-full bg-blue-500 flex-col justify-center items-center">
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
            {currState === "Sign Up" && (
              <>
                <InputField
                  id="username"
                  label="Username"
                  type="text"
                  value={username}
                  onChange={handleChange}
                  error={usernameError}
                />
                <InputField
                  id="email"
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  error={emailError}
                />
              </>
            )}
            {currState !== "Sign Up" && (
              <InputField
                id="login"
                label="Email/Username"
                type="text"
                value={login}
                onChange={handleChange}
                error={emailError}
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
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 pl-4 pr-4"
                />
                <p className="text-[12px] max-w-[220px] lg:max-w-full pl-1 lg:pl-2 text-red-600">
                  {passwordError}
                </p>
                <p className="text-[12px] mt-[2px] pl-2 text-green-500">
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
          <p className="mt-10 text-center text-sm text-gray-500">
            {currState === "Sign Up" ? (
              <>
                Already have Account?{" "}
                <a
                  onClick={() => setCurrState("Login")}
                  href="#"
                  className="font-semibold leading-6 text-blue-500 hover:text-blue-600">
                  Login Here
                </a>
              </>
            ) : (
              <>
                Create a New Account?{" "}
                <a
                  onClick={() => setCurrState("Sign Up")}
                  href="#"
                  className="font-semibold leading-6 text-blue-500 hover:text-blue-600">
                  Click Here
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ id, label, type, value, onChange, error }) => (
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
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 pl-4 pr-4"
      />
      <p className="text-[12px] pl-2 text-red-600">{error}</p>
    </div>
  </div>
);

export default Auth;
