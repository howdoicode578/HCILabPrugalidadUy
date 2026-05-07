const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();

// ===============================
// SIGNUP
// ===============================
router.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      admin: false
    });

    await newUser.save();

    req.session.user = {
      _id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      admin: newUser.admin
    };

    res.json({
      message: "User created successfully",
      user: req.session.user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// LOGIN
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN BODY:", req.body); // DEBUG

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    req.session.user = {
      _id: user._id, // ✅ FIXED (was user.user_id)
      email: user.email,
      username: user.username,
      admin: user.admin
    };

    res.json({
      message: "Login successful",
      user: req.session.user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===============================
// GET CURRENT USER
// ===============================
router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.json(req.session.user);
});

// ===============================
// LOGOUT
// ===============================
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;