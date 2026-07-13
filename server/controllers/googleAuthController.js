import userModel from "../models/userModel.js";

import {
  clearAuthCookies,
  getRefreshTokenFromRequest,
  hashToken,
} from "../utils/authTokens.js";
import {
  clearUserSession,
  findUserByRefreshToken,
  issueUserSession,
  resolveCurrentDeviceId,
} from "../utils/session.js";
import {
  findDeviceEntry,
  isDeviceSessionRevoked,
} from "../utils/deviceTracking.js";
import { completeOAuthDeviceLogin } from "./deviceController.js";

const googleAuthCallback = async (req, res) => {
  try {
    const { user } = req;
    return completeOAuthDeviceLogin(req, res, user);
  } catch (error) {
    console.error("Google auth callback error:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/auth?error=auth_failed`);
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
    const { user, deviceId } = await findUserByRefreshToken(refreshHash);

    if (!user) {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        code: "REFRESH_EXPIRED",
        message: "Session expired, please login again",
      });
    }

    const deviceIdHeader = req.headers["device-id"];
    const resolvedDeviceId =
      deviceId || resolveCurrentDeviceId(user, deviceIdHeader) || undefined;

    if (
      isDeviceSessionRevoked(user, resolvedDeviceId) ||
      isDeviceSessionRevoked(user, deviceIdHeader)
    ) {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        code: "SESSION_REVOKED",
        message: "This device was signed out. Please login again",
      });
    }

    const deviceEntry = resolvedDeviceId
      ? findDeviceEntry(user, resolvedDeviceId)
      : null;

    const session = await issueUserSession(user, res, {
      preservePrevious: true,
      deviceId: resolvedDeviceId,
      deviceName: deviceEntry?.deviceName,
      deviceType: deviceEntry?.deviceType,
      userAgent: deviceEntry?.userAgent || req.headers["user-agent"],
    });

    return res.json({
      success: true,
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

const completeOnboarding = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.body.userId;

    const usernameRegex = /^[a-z0-9][a-z0-9_-]{2,29}$/;
    if (!usernameRegex.test(username)) {
      return res.json({
        success: false,
        message:
          "Username must start with a lowercase letter or number, followed by 29(max) lowercase letters, numbers, underscores, or hyphens",
      });
    }

    const existingUser = await userModel.findOne({
      username,
      _id: { $ne: userId },
    });
    if (existingUser) {
      return res.json({ success: false, message: "Username already in use" });
    }

    const user = await userModel.findById(userId);
    user.username = username;
    user.hasCompletedOnboarding = true;
    await user.save();

    return res.json({
      success: true,
      message: "Onboarding completed successfully",
    });
  } catch (error) {
    console.error("Complete onboarding error:", error);
    return res.json({ success: false, message: "Error completing onboarding" });
  }
};

const getUserData = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.hasCompletedOnboarding) {
      return res.json({
        success: false,
        requiresOnboarding: true,
        message: "Please complete onboarding",
      });
    }

    if (user.profilePicture && !user.profilePicture.startsWith("http")) {
      user.profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username)}`;
      user.save().catch((saveError) => {
        console.error("Failed to update profile picture URL:", saveError);
      });
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

const logoutUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await userModel.findById(userId);
    const deviceId = req.deviceId || null;

    await clearUserSession(user, res, { deviceId: deviceId || undefined });

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
  logoutUser,
};
