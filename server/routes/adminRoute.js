import express from "express";
import {
  getAdminDashboard,
  getAdminSession,
  loginAdmin,
  logoutAdmin,
} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  adminApiRateLimit,
  adminLoginRateLimit,
} from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/login", adminLoginRateLimit, loginAdmin);
router.post("/logout", adminAuth, logoutAdmin);
router.get("/session", adminApiRateLimit, adminAuth, getAdminSession);
router.get("/dashboard", adminApiRateLimit, adminAuth, getAdminDashboard);

export default router;
