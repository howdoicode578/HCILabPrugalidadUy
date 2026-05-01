const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  username: String,   
  email: String,      

  items: [
    {
      itemId: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],

  total: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);