import { fetchTweetById } from "../utils/tweetFetcher.js";

const tweetCache = new Map();
const TWEET_CACHE_TTL_MS = 60 * 60 * 1000;

export const getTweet = async (req, res) => {
  try {
    const { id } = req.params;
    const cached = tweetCache.get(id);

    if (cached && Date.now() - cached.timestamp < TWEET_CACHE_TTL_MS) {
      return res.json({ success: true, data: cached.data });
    }

    const data = await fetchTweetById(id);
    tweetCache.set(id, { data, timestamp: Date.now() });

    return res.json({ success: true, data });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to fetch tweet",
    });
  }
};
