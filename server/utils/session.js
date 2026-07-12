import userModel from "../models/userModel.js";
import {
  clearAuthCookies,
  createAccessToken,
  createRefreshToken,
  getRefreshReuseWindowMs,
  getSessionExpiresAt,
  hashToken,
  setAuthCookies,
} from "./authTokens.js";
import {
  applySessionToDevice,
  clearDeviceSessionFields,
  findDeviceByRefreshHash,
  findDeviceEntry,
} from "./deviceTracking.js";

const isUserLevelSessionValid = (user, now = new Date()) =>
  user.tokenExpiresAt && new Date(user.tokenExpiresAt) > now;

export const findUserByRefreshToken = async (refreshHash) => {
  const now = new Date();

  const candidates = await userModel.find({
    $or: [
      { refreshTokenHash: refreshHash },
      {
        previousRefreshTokenHash: refreshHash,
        previousRefreshTokenExpiresAt: { $gt: now },
      },
      { "loginDevices.refreshTokenHash": refreshHash },
      {
        "loginDevices.previousRefreshTokenHash": refreshHash,
        "loginDevices.previousRefreshTokenExpiresAt": { $gt: now },
      },
    ],
  });

  for (const user of candidates) {
    const device = findDeviceByRefreshHash(user, refreshHash, now);
    if (device) {
      return { user, deviceId: device.deviceId };
    }

    if (
      isUserLevelSessionValid(user, now) &&
      (user.refreshTokenHash === refreshHash ||
        (user.previousRefreshTokenHash === refreshHash &&
          user.previousRefreshTokenExpiresAt &&
          new Date(user.previousRefreshTokenExpiresAt) > now))
    ) {
      return { user, deviceId: null };
    }
  }

  return { user: null, deviceId: null };
};

export const issueUserSession = async (user, res, options = {}) => {
  const {
    preservePrevious = true,
    deviceId,
    deviceName,
    deviceType,
    userAgent,
  } = options;
  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken();
  const tokenExpiresAt = getSessionExpiresAt();
  const refreshTokenHash = hashToken(refreshToken);
  const previousExpiresAt = new Date(Date.now() + getRefreshReuseWindowMs());

  const sessionFields = {
    refreshTokenHash,
    tokenExpiresAt,
    preservePrevious,
    previousExpiresAt,
    deviceName,
    deviceType,
    userAgent,
  };

  if (deviceId) {
    applySessionToDevice(user, deviceId, sessionFields);
  } else if (preservePrevious && user.refreshTokenHash) {
    user.previousRefreshTokenHash = user.refreshTokenHash;
    user.previousRefreshTokenExpiresAt = previousExpiresAt;
  } else {
    user.previousRefreshTokenHash = undefined;
    user.previousRefreshTokenExpiresAt = undefined;
  }

  if (!deviceId) {
    user.refreshTokenHash = refreshTokenHash;
    user.tokenExpiresAt = tokenExpiresAt;
  }

  user.refreshToken = undefined;
  await user.save();

  setAuthCookies(res, { accessToken, refreshToken });

  return {
    accessToken,
    expiresAt: tokenExpiresAt,
    deviceId,
  };
};

export const clearUserSession = async (user, res, options = {}) => {
  const { deviceId } = options;

  if (user) {
    if (deviceId) {
      const device = findDeviceEntry(user, deviceId);
      // Capture hash before clearing — comparing after clear always failed.
      const deviceHash = device?.refreshTokenHash;
      clearDeviceSessionFields(device);

      if (
        user.refreshTokenHash &&
        deviceHash &&
        deviceHash === user.refreshTokenHash
      ) {
        user.refreshTokenHash = undefined;
        user.previousRefreshTokenHash = undefined;
        user.previousRefreshTokenExpiresAt = undefined;
        user.tokenExpiresAt = undefined;
      }

      user.markModified?.("loginDevices");
    } else {
      (user.loginDevices || []).forEach(clearDeviceSessionFields);
      user.refreshToken = undefined;
      user.refreshTokenHash = undefined;
      user.previousRefreshTokenHash = undefined;
      user.previousRefreshTokenExpiresAt = undefined;
      user.tokenExpiresAt = undefined;
      user.markModified?.("loginDevices");
    }

    await user.save();
  }

  clearAuthCookies(res);
};

export const resolveCurrentDeviceId = (user, deviceIdHeader) => {
  if (deviceIdHeader) return deviceIdHeader;

  const activeWithToken = (user.loginDevices || []).find(
    (device) =>
      device.isActive &&
      device.refreshTokenHash &&
      device.refreshTokenHash === user.refreshTokenHash,
  );

  return activeWithToken?.deviceId || null;
};
