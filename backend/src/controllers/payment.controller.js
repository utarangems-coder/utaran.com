import Payment from "../models/Payment.model.js";
import Order from "../models/Order.model.js";
import User from "../models/User.model.js";
import Refund from "../models/Refund.model.js";
import { razorpay } from "../services/payment.service.js";
import { logPaymentEvent } from "../services/paymentAudit.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPayment = asyncHandler(async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ message: "Payments not enabled" });
  }

  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.quantity < quantity) {
    return res.status(400).json({ message: "Insufficient stock" });
  }

  const amount = product.price * quantity;

  // Create Payment (NO ORDER YET)
  const payment = await Payment.create({
    user: req.user.id,
    provider: "RAZORPAY",
    amount,
    status: "PROCESSING",
  });

  const razorpayOrder = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: payment._id.toString(),
    notes: {
      productId: product._id.toString(),
      quantity: quantity.toString(),
      userId: req.user.id.toString(),
    },
  });

  payment.providerOrderId = razorpayOrder.id;
  await payment.save();

  await logPaymentEvent({
    order: null,
    user: req.user.id,
    eventType: "PAYMENT_INTENT_CREATED",
    providerRef: razorpayOrder.id,
    amount,
  });

  res.json({
    key: process.env.RAZORPAY_KEY_ID,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  });
});

export const refundPayment = asyncHandler(async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ message: "Payments not enabled" });
  }
  const { paymentId, amount } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  if (!["SUCCESS", "PARTIALLY_REFUNDED"].includes(payment.status)) {
    return res.status(400).json({ message: "Payment not refundable" });
  }

  const refundableAmount = payment.amount - payment.refundedAmount;

  if (amount <= 0 || amount > refundableAmount) {
    return res.status(400).json({
      message: `Invalid refund amount. Max refundable: ₹${refundableAmount}`,
    });
  }

  const refund = await Refund.create({
    payment: payment._id,
    amount,
    status: "REQUESTED",
  });

  try {
    const razorpayRefund = await razorpay.payments.refund(
      payment.providerPaymentId,
      {
        amount: amount * 100,
      },
    );

    refund.providerRefundId = razorpayRefund.id;
    refund.status = "PROCESSING";
    await refund.save();

    await logPaymentEvent({
      order: payment.order,
      user: payment.user,
      eventType: "REFUND_REQUESTED",
      providerRef: razorpayRefund.id,
      amount,
      metadata: razorpayRefund,
    });

    res.json({
      message: "Refund initiated successfully",
      refundId: refund._id,
    });
  } catch (err) {
    refund.status = "FAILED";
    await refund.save();

    await logPaymentEvent({
      order: payment.order,
      user: payment.user,
      eventType: "REFUND_FAILED",
      amount,
      metadata: err,
    });

    throw err;
  }
});
