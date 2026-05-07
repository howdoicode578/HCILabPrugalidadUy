import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import "./AdminDashboard.css"; // Ensure this matches your CSS filename

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({});

  // FETCH USERS + ORDERS
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log(err));

    fetch("http://localhost:5000/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.log(err));
  }, []);

  // UPDATE USER
  const handleUpdate = async (id) => {
    try {
      const payload = { ...editData };

      if (!payload.password || payload.password.trim() === "") {
        delete payload.password;
      }

      const res = await fetch(`http://localhost:5000/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      setUsers(users.map((u) => (u._id === id ? data : u)));
      setEditingUser(null);
      setEditData({});
    } catch (err) {
      console.log(err);
    }
  };

  // MARK ORDER AS DONE (DELETE)
  const handleDeleteOrder = async (orderId) => {
    try {
      await fetch(`http://localhost:5000/orders/${orderId}`, {
        method: "DELETE",
      });

      setOrders(orders.filter((o) => o._id !== orderId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="admin-page">
      <Navbar />

      <div className="admin-container">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="header-underline"></div>
        </header>

        {/* SEARCH SECTION */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-bar"
          />
        </div>

        <div className="dashboard-grid">
          {/* ================= ORDERS SECTION ================= */}
          <section className="admin-card">
            <div className="card-header orders-head">
              <h2>Orders</h2>
              <span className="badge">{orders.length} Active</span>
            </div>

            <div className="card-content">
              {orders.map((order) => (
                <div key={order._id} className="order-entry">
                  <div className="order-info">
                    <p><strong>Customer:</strong> {order.username}</p>
                    <div className="order-items-list">
                      {order.items.map((item, i) => (
                        <div key={i} className="item-tag">
                          - {item.name} x {item.quantity}
                        </div>
                      ))}
                    </div>
                    <p className="order-total-text">Total: ₱{order.total}</p>
                  </div>

                  <button
                    className="done-btn"
                    onClick={() => handleDeleteOrder(order._id)}
                  >
                    Mark as Done
                  </button>
                </div>
              ))}
              {orders.length === 0 && <p className="empty-msg">No active orders.</p>}
            </div>
          </section>

          {/* ================= ACCOUNTS SECTION ================= */}
          <section className="admin-card">
            <div className="card-header accounts-head">
              <h2>Accounts</h2>
            </div>

            <div className="card-content">
              {users
                .filter((user) =>
                  user.username.toLowerCase().includes(search.toLowerCase())
                )
                .map((user) => (
                  <div key={user._id} className="user-entry">
                    {editingUser === user._id ? (
                      /* EDIT MODE */
                      <div className="edit-form">
                        <div className="input-group">
                          <label style={{fontSize: '12px', color: '#b91c1c', fontWeight: 'bold'}}>Username</label>
                          <input
                            className="admin-input-small"
                            placeholder="Username"
                            value={editData.username}
                            onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                          />
                        </div>

                        <div className="input-group">
                          <label style={{fontSize: '12px', color: '#b91c1c', fontWeight: 'bold'}}>Email Address</label>
                          <input
                            className="admin-input-small"
                            placeholder="Email"
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          />
                        </div>

                        <div className="input-group">
                          <label style={{fontSize: '12px', color: '#b91c1c', fontWeight: 'bold'}}>Password (Leave blank to keep same)</label>
                          <input
                            className="admin-input-small"
                            type="password"
                            placeholder="••••••••"
                            value={editData.password || ""}
                            onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                          />
                        </div>

                        <label className="admin-checkbox">
                          <input
                            type="checkbox"
                            checked={editData.admin}
                            onChange={(e) => setEditData({ ...editData, admin: e.target.checked })}
                          />
                          Grant Administrator Permissions
                        </label>

                        <div className="action-btns">
                          <button className="save-btn" onClick={() => handleUpdate(user._id)}>
                            Update Account
                          </button>
                          <button className="cancel-btn" onClick={() => setEditingUser(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* VIEW MODE */
                      <div className="view-row">
                        <div className="user-details">
                          <p className="u-name">
                            {user.username} {user.admin && <span className="admin-tag">Admin</span>}
                          </p>
                          <p className="u-email">{user.email}</p>
                        </div>
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setEditingUser(user._id);
                            setEditData({
                              username: user.username,
                              email: user.email,
                              password: "",
                              admin: user.admin,
                            });
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;