import User from '../models/userModel.js';
import Bookmark from '../models/bookmarkModel.js';
import Category from '../models/categoryModel.js';

// Average time saved per click (in seconds)
const AVERAGE_TIME_SAVED_PER_CLICK = 10;

// Track a bookmark click
export const trackBookmarkClick = async (req, res) => {
  try {
    const { bookmarkId } = req.body;
    const userId = req.body.userId;
    const deviceId = req.headers['device-id'] || 'unknown';

    // Find the bookmark
    const bookmark = await Bookmark.findById(bookmarkId);
    if (!bookmark) {
      return res.json({ success: false, message: 'Bookmark not found' });
    }

    // Get the category to verify user access
    const category = await Category.findOne({
      _id: bookmark.categoryId,
      userId
    });

    if (!category) {
      return res.json({ success: false, message: 'Access denied to this bookmark' });
    }

    // Update bookmark click stats
    const now = new Date();
    bookmark.clickCount = (bookmark.clickCount || 0) + 1;
    bookmark.lastClicked = now;
    bookmark.clickHistory.push({ timestamp: now, deviceId });

    // Keep clickHistory from growing too large (keep last 50 entries)
    if (bookmark.clickHistory.length > 50) {
      bookmark.clickHistory = bookmark.clickHistory.slice(-50);
    }

    await bookmark.save();

    // Update user stats
    const user = await User.findById(userId);
    if (user) {
      // Initialize stats object if it doesn't exist
      if (!user.stats) {
        user.stats = {
          totalClicks: 0,
          timeSaved: 0
        };
      }

      user.stats.totalClicks = (user.stats.totalClicks || 0) + 1;
      user.stats.timeSaved = (user.stats.timeSaved || 0) + AVERAGE_TIME_SAVED_PER_CLICK;
      user.stats.lastClickedBookmark = {
        timestamp: now,
        bookmarkId: bookmark._id,
        name: bookmark.name
      };

      await user.save();
    }

    res.json({
      success: true,
      clickCount: bookmark.clickCount,
      totalClicks: user?.stats?.totalClicks || 0,
      timeSaved: user?.stats?.timeSaved || 0
    });
  } catch (error) {
    console.error('Error tracking bookmark click:', error);
    res.json({ success: false, message: 'Error tracking bookmark click' });
  }
};

// Get click statistics for a user
export const getUserClickStats = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const categories = await Category.find({ userId: user._id }).select('_id').lean();
    const categoryIds = categories.map((category) => category._id);

    if (categoryIds.length === 0) {
      return res.json({
        success: true,
        stats: {
          totalClicks: user.stats?.totalClicks || 0,
          timeSaved: user.stats?.timeSaved || 0,
          topBookmarks: [],
          lastClickedBookmark: user.stats?.lastClickedBookmark || null,
        },
      });
    }

    const [topBookmarks, bookmarkTotalClicks] = await Promise.all([
      Bookmark.find({ categoryId: { $in: categoryIds }, clickCount: { $gt: 0 } })
        .select('name link logo clickCount lastClicked')
        .sort({ clickCount: -1 })
        .limit(5)
        .lean(),
      Bookmark.aggregate([
        { $match: { categoryId: { $in: categoryIds } } },
        { $group: { _id: null, total: { $sum: { $ifNull: ['$clickCount', 0] } } } },
      ]),
    ]);

    const aggregatedClicks = bookmarkTotalClicks[0]?.total || 0;
    const totalClicks = user.stats?.totalClicks || aggregatedClicks;
    const timeSaved = user.stats?.timeSaved || aggregatedClicks * AVERAGE_TIME_SAVED_PER_CLICK;

    res.json({
      success: true,
      stats: {
        totalClicks,
        timeSaved,
        topBookmarks: topBookmarks.map((bookmark) => ({
          id: bookmark._id,
          name: bookmark.name,
          link: bookmark.link,
          logo: bookmark.logo,
          clickCount: bookmark.clickCount || 0,
          lastClicked: bookmark.lastClicked,
        })),
        lastClickedBookmark: user.stats?.lastClickedBookmark,
      },
    });
  } catch (error) {
    console.error('Error getting click statistics:', error);
    res.json({ success: false, message: 'Error retrieving click statistics' });
  }
};
