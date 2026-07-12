import express from "express";
import {
  googleAuthCallback,
  refreshSession,
  completeOnboarding,
  getUserData,
  logoutUser,
} from "../controllers/googleAuthController.js";
import {
  continueDeviceLogin,
  getPendingDeviceLogin,
  revokeDevice,
} from "../controllers/deviceController.js";
import {
  getProfileInfo,
  getProfileAnalytics,
  updateProfile,
} from "../controllers/profileController.js";
import authMiddleware from "../middleware/authmiddleware.js";
import {
  authRateLimit,
  deviceLoginRateLimit,
  refreshRateLimit,
} from "../middleware/rateLimit.js";
import { createOAuthState } from "../utils/oauthState.js";
import passport from "../config/passport.js";

const userRouter = express.Router();

userRouter.get("/auth/google", authRateLimit, (req, res, next) => {
  const deviceId =
    typeof req.query.deviceId === "string" ? req.query.deviceId : "";
  const state = createOAuthState(deviceId);

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state,
  })(req, res, next);
});

userRouter.get(
  "/auth/google/callback",
  authRateLimit,
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth?error=auth_failed`,
    session: false,
  }),
  googleAuthCallback,
);

userRouter.get("/devices/pending", deviceLoginRateLimit, getPendingDeviceLogin);
userRouter.post(
  "/devices/continue-login",
  deviceLoginRateLimit,
  continueDeviceLogin,
);

userRouter.post("/refresh", refreshRateLimit, refreshSession);
userRouter.post("/userdata", authMiddleware, getUserData);
userRouter.post("/complete-onboarding", authMiddleware, completeOnboarding);
userRouter.post("/logout", authMiddleware, logoutUser);
userRouter.post("/devices/revoke", authMiddleware, revokeDevice);

userRouter.post("/profile", authMiddleware, getProfileInfo);
userRouter.get("/profile/analytics", authMiddleware, getProfileAnalytics);
userRouter.put("/profile", authMiddleware, updateProfile);

export default userRouter;
