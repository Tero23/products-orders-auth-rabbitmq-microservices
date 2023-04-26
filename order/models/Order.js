const { Schema, model, SchemaTypes } = require("mongoose");

const orderSchema = new Schema({
  products: [
    {
      productId: SchemaTypes.ObjectId,
    },
  ],
  user: {
    type: SchemaTypes.ObjectId,
    required: [true, "An order must have an owner!"],
  },
  totalPrice: {
    type: Number,
    required: [true, "An Order must have a total price!"],
  },
});

const Order = model("Order", orderSchema);

module.exports = Order;
