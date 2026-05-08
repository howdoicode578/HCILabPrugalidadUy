import React from 'react'

import { Routes, Route } from 'react-router-dom'

import Home from './pages/home/Home'
import Send from './pages/send/Send'
import Signup from './pages/signup/Signup'
import Login from './pages/login/Login'
import Menu from './pages/menu/menu'
import EditProfile from './pages/editProfile/editProfile'

import ItemPage from './pages/item/item'
import Cart from './pages/cart/cart'
import Orders from './pages/orders/orders'


import AddItem from './pages/addItem/AddItem'
import AdminDashboard from './pages/adminDashboard/AdminDashboard'
import EditItems from './pages/editItems/EditItems'
import Analytics from './pages/analytics/Analytics'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/send' element={<Send />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/item/:id' element={<ItemPage />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/editProfile' element={<EditProfile />} />

        {/* ADMIN PAGE */}
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path="/edit-items" element={<EditItems />} />
        <Route path='/add-item' element={<AddItem />} />
        <Route path='/analytics' element={<Analytics />} />
      </Routes>
    </div>
  )
}
App
export default App;