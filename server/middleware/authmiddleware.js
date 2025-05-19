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

    req.body.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.json({ success: false, message: "Authentication error, please login again" })
  }
}

export default authMiddleware;