console.log("Items routes loaded");

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String
});

const Item = mongoose.model('Item', ItemSchema);

router.post("/add-item", upload.single("image"), async (req, res) => {
  try {
    const { name, price } = req.body;

    const newItem = new Item({
      name,
      price,
      description: "Delicious food item",
      image: req.file.filename
    });

    await newItem.save();

    res.json({ message: "Item added", item: newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/item/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;