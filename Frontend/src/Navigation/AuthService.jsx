import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Screens/Auth/Login";
import SignUp from "../Screens/Auth/SignUp";

const AuthService = () => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
      <Route
        path="/signup"
        element={!token ? <SignUp /> : <Navigate to="/" />}
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AuthService;
