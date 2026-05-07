import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({});

  // FETCH USERS
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.log(err));

    fetch("http://localhost:5000/orders")
  .then(res => res.json())
  .then(data => setOrders(data))
  .catch(err => console.log(err));
  }, []);

  // ✅ FIX: FUNCTION MUST BE HERE (BEFORE RETURN)
  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editData)
      });

      const data = await res.json();

      setUsers(users.map(u => (u._id === id ? data : u)));
      setEditingUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />

      <h1 style={{ textAlign: "center" }}>ADMIN DASHBOARD</h1>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          margin: "20px 0",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      {/* MAIN BOXES */}
      <div style={{ display: "flex", gap: "20px" }}>

        {/* ORDERS */}
        <div style={{
          flex: 1,
          border: "1px solid #ccc",
          borderRadius: "15px",
          padding: "15px",
          minHeight: "300px"
        }}>
          <h2>ORDERS</h2>
         {orders.map(order => (
  <div key={order._id} style={{ marginBottom: "10px" }}>
    <p><b>Customer:</b> {order.username}</p>

    <p><b>Items:</b></p>
    {order.items.map((item, i) => (
      <div key={i}>
        - {item.name} x {item.quantity}
      </div>
    ))}

    <p><b>Total:</b> ₱{order.total}</p>

    <hr />
  </div>
))}
        </div>

        {/* ACCOUNTS */}
        <div style={{
          flex: 1,
          border: "1px solid #ccc",
          borderRadius: "15px",
          padding: "15px",
          minHeight: "300px"
        }}>
          <h2>ACCOUNTS</h2>

          {users
            .filter(user =>
              user.username.toLowerCase().includes(search.toLowerCase())
            )
            .map(user => (
              <div key={user._id} style={{ marginBottom: "10px" }}>

                {editingUser === user._id ? (
                  <>
                    <input
                      value={editData.username}
                      onChange={(e) =>
                        setEditData({ ...editData, username: e.target.value })
                      }
                    />

                    <input
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                    />

                    <input
                      value={editData.password || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, password: e.target.value })
                      }
                    />

                    <label>
                      Admin:
                      <input
                        type="checkbox"
                        checked={editData.admin}
                        onChange={(e) =>
                          setEditData({ ...editData, admin: e.target.checked })
                        }
                      />
                    </label>

                    <button onClick={() => handleUpdate(user._id)}>Save</button>
                  </>
                ) : (
                  <>
                    <p><b>Username:</b> {user.username}</p>
                    <p><b>Email:</b> {user.email}</p>
                    <p><b>Admin:</b> {user.admin ? "Yes" : "No"}</p>

                    <button onClick={() => {
                      setEditingUser(user._id);
                      setEditData(user);
                    }}>
                      Edit
                    </button>
                  </>
                )}

                <hr />
              </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;