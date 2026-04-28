const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const lastUser = await User.findOne().sort({ user_id: -1 });

    const newUser = new User({
      user_id: lastUser ? lastUser.user_id + 1 : 1,
      email,
      username,
      password: hashedPassword
    });

    await newUser.save();

    req.session.user = {
      id: newUser.user_id,
      email: newUser.email,
      username: newUser.username
    };

    return res.json({
      message: "User created successfully",
      user: req.session.user
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    req.session.user = {
      id: user.user_id,
      email: user.email,
      username: user.username
    };

    return res.json({
      message: "Login successful",
      user: req.session.user
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});


router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.json(req.session.user);
});


// LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }

    res.clearCookie("connect.sid");
    return res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;