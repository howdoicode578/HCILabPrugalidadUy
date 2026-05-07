import React from 'react'

import { Routes, Route } from 'react-router-dom'

import Home from './pages/home/Home'
import Send from './pages/send/Send'
import Signup from './pages/signup/Signup'
import Login from './pages/login/Login'
import Menu from './pages/menu/menu'

import ItemPage from './pages/item/item'
import Cart from './pages/cart/cart'
import Orders from './pages/orders/orders'

// KEEP THESE
import AddItem from './pages/addItem/AddItem'
import AdminDashboard from './pages/adminDashboard/AdminDashboard'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/send' element={<Send />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/add-item' element={<AddItem />} />
        <Route path='/item/:id' element={<ItemPage />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/orders' element={<Orders />} />

        {/* ADMIN PAGE */}
        <Route path='/admin' element={<AdminDashboard />} />
      </Routes>
    </div>
  )
}
App
export default App;