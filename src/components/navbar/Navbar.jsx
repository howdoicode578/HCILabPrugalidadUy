import React from 'react'
import './Navbar.css'
import logo from "../../assets/logo.png"
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, {
        withCredentials: true
      });

      localStorage.removeItem("user"); // remove stored user
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert("Logout failed");
    }
  };

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

          {/* ✅ Logout button */}
          <li onClick={handleLogout} style={{ cursor: "pointer" }}>
            Logout
          </li>
        </div>
      </div>
    </div>
  )
}

export default Navbar;