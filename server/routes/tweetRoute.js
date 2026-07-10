import express from 'express';
import { getTweet } from '../controllers/tweetController.js';

const router = express.Router();

router.get('/:id', getTweet);

export default router;
