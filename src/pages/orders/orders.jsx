import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get(`http://localhost:5000/orders/${user._id}`)
      .then(res => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>Your Orders</h2>

      {orders.map(order => (
        <div key={order._id}>
          <p>Total: ₱{order.total}</p>

          {order.items.map(item => (
            <div key={item.itemId}>
              <p>{item.name} x {item.quantity}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Orders;