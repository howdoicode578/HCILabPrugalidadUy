import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "../../utils/cart";
import Navbar from "../../components/navbar/Navbar";
import "./item.css";

const ItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:5000/item/${id}`)
      .then(res => setItem(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!item) return <div className="loading">Loading...</div>;

  const handleAddToCart = () => {
    addToCart({
      itemId: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: quantity
    });
    alert(`${item.name} added to cart!`);
  };

  return (
    <>
      <Navbar />
      <div className="item-detail-page">
        <div className="item-detail-container">
          
          {/* Left Side: Image Gallery Style */}
          <div className="item-image-section">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <div className="main-image-wrapper">
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.name}
              />
            </div>
          </div>

          {/* Right Side: Product Info */}
          <div className="item-info-section">
            <span className="category-tag">Chef's Choice</span>
            <h1>{item.name}</h1>
            <div className="item-price-row">
              <span className="currency">₱</span>
              <span className="amount">{item.price}</span>
            </div>

            <div className="item-description">
              <h3>Description</h3>
              <p>{item.description || "No description available for this delicious item yet. Rest assured, it is made with the freshest ingredients and lots of love!"}</p>
            </div>

            <div className="order-controls">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>

            <div className="trust-badges">
              <span>🚀 Fast Delivery</span>
              <span>🔥 Freshly Prepared</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ItemPage;