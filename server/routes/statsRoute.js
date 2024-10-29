import express from 'express';
import {
  getPublicStats,
  getHistoricalStats
} from '../controllers/statsController.js';

const router = express.Router();

// Get current stats with optional time range
router.get('/public', getPublicStats);

// Get historical stats with type parameter (daily/weekly/monthly)
router.get('/historical/:type', getHistoricalStats);

export default router;