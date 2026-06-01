import express from "express";
import { runStatsCollection } from "../utils/cronJobs.js";

const router = express.Router();

const verifyCronRequest = (req, res, next) => {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    if (process.env.NODE_ENV === "production") {
      return res.status(500).json({
        success: false,
        message: "CRON_SECRET is not configured",
      });
    }
    return next();
  }

  const expected = `Bearer ${cronSecret}`;
  if (req.headers.authorization !== expected) {
    return res.status(401).json({ success: false, message: "Unauthorized cron request" });
  }

  return next();
};

router.get("/stats", verifyCronRequest, async (_req, res) => {
  try {
    await runStatsCollection();
    return res.json({ success: true, message: "Stats collection completed" });
  } catch (error) {
    console.error("Cron stats collection failed:", error);
    return res.status(500).json({
      success: false,
      message: "Stats collection failed",
    });
  }
});

export default router;
