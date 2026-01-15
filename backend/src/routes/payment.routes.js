import express from "express";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";
import { createPayment, refundPayment } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create", protect, createPayment);
router.post("/refund", protect, adminOnly, refundPayment);

export default router;
