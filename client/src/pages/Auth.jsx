import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { assets } from "../assets/assests";
import { useAuth } from "../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";

const Auth = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  useEffect(() => {
    // Handle direct token passing (from Google OAuth callback)
    if (token) {
      localStorage.setItem("token", token);
      navigate("/user/dashboard");
    }

    // Handle auth error
    if (error) {
      toast.error(error || "Authentication failed");
    }
  }, [token, error, navigate]);

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
            onClick={googleLogin}
            type="button"
            className="flex w-full justify-center items-center gap-3 rounded-md bg-white px-3 py-6 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <FcGoogle className="h-6 w-6" />
            Continue with Google
          </Button>

          <p className="mt-10 text-center text-sm text-gray-500">
            By signing in, you agree to our{" "}
            <a
              href="#"
              className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
