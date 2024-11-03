import cron from 'node-cron';
import {
  trackDailyStats,
  trackWeeklyStats,
  trackMonthlyStats
} from '../controllers/statsController.js';

export const initializeCronJobs = async () => {
  // Helper function to handle errors
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

  // Run daily at midnight and also run immediately when server starts
  const runDailyStats = async () => {
    console.log('Running daily stats tracking...');
    await executeWithRetry(trackDailyStats);
  };

  // Run weekly on Sunday at midnight and also run immediately when server starts
  const runWeeklyStats = async () => {
    console.log('Running weekly stats tracking...');
    await executeWithRetry(trackWeeklyStats);
  };

  // Run monthly on the 1st at midnight and also run immediately when server starts
  const runMonthlyStats = async () => {
    console.log('Running monthly stats tracking...');
    await executeWithRetry(trackMonthlyStats);
  };

  // Schedule the jobs
  cron.schedule('0 0 * * *', runDailyStats);
  cron.schedule('0 0 * * 0', runWeeklyStats);
  cron.schedule('0 0 1 * *', runMonthlyStats);

  try {
    // Run all jobs immediately when server starts
    await Promise.all([
      runDailyStats(),
      runWeeklyStats(),
      runMonthlyStats()
    ]);
    console.log('Initial stats collection completed successfully');
  } catch (error) {
    console.error('Error during initial stats collection:', error);
  }

  console.log('Cron jobs initialized');
};