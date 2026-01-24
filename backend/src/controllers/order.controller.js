import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import { isValidObjectId } from "../utils/isValidObject.js";
import {asyncHandler} from "../utils/asyncHandler.js"; 

// export const createOrder = asyncHandler(async (req, res) => {
//   const { items } = req.body;

//   if (!items?.length) {
//     return res.status(400).json({ message: "No items in order" });
//   }

//   let totalAmount = 0;
//   const orderItems = [];

//   for (const item of items) {
//     if (!isValidObjectId(item.productId)) {
//       return res.status(400).json({ message: "Invalid product id" });
//     }

//     const product = await Product.findOneAndUpdate(
//       {
//         _id: item.productId,
//         isActive: true,
//         quantity: { $gte: item.quantity },
//       },
//       { $inc: { quantity: -item.quantity } }, 
//       { new: true }
//     );

//     if (!product) {
//       return res.status(400).json({ message: "Product out of stock" });
//     }

//     totalAmount += product.price * item.quantity;

//     orderItems.push({
//       product: product._id,
//       title: product.title,
//       price: product.price,
//       quantity: item.quantity,
//     });
//   }

//   const order = await Order.create({
//     user: req.user.id,
//     items: orderItems,
//     totalAmount,
//   });

//   res.status(201).json(order);
// });

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort("-createdAt");
  res.json(orders);
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    userId,
    paymentStatus,
    fulfillmentStatus,
  } = req.query;

  const query = {};

  if (userId) query.user = userId;
  if (paymentStatus) query.paymentStatus = paymentStatus;
  if (fulfillmentStatus) query.fulfillmentStatus = fulfillmentStatus;

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate("user", "email")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(query),
  ]);

  res.json({
    data: orders,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(order);
});

export const getOrdersByUser = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.userId }).sort(
    "-createdAt"
  );

  res.json(orders);
});

// export const cancelOrder = asyncHandler(async (req, res) => {
//   const order = await Order.findOne({
//     _id: req.params.id,
//     user: req.user.id,
//   });

//   if (!order) {
//     return res.status(404).json({ message: "Order not found" });
//   }

//   if (order.paymentStatus === "PAID") {
//     return res.status(400).json({ message: "Cannot cancel paid order" });
//   }

//   if (order.fulfillmentStatus !== "PENDING") {
//     return res.status(400).json({ message: "Order cannot be cancelled" });
//   }

//   for (const item of order.items) {
//     await Product.findByIdAndUpdate(item.product, {
//       $inc: { quantity: item.quantity },
//     });
//   }

//   order.fulfillmentStatus = "CANCELLED";
//   await order.save();

//   res.json({ message: "Order cancelled successfully" });
// });
