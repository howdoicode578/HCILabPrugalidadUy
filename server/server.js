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
app.get("/test", (req, res) => {
  res.send("SERVER IS RUNNING CORRECT FILE");
});

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));

app.use(express.json());
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

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/", authRoutes);
app.use("/", itemRoutes);
app.use("/orders", orderRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API is running");
});

// 👇 PUT IT HERE
app.get("/orders-test", (req, res) => {
  res.send("ORDERS ROUTE IS WORKING");
});

const dns = require("dns");

app.get("/srv-test", (req, res) => {
  dns.resolveSrv("_mongodb._tcp.cluster0.bcgnwkz.mongodb.net", (err, result) => {
    if (err) return res.json({ error: err.message });
    res.json(result);
  });
});

app.get("/create-test-order", async (req, res) => {
  const Order = require("./models/Order");

  try {
    const newOrder = new Order({
      userId: "1",
      username: "uytest",
      email: "uytest@gmail.com",
      items: [
        {
          name: "Burger",
          quantity: 2,
          price: 100
        }
      ],
      total: 200
    });

    await newOrder.save();

    res.send("Test order created!");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// ===============================
// USERS ROUTES (FIX FOR ADMIN)
// ===============================

// GET ALL USERS
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
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});