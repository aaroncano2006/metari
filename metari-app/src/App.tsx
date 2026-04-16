import { useState, useEffect } from 'react'

import './App.css'
import { Routes, Route} from 'react-router-dom'
import Home from './views/Home'
import Profile from './views/Profile'

function App() {

  return (
    <>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  )
}

export default App
