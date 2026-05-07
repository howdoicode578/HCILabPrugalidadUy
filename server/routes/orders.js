const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/order", async (req, res) => {
  try {
    const { userId, username, email, items } = req.body;

    const total = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const newOrder = new Order({
      userId,
      username,   
      email,      
      items,
      total
    });

    await newOrder.save();

    res.json({ message: "Order placed", order: newOrder });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;