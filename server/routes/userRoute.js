import express from "express"
import {
  googleAuthCallback,
  completeOnboarding,
  getUserData,
  logoutUser
} from "../controllers/googleAuthController.js"
import authMiddleware from "../middleware/authmiddleware.js"
import passport from "../config/passport.js"

const userRouter = express.Router()

// Google OAuth routes
userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  googleAuthCallback
)

// User data and management
userRouter.post("/userdata", authMiddleware, getUserData)
userRouter.post("/complete-onboarding", authMiddleware, completeOnboarding)
userRouter.post("/logout", authMiddleware, logoutUser)

export default userRouter;