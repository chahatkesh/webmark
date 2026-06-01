import userModel from "../models/userModel.js";
import createDefaultBookmarks from '../utils/defaultBookmarks.js';
import {
  clearAuthCookies,
  getRefreshTokenFromRequest,
  hashToken,
} from "../utils/authTokens.js";
import { clearUserSession, issueUserSession } from "../utils/session.js";

// Handle Google OAuth callback and complete authentication flow
const googleAuthCallback = async (req, res) => {
  try {
    const { user } = req;

    // Get user agent for device tracking
    const userAgent = req.headers['user-agent'];

    // Update login information
    user.lastLogin = new Date();
    user.lastLoginDevice = userAgent;

    const { accessToken } = await issueUserSession(user, res, { preservePrevious: false });

    // Check if the user has completed onboarding (has a proper username)
    if (!user.hasCompletedOnboarding) {
      // First-time login - needs to complete onboarding
      return res.redirect(`${process.env.FRONTEND_URL}/onboarding`);
    }

    // Regular login - redirect to dashboard
    if (process.env.AUTH_REDIRECT_TOKEN === "true") {
      return res.redirect(`${process.env.FRONTEND_URL}/auth?token=${accessToken}`);
    }

    return res.redirect(`${process.env.FRONTEND_URL}/auth`);
  } catch (error) {
    console.error("Google auth callback error:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/auth?error=Authentication failed`);
  }
};

const refreshSession = async (req, res) => {
  try {
    const refreshToken = getRefreshTokenFromRequest(req);
    if (!refreshToken) {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        code: "REFRESH_REQUIRED",
        message: "Refresh token not found",
      });
    }

    const refreshHash = hashToken(refreshToken);
    const now = new Date();
    const user = await userModel.findOne({
      $or: [
        { refreshTokenHash: refreshHash },
        {
          previousRefreshTokenHash: refreshHash,
          previousRefreshTokenExpiresAt: { $gt: now },
        },
      ],
      tokenExpiresAt: { $gt: now },
    });

    if (!user) {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        code: "REFRESH_EXPIRED",
        message: "Session expired, please login again",
      });
    }

    const session = await issueUserSession(user, res, { preservePrevious: true });
    return res.json({
      success: true,
      accessToken: session.accessToken,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error("Refresh session error:", error);
    clearAuthCookies(res);
    return res.status(500).json({
      success: false,
      code: "REFRESH_ERROR",
      message: "Could not refresh session",
    });
  }
};

// Complete user onboarding by setting username
const completeOnboarding = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.body.userId;

    // Validate username
    const usernameRegex = /^[a-z0-9][a-z0-9_-]{2,29}$/;
    if (!usernameRegex.test(username)) {
      return res.json({
        success: false,
        message: "Username must start with a lowercase letter or number, followed by 29(max) lowercase letters, numbers, underscores, or hyphens"
      });
    }

    // Check if username is already in use
    const existingUser = await userModel.findOne({ username, _id: { $ne: userId } });
    if (existingUser) {
      return res.json({ success: false, message: "Username already in use" });
    }

    // Update user record with the chosen username
    const user = await userModel.findById(userId);
    user.username = username;
    user.hasCompletedOnboarding = true;
    await user.save();

    // Create default bookmarks for new user
    await createDefaultBookmarks(userId);

    return res.json({ success: true, message: "Onboarding completed successfully" });
  } catch (error) {
    console.error("Complete onboarding error:", error);
    return res.json({ success: false, message: "Error completing onboarding" });
  }
};

// Get user data for authenticated user
const getUserData = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if the user has completed onboarding
    if (!user.hasCompletedOnboarding) {
      return res.json({
        success: false,
        requiresOnboarding: true,
        message: "Please complete onboarding"
      });
    }

    // Ensure profile picture is a valid URL
    if (user.profilePicture && !user.profilePicture.startsWith('http')) {
      // If it's not a valid URL, update to use a default avatar service
      user.profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username)}`;
      await user.save();
    }

    return res.json({
      success: true,
      username: user.username,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      joinedAt: user.joinedAt,
      lastLogin: user.lastLogin,
      lastLoginDevice: user.lastLoginDevice,
      aiSortsRemaining: user.aiSortsRemaining ?? 5,
      importsRemainingThisMonth: (() => {
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
        if (user.importBonusMonthKey !== monthKey) return 2;
        return Math.max(0, 2 - (user.importBonusUsedThisMonth ?? 0));
      })(),
    });
  } catch (error) {
    console.error("Get user data error:", error);
    return res.json({ success: false, message: "Error retrieving user data" });
  }
};

// Logout user
const logoutUser = async (req, res) => {
  try {
    // Clear refresh token from user record
    const userId = req.body.userId;
    const user = await userModel.findById(userId);
    await clearUserSession(user, res);

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    clearAuthCookies(res);
    return res.json({ success: false, message: "Error during logout" });
  }
};

export {
  googleAuthCallback,
  refreshSession,
  completeOnboarding,
  getUserData,
  logoutUser
};
