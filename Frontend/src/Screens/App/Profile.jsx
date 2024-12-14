import React, { useEffect, useState } from "react";
import profilePicture from "../../Assets/Home/Demo/images.png";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import UpdatePassword from "../../Components/Profile/UpdatePassword";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../../Utils/process.env";
import { logout, setUser } from "../../Redux/Slice/userSlice";

const Profile = () => {
  const navigate = useNavigate();
  const baseUrl = BASE_URL;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [userData, setUserData] = useState(user ?? {});
  const [updatePasswordModal, setUpdatePasswordModal] = useState(false);

  const logoutFunction = () => {
    localStorage.removeItem("token");
    dispatch(setUser(null));
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    getProfile();
  }, [user]);

  const getProfile = async () => {
    try {
      const response = await axios.get(`${baseUrl}/user/profile`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      if (response.data.status) {
        setUserData(response.data.data);
        dispatch(setUser(response.data.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <button
        onClick={() => navigate("/")}
        aria-label="Go to Home"
        className="flex items-center ml-3 mt-3"
      >
        <FaArrowLeft className="mr-2" />
        Back to Home
      </button>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold">Profile</h3>
        </div>

        <div className="flex justify-center mb-6">
          <img
            src={userData ? userData?.profileImage : profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full border border-gray-300"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => navigate("/updateProfile")}
            className="text-blue-500 hover:underline"
          >
            Update Profile
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <p className="mt-1 p-2 border border-gray-300 rounded-md">
              {userData.firstname}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <p className="mt-1 p-2 border border-gray-300 rounded-md">
              {userData.lastname}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 p-2 border border-gray-300 rounded-md">
              {userData.email}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <p className="mt-1 p-2 border border-gray-300 rounded-md">
                *********************************
              </p>
            </div>
            <button
              onClick={() => setUpdatePasswordModal(true)}
              className="text-blue-500 hover:underline ml-4"
            >
              Update Password
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
            onClick={logoutFunction}
          >
            Logout
          </button>
        </div>
      </div>

      {updatePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <UpdatePassword closeModal={() => setUpdatePasswordModal(false)} />
        </div>
      )}
    </div>
  );
};

export default Profile;
