import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../Screens/App/Home";
import AuthService from "./AuthService";
import AddUser from "../Screens/App/AddUser";
import DeleteUsers from "../Screens/App/DeleteUsers";
import Profile from "../Screens/App/Profile";
import UpdateProfile from "../Screens/App/UpdateProfile";
const AppService = () => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
      <Route path="/*" element={<AuthService />} />
      <Route path="/addUser" element={<AddUser />} />
      <Route path="/deletedUsers" element={<DeleteUsers />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/updateProfile" element={<UpdateProfile />} />
    </Routes>
  );
};

export default AppService;
