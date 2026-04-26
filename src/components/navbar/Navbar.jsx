import React from 'react'
import './Navbar.css'
import logo from "../../assets/logo.png"

const Navbar = () => {
  return (
    <div className="Navbar">
      <div className='navbar-left'>
        <img src={logo} alt="" className="logo" />
          <ul className='hidden xl:flex items-center list-none gap-[120px]'>
            <li>Home</li>
            <li>Images</li>
            <li>Random things</li>
            <li>A picture of a hamburger</li>
            <li>A picture of a chincilla</li>
          </ul>
        <div className='navbar-right'>
        </div>
    </div>
    </div>
  )
}

export default Navbar
