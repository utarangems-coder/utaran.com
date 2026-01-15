import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import User from "../models/User.Model.js";
import PaymentLog from "../models/PaymentLog.model.js";

export const getAdminSummary = async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments({ role: "user" });
  const totalProducts = await Product.countDocuments({ isActive: true });

  res.json({
    totalOrders,
    totalUsers,
    totalProducts,
  });
};

export const getPaymentLogsByOrder = async (req, res) => {
  const logs = await PaymentLog.find({
    order: req.params.orderId,
  }).sort("createdAt");

  res.json(logs);
};

