import cron from 'node-cron';
import {
  trackDailyStats,
  trackWeeklyStats,
  trackMonthlyStats
} from '../controllers/statsController.js';

export const initializeCronJobs = () => {
  // Run daily at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily stats tracking...');
    await trackDailyStats();
  });

  // Run weekly on Sunday at midnight (00:00)
  cron.schedule('0 0 * * 0', async () => {
    console.log('Running weekly stats tracking...');
    await trackWeeklyStats();
  });

  // Run monthly on the 1st at midnight (00:00)
  cron.schedule('0 0 1 * *', async () => {
    console.log('Running monthly stats tracking...');
    await trackMonthlyStats();
  });

  console.log('Cron jobs initialized');
};