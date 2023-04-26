const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Order = require("../models/Order");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({});
  if (!orders.length)
    return res.status(200).json({ message: "There are currently no orders!" });

  res.status(200).json(orders);
});
