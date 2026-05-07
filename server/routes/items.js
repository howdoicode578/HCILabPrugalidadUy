console.log("Items routes loaded");

const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const mongoose = require("mongoose");

// ITEM SCHEMA
const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  description: {
    type: String,
    default: "Delicious food item"
  },

  image: {
    type: String,
    default: ""
  }
});

const Item = mongoose.models.Item || mongoose.model("Item", ItemSchema);

// ADD ITEM
router.post(
  "/add-item",
  upload.single("image"),
  async (req, res) => {
    try {

      const { name, price, description } = req.body;

      if (!req.file) {
        return res.status(400).json({
          error: "Image is required"
        });
      }

      const newItem = new Item({
        name,
        price,
        description:
          description || "Delicious food item",

        image: req.file.filename
      });

      await newItem.save();

      res.json({
        message: "Item added successfully",
        item: newItem
      });

    } catch (err) {
      console.log(err);

      res.status(500).json({
        error: err.message
      });
    }
  }
);

// GET ALL ITEMS
router.get("/items", async (req, res) => {
  try {

    const items = await Item.find();

    res.json(items);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
});

// GET SINGLE ITEM
router.get("/item/:id", async (req, res) => {
  try {

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        error: "Item not found"
      });
    }

    res.json(item);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
});

// UPDATE ITEM
router.put(
  "/item/:id",
  upload.single("image"),
  async (req, res) => {
    try {

      const item = await Item.findById(req.params.id);

      if (!item) {
        return res.status(404).json({
          error: "Item not found"
        });
      }

      // update fields
      item.name = req.body.name || item.name;

      item.price = req.body.price || item.price;

      item.description =
        req.body.description || item.description;

      // if new image uploaded
      if (req.file) {
        item.image = req.file.filename;
      }

      await item.save();

      res.json({
        message: "Item updated successfully",
        item
      });

    } catch (err) {
      console.log(err);

      res.status(500).json({
        error: err.message
      });
    }
  }
);

// DELETE ITEM
router.delete("/item/:id", async (req, res) => {
  try {

    const deletedItem = await Item.findByIdAndDelete(
      req.params.id
    );

    if (!deletedItem) {
      return res.status(404).json({
        error: "Item not found"
      });
    }

    res.json({
      message: "Item deleted successfully"
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;