import User from '../models/userModel.js';
import Category from '../models/categoryModel.js';
import Bookmark from '../models/bookmarkModel.js';
import Stats from '../models/statsModel.js';

const getDateRanges = (range) => {
  const now = new Date();
  let startDate, previousStartDate, endDate;

  switch (range) {
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
      previousStartDate = new Date(startDate);
      previousStartDate.setDate(previousStartDate.getDate() - 7);
      endDate = new Date(now);
      break;

    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;

    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      break;

    default:
      startDate = new Date(0);
      previousStartDate = new Date(0);
      endDate = new Date();
  }

  startDate.setHours(0, 0, 0, 0);
  previousStartDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, previousStartDate, endDate };
};

const aggregateHistoricalStats = async (startDate, endDate, interval = 'day') => {
  try {
    const adjustedStartDate = new Date(startDate);
    adjustedStartDate.setHours(0, 0, 0, 0);

    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);

    // First, get all data up to the end date for cumulative counts
    const userPipeline = [
      {
        $match: {
          joinedAt: { $lte: adjustedEndDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$joinedAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ];

    const regularPipeline = [
      {
        $match: {
          createdAt: { $lte: adjustedEndDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ];

    const [userStats, bookmarkStats, categoryStats] = await Promise.all([
      User.aggregate(userPipeline),
      Bookmark.aggregate(regularPipeline),
      Category.aggregate(regularPipeline)
    ]);

    // Generate date range
    const dates = [];
    let currentDate = new Date(adjustedStartDate);
    while (currentDate <= adjustedEndDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Process cumulative counts
    let cumulativeUsers = 0;
    let cumulativeBookmarks = 0;
    let cumulativeCategories = 0;

    const processedStats = new Map();

    // Initialize all dates with 0
    dates.forEach(date => {
      const dateKey = date.toISOString().split('T')[0];
      processedStats.set(dateKey, {
        date: new Date(date),
        users: 0,
        bookmarks: 0,
        categories: 0
      });
    });

    // Process all stats types with cumulative counts
    const processCumulativeStats = (stats, key, cumulativeCount) => {
      stats.forEach(stat => {
        const dateKey = stat._id;
        cumulativeCount += stat.count;

        if (processedStats.has(dateKey)) {
          processedStats.get(dateKey)[key] = cumulativeCount;
        }

        // Propagate cumulative count to future dates
        dates.forEach(date => {
          const currentKey = date.toISOString().split('T')[0];
          if (currentKey > dateKey && processedStats.has(currentKey)) {
            processedStats.get(currentKey)[key] = cumulativeCount;
          }
        });
      });
    };

    // Process each type of stat
    processCumulativeStats(userStats, 'users', 0);
    processCumulativeStats(bookmarkStats, 'bookmarks', 0);
    processCumulativeStats(categoryStats, 'categories', 0);

    // Convert to array and adjust timezone
    const result = Array.from(processedStats.values())
      .sort((a, b) => a.date - b.date)
      .map(stat => ({
        ...stat,
        date: new Date(stat.date.getTime() - stat.date.getTimezoneOffset() * 60000)
      }));

    return result;

  } catch (error) {
    console.error('Error in aggregateHistoricalStats:', error);
    throw error;
  }
};

export const getHistoricalStats = async (req, res) => {
  try {
    const { type = 'daily' } = req.params;
    let { period = 30 } = req.query;

    period = parseInt(period, 10);

    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);

    switch (type) {
      case 'daily':
        startDate.setDate(now.getDate() - (period - 1));
        break;
      case 'weekly':
        startDate.setDate(now.getDate() - (period - 1));
        break;
      case 'monthly':
        startDate.setMonth(now.getMonth() - period + 1);
        startDate.setDate(1);
        break;
      default:
        startDate.setDate(now.getDate() - (period - 1));
    }

    now.setHours(23, 59, 59, 999);

    const stats = await aggregateHistoricalStats(startDate, now, type);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Historical stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch historical statistics',
      error: error.message
    });
  }
};

export const getPublicStats = async (req, res) => {
  try {
    const { range = 'month' } = req.query;
    const { startDate, previousStartDate, endDate } = getDateRanges(range);

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
      User.find()
        .select('username email joinedAt -_id')
        .sort({ joinedAt: -1 })
        .limit(6),
      Promise.all([
        User.countDocuments({
          joinedAt: {
            $gte: startDate,
            $lte: endDate
          }
        }),
        Category.countDocuments({
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        }),
        Bookmark.countDocuments({
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        })
      ]),
      Promise.all([
        User.countDocuments({
          joinedAt: {
            $gte: previousStartDate,
            $lt: startDate
          }
        }),
        Category.countDocuments({
          createdAt: {
            $gte: previousStartDate,
            $lt: startDate
          }
        }),
        Bookmark.countDocuments({
          createdAt: {
            $gte: previousStartDate,
            $lt: startDate
          }
        })
      ])
    ]);

    const calculateGrowth = (current, previous, range) => {
      if (range === 'year') {
        return current > 0 ? 100 : 0;
      }
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }
      const growth = ((current - previous) / previous * 100);
      return parseFloat(growth.toFixed(1));
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
        users: calculateGrowth(currentUsers, previousUsers, range),
        categories: calculateGrowth(currentCategories, previousCategories, range),
        bookmarks: calculateGrowth(currentBookmarks, previousBookmarks, range)
      }
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

// Stats tracking functions remain unchanged
export const trackDailyStats = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [users, categories, bookmarks] = await Promise.all([
      User.countDocuments(),
      Category.countDocuments(),
      Bookmark.countDocuments()
    ]);

    await Stats.findOneAndUpdate(
      {
        type: 'daily',
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      },
      {
        type: 'daily',
        date: new Date(),
        users,
        categories,
        bookmarks
      },
      { upsert: true, new: true }
    );

    return true;
  } catch (error) {
    console.error('Error tracking daily stats:', error);
    return false;
  }
};

export const trackWeeklyStats = async () => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [users, categories, bookmarks] = await Promise.all([
      User.countDocuments(),
      Category.countDocuments(),
      Bookmark.countDocuments()
    ]);

    await Stats.findOneAndUpdate(
      {
        type: 'weekly',
        date: {
          $gte: startOfWeek,
          $lt: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
        }
      },
      {
        type: 'weekly',
        date: new Date(),
        users,
        categories,
        bookmarks
      },
      { upsert: true, new: true }
    );

    return true;
  } catch (error) {
    console.error('Error tracking weekly stats:', error);
    return false;
  }
};

export const trackMonthlyStats = async () => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [users, categories, bookmarks] = await Promise.all([
      User.countDocuments(),
      Category.countDocuments(),
      Bookmark.countDocuments()
    ]);

    await Stats.findOneAndUpdate(
      {
        type: 'monthly',
        date: {
          $gte: startOfMonth,
          $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
        }
      },
      {
        type: 'monthly',
        date: new Date(),
        users,
        categories,
        bookmarks
      },
      { upsert: true, new: true }
    );

    return true;
  } catch (error) {
    console.error('Error tracking monthly stats:', error);
    return false;
  }
};