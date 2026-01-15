import express from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  restoreProduct,
} from "../controllers/product.controller.js";

import { protect, adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* Public */
router.get("/products", getAllProducts);

/* Admin */
router.post("/admin/products", protect, adminOnly, createProduct);
router.put("/admin/products/:id", protect, adminOnly, updateProduct);
router.delete("/admin/products/:id", protect, adminOnly, deleteProduct);
router.patch("/admin/products/:id/restore", protect, adminOnly, restoreProduct);

export default router;
