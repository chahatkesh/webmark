import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized login again" })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get the user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if token is expired
    const currentTime = new Date();
    if (user.tokenExpiresAt && new Date(user.tokenExpiresAt) < currentTime) {
      // Token has expired, check if refresh token exists
      if (user.refreshToken) {
        try {
          // Issue new token
          const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

          // Update token expiry date (30 days from now)
          user.tokenExpiresAt = new Date(currentTime.getTime() + 30 * 24 * 60 * 60 * 1000);
          await user.save();

          // Send the new token in the response
          res.setHeader('x-auth-token', newToken);
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          return res.json({ success: false, message: "Session expired, please login again" });
        }
      } else {
        return res.json({ success: false, message: "Session expired, please login again" });
      }
    }

    // Update last login information (only for API calls that aren't profile-related)
    // This prevents updating the last login timestamp when viewing the profile page
    if (!req.originalUrl.includes('/api/user/profile')) {
      // Store the previous login information before updating
      const userAgent = req.headers['user-agent'];
      if (user.lastLogin) {
        // Only update if it's been more than 1 hour since last update
        // to prevent excessive updates during active sessions
        const oneHourAgo = new Date(currentTime.getTime() - (60 * 60 * 1000));
        if (new Date(user.lastLogin) < oneHourAgo) {
          user.lastLogin = currentTime;
          user.lastLoginDevice = userAgent;
          await user.save();
        }
      } else {
        // First login ever
        user.lastLogin = currentTime;
        user.lastLoginDevice = userAgent;
        await user.save();
      }
    }

    req.body.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.json({ success: false, message: "Authentication error, please login again" })
  }
}

export default authMiddleware;