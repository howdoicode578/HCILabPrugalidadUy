import React, { useEffect, useState } from "react";
import "./cart.css";
import Navbar from "../../components/navbar/Navbar";
import { getCart, clearCart, removeFromCart } from "../../utils/cart";
import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const handleRemove = (id) => {
    removeFromCart(id);
    setCart(getCart());
  };

  const handleCheckout = async () => {
    try {
      if (!cart || cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please log in first");
        return;
      }

      await axios.post("http://localhost:5000/order", {
        userId: user._id,
        username: user.username,
        email: user.email,
        items: cart,
        totalAmount: total
      });

      clearCart();
      setCart([]);
      alert("Order placed successfully! Enjoy your meal!");

    } catch (err) {
      console.error(err);
      alert("Order failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-left">
            <h2>Your Selection</h2>
            <div className="header-underline"></div>

            {cart.length === 0 ? (
              <div className="empty-cart-msg">
                <p>Your tray is empty!</p>
                <button className="back-to-menu" onClick={() => window.location.href='/menu'}>
                  Go to Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.itemId} className="cart-item-card">
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="cart-item-qty">Quantity: {item.quantity}</p>
                    <p className="cart-item-price">₱{item.price * item.quantity}</p>
                  </div>
                  <button className="remove-btn" onClick={() => handleRemove(item.itemId)}>
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="cart-right">
            <div className="summary-box">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₱{total}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₱0</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>₱{total}</span>
              </div>
              <button 
                className="checkout-btn" 
                onClick={handleCheckout} 
                disabled={cart.length === 0}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;