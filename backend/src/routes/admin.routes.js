import express from "express";
import { getAdminSummary } from "../controllers/admin.controller.js";
import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/summary", protect, adminOnly, getAdminSummary);

router.get(
  "/payment-logs/:orderId",
  protect,
  adminOnly,
  getPaymentLogsByOrder
);


export default router;
