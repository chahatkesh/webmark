import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized login again" })
  }

  try {
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name !== 'TokenExpiredError') {
        // Invalid signature or malformed token — reject immediately
        return res.json({ success: false, message: "Not Authorized login again" });
      }

      // JWT is expired — attempt silent refresh via the DB refresh token
      decoded = jwt.decode(token);
      if (!decoded?.id) {
        return res.json({ success: false, message: "Not Authorized login again" });
      }

      const user = await User.findById(decoded.id);
      if (
        !user ||
        !user.refreshToken ||
        !user.tokenExpiresAt ||
        new Date(user.tokenExpiresAt) < new Date()
      ) {
        return res.json({ success: false, message: "Session expired, please login again" });
      }

      // Issue a new short-lived access token and roll the refresh window forward
      const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      user.tokenExpiresAt = new Date(Date.now() + ONE_YEAR_MS);
      await user.save();

      res.setHeader('x-auth-token', newToken);
      req.body.userId = String(decoded.id);
      return next();
    }

    // JWT is valid — standard path
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Throttled last-login update (at most once per hour, skip on profile routes)
    if (!req.originalUrl.includes('/api/user/profile')) {
      const currentTime = new Date();
      const userAgent = req.headers['user-agent'];
      const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);
      if (!user.lastLogin || new Date(user.lastLogin) < oneHourAgo) {
        user.lastLogin = currentTime;
        user.lastLoginDevice = userAgent;
        await user.save();
      }
    }

    req.body.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.json({ success: false, message: "Authentication error, please login again" });
  }
}

export default authMiddleware;