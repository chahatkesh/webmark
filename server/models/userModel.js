import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpires: Date
})

const userModel = mongoose.model.user || mongoose.model("user", userSchema)

export default userModel;