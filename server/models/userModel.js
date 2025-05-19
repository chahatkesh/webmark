import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String, unique: true, sparse: true },
  profilePicture: { type: String },
  name: { type: String },
  joinedAt: { type: Date, default: Date.now },
  hasCompletedOnboarding: { type: Boolean, default: false },
  refreshToken: { type: String },
  tokenExpiresAt: { type: Date }
})

const userModel = mongoose.model.user || mongoose.model("user", userSchema)

export default userModel;