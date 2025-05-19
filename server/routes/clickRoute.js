import express from 'express';
import authMiddleware from '../middleware/authmiddleware.js';
import { trackBookmarkClick, getUserClickStats } from '../controllers/clickController.js';

const router = express.Router();

// Track a bookmark click
router.post('/track', authMiddleware, trackBookmarkClick);

// Get click statistics
router.post('/stats', authMiddleware, getUserClickStats);

export default router;
