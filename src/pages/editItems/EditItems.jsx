import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import "./EditItems.css";

const EditItems = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/items");
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setSelectedImage(null);
  };

  const handleChange = (e) => {
    setEditingItem({
      ...editingItem,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("name", editingItem.name);
      formData.append("price", editingItem.price);

      // only upload if user selected a new image
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await axios.put(
        `http://localhost:5000/item/${editingItem._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Item updated!");

      setEditingItem(null);

      fetchItems();

    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  if (!user || !user.admin) {
    return (
      <div className="admin-page">
        <Navbar />

        <div className="error-container">
          <h2>Access Denied</h2>
          <p>Admin privileges required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-items-page">
      <Navbar />

      <div className="items-container">
        <header className="items-header">
          <h1>Menu Management</h1>
          <div className="header-underline"></div>
        </header>

        <div className="items-grid">
          {items.map((item) => (
            <div key={item._id} className="item-admin-card">
              <div className="item-img-wrapper">
                <img
                  src={`http://localhost:5000/uploads/${item.image}`}
                  alt={item.name}
                />
              </div>

              <div className="item-admin-info">
                <h3>{item.name}</h3>

                <p className="item-price">
                  ₱{item.price}
                </p>

                <button
                  className="item-edit-btn"
                  onClick={() => handleEditClick(item)}
                >
                  Edit Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingItem && (
        <div className="modal-overlay">
          <div className="edit-modal">

            <h3>Edit Item Details</h3>

            <div className="modal-form">

              <label>Item Name</label>
              <input
                name="name"
                value={editingItem.name}
                onChange={handleChange}
              />

              <label>Price (₱)</label>
              <input
                name="price"
                value={editingItem.price}
                onChange={handleChange}
              />

              <label>Upload New Image</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {editingItem.image && (
                <img
                  src={`http://localhost:5000/uploads/${editingItem.image}`}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                    marginTop: "10px",
                    borderRadius: "10px"
                  }}
                />
              )}

              <div className="modal-actions">
                <button
                  className="save-btn"
                  onClick={handleUpdate}
                >
                  Save Changes
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditItems;