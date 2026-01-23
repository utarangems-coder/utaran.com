import Payment from "../models/Payment.model.js";
import Order from "../models/Order.model.js";
import Refund from "../models/Refund.model.js";
import { razorpay } from "../services/payment.service.js";
import { logPaymentEvent } from "../services/paymentAudit.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPayment = asyncHandler(async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ message: "Payments not enabled" });
  }

  if (req.user.role === "admin") {
    return res.status(403).json({ message: "Admins cannot place orders" });
  }

  const user = await User.findById(req.user.id).populate("cart.product");

  if (!user.cart || user.cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  let totalAmount = 0;

  for (const item of user.cart) {
    if (!item.product || !item.product.isActive) {
      return res.status(400).json({ message: "Invalid product in cart" });
    }

    if (item.product.quantity < item.quantity) {
      return res.status(400).json({
        message: `${item.product.title} is out of stock`,
      });
    }

    totalAmount += item.product.price * item.quantity;
  }

  // Idempotency: reuse existing processing payment
  const existingPayment = await Payment.findOne({
    user: user._id,
    status: { $in: ["INITIATED", "PROCESSING"] },
  });

  if (existingPayment) {
    return res.json({
      razorpayOrderId: existingPayment.providerOrderId,
      amount: totalAmount * 100,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  }

  const payment = await Payment.create({
    user: user._id,
    provider: "RAZORPAY",
    amount: totalAmount,
    status: "PROCESSING",
  });

  const razorpayOrder = await razorpay.orders.create({
    amount: totalAmount * 100,
    currency: "INR",
    receipt: payment._id.toString(),
  });

  payment.providerOrderId = razorpayOrder.id;
  await payment.save();

  await logPaymentEvent({
    order: null,
    user: user._id,
    eventType: "PAYMENT_INITIATED",
    amount: totalAmount,
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
