import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../Utils/process.env";
import toast from "react-hot-toast";
import {
  addSelectedUser,
  addSingleUser,
  addType,
} from "../../Redux/Slice/listSlice";
import { updateUser } from "../../Redux/Slice/userSlice";

const AddUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseURL = BASE_URL;
  const { selectedUser, actionType } = useSelector((state) => state.list);
  const [formData, setFormData] = useState({
    firstname: selectedUser?.firstname || "",
    lastname: selectedUser?.lastname || "",
    email: selectedUser?.email || "",
    phone: selectedUser ? String(selectedUser?.phone) : "",
    address: selectedUser?.address || "",
    userImage: selectedUser?.userImage || "",
  });

  console.log("selectedUser : ", selectedUser);

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFormData((prevData) => ({
        ...prevData,
        userImage: URL.createObjectURL(selectedFile),
      }));
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

  const backAction = () => {
    dispatch(addSelectedUser(undefined));
    dispatch(addType(undefined));
    navigate("/");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstname.trim())
      newErrors.firstName = "First name is required.";

    if (!formData.lastname.trim())
      newErrors.lastName = "Last name is required.";

    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Valid email is required.";
    }

    if (!formData?.phone.trim() || !/^\d{10}$/.test(formData?.phone)) {
      newErrors.phone = "Valid 10-digit number is required.";
    }

    if (!formData.address.trim()) newErrors.address = "Address is required.";

    return newErrors;
  };
  const toaster = (message) => {
    toast.success(`${message}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let uploadedImageUrl;
    actionType == "update"
      ? (uploadedImageUrl = true)
      : (uploadedImageUrl = await handleFileUpload());

    if (uploadedImageUrl || actionType == "update") {
      const number = Number(formData.phone);
      formData.phone = number;

      try {
        let response;
        const requestData = {
          ...formData,
          userImage: uploadedImageUrl?.path ?? selectedUser?.userImage,
        };

        if (actionType === "update") {
          response = await axios.put(
            `${baseURL}/list/update-user/${selectedUser?._id}`,
            requestData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
              },
            }
          );
        } else {
          response = await axios.post(`${baseURL}/list/add-user`, requestData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          });
        }

        if (response.data.status) {
          if (actionType === "update") {
            dispatch(updateUser(response.data.data));
          } else {
            dispatch(addSingleUser(response.data.data));
          }
          toaster(`${response?.data?.message}`);
          dispatch(addSelectedUser(undefined));
          dispatch(addType(undefined));

          setFormData({
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            address: "",
            userImage: "",
          });
          setFile(null);
          setErrors({});
          navigate("/");
        } else {
          toast.error(`${response.data.message}`);
          console.error("Unexpected response status:", response.status);
        }
      } catch (err) {
        toast.error(`${err.response.data.message}`);
        console.error("Error during form submission:", err);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <button
        onClick={backAction}
        aria-label="Go to Home"
        className="flex items-center ml-3 mt-3"
      >
        <FaArrowLeft className="mr-2" />
        Back to Home
      </button>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 text-center">Add User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="firstname"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="lastname"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="phone"
            >
              Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="address"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="image"
            >
              Select image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
            {formData.userImage && (
              <div className="mt-4">
                <img
                  src={formData.userImage}
                  alt="Selected Preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
