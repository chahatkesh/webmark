import User from "../models/userModel.js";
import crypto from "crypto";

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

    const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
    const deviceType = isMobile ? "Mobile" : "Desktop";

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

const buildActiveDevices = (
  loginDevices,
  deviceId,
  deviceName,
  currentLogin,
) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activeDevices = (loginDevices || [])
    .filter(
      (device) =>
        device.isActive && new Date(device.lastActive) > thirtyDaysAgo,
    )
    .map((device) => ({
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      lastActive: device.lastActive,
      isCurrent: device.deviceId === deviceId,
    }));

  if (activeDevices.length === 0) {
    activeDevices.push({
      deviceId,
      deviceName,
      lastActive: currentLogin,
      isCurrent: true,
    });
  } else if (!activeDevices.some((device) => device.isCurrent)) {
    activeDevices.push({
      deviceId,
      deviceName,
      lastActive: currentLogin,
      isCurrent: true,
    });
  }

  return activeDevices;
};

export const getActiveDevicesForResponse = (
  user,
  userAgent,
  ip,
  deviceIdHeader,
) => {
  const userAgentValue = userAgent || "";
  const ipValue = ip || "";
  const deviceId = deviceIdHeader || generateDeviceId(userAgentValue, ipValue);
  const deviceName = getDeviceName(userAgentValue);
  const currentLogin = new Date();

  const loginDevices = Array.isArray(user.loginDevices)
    ? [...user.loginDevices]
    : [];
  let existingDevice = loginDevices.find(
    (device) => device.deviceId === deviceId,
  );

  if (!existingDevice) {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const similarDevice = loginDevices.find(
      (device) =>
        device.deviceName === deviceName &&
        new Date(device.lastActive) > twoWeeksAgo,
    );

    if (similarDevice) {
      similarDevice.deviceId = deviceId;
      existingDevice = similarDevice;
    }
  }

  if (existingDevice) {
    existingDevice.lastActive = currentLogin;
    existingDevice.userAgent = userAgentValue;
    existingDevice.isActive = true;
    if (
      deviceName !== "Unknown device" &&
      existingDevice.deviceName === "Unknown device"
    ) {
      existingDevice.deviceName = deviceName;
    }
  } else {
    loginDevices.push({
      deviceId,
      userAgent: userAgentValue,
      lastActive: currentLogin,
      deviceName,
      isActive: true,
    });
  }

  const activeDevices = buildActiveDevices(
    loginDevices,
    deviceId,
    deviceName,
    currentLogin,
  );
  const currentDeviceId =
    loginDevices.find((device) => device.userAgent === userAgentValue)
      ?.deviceId || deviceId;

  return {
    deviceId,
    deviceName,
    currentLogin,
    activeDevices,
    currentDeviceId,
    totalActiveDevices: activeDevices.length,
  };
};

export const persistDeviceActivity = async (
  userId,
  userAgent,
  ip,
  deviceIdHeader,
) => {
  const user = await User.findById(userId);
  if (!user) return;

  const userAgentValue = userAgent || "";
  const ipValue = ip || "";
  const deviceId = deviceIdHeader || generateDeviceId(userAgentValue, ipValue);
  const deviceName = getDeviceName(userAgentValue);
  const currentLogin = new Date();

  if (!user.loginDevices) {
    user.loginDevices = [];
  }

  let existingDevice = user.loginDevices.find(
    (device) => device.deviceId === deviceId,
  );

  if (!existingDevice) {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const similarDevice = user.loginDevices.find(
      (device) =>
        device.deviceName === deviceName &&
        new Date(device.lastActive) > twoWeeksAgo,
    );

    if (similarDevice) {
      similarDevice.deviceId = deviceId;
      existingDevice = similarDevice;
    }
  }

  if (existingDevice) {
    existingDevice.lastActive = currentLogin;
    existingDevice.userAgent = userAgentValue;
    existingDevice.isActive = true;
    if (
      deviceName !== "Unknown device" &&
      existingDevice.deviceName === "Unknown device"
    ) {
      existingDevice.deviceName = deviceName;
    }
  } else {
    user.loginDevices.push({
      deviceId,
      userAgent: userAgentValue,
      lastActive: currentLogin,
      deviceName,
      isActive: true,
    });
  }

  const deviceGroups = {};
  user.loginDevices.forEach((device) => {
    if (!deviceGroups[device.deviceName]) {
      deviceGroups[device.deviceName] = [];
    }
    deviceGroups[device.deviceName].push(device);
  });

  Object.keys(deviceGroups).forEach((name) => {
    if (deviceGroups[name].length > 1) {
      deviceGroups[name].sort(
        (a, b) => new Date(b.lastActive) - new Date(a.lastActive),
      );
      for (let i = 1; i < deviceGroups[name].length; i += 1) {
        deviceGroups[name][i].isActive = false;
      }
    }
  });

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  user.loginDevices = user.loginDevices.filter(
    (device) => device.isActive || new Date(device.lastActive) > sixtyDaysAgo,
  );

  if (user.loginDevices.length > 10) {
    user.loginDevices.sort((a, b) => {
      if (a.isActive !== b.isActive) return b.isActive ? 1 : -1;
      return new Date(b.lastActive) - new Date(a.lastActive);
    });
    user.loginDevices = user.loginDevices.slice(0, 10);
  }

  await user.save();
};
