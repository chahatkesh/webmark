import express from "express"
import { loginUser, registerUser, userData } from "../controllers/userController.js"
import authMiddleware from "../middleware/authmiddleware.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/userdata", authMiddleware, userData)

export default userRouter;