import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import {
  clearAuthCookies,
  getAccessTokenFromRequest,
  getRefreshTokenFromRequest,
  hashToken,
} from "../utils/authTokens.js";
import { findUserByRefreshToken, issueUserSession } from "../utils/session.js";
import { sendBookmarkletPage } from "../utils/bookmarkletPage.js";

const authError = (res, message) =>
  sendBookmarkletPage(res, {
    status: "error",
    title: "Could not save",
    message,
  });

const loadUserFromAccessToken = async (token) => {
  if (!token) return { user: null, expired: false };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return { user: null, expired: false };

    if (user.tokenExpiresAt && new Date(user.tokenExpiresAt) < new Date()) {
      return { user: null, expired: false };
    }

    return { user, expired: false };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { user: null, expired: true };
    }
    return { user: null, expired: false };
  }
};

const refreshUserSession = async (req, res) => {
  const refreshToken = getRefreshTokenFromRequest(req);
  if (!refreshToken) return null;

  const refreshHash = hashToken(refreshToken);
  const { user, deviceId } = await findUserByRefreshToken(refreshHash);

  if (!user) return null;

  const deviceEntry = deviceId
    ? user.loginDevices?.find((device) => device.deviceId === deviceId)
    : null;

  await issueUserSession(user, res, {
    preservePrevious: true,
    deviceId: deviceId || undefined,
    deviceName: deviceEntry?.deviceName,
    deviceType: deviceEntry?.deviceType,
    userAgent: deviceEntry?.userAgent || req.headers["user-agent"],
  });
  return user;
};

const bookmarkletAuthMiddleware = async (req, res, next) => {
  try {
    const accessToken = getAccessTokenFromRequest(req);
    let { user, expired } = await loadUserFromAccessToken(accessToken);

    if (!user && (expired || !accessToken)) {
      user = await refreshUserSession(req, res);
    }

    if (!user) {
      clearAuthCookies(res);
      return authError(
        res,
        "Please log in to Webmark first, then try the bookmarklet again.",
      );
    }

    req.user = user;
    req.body = req.body || {};
    req.body.userId = user._id.toString();
    return next();
  } catch (error) {
    console.error("Bookmarklet auth error:", error);
    return authError(
      res,
      "Authentication failed. Please log in and try again.",
    );
  }
};

export default bookmarkletAuthMiddleware;
