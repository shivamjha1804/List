import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../Utils/process.env";
import axios from "axios";
import toast from "react-hot-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const baseURL = BASE_URL;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [file, setFile] = useState(null); // For managing the file state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProfileImage(URL.createObjectURL(selectedFile)); // Set the preview image URL
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      console.error("No file selected for upload.");
      return null;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("profilePic", file);

    try {
      const response = await axios.post(`${baseURL}/upload`, uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.file;
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    setError({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      profileImage: "",
    });

    if (!firstName) {
      setError((prev) => ({ ...prev, firstName: "First Name is required" }));
    }
    if (!lastName) {
      setError((prev) => ({ ...prev, lastName: "Last Name is required" }));
    }
    if (!email) {
      setError((prev) => ({ ...prev, email: "Email is required" }));
    }
    if (!emailRegex.test(email)) {
      setError((prev) => ({ ...prev, email: "Invalid email address" }));
    }
    if (!password) {
      setError((prev) => ({ ...prev, password: "Password is required" }));
    }
    if (!profileImage) {
      setError((prev) => ({
        ...prev,
        profileImage: "Profile Image is required",
      }));
    }
    if (password !== confirmPassword) {
      setError((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    }

    if (
      firstName &&
      lastName &&
      email &&
      password &&
      password === confirmPassword
    ) {
      setIsLoading(true);
      const user = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password,
        profileImage: profileImage,
      };

      const uploadedFile = await handleFileUpload();
      if (uploadedFile) {
        user.profileImage = uploadedFile.path;
        try {
          const response = await axios.post(`${baseURL}/user/sign-up`, user);
          if (response.data.status) {
            console.log("Data : ", JSON.stringify(response.data.message));
            toast.success(`${response.data.message}`);
            navigate("/login");
          } else {
            toast.error(`${response.data.message}`);
          }
        } catch (error) {
          toast.error(`${error.response.data.message}`);
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        toast.error("Profile image upload failed.");
      }
    }
  };

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (!passwordRegex.test(newPassword)) {
      setError((prev) => ({
        ...prev,
        password:
          "Max length - 16, Min length - 8, At least 1 capital letter, 1 small letter, 1 number, 1 special character.",
      }));
    } else {
      profileImage;
      setError((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (newConfirmPassword !== password) {
      setError((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setError((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex gap-3">
              <div className="mb-4">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                {error.firstName && (
                  <div className="text-red-500 text-sm">{error.firstName}</div>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                {error.lastName && (
                  <div className="text-red-500 text-sm">{error.lastName}</div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Email
              </label>
              <div className="flex items-center">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              {error.email && (
                <div className="text-red-500 text-sm">{error.email}</div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Profile Image
              </label>
              <input
                type="file"
                id="profileImage"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {profileImage && (
                <img
                  src={profileImage}
                  alt="Profile Preview"
                  className="mt-2 w-20 h-20 rounded-full object-cover"
                />
              )}
              {error.profileImage && (
                <div className="text-red-500 text-sm">{error.profileImage}</div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              {error.password && (
                <div className="text-red-500 text-sm">{error.password}</div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </span>
              </div>
              {error.confirmPassword && (
                <div className="text-red-500 text-sm">
                  {error.confirmPassword}
                </div>
              )}
            </div>

            <div className="mb-6">
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
              >
                Sign Up
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
