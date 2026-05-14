// import { useState, useEffect } from 'react'
import { NavBar } from "./components/NavBar";

import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import MyGroups from "./views/MyGroups";
import MyMetas from "./views/MyMetas";
import Profile from "./views/Profile";
import Login from "./views/Login";
import Register from "./views/Register";
import AdminPanel from "./views/AdminPanel";
import Logout from "./views/Logout";
import ForgotPassword from "./views/ForgotPassword";
import RestorePassword from "./views/RestorePassword";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <NavBar />

      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mygroups" element={<MyGroups />} />
          <Route path="/mymetas" element={<MyMetas />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/restore-password" element={<RestorePassword />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;
