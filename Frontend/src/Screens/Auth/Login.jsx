import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../Utils/process.env";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/Slice/userSlice";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseURL = BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    localStorage.setItem("token", undefined);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError((prevError) => ({ ...prevError, email: "Email is required*" }));
      isValid = false;
    }
    if (!emailRegex.test(email)) {
      setError((prevError) => ({
        ...prevError,
        email: "Invalid email format*",
      }));
      isValid = false;
    }
    if (!password) {
      setError((prevError) => ({
        ...prevError,
        password: "Password is required*",
      }));
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${baseURL}/user/login`, {
        email: email,
        password: password,
      });

      if (response.data.status) {
        localStorage.setItem("token", response.data.token);
        dispatch(login(response?.data?.data));
        toast.success(`${response.data.message}`);
        navigate("/");
      } else {
        toast.error(response.data.message || "Login failed");
        setError(response.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError(error);
      toast.error(`${error.response.data.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Email*
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {error.email && (
                <div className="mb-4 text-sm text-red-500">{error.email}</div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Password*
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-600 focus:outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {error.password && (
                <div className="mb-4 text-sm text-red-500">
                  {error.password}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Don't have an account?{" "}
              <button
                onClick={navigateToSignup}
                className="text-blue-500 hover:underline"
              >
                Sign up
              </button>
            </p>
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
