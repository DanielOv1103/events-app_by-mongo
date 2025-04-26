import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './app/Home'          // listEvents y grid de cards
import Events from './app/events/page'
import Users from './app/users/users'
import Music from './app/music/page'
import { NavBar } from "@/modules/index"

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/users" element={<Users />} />
          <Route path="/musica" element={<Music />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App