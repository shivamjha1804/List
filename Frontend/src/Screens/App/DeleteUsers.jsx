import React, { useState } from "react";
import ViewUserCard from "../../Components/Home/ViewUserCard";
import { data } from "../../Data/Demo/DemoData";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaTrashAlt } from "react-icons/fa";
import userProfile from "../../Assets/Home/Demo/images.png";
import ListCard from "../../Components/Home/ListCard";
import DeletedListCard from "../../Components/DeletedUser/DeletedListCard";
import { useSelector } from "react-redux";
const DeleteUsers = () => {
  const navigate = useNavigate();
  const { deletedUsers } = useSelector((state) => state.list);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [deletedUsersList, setDeletedUsersList] = useState(deletedUsers);

  console.log("deletedUserList : ", JSON.stringify(deletedUsersList));

  const handleFunctionType = (type, user = null) => {
    setSelectedUser(user);
    setViewModal(true);
  };

  const closeModals = () => {
    setViewModal(false);
    setDeleteModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <button
        onClick={() => navigate("/")}
        aria-label="Go to Home"
        className="flex items-center ml-3 mt-3"
      >
        <FaArrowLeft className="mr-2" />
        Back to Home
      </button>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            Deleted User List
          </h3>
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
              </tr>
            </thead>
            <tbody>
              {deletedUsersList.map((item, index) => (
                <DeletedListCard
                  key={item._id || index}
                  item={item}
                  index={index}
                  functionType={handleFunctionType}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {viewModal && (
        <ViewUserCard
          type={"delete"}
          selectedUser={selectedUser}
          onClose={closeModals}
        />
      )}
    </div>
  );
};

export default DeleteUsers;
