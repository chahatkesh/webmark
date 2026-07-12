import crypto from "crypto";
import PendingLogin from "../models/pendingLoginModel.js";

const PENDING_TTL_MS = 10 * 60 * 1000;

export const createPendingLoginCode = async ({
  userId,
  deviceId,
  deviceName,
  deviceType,
  userAgent,
}) => {
  const code = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + PENDING_TTL_MS);

  await PendingLogin.create({
    code,
    userId,
    deviceId,
    deviceName,
    deviceType,
    userAgent: userAgent || "",
    expiresAt,
  });

  return code;
};

export const loadPendingLogin = async (code, { consume = false } = {}) => {
  if (!code || typeof code !== "string") return null;

  const now = new Date();
  const query = {
    code,
    used: false,
    expiresAt: { $gt: now },
  };

  if (consume) {
    return PendingLogin.findOneAndUpdate(
      query,
      { $set: { used: true } },
      { new: false },
    );
  }

  return PendingLogin.findOne(query).lean();
};
