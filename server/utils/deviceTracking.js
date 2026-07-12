import User from "../models/userModel.js";
import crypto from "crypto";

export const MAX_DEVICES = 2;

export const generateDeviceId = (userAgent, ip) => {
  let stableFingerprint = "";

  if (userAgent) {
    const browserMatch = userAgent.match(
      /(Chrome|Firefox|Safari|Edge|MSIE|Trident)[\/\s](\d+)/i,
    );
    const browserName = browserMatch ? browserMatch[1] : "Unknown";

    const osMatch = userAgent.match(
      /(Windows|Mac|iPhone|iPad|iOS|Android|Linux)[;\s)]?/i,
    );
    const osName = osMatch ? osMatch[1] : "Unknown";

    const deviceType = getDeviceType(userAgent);

    stableFingerprint = `${browserName}-${osName}-${deviceType}`;
  }

  const cleanIp = ip
    ? ip.split(",")[0].trim().split(".").slice(0, 2).join(".")
    : "unknown";

  return crypto
    .createHash("md5")
    .update(`${stableFingerprint}-${cleanIp}`)
    .digest("hex");
};

export const getDeviceType = (userAgent) => {
  if (!userAgent) return "desktop";
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|Tablet/i.test(userAgent);
  return isMobile ? "mobile" : "desktop";
};

export const getDeviceName = (userAgent) => {
  if (!userAgent) return "Unknown device";

  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
  const isTablet = /Tablet|iPad/i.test(userAgent);
  const isMac = /Macintosh|Mac OS X/i.test(userAgent) && !isMobile;
  const isWindows = /Windows/i.test(userAgent);
  const isLinux = /Linux/i.test(userAgent) && !isMobile;
  const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
  const isChrome = /Chrome/i.test(userAgent);
  const isFirefox = /Firefox/i.test(userAgent);
  const isEdge = /Edg/i.test(userAgent);

  let deviceType = "Unknown device";
  if (isMobile && !isTablet) deviceType = "Mobile";
  else if (isTablet) deviceType = "Tablet";
  else if (isMac) deviceType = "Mac";
  else if (isWindows) deviceType = "Windows";
  else if (isLinux) deviceType = "Linux";

  let browser = "";
  if (isEdge) browser = " (Edge)";
  else if (isChrome) browser = " (Chrome)";
  else if (isSafari) browser = " (Safari)";
  else if (isFirefox) browser = " (Firefox)";

  return `${deviceType}${browser}`;
};

const isSessionValid = (device, now = new Date()) => {
  if (!device?.isActive) return false;
  if (device.tokenExpiresAt && new Date(device.tokenExpiresAt) > now) {
    return true;
  }
  if (!device.lastActive) return false;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return new Date(device.lastActive) > thirtyDaysAgo;
};

export const toDeviceResponse = (device, currentDeviceId) => ({
  deviceId: device.deviceId,
  deviceName: device.deviceName,
  deviceType: device.deviceType || getDeviceType(device.userAgent),
  lastActive: device.lastActive,
  isCurrent: device.deviceId === currentDeviceId,
});

export const listActiveSessions = (user, now = new Date()) =>
  (user.loginDevices || []).filter((device) => isSessionValid(device, now));

export const findDeviceEntry = (user, deviceId) =>
  (user.loginDevices || []).find((device) => device.deviceId === deviceId);

export const ensureLoginDevices = (user) => {
  if (!Array.isArray(user.loginDevices)) {
    user.loginDevices = [];
  }
};

export const resolveDeviceContext = (userAgent, ip, deviceIdHeader) => {
  const userAgentValue = userAgent || "";
  const ipValue = ip || "";
  const deviceId = deviceIdHeader || generateDeviceId(userAgentValue, ipValue);
  const deviceName = getDeviceName(userAgentValue);
  const deviceType = getDeviceType(userAgentValue);

  return {
    deviceId,
    deviceName,
    deviceType,
    userAgent: userAgentValue,
    ip: ipValue,
  };
};

export const evaluateDeviceLogin = (user, { deviceId }) => {
  const active = listActiveSessions(user);
  const existing = active.find((device) => device.deviceId === deviceId);

  if (existing) {
    return { ok: true, existing: true };
  }

  if (active.length < MAX_DEVICES) {
    return { ok: true, existing: false };
  }

  return {
    ok: false,
    conflict: true,
    devices: active.map((device) => toDeviceResponse(device, deviceId)),
  };
};

export const clearUserLevelSessionIfMatches = (user, refreshTokenHash) => {
  if (!refreshTokenHash || user.refreshTokenHash !== refreshTokenHash) {
    return false;
  }

  user.refreshTokenHash = undefined;
  user.previousRefreshTokenHash = undefined;
  user.previousRefreshTokenExpiresAt = undefined;
  user.tokenExpiresAt = undefined;
  return true;
};

export const revokeDeviceSession = (user, deviceId) => {
  ensureLoginDevices(user);
  const device = findDeviceEntry(user, deviceId);
  if (!device) return false;

  const deviceHash = device.refreshTokenHash;
  clearDeviceSessionFields(device);
  clearUserLevelSessionIfMatches(user, deviceHash);
  user.markModified?.("loginDevices");
  return true;
};

export const upsertDeviceSession = (
  user,
  { deviceId, deviceName, deviceType, userAgent },
) => {
  ensureLoginDevices(user);
  const currentLogin = new Date();
  let device = findDeviceEntry(user, deviceId);

  if (!device) {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const similarDevice = user.loginDevices.find(
      (entry) =>
        entry.deviceName === deviceName &&
        entry.isActive &&
        new Date(entry.lastActive) > twoWeeksAgo,
    );

    if (similarDevice) {
      similarDevice.deviceId = deviceId;
      device = similarDevice;
    }
  }

  if (device) {
    device.lastActive = currentLogin;
    device.userAgent = userAgent;
    device.deviceName = deviceName;
    device.deviceType = deviceType;
    device.isActive = true;
  } else {
    user.loginDevices.push({
      deviceId,
      userAgent,
      lastActive: currentLogin,
      deviceName,
      deviceType,
      isActive: true,
    });
    device = findDeviceEntry(user, deviceId);
  }

  return device;
};

export const pruneInactiveDevices = (user) => {
  ensureLoginDevices(user);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  user.loginDevices = user.loginDevices.filter(
    (device) =>
      device.isActive ||
      (device.lastActive && new Date(device.lastActive) > sixtyDaysAgo),
  );
};

export const buildActiveDevices = (
  loginDevices,
  deviceId,
  deviceName,
  deviceType,
  currentLogin,
) => {
  const now = new Date();
  const activeDevices = (loginDevices || [])
    .filter((device) => isSessionValid(device, now))
    .map((device) => toDeviceResponse(device, deviceId));

  if (
    activeDevices.length === 0 &&
    !activeDevices.some((device) => device.deviceId === deviceId)
  ) {
    activeDevices.push({
      deviceId,
      deviceName,
      deviceType,
      lastActive: currentLogin,
      isCurrent: true,
    });
  } else if (!activeDevices.some((device) => device.isCurrent)) {
    const registered = findDeviceEntry({ loginDevices }, deviceId);
    if (registered && isSessionValid(registered, now)) {
      activeDevices.push(toDeviceResponse(registered, deviceId));
    }
  }

  return activeDevices;
};

export const getActiveDevicesForResponse = (
  user,
  userAgent,
  ip,
  deviceIdHeader,
) => {
  const ctx = resolveDeviceContext(userAgent, ip, deviceIdHeader);
  const { deviceId, deviceName, deviceType, userAgent: userAgentValue } = ctx;
  const currentLogin = new Date();
  const loginDevices = Array.isArray(user.loginDevices)
    ? [...user.loginDevices]
    : [];

  const registered = findDeviceEntry({ loginDevices }, deviceId);
  if (registered && isSessionValid(registered)) {
    registered.lastActive = currentLogin;
    if (userAgentValue) registered.userAgent = userAgentValue;
  }

  const activeDevices = buildActiveDevices(
    loginDevices,
    deviceId,
    deviceName,
    deviceType,
    currentLogin,
  );

  return {
    deviceId,
    deviceName,
    deviceType,
    currentLogin,
    activeDevices,
    currentDeviceId: deviceId,
    totalActiveDevices: activeDevices.length,
    maxDevices: MAX_DEVICES,
  };
};

export const persistDeviceActivity = async (
  userId,
  userAgent,
  ip,
  deviceIdHeader,
) => {
  const ctx = resolveDeviceContext(userAgent, ip, deviceIdHeader);
  const setFields = {
    "loginDevices.$[device].lastActive": new Date(),
  };
  if (ctx.userAgent) {
    setFields["loginDevices.$[device].userAgent"] = ctx.userAgent;
  }

  // Atomic update only — never load/save the full user doc. A concurrent
  // load-modify-save was re-writing revoked devices as active.
  await User.updateOne(
    {
      _id: userId,
      loginDevices: {
        $elemMatch: { deviceId: ctx.deviceId, isActive: true },
      },
    },
    { $set: setFields },
    {
      arrayFilters: [
        { "device.deviceId": ctx.deviceId, "device.isActive": true },
      ],
    },
  );
};

export const findDeviceByRefreshHash = (
  user,
  refreshHash,
  now = new Date(),
) => {
  ensureLoginDevices(user);

  for (const device of user.loginDevices) {
    if (!device.isActive) continue;

    if (device.refreshTokenHash === refreshHash) {
      if (device.tokenExpiresAt && new Date(device.tokenExpiresAt) <= now) {
        continue;
      }
      return device;
    }

    if (
      device.previousRefreshTokenHash === refreshHash &&
      device.previousRefreshTokenExpiresAt &&
      new Date(device.previousRefreshTokenExpiresAt) > now
    ) {
      return device;
    }
  }

  return null;
};

export const mirrorUserSessionFromDevice = (user, device) => {
  if (!device) return;
  user.refreshTokenHash = device.refreshTokenHash;
  user.previousRefreshTokenHash = device.previousRefreshTokenHash;
  user.previousRefreshTokenExpiresAt = device.previousRefreshTokenExpiresAt;
  user.tokenExpiresAt = device.tokenExpiresAt;
};

export const applySessionToDevice = (user, deviceId, sessionFields) => {
  const device = upsertDeviceSession(user, {
    deviceId,
    deviceName: sessionFields.deviceName,
    deviceType: sessionFields.deviceType,
    userAgent: sessionFields.userAgent,
  });

  if (sessionFields.preservePrevious && device.refreshTokenHash) {
    device.previousRefreshTokenHash = device.refreshTokenHash;
    device.previousRefreshTokenExpiresAt = sessionFields.previousExpiresAt;
  } else {
    device.previousRefreshTokenHash = undefined;
    device.previousRefreshTokenExpiresAt = undefined;
  }

  device.refreshTokenHash = sessionFields.refreshTokenHash;
  device.tokenExpiresAt = sessionFields.tokenExpiresAt;
  device.isActive = true;
  device.lastActive = new Date();

  mirrorUserSessionFromDevice(user, device);
  return device;
};

export const clearDeviceSessionFields = (device) => {
  if (!device) return;
  device.isActive = false;
  device.refreshTokenHash = undefined;
  device.previousRefreshTokenHash = undefined;
  device.previousRefreshTokenExpiresAt = undefined;
  device.tokenExpiresAt = undefined;
};

export const isDeviceSessionRevoked = (user, deviceId) => {
  if (!deviceId) return false;
  const device = findDeviceEntry(user, deviceId);
  return Boolean(device && device.isActive === false);
};
