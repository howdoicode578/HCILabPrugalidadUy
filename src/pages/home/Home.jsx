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

  // Limit featured items on the home page to the first 3 or 4 dishes
  const featuredItems = items.slice(0, 4);

  return (
    <>
      <Navbar />
      
      <div className="home-page">
        {/* --- Hero Section --- */}
        <header className="hero-section">
          <div className="hero-content">
            <h1>Hot, Fresh & Delicious Food</h1>
            <p>Hungry? We've got you covered. Try out our locally made, fresh dishes today!</p>
            <Link to="/menu" className="hero-btn">
              Explore Our Menu
            </Link>
          </div>
        </header>

        {/* --- Featured Section --- */}
        <section className="featured-section">
          <div className="section-title">
            <h2>Our Top Recommendations</h2>
            <div className="header-underline"></div>
          </div>

          <div className="home-menu-grid">
            {featuredItems.map(item => (
              <div key={item._id} className="home-item-card">
                <div className="home-card-image">
                  <img 
                    src={`http://localhost:5000/uploads/${item.image}`} 
                    alt={item.name} 
                  />
                  <span className="home-card-price">₱{item.price}</span>
                </div>
                
                <div className="home-card-details">
                  <h3>{item.name}</h3>
                  <Link to={`/item/${item._id}`} className="home-view-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;