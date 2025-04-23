import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'          // listEvents y grid de cards
import CreateEvent from './pages/CreateEvent'

function App() {
  return (
    <BrowserRouter>
      <div className="px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateEvent />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App