import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import createDefaultBookmarks from '../utils/defaultBookmarks.js';

// Helper function to create JWT token with extended expiry
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Handle Google OAuth callback and complete authentication flow
const googleAuthCallback = async (req, res) => {
  try {
    const { user } = req;

    // Generate JWT token
    const token = createToken(user._id);

    // Update the token expiry date (30 days from now)
    user.refreshToken = crypto.randomBytes(64).toString('hex');
    user.tokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    await user.save();

    // Check if the user has completed onboarding (has a proper username)
    if (!user.hasCompletedOnboarding) {
      // First-time login - needs to complete onboarding
      return res.redirect(`${process.env.FRONTEND_URL}/onboarding?token=${token}`);
    }

    // Regular login - redirect to dashboard
    return res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}`);
  } catch (error) {
    console.error("Google auth callback error:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/auth?error=Authentication failed`);
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
        message: "Username must be 3-30 characters long, start with a letter or number, and can contain lowercase letters, numbers, underscore, or hyphen"
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

    return res.json({
      success: true,
      username: user.username,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      joinedAt: user.joinedAt
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
    await userModel.findByIdAndUpdate(userId, {
      refreshToken: null,
      tokenExpiresAt: null
    });

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.json({ success: false, message: "Error during logout" });
  }
};

export {
  googleAuthCallback,
  completeOnboarding,
  getUserData,
  logoutUser
};
