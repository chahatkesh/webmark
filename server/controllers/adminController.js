import bcrypt from "bcryptjs";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import Bookmark from "../models/bookmarkModel.js";
import Category from "../models/categoryModel.js";
import Stats from "../models/statsModel.js";
import {
  clearAdminCookie,
  createAdminToken,
  setAdminCookie,
} from "../utils/adminAuth.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const ALLOWED_RANGES = new Set([30, 90, 365]);
const CRON_JOB_CONFIG = {
  daily: {
    cadenceHours: 24,
    maxExpectedAgeHours: 30,
    schedule: "Daily at 00:00 UTC",
  },
  weekly: {
    cadenceHours: 168,
    maxExpectedAgeHours: 192,
    schedule: "Sunday at 00:00 UTC",
  },
  monthly: {
    cadenceHours: 720,
    maxExpectedAgeHours: 1080,
    schedule: "1st day at 00:00 UTC",
  },
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toDateKey = (date) => new Date(date).toISOString().slice(0, 10);

const getDateBuckets = (days) => {
  const end = new Date();
  end.setUTCHours(23, 59, 59, 999);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - days + 1);
  start.setUTCHours(0, 0, 0, 0);

  const buckets = [];
  for (
    let cursor = new Date(start);
    cursor <= end;
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  ) {
    buckets.push({
      date: toDateKey(cursor),
      users: 0,
      bookmarks: 0,
      categories: 0,
    });
  }

  return { start, end, buckets };
};

const aggregateByDay = (Model, dateField, start, end) =>
  Model.aggregate([
    { $match: { [dateField]: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: `$${dateField}`,
            timezone: "UTC",
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

const mergeTrends = (buckets, userRows, bookmarkRows, categoryRows) => {
  const byDate = new Map(buckets.map((bucket) => [bucket.date, bucket]));

  [
    [userRows, "users"],
    [bookmarkRows, "bookmarks"],
    [categoryRows, "categories"],
  ].forEach(([rows, key]) => {
    rows.forEach((row) => {
      if (byDate.has(row._id)) byDate.get(row._id)[key] = row.count;
    });
  });

  return Array.from(byDate.values());
};

const getCronJobsSummary = (rows, nowMs) => {
  const byType = new Map(rows.map((row) => [row._id, row]));

  return Object.entries(CRON_JOB_CONFIG).map(([type, config]) => {
    const row = byType.get(type);
    const lastUpdatedAt = row?.lastUpdatedAt || null;
    const ageHours = lastUpdatedAt
      ? Number(
          ((nowMs - new Date(lastUpdatedAt).getTime()) / 3600000).toFixed(1),
        )
      : null;

    let status = "missing";
    if (lastUpdatedAt) {
      status = ageHours <= config.maxExpectedAgeHours ? "healthy" : "stale";
    }

    return {
      type,
      status,
      count: row?.count || 0,
      schedule: config.schedule,
      cadenceHours: config.cadenceHours,
      maxExpectedAgeHours: config.maxExpectedAgeHours,
      lastUpdatedAt,
      ageHours,
    };
  });
};

export const loginAdmin = async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password || password.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({ email }).select("+passwordHash");
    const passwordMatches = admin
      ? await bcrypt.compare(password, admin.passwordHash)
      : false;

    if (!admin || !passwordMatches) {
      return res.status(401).json({
        success: false,
        code: "INVALID_ADMIN_CREDENTIALS",
        message: "Invalid email or password",
      });
    }

    setAdminCookie(res, createAdminToken(admin._id));
    admin.lastLoginAt = new Date();
    await admin.save();

    res.set("Cache-Control", "no-store");
    return res.status(200).json({
      success: true,
      admin: { email: admin.email },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to sign in",
    });
  }
};

export const logoutAdmin = (_req, res) => {
  clearAdminCookie(res);
  res.set("Cache-Control", "no-store");
  return res.status(200).json({ success: true });
};

export const getAdminSession = (req, res) => {
  res.set("Cache-Control", "no-store");
  return res.status(200).json({
    success: true,
    admin: { email: req.admin.email },
  });
};

export const getAdminDashboard = async (req, res) => {
  try {
    const requestedRange = Number(req.query.range || 30);
    const range = ALLOWED_RANGES.has(requestedRange) ? requestedRange : 30;
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 20, 10),
      50,
    );
    const search = String(req.query.search || "")
      .trim()
      .slice(0, 80);
    const { start, end, buckets } = getDateBuckets(range);
    const generatedAt = new Date();
    const now = Date.now();
    const userFilter = search
      ? {
          $or: ["username", "email", "name"].map((field) => ({
            [field]: { $regex: escapeRegExp(search), $options: "i" },
          })),
        }
      : {};

    const [
      totalUsers,
      totalBookmarks,
      totalCategories,
      userSummaryRows,
      userTrends,
      bookmarkTrends,
      categoryTrends,
      deviceBreakdown,
      cronSnapshotRows,
      latestSnapshots,
      accountRows,
      filteredUsers,
    ] = await Promise.all([
      User.countDocuments(),
      Bookmark.countDocuments(),
      Category.countDocuments(),
      User.aggregate([
        {
          $group: {
            _id: null,
            totalClicks: { $sum: { $ifNull: ["$stats.totalClicks", 0] } },
            totalTimeSavedSeconds: {
              $sum: { $ifNull: ["$stats.timeSaved", 0] },
            },
            completedOnboarding: {
              $sum: { $cond: ["$hasCompletedOnboarding", 1, 0] },
            },
            googleAccounts: {
              $sum: { $cond: [{ $ifNull: ["$googleId", false] }, 1, 0] },
            },
            activeDeviceSessions: {
              $sum: {
                $size: {
                  $filter: {
                    input: { $ifNull: ["$loginDevices", []] },
                    as: "device",
                    cond: { $eq: ["$$device.isActive", true] },
                  },
                },
              },
            },
            usersActive24h: {
              $sum: {
                $cond: [{ $gte: ["$lastLogin", new Date(now - DAY_MS)] }, 1, 0],
              },
            },
            usersActive7d: {
              $sum: {
                $cond: [
                  { $gte: ["$lastLogin", new Date(now - 7 * DAY_MS)] },
                  1,
                  0,
                ],
              },
            },
            usersActive30d: {
              $sum: {
                $cond: [
                  { $gte: ["$lastLogin", new Date(now - 30 * DAY_MS)] },
                  1,
                  0,
                ],
              },
            },
            usersWithoutAiSorts: {
              $sum: { $cond: [{ $lte: ["$aiSortsRemaining", 0] }, 1, 0] },
            },
            aiSortsRemaining: {
              $sum: { $ifNull: ["$aiSortsRemaining", 0] },
            },
            importBonusUsed: {
              $sum: { $ifNull: ["$importBonusUsedThisMonth", 0] },
            },
          },
        },
      ]),
      aggregateByDay(User, "joinedAt", start, end),
      aggregateByDay(Bookmark, "createdAt", start, end),
      aggregateByDay(Category, "createdAt", start, end),
      User.aggregate([
        { $unwind: "$loginDevices" },
        { $match: { "loginDevices.isActive": true } },
        {
          $group: {
            _id: { $ifNull: ["$loginDevices.deviceType", "unknown"] },
            value: { $sum: 1 },
          },
        },
        { $sort: { value: -1 } },
      ]),
      Stats.aggregate([
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
            lastUpdatedAt: { $max: "$updatedAt" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Stats.find()
        .sort({ date: -1 })
        .limit(8)
        .select("type date users bookmarks categories -_id")
        .lean(),
      User.find(userFilter)
        .select(
          "username email name joinedAt lastLogin hasCompletedOnboarding aiSortsRemaining importBonusUsedThisMonth loginDevices.isActive loginDevices.deviceType stats.totalClicks stats.timeSaved",
        )
        .sort({ joinedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(userFilter),
    ]);

    const cronJobs = getCronJobsSummary(cronSnapshotRows, now);
    const summary = userSummaryRows[0] || {};
    const accounts = accountRows.map((user) => {
      const activeDevices = (user.loginDevices || []).filter(
        (device) => device.isActive,
      );

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name || "",
        joinedAt: user.joinedAt,
        lastLogin: user.lastLogin || null,
        hasCompletedOnboarding: Boolean(user.hasCompletedOnboarding),
        aiSortsRemaining: user.aiSortsRemaining ?? 0,
        importBonusUsedThisMonth: user.importBonusUsedThisMonth ?? 0,
        totalClicks: user.stats?.totalClicks || 0,
        timeSavedSeconds: user.stats?.timeSaved || 0,
        activeDeviceCount: activeDevices.length,
        activeDeviceTypes: [
          ...new Set(
            activeDevices.map((device) => device.deviceType || "unknown"),
          ),
        ],
      };
    });

    res.set("Cache-Control", "no-store");
    return res.status(200).json({
      success: true,
      generatedAt: generatedAt.toISOString(),
      privacy: {
        bookmarkContentRead: false,
        categoryContentRead: false,
        excludedFields: [
          "bookmark names, URLs, logos, notes, and click history",
          "category names, colors, emoji, and ownership",
          "auth tokens, token hashes, device IDs, and user agents",
          "AI sort bookmark and category snapshots",
        ],
      },
      overview: {
        totalUsers,
        totalBookmarks,
        totalCategories,
        totalClicks: summary.totalClicks || 0,
        totalTimeSavedSeconds: summary.totalTimeSavedSeconds || 0,
        completedOnboarding: summary.completedOnboarding || 0,
        googleAccounts: summary.googleAccounts || 0,
        activeDeviceSessions: summary.activeDeviceSessions || 0,
        usersActive24h: summary.usersActive24h || 0,
        usersActive7d: summary.usersActive7d || 0,
        usersActive30d: summary.usersActive30d || 0,
      },
      aiUsage: {
        usersWithoutAiSorts: summary.usersWithoutAiSorts || 0,
        aiSortsRemaining: summary.aiSortsRemaining || 0,
        importBonusUsed: summary.importBonusUsed || 0,
      },
      trends: mergeTrends(buckets, userTrends, bookmarkTrends, categoryTrends),
      deviceBreakdown: deviceBreakdown.map((row) => ({
        name: row._id,
        value: row.value,
      })),
      database: {
        collections: [
          {
            name: "users",
            documents: totalUsers,
            access: "allowlisted fields",
          },
          {
            name: "bookmarks",
            documents: totalBookmarks,
            access: "counts only",
          },
          {
            name: "categories",
            documents: totalCategories,
            access: "counts only",
          },
          {
            name: "stats",
            documents: cronSnapshotRows.reduce(
              (sum, row) => sum + row.count,
              0,
            ),
            access: "aggregate snapshots",
          },
        ],
        snapshotCounts: cronSnapshotRows.map((row) => ({
          type: row._id,
          count: row.count,
        })),
        cronJobs,
        latestSnapshots,
      },
      accounts: {
        rows: accounts,
        page,
        limit,
        total: filteredUsers,
        pages: Math.max(Math.ceil(filteredUsers / limit), 1),
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load admin analytics",
    });
  }
};
