const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const authRoutes = require("./middleware/auth"); 
const itemRoutes = require("./routes/items");
const orderRoutes = require("./routes/orders");
const User = require("./models/user");

const app = express();

// ===============================
// MIDDLEWARE
// ===============================
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

// ===============================
app.get("/", (req, res) => {
  res.send("API is running");
});

// TEST ROUTES
app.get("/test", (req, res) => {
  res.send("SERVER IS RUNNING CORRECT FILE");
});

app.get("/orders-test", (req, res) => {
  res.send("ORDERS ROUTE IS WORKING");
});

// USERS (ADMIN)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const bcrypt = require("bcrypt"); 

app.put("/users/:id", async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // CHECK CURRENT PASSWORD FIRST
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // UPDATE DATA
    user.username = username;
    user.email = email;

    // ONLY HASH IF NEW PASSWORD EXISTS
    if (newPassword && newPassword.trim() !== "") {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      admin: user.admin
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});