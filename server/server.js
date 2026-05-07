const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const bcrypt = require("bcrypt");

const PORT = process.env.PORT || 5000;

const authRoutes = require("./middleware/auth");
const itemRoutes = require("./routes/items");
const orderRoutes = require("./routes/orders");
const User = require("./models/user");

const app = express();

// MIDDLEWARE
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// ROUTES
app.use("/", authRoutes);
app.use("/", itemRoutes);
app.use("/orders", orderRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/test", (req, res) => {
  res.send("SERVER IS RUNNING CORRECT FILE");
});

app.get("/orders-test", (req, res) => {
  res.send("ORDERS ROUTE IS WORKING");
});

// USERS
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE USER
app.put("/users/:id", async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword, admin } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateData = {};

    // update username/email/admin if provided
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (admin !== undefined) updateData.admin = admin;

    // PASSWORD CHECK + UPDATE
    if (newPassword && newPassword.trim() !== "") {

      // require current password check
      if (!currentPassword) {
        return res.status(400).json({
          error: "Current password is required"
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({
          error: "Current password is incorrect"
        });
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      admin: updatedUser.admin
    });

  } catch (err) {
    console.log("UPDATE USER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});