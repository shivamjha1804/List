import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import axios from "axios";
import { BASE_URL } from "../../../Utils/process.env";
import toast from "react-hot-toast";

const UpdatePassword = ({ closeModal }) => {
  const baseUrl = BASE_URL;
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,16}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      setErrorMessage("Current password is required.");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage(
        "Password must be between 8-16 characters and include at least one capital letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");
    try {
      const response = await axios.put(
        `${baseUrl}/user/update-password`,
        { currentPassword, newPassword: password },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (response.data.status) {
        toast.success(`${response.data.message}`);
        closeModal();
      } else {
        toast.error(`${response.data.message}`);
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg relative">
      <button
        onClick={closeModal}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        aria-label="Close"
      >
        <AiOutlineClose size={24} />
      </button>
      <h2 className="text-2xl font-bold text-center mb-4">Update Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Current Password
          </label>
          <input
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword((prev) => !prev)}
            className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
          >
            {showCurrentPassword ? (
              <BsEyeSlash size={20} />
            ) : (
              <BsEye size={20} />
            )}
          </button>
        </div>
        <div className="mb-4 relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
          </button>
        </div>
        <div className="mb-4 relative">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? (
              <BsEyeSlash size={20} />
            ) : (
              <BsEye size={20} />
            )}
          </button>
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
