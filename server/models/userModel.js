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
  tokenExpiresAt: { type: Date },
  lastLogin: { type: Date },
  lastLoginDevice: { type: String },
  loginDevices: [{
    deviceId: { type: String },
    userAgent: { type: String },
    lastActive: { type: Date, default: Date.now },
    deviceName: { type: String },
    isActive: { type: Boolean, default: true }
  }]
})

const userModel = mongoose.model.user || mongoose.model("user", userSchema)

export default userModel;