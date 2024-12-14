import React from "react";
import { FaPen, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import userImage from "../../Assets/Home/Demo/images.png";
import { useDispatch } from "react-redux";
import { addSelectedUser, addType } from "../../Redux/Slice/listSlice";

const ViewUserCard = ({ type, selectedUser, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!selectedUser) return null;

  const onUpdate = () => {
    dispatch(addSelectedUser(selectedUser));
    dispatch(addType("update"));
    navigate("/addUser");
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
        <div className="absolute top-4 right-4 flex space-x-2">
          {type === "Home" && (
            <button
              className="text-gray-500 hover:text-blue-500"
              onClick={onUpdate}
              title="Edit User"
            >
              <FaPen />
            </button>
          )}
          <button
            className="text-gray-500 hover:text-red-500"
            onClick={onClose}
            title="Close"
          >
            <FaTimes />
          </button>
        </div>
        <div className="flex justify-center mb-6">
          <img
            src={selectedUser.userImage || userImage}
            alt="User Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
        {/* <h3 className="text-lg font-semibold mb-4 text-center">View User</h3> */}
        <div className="text-gray-700 space-y-2">
          <div className="flex gap-28">
            <p>
              <strong>First Name:</strong> {selectedUser.firstname}
            </p>
            <p>
              <strong>Last Name:</strong> {selectedUser.lastname}
            </p>
          </div>
          <p>
            <strong>Email:</strong> {selectedUser.email || "N/A"}
          </p>
          <p>
            <strong>Number:</strong> {selectedUser.phone || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {selectedUser.address || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewUserCard;
