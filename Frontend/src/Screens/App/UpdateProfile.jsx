import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../Utils/process.env";
import { setUser } from "../../Redux/Slice/userSlice";
import toast from "react-hot-toast";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const baseURL = BASE_URL;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [firstName, setFirstName] = useState(user?.firstname);
  const [lastName, setLastName] = useState(user?.lastname);
  const [profileImage, setProfileImage] = useState(user?.profileImage);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProfileImage(URL.createObjectURL(selectedFile));
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

    let uploadedImage = profileImage;
    if (file) {
      const uploadedFilePath = await handleFileUpload();
      if (uploadedFilePath) {
        uploadedImage = uploadedFilePath;
      }
    }

    const data = {
      firstname: firstName,
      lastname: lastName,
      profileImage: uploadedImage.path,
      email: user?.email,
    };

    try {
      const response = await axios.put(`${baseURL}/user/update-profile`, data, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      if (response.data.status) {
        dispatch(setUser(response.data.data));
        toast.success(`${response.data.message}`);
        navigate("/profile");
      } else {
        toast.error(`${response.data.message}`);
        console.error("Failed to update profile.");
      }
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <button
        onClick={() => navigate("/profile")}
        aria-label="Go to Home"
        className="flex items-center ml-3 mt-3"
      >
        <FaArrowLeft className="mr-2" />
        Back to Profile
      </button>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Update Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Enter your last name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-blue-600 hover:file:bg-gray-200"
            />
            {profileImage && (
              <img
                src={profileImage}
                alt="Profile Preview"
                className="mt-4 w-24 h-24 rounded-full border border-gray-300"
              />
            )}
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
