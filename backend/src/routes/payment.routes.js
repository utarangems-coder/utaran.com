import express from "express";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import { createPayment, refundPayment } from "../controllers/payment.controller.js";
import { razorpayWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

router.post("/webhook", razorpayWebhook);
router.post("/create", protect, createPayment);
router.post("/refund", protect, adminOnly, refundPayment);

export default router;
