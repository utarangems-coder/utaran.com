import Payment from "../models/Payment.model.js";
import Order from "../models/Order.model.js";
import { razorpay } from "../services/payment.service.js";

export const createPayment = async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.paymentStatus !== "PENDING") {
    return res.status(400).json({ message: "Order already paid or refunded" });
  }

  const existingPayment = await Payment.findOne({
    order: order._id,
    status: { $in: ["INITIATED", "PROCESSING"] },
  });

  if (existingPayment) {
    // Idempotent response
    return res.json({
      razorpayOrderId: existingPayment.providerOrderId,
      amount: order.totalAmount * 100,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  }

  const payment = await Payment.create({
    order: order._id,
    user: req.user.id,
    provider: "RAZORPAY",
    amount: order.totalAmount,
    status: "PROCESSING",
  });

  const razorpayOrder = await razorpay.orders.create({
    amount: order.totalAmount * 100,
    currency: "INR",
    receipt: payment._id.toString(), 
  });

  payment.providerOrderId = razorpayOrder.id;
  await payment.save();

  res.json({
    key: process.env.RAZORPAY_KEY_ID,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  });
};

export const refundPayment = async (req, res) => {
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
      }
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
};