// import { useState, useEffect } from 'react'
import { NavBar } from "./components/NavBar";

import './App.css'
import { Routes, Route} from 'react-router-dom'
import Home from './views/Home'
import Profile from './views/Profile'
import Login from './views/Login'
import Register from './views/Register'

function App() {

  return (
    <>
      <NavBar />


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
