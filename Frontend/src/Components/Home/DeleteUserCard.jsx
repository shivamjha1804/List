import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../../../Utils/process.env";
import { deleteUser } from "../../Redux/Slice/listSlice";
import toast from "react-hot-toast";

const DeleteUserCard = ({ selectedUser, onClose }) => {
  if (!selectedUser) return null;
  const dispatch = useDispatch();
  const baseURL = BASE_URL;

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${baseURL}/list/delete-user/${selectedUser?._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response?.data.status) {
        dispatch(deleteUser(selectedUser?._id));
        toast.success(`${response.data.message}`);
        onClose();
      } else {
        toast.error(`${response.data.message}`);
        alert("Failed to delete user");
      }
    } catch (err) {
      toast.error(`${err.response.data.message}`);
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h3 className="text-lg font-semibold mb-4">Delete User</h3>
        <p>
          Are you sure you want to delete{" "}
          <strong>{`${selectedUser.firstname} ${selectedUser.lastname}`}</strong>
          ?
        </p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserCard;
