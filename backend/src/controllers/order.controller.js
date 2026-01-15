import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";

export const createOrder = async (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items in order" });
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product || !product.isActive) {
      return res.status(400).json({ message: "Invalid product" });
    }

    if (product.quantity < item.quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    totalAmount += product.price * item.quantity;

    orderItems.push({
      product: product._id,
      title: product.title,
      price: product.price,
      quantity: item.quantity,
    });
  }

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    totalAmount,
  });

  res.status(201).json(order);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort("-createdAt");
  res.json(orders);
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "email")
    .sort("-createdAt");

  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(order);
};

export const getOrdersByUser = async (req, res) => {
  const orders = await Order.find({ user: req.params.userId }).sort(
    "-createdAt"
  );

  res.json(orders);
};

export const cancelOrder = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status !== "PENDING") {
    return res.status(400).json({ message: "Order cannot be cancelled now" });
  }

  order.status = "CANCELLED";
  await order.save();

  res.json({ message: "Order cancelled successfully" });
};