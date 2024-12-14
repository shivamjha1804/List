import React, { useEffect, useState } from "react";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import userProfile from "../../Assets/Home/Demo/images.png";
import { data } from "../../Data/Demo/DemoData";
import ListCard from "../../Components/Home/ListCard";
import { useNavigate } from "react-router-dom";
import ViewUserCard from "../../Components/Home/ViewUserCard";
import DeleteUserCard from "../../Components/Home/DeleteUserCard";
import { BASE_URL } from "../../../Utils/process.env";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addDeletedUsers,
  addList,
  addSelectedUser,
  addType,
} from "../../Redux/Slice/listSlice";
import { setUser } from "../../Redux/Slice/userSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseURL = BASE_URL;
  const { list } = useSelector((state) => state.list);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [userData, setUserData] = useState();
  const [listUsers, setListUsers] = useState([]);

  useEffect(() => {
    getProfile();
    getListData();
    deletedUsers();
  }, []);

  useEffect(() => {
    setListUsers(list);
  }, [list]);

  const handleFunctionType = (type, user = null) => {
    setSelectedUser(user);
    if (type === "edit") {
      dispatch(addSelectedUser(user));
      dispatch(addType("update"));
      navigate(`/addUser`);
    } else if (type === "delete") {
      setDeleteModal(true);
    } else if (type === "view") {
      setViewModal(true);
    }
  };

  const closeModals = () => {
    setListUsers(list);
    setViewModal(false);
    setDeleteModal(false);
  };

  const getProfile = async () => {
    try {
      const response = await axios.get(`${baseURL}/user/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getfalseItem("token"),
        },
      });

      if (response.data.status) {
        dispatch(setUser(response.data.data));
        setUserData(response.data.data);
      } else {
        console.log("Error from server : ", response.data.message);
      }
    } catch (err) {
      console.log("Error while fetching the userData : ");
    }
  };

  const getListData = async () => {
    try {
      const response = await axios.get(`${baseURL}/list/get-all-users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
      if (response.data.status) {
        // setListUsers(response.data.data);
        dispatch(addList(response?.data.data));
      } else {
        console.log("Error from server : ", response.data.message);
      }
    } catch (err) {
      console.log("Error while fetching the userData : ");
    }
  };

  const deletedUsers = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/list/get-all-deleted-users`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (response.data.status) {
        dispatch(addDeletedUsers(response?.data.data));
      } else {
        console.log("Error from server : ", response.data.message);
      }
    } catch (err) {
      console.log("Error while fetching the userData : ", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div
          onClick={() => navigate("/profile")}
          className="flex justify-between items-center mb-6 cursor-pointer"
        >
          <h3 className="text-2xl font-semibold text-gray-800">User List</h3>
          <div className="flex items-center space-x-3">
            <img
              src={
                userData?.profileImage ? userData?.profileImage : userProfile
              }
              alt="user"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-gray-600 text-sm">
              {userData?.firstname} {userData?.lastname}
            </span>
          </div>
        </div>
        <div className="flex justify-between space-x-6 mb-3">
          <button
            className="flex items-center bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
            onClick={() => navigate("/addUser")}
          >
            <FaPlus className="mr-2" /> Add User
          </button>
          <button
            className="flex items-center bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300"
            onClick={() => navigate("/deletedUsers")}
          >
            <FaTrashAlt className="mr-2" /> Deleted Users
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="w-[10%] text-center text-sm font-semibold text-gray-700 py-3">
                  S.No
                </th>
                <th className="w-[20%] text-center text-sm font-semibold text-gray-700 py-3">
                  First Name
                </th>
                <th className="w-[20%] text-center text-sm font-semibold text-gray-700 py-3">
                  Last Name
                </th>
                <th className="w-[10%] text-center text-sm font-semibold text-gray-700">
                  View
                </th>
                <th className="w-[10%] text-center text-sm font-semibold text-gray-700">
                  Edit
                </th>
                <th className="w-[10%] text-center text-sm font-semibold text-gray-700">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {listUsers.map(
                (item, index) =>
                  item.isDeleted == false && (
                    <ListCard
                      key={item._id || index}
                      item={item}
                      index={index}
                      functionType={handleFunctionType}
                    />
                  )
              )}
            </tbody>
          </table>
        </div>
      </div>
      {viewModal && (
        <ViewUserCard
          type={"Home"}
          selectedUser={selectedUser}
          onClose={closeModals}
        />
      )}
      {deleteModal && (
        <DeleteUserCard selectedUser={selectedUser} onClose={closeModals} />
      )}
    </div>
  );
};

export default Home;
