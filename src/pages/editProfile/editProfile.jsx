import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import "./editProfile.css";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "" 
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setForm({
        username: storedUser.username || "",
        email: storedUser.email || "",
        currentPassword: "",
        newPassword: ""
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?._id) return alert("User not found.");

      const updatedData = {
        username: form.username,
        email: form.email,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      };

      const res = await axios.put(`http://localhost:5000/users/${storedUser._id}`, updatedData);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      alert("Profile updated successfully!");

      setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update profile");
    }
  };

  if (!user) {
    return (
      <div className="edit-profile-page">
        <Navbar />
        <div className="error-message">Please log in to view this page.</div>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <Navbar />
      
      <div className="profile-container">
        <div className="profile-card">
          <header className="profile-header">
            <h2>User Settings</h2>
            <p>Update your personal information and password</p>
          </header>

          <div className="profile-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter username"
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>

            <hr className="form-divider" />

            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Confirm current password"
              />
            </div>

            <div className="form-group">
              <label>New Password (optional)</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>

            <button className="save-profile-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;