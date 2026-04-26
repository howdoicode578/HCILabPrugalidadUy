import React from 'react'
import Home from './pages/home/Home'
import { Routes, Route } from 'react-router-dom'
import Send from './pages/send/Send'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={ <Home /> }/>
        <Route path='/send' element={ <Send /> }/>
      </Routes>
    </div>
  )
}

export default App
