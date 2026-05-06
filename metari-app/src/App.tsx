// import { useState, useEffect } from 'react'
import { NavBar } from "./components/NavBar";

import './App.css'
import { Routes, Route} from 'react-router-dom'
import Home from './views/Home'
import Profile from './views/Profile'
import Login from './views/Login'
import Register from './views/Register'
import AdminPanel from './views/AdminPanel'
import Logout from "./views/Logut";
import ForgotPassword from "./views/ForgotPassword";
import RestorePassword from "./views/RestorePassword";

function App() {

  return (
    <>
      <NavBar />


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/logout" element={<Logout/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/restore-password" element={<RestorePassword/>}/>
      </Routes>
    </>
  )
}

export default App
