import React from 'react'
import Home from './pages/home/Home'
import { Routes, Route } from 'react-router-dom'
import Send from './pages/send/Send'
import Signup from './pages/signup/Signup'
import Login from './pages/login/Login'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={ <Home /> }/>
        <Route path='/send' element={ <Send /> }/>
        <Route path='/signup' element={ <Signup /> }/>
        <Route path='/login' element={ <Login /> }/>
      </Routes>
    </div>
  )
}

export default App
