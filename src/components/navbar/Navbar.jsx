import React from 'react'
import './Navbar.css'
import logo from "../../assets/logo.png"
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="Navbar">
      <div className='navbar-left'>
        <img src={logo} alt="" className="logo" />

        <ul className='hidden xl:flex items-center list-none gap-[120px]'>
          <li>Home</li>
          <li>Order Menu</li>
          <li>Other Options</li>
        </ul>

        <div className='navbar-right'>
          <Link to="/login">
            <li>Login</li>
          </Link>

          <Link to="/signup">
            <li>Sign Up</li>
          </Link>

        </div>
      </div>
    </div>
  )
}

export default Navbar;