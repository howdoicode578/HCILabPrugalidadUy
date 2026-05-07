import React, { useEffect, useState } from "react";
import "./Home.css";
import Navbar from "../../components/navbar/Navbar";
import { Link } from "react-router-dom";

const Home = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/items")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <Navbar />

      <h1>MENU</h1>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {items.map(item => (
          <div
            key={item._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "200px"
            }}
          >
            <img src={item.image} alt="" style={{ width: "100%" }} />
            <h3>{item.name}</h3>
            <p>₱{item.price}</p>

            <Link to={`/item/${item._id}`}>
              View Item
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;