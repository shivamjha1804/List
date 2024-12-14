import React from "react";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

const DeletedListCard = ({ item, index, functionType }) => {
  return (
    <tr
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      } hover:bg-gray-100 transition duration-200 ease-in-out border-b`}
    >
      <td className="w-[10%] text-center text-sm text-gray-800 py-3">
        {index + 1}
      </td>
      <td className="w-[20%] text-center text-sm text-gray-800 py-3">
        {item?.firstname}
      </td>
      <td className="w-[20%] text-center text-sm text-gray-800 py-3">
        {item?.lastname}
      </td>
      <td className="w-[10%] text-center">
        <button
          aria-label={`View details of ${item?.firstName} ${item?.lastName}`}
          className="flex justify-center items-center text-blue-500 hover:text-blue-700 focus:outline-none transition duration-200"
          onClick={() => functionType("view", item)}
        >
          <FaEye />
        </button>
      </td>
    </tr>
  );
};

export default DeletedListCard;
