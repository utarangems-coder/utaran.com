import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cron from "node-cron";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import userRoutes from "./routes/user.routes.js";
import cartRoutes from "./routes/cart.routes.js";

import { errorHandler } from "./middlewares/error.middleware.js";
import { cleanupExpiredReservations } from "./services/reservationCleanup.Job.js";

const app = express();

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman, curl
      if (origin === process.env.CLIENT_URL) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

cron.schedule("*/1 * * * *", async () => {
  try {
    await cleanupExpiredReservations();
  } catch (err) {
    console.error("Reservation cleanup failed", err);
  }
});

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/", productRoutes);
app.use("/api/", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);

app.use(errorHandler);

export default app;
