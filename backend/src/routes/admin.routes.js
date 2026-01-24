import express from "express";
import { getAdminSummary,getPaymentLogsByOrder } from "../controllers/admin.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/summary", protect, adminOnly, getAdminSummary);

router.get(
  "/payment-logs/:orderId",
  protect,
  adminOnly,
  getPaymentLogsByOrder
);

router.get(
  "/reservations",
  protect,
  adminOnly,
  getReservations
);

export default router;
