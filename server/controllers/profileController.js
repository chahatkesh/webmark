import User from "../models/userModel.js";
import Bookmark from "../models/bookmarkModel.js";
import Category from "../models/categoryModel.js";
import { sanitizeImageUrl } from "../utils/urlValidation.js";
import {
  getActiveDevicesForResponse,
  persistDeviceActivity,
} from "../utils/deviceTracking.js";

const AVERAGE_TIME_SAVED_PER_CLICK = 10;

const getImportsRemainingThisMonth = (user) => {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
  if (user.importBonusMonthKey !== monthKey) return 2;
  return Math.max(0, 2 - (user.importBonusUsedThisMonth ?? 0));
};

const getClickStatsForUser = async (user, categoryIds) => {
  if (categoryIds.length === 0) {
    return {
      totalClicks: user.stats?.totalClicks || 0,
      timeSaved: user.stats?.timeSaved || 0,
      topBookmarks: [],
      lastClickedBookmark: user.stats?.lastClickedBookmark || null,
    };
  }

  const [topBookmarks, bookmarkTotalClicks] = await Promise.all([
    Bookmark.find({ categoryId: { $in: categoryIds }, clickCount: { $gt: 0 } })
      .select("name link logo clickCount lastClicked")
      .sort({ clickCount: -1 })
      .limit(5)
      .lean(),
    Bookmark.aggregate([
      { $match: { categoryId: { $in: categoryIds } } },
      {
        $group: { _id: null, total: { $sum: { $ifNull: ["$clickCount", 0] } } },
      },
    ]),
  ]);

  const aggregatedClicks = bookmarkTotalClicks[0]?.total || 0;
  const totalClicks = user.stats?.totalClicks || aggregatedClicks;
  const timeSaved =
    user.stats?.timeSaved || aggregatedClicks * AVERAGE_TIME_SAVED_PER_CLICK;

  return {
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
    lastClickedBookmark: user.stats?.lastClickedBookmark || null,
  };
};

// Get detailed profile information for the user
export const getProfileInfo = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userId = user._id;
    const userAgent = req.headers["user-agent"];
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const deviceIdHeader = req.headers["device-id"];

    const categories = await Category.find({ userId }).select("_id").lean();
    const categoryIds = categories.map((category) => category._id);

    const [bookmarkCount, clickStats, deviceInfo] = await Promise.all([
      categoryIds.length > 0
        ? Bookmark.countDocuments({ categoryId: { $in: categoryIds } })
        : Promise.resolve(0),
      getClickStatsForUser(user, categoryIds),
      Promise.resolve(
        getActiveDevicesForResponse(user, userAgent, ip, deviceIdHeader),
      ),
    ]);

    res.set("X-Device-ID", deviceInfo.deviceId);

    res.json({
      success: true,
      profile: {
        username: user.username,
        email: user.email,
        name: user.name || "",
        profilePicture: user.profilePicture || "",
        joinedAt: user.joinedAt,
        lastLogin: user.lastLogin || deviceInfo.currentLogin,
        lastLoginDevice: user.lastLoginDevice || userAgent,
        currentLoginDevice: userAgent,
        bookmarkCount,
        categoryCount: categories.length,
        activeDevices: deviceInfo.activeDevices,
        currentDeviceId: deviceInfo.currentDeviceId,
        totalActiveDevices: deviceInfo.totalActiveDevices,
        maxDevices: deviceInfo.maxDevices,
        aiSortsRemaining: user.aiSortsRemaining ?? 5,
        importsRemainingThisMonth: getImportsRemainingThisMonth(user),
      },
      clickStats,
    });

    persistDeviceActivity(userId, userAgent, ip, deviceIdHeader).catch(
      (error) => {
        console.error("Failed to persist device activity:", error);
      },
    );
  } catch (error) {
    console.error("Error fetching profile information:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile information",
    });
  }
};

const parseAnalyticsRange = (rangeParam) => {
  const range = rangeParam === "7d" ? "7d" : "30d";
  const days = range === "7d" ? 7 : 30;
  const startDate = new Date();
  startDate.setUTCHours(0, 0, 0, 0);
  startDate.setUTCDate(startDate.getUTCDate() - (days - 1));
  return { range, days, startDate };
};

const formatDateKey = (date) => date.toISOString().slice(0, 10);

const buildClicksOverTime = (startDate, days, aggregated) => {
  const clickMap = Object.fromEntries(
    aggregated.map((entry) => [entry._id, entry.clicks]),
  );
  const clicksOverTime = [];

  for (let i = 0; i < days; i += 1) {
    const date = new Date(startDate);
    date.setUTCDate(startDate.getUTCDate() + i);
    const key = formatDateKey(date);
    clicksOverTime.push({
      date: key,
      clicks: clickMap[key] || 0,
    });
  }

  return clicksOverTime;
};

// Per-user analytics for profile charts
export const getProfileAnalytics = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { range, days, startDate } = parseAnalyticsRange(req.query.range);
    const categories = await Category.find({ userId: user._id })
      .select("_id")
      .lean();
    const categoryIds = categories.map((category) => category._id);

    if (categoryIds.length === 0) {
      return res.json({
        success: true,
        range,
        clicksOverTime: buildClicksOverTime(startDate, days, []),
      });
    }

    const clickAgg = await Bookmark.aggregate([
      { $match: { categoryId: { $in: categoryIds } } },
      { $unwind: "$clickHistory" },
      {
        $match: {
          "clickHistory.timestamp": { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$clickHistory.timestamp",
            },
          },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      range,
      clicksOverTime: buildClicksOverTime(startDate, days, clickAgg),
    });
  } catch (error) {
    console.error("Error fetching profile analytics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile analytics",
    });
  }
};

// Update user profile information
export const updateProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { name, profilePicture } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name;
    if (profilePicture !== undefined) {
      if (profilePicture === "" || profilePicture === null) {
        user.profilePicture = "";
      } else {
        const safePicture = sanitizeImageUrl(profilePicture);
        if (!safePicture) {
          return res.status(400).json({
            success: false,
            message: "Profile picture must be a valid https URL",
          });
        }
        user.profilePicture = safePicture;
      }
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        username: user.username,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile information",
    });
  }
};
