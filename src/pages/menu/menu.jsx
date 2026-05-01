import React, { useEffect, useState } from "react";
import axios from "axios";
import "./menu.css";
import Navbar from "../../components/navbar/Navbar";
import { Link } from "react-router-dom";

const Menu = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/items")
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="menu-page">
        <header className="menu-header">
          <h2>Our Delicious Menu</h2>
          <div className="header-underline"></div>
        </header>

        <div className="menu-container">
          {items.map(item => (
            <Link to={`/item/${item._id}`} key={item._id} className="menu-item-link">
              <div className="menu-card">
                <div className="image-container">
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                  />
                  <div className="price-badge">₱{item.price}</div>
                </div>
                <h3>{item.name}</h3>
                <button className="view-btn">View Details</button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Menu;