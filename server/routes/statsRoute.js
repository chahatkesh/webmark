import express from "express";
import {
  getPublicStats,
  getHistoricalStats,
} from "../controllers/statsController.js";
import { publicStatsRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

router.get("/public", publicStatsRateLimit, getPublicStats);
router.get("/historical/:type", publicStatsRateLimit, getHistoricalStats);

export default router;
