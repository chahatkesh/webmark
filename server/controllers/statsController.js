import User from '../models/userModel.js';
import Category from '../models/categoryModel.js';
import Bookmark from '../models/bookmarkModel.js';
import Stats from '../models/statsModel.js';

export const getPublicStats = async (req, res) => {
  try {
    const { range = 'month' } = req.query;
    const now = new Date();

    // Calculate date ranges based on the requested range
    let startDate, previousStartDate;
    switch (range) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
        break;
      default:
        startDate = new Date(0); // Beginning of time
        previousStartDate = new Date(0);
    }

    // Get current period counts
    const [
      totalUsers,
      totalCategories,
      totalBookmarks,
      recentUsers,
      currentPeriodStats,
      previousPeriodStats
    ] = await Promise.all([
      User.countDocuments(),
      Category.countDocuments(),
      Bookmark.countDocuments(),
      User.find({})
        .select('username email joinedAt -_id')
        .sort({ joinedAt: -1 })
        .limit(6),
      Promise.all([
        User.countDocuments({ createdAt: { $gte: startDate } }),
        Category.countDocuments({ createdAt: { $gte: startDate } }),
        Bookmark.countDocuments({ createdAt: { $gte: startDate } })
      ]),
      Promise.all([
        User.countDocuments({
          createdAt: { $gte: previousStartDate, $lt: startDate }
        }),
        Category.countDocuments({
          createdAt: { $gte: previousStartDate, $lt: startDate }
        }),
        Bookmark.countDocuments({
          createdAt: { $gte: previousStartDate, $lt: startDate }
        })
      ])
    ]);

    // Calculate growth percentages
    const calculateGrowth = (current, previous) => {
      if (!previous) return 0;
      return ((current - previous) / previous * 100).toFixed(1);
    };

    const [currentUsers, currentCategories, currentBookmarks] = currentPeriodStats;
    const [previousUsers, previousCategories, previousBookmarks] = previousPeriodStats;

    const stats = {
      success: true,
      totalUsers,
      totalCategories,
      totalBookmarks,
      recentUsers,
      currentPeriod: {
        users: currentUsers,
        categories: currentCategories,
        bookmarks: currentBookmarks
      },
      previousPeriod: {
        users: previousUsers,
        categories: previousCategories,
        bookmarks: previousBookmarks
      },
      growth: {
        users: calculateGrowth(currentUsers, previousUsers),
        categories: calculateGrowth(currentCategories, previousCategories),
        bookmarks: calculateGrowth(currentBookmarks, previousBookmarks)
      }
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

export const getHistoricalStats = async (req, res) => {
  try {
    const { type = 'daily' } = req.params;
    const { period = 30 } = req.query; // Default to 30 days/weeks/months

    // Calculate start date based on period
    const now = new Date();
    let startDate;

    switch (type) {
      case 'daily':
        startDate = new Date(now.setDate(now.getDate() - period));
        break;
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - (period * 7)));
        break;
      case 'monthly':
        startDate = new Date(now.setMonth(now.getMonth() - period));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 30));
    }

    const stats = await Stats.find({
      type,
      date: { $gte: startDate }
    })
      .sort({ date: 1 })
      .select('-_id -__v');

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Historical stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch historical statistics'
    });
  }
};

// Track daily stats
export const trackDailyStats = async () => {
  try {
    const [users, categories, bookmarks] = await Promise.all([
      User.countDocuments(),
      Category.countDocuments(),
      Bookmark.countDocuments()
    ]);

    await Stats.create({
      type: 'daily',
      date: new Date(),
      users,
      categories,
      bookmarks
    });

    return true;
  } catch (error) {
    console.error('Error tracking daily stats:', error);
    return false;
  }
};

// Track weekly stats
export const trackWeeklyStats = async () => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    const [users, categories, bookmarks] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Category.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Bookmark.countDocuments({ createdAt: { $gte: startOfWeek } })
    ]);

    await Stats.create({
      type: 'weekly',
      date: new Date(),
      users,
      categories,
      bookmarks
    });

    return true;
  } catch (error) {
    console.error('Error tracking weekly stats:', error);
    return false;
  }
};

// Track monthly stats
export const trackMonthlyStats = async () => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [users, categories, bookmarks] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Category.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Bookmark.countDocuments({ createdAt: { $gte: startOfMonth } })
    ]);

    await Stats.create({
      type: 'monthly',
      date: new Date(),
      users,
      categories,
      bookmarks
    });

    return true;
  } catch (error) {
    console.error('Error tracking monthly stats:', error);
    return false;
  }
};