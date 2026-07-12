import mongoose from "mongoose";

const pendingLoginSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    index: true,
  },
  deviceId: { type: String, required: true },
  deviceName: { type: String, default: "Unknown device" },
  deviceType: { type: String, enum: ["desktop", "mobile"], required: true },
  userAgent: { type: String, default: "" },
  used: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export default mongoose.model("PendingLogin", pendingLoginSchema);
