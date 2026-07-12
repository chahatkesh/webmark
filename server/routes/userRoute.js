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
import passport from "../config/passport.js";

const userRouter = express.Router();

userRouter.get("/auth/google", (req, res, next) => {
  const deviceId =
    typeof req.query.deviceId === "string" ? req.query.deviceId : "";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: deviceId,
  })(req, res, next);
});

userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleAuthCallback,
);

userRouter.get("/devices/pending", getPendingDeviceLogin);
userRouter.post("/devices/continue-login", continueDeviceLogin);

userRouter.post("/refresh", refreshSession);
userRouter.post("/userdata", authMiddleware, getUserData);
userRouter.post("/complete-onboarding", authMiddleware, completeOnboarding);
userRouter.post("/logout", authMiddleware, logoutUser);
userRouter.post("/devices/revoke", authMiddleware, revokeDevice);

userRouter.post("/profile", authMiddleware, getProfileInfo);
userRouter.get("/profile/analytics", authMiddleware, getProfileAnalytics);
userRouter.put("/profile", authMiddleware, updateProfile);

export default userRouter;
