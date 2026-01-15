import express from "express";
import { login, logout, refreshAccessToken, register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/refresh", refreshAccessToken);

export default router;
