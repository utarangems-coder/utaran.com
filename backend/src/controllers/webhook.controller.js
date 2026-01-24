import crypto from "crypto";
import Payment from "../models/Payment.model.js";
import Order from "../models/Order.model.js";
import Refund from "../models/Refund.model.js";
import Product from "../models/Product.model.js";
import { logPaymentEvent } from "../services/paymentAudit.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.model.js";

export const razorpayWebhook = asyncHandler(async (req, res) => {
  let event;

  try {
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).send("Invalid signature");
    }

    event = JSON.parse(req.body.toString());
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return res.status(400).send("Bad request");
  }

  try {
    if (event.event === "payment.captured") {
      const entity = event.payload.payment.entity;

      const payment = await Payment.findOne({
        providerOrderId: entity.order_id,
      });

      if (!payment || payment.status === "SUCCESS") {
        return res.json({ ok: true });
      }

      payment.providerPaymentId = entity.id;
      payment.status = "SUCCESS";
      await payment.save();

      const user = await User.findById(payment.user);
      if (!user) return res.json({ ok: true });

      const { productId, quantity } = entity.notes;

      const product = await Product.findOneAndUpdate(
        {
          _id: productId,
          quantity: { $gte: quantity },
        },
        { $inc: { quantity: -quantity } },
        { new: true },
      );

      if (!product) {
        await logPaymentEvent({
          order: null,
          user: user._id,
          eventType: "PAYMENT_FAILED",
          providerRef: entity.id,
          metadata: "Inventory mismatch",
        });
        return res.json({ ok: true });
      }

      const order = await Order.create({
        user: user._id,
        items: [
          {
            product: product._id,
            title: product.title,
            price: product.price,
            quantity,
          },
        ],
        totalAmount: payment.amount,
        paymentStatus: "PAID",
      });

      payment.order = order._id;
      await payment.save();

      await logPaymentEvent({
        order: order._id,
        user: user._id,
        eventType: "PAYMENT_SUCCESS",
        providerRef: entity.id,
        amount: payment.amount,
      });

      res.json({ ok: true });
    }

    if (event.event === "payment.failed") {
      const entity = event.payload.payment.entity;

      const payment = await Payment.findOne({
        providerOrderId: entity.order_id,
      });

      if (!payment) return res.json({ ok: true });

      if (payment.status !== "FAILED") {
        payment.status = "FAILED";
        await payment.save();
      }

      await logPaymentEvent({
        order: payment.order,
        user: payment.user,
        eventType: "PAYMENT_FAILED",
        providerRef: entity.id,
        metadata: entity,
      });

      // const order = await Order.findById(payment.order);
      // if (order && order.fulfillmentStatus === "PENDING") {
      //   for (const item of order.items) {
      //     await Product.findByIdAndUpdate(item.product, {
      //       $inc: { quantity: item.quantity },
      //     });
      //   }
      // }
    }

    if (event.event === "refund.processed") {
      const entity = event.payload.refund.entity;

      const refund = await Refund.findOne({
        providerRefundId: entity.id,
      });

      if (!refund) return res.json({ ok: true });

      if (refund.status !== "COMPLETED") {
        refund.status = "COMPLETED";
        await refund.save();

        const payment = await Payment.findById(refund.payment);
        payment.refundedAmount += refund.amount;

        if (payment.refundedAmount < payment.amount) {
          payment.status = "PARTIALLY_REFUNDED";
        } else {
          payment.status = "REFUNDED";
        }

        await payment.save();

        const order = await Order.findById(payment.order);
        order.paymentStatus =
          payment.status === "REFUNDED" ? "REFUNDED" : "PARTIALLY_REFUNDED";

        await order.save();

        await logPaymentEvent({
          order: order._id,
          user: order.user,
          eventType: "REFUND_SUCCESS",
          providerRef: entity.id,
          amount: refund.amount,
          metadata: entity,
        });
      }
    }

    if (event.event === "dispute.created" || event.event === "dispute.closed") {
      await logPaymentEvent({
        order: null,
        eventType:
          event.event === "dispute.created"
            ? "DISPUTE_OPENED"
            : "DISPUTE_CLOSED",
        metadata: event.payload.dispute.entity,
      });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Webhook processing error", err);
    return res.json({ ok: true });
  }
});
