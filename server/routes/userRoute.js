import express from "express"
import {
  loginUser,
  registerUser,
  userData,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification
} from "../controllers/userController.js"
import authMiddleware from "../middleware/authmiddleware.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/userdata", authMiddleware, userData)
userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/reset-password", resetPassword)
userRouter.get("/verify-email/:token", verifyEmail)
userRouter.post("/resend-verification", resendVerification)

export default userRouter;