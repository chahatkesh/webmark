import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import {
  clearAuthCookies,
  getAccessTokenFromRequest,
  getRefreshTokenFromRequest,
} from "../utils/authTokens.js";
import { issueUserSession } from "../utils/session.js";

const authMiddleware = async (req, res, next) => {
  const token = getAccessTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      code: "AUTH_REQUIRED",
      message: "Not Authorized login again",
    });
  }

  try {
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          code: "ACCESS_TOKEN_EXPIRED",
          message: "Access token expired",
        });
      }

      return res.status(401).json({
        success: false,
        code: "INVALID_TOKEN",
        message: "Not Authorized login again",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    if (user.tokenExpiresAt && new Date(user.tokenExpiresAt) < new Date()) {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        code: "SESSION_EXPIRED",
        message: "Session expired, please login again",
      });
    }

    // Migrate legacy localStorage sessions to cookie-backed sessions while
    // the legacy access token is still valid.
    if (
      !getRefreshTokenFromRequest(req) &&
      !user.refreshTokenHash &&
      user.refreshToken
    ) {
      await issueUserSession(user, res, { preservePrevious: false });
    }

    // Throttled last-login update (at most once per hour, skip on profile routes)
    if (!req.originalUrl.includes("/api/user/profile")) {
      const currentTime = new Date();
      const userAgent = req.headers["user-agent"];
      const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);
      if (!user.lastLogin || new Date(user.lastLogin) < oneHourAgo) {
        User.updateOne(
          {
            _id: user._id,
            $or: [
              { lastLogin: { $lt: oneHourAgo } },
              { lastLogin: { $exists: false } },
            ],
          },
          { $set: { lastLogin: currentTime, lastLoginDevice: userAgent } },
        ).catch((updateError) => {
          console.error("Failed to update last login:", updateError);
        });
      }
    }

    req.user = user;
    req.userId = decoded.id;
    req.body = req.body || {};
    req.body.userId = decoded.id;
    return next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      code: "AUTH_ERROR",
      message: "Authentication error, please login again",
    });
  }
};

export default authMiddleware;
