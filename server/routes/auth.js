import express from "express";

const router = express.Router();

import { requireSignin } from "../middlewares";

import {
  login,
  register,
  logout,
  currentUser,
  SendTestEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser);
router.get("/send-email", SendTestEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
