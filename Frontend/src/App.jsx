import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppService from "./Navigation/Appservice";
import AuthService from "./Navigation/AuthService";

const App = () => {
  const token = localStorage.getItem("token");

  return <Router>{token ? <AppService /> : <AuthService />}</Router>;
};

export default App;
