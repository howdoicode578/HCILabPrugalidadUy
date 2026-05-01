import React, { useEffect, useState } from 'react';
import './Navbar.css';
import logo from "../../assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/me", { withCredentials: true })
      .then(res => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data)); 
      })
      .catch(() => setUser(null));
  }, []);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <nav className="Navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} alt="Company Logo" className="navbar-logo" />
        </Link>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/menu">Order Menu</Link></li>
          {user?.admin && (
            <li><Link to="/add-item">Add Item</Link></li>
          )}
        </ul>
      </div>

      <div className="navbar-right">
        <ul className="nav-links">
          {!user ? (
            <>
              <li><Link to="/login" className="login-link">Log In</Link></li>
              <li><Link to="/signup" className="signup-btn">Sign Up</Link></li>
            </>
          ) : (
            <>
              <li className="user-greeting">Hi, {user.username}</li>
              <li><Link to="/cart">Cart</Link></li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Log Out
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;