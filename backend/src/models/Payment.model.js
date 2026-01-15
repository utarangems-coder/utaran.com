import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    provider: {
      type: String,
      enum: ["RAZORPAY"],
      required: true,
    },

    /** Razorpay order_id */
    providerOrderId: {
      type: String,
      index: true,
    },

    /** Razorpay payment_id (after success) */
    providerPaymentId: {
      type: String,
      index: true,
    },

    amount: {
      type: Number,
      required: true, // rupees
    },

    refundedAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "INITIATED",
        "PROCESSING",
        "SUCCESS",
        "FAILED",
        "PARTIALLY_REFUNDED",
        "REFUNDED",
        "DISPUTED",
      ],
      default: "INITIATED",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
