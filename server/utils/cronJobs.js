import cron from "node-cron";
import {
  trackDailyStats,
  trackWeeklyStats,
  trackMonthlyStats,
} from "../controllers/statsController.js";

const executeWithRetry = async (job, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await job();
      return true;
    } catch (error) {
      console.error(`Failed attempt ${i + 1}/${retries}:`, error);
      if (i === retries - 1) throw error;
    }
  }
};

export const runStatsCollection = async () => {
  console.log("Running stats collection...");
  await Promise.all([
    executeWithRetry(trackDailyStats),
    executeWithRetry(trackWeeklyStats),
    executeWithRetry(trackMonthlyStats),
  ]);
  console.log("Stats collection completed successfully");
};

export const initializeCronJobs = async () => {
  // Run daily at midnight and also run immediately when server starts
  const runDailyStats = async () => {
    console.log("Running daily stats tracking...");
    await executeWithRetry(trackDailyStats);
  };

  // Run weekly on Sunday at midnight and also run immediately when server starts
  const runWeeklyStats = async () => {
    console.log("Running weekly stats tracking...");
    await executeWithRetry(trackWeeklyStats);
  };

  // Run monthly on the 1st at midnight and also run immediately when server starts
  const runMonthlyStats = async () => {
    console.log("Running monthly stats tracking...");
    await executeWithRetry(trackMonthlyStats);
  };

  // Schedule the jobs
  cron.schedule("0 0 * * *", runDailyStats);
  cron.schedule("0 0 * * 0", runWeeklyStats);
  cron.schedule("0 0 1 * *", runMonthlyStats);

  if (process.env.RUN_CRON_ON_STARTUP === "true") {
    try {
      await runStatsCollection();
    } catch (error) {
      console.error("Error during initial stats collection:", error);
    }
  }

  console.log("Cron jobs initialized");
};
