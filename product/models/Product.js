const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "A Product must have a name!"],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, "A product must have a price!"],
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const Product = model("Product", productSchema);

module.exports = Product;
