const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/Product");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");
const Product = require("../models/Product");
const amqp = require("amqplib");
const amqpUrl = "amqp://localhost:5672";

exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, description, price } = req.body;

  if (!name || !price)
    return next(new AppError("Please fill All the required fields!", 400));

  const product = await Product.create({
    name,
    description,
    price,
  });

  res.status(201).json(product);
});

exports.buyProducts = catchAsync(async (req, res, next) => {
  let order;
  const { ids } = req.body;
  const products = await Product.find({ _id: { $in: ids } });

  if (!products.length)
    return next(new AppError("Please select at least 1 product to buy!", 400));

  const connection = await amqp.connect(amqpUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue("PRODUCT");

  channel.sendToQueue(
    "ORDER",
    Buffer.from(JSON.stringify({ products, user: req.user }))
  );

  channel.consume("PRODUCT", async (data) => {
    console.log("Consuming PRODUCT queue");
    order = JSON.parse(data.content);
    await channel.ack(data);
  });

  res.status(200).json({ message: "Products purchased successfully!", order });
});
