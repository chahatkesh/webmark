import express from "express";
import {
  googleAuthCallback,
  refreshSession,
  completeOnboarding,
  getUserData,
  logoutUser,
} from "../controllers/googleAuthController.js";
import {
  getProfileInfo,
  getProfileAnalytics,
  updateProfile,
} from "../controllers/profileController.js";
import authMiddleware from "../middleware/authmiddleware.js";
import passport from "../config/passport.js";

const userRouter = express.Router();

// Google OAuth routes
userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleAuthCallback,
);

// User data and management
userRouter.post("/refresh", refreshSession);
userRouter.post("/userdata", authMiddleware, getUserData);
userRouter.post("/complete-onboarding", authMiddleware, completeOnboarding);
userRouter.post("/logout", authMiddleware, logoutUser);

// Profile management
userRouter.post("/profile", authMiddleware, getProfileInfo);
userRouter.get("/profile/analytics", authMiddleware, getProfileAnalytics);
userRouter.put("/profile", authMiddleware, updateProfile);

export default userRouter;
