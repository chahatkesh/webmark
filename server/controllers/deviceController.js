import userModel from "../models/userModel.js";
import {
  createDevicePendingToken,
  verifyDevicePendingToken,
} from "../utils/authTokens.js";
import {
  evaluateDeviceLogin,
  listActiveSessions,
  resolveDeviceContext,
  revokeDeviceSession,
  toDeviceResponse,
  upsertDeviceSession,
} from "../utils/deviceTracking.js";
import { issueUserSession } from "../utils/session.js";

export const getPendingDeviceLogin = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Missing pending token",
      });
    }

    const decoded = verifyDevicePendingToken(token);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const active = listActiveSessions(user);
    return res.json({
      success: true,
      devices: active.map((device) =>
        toDeviceResponse(device, decoded.deviceId),
      ),
      newDevice: {
        deviceId: decoded.deviceId,
        deviceName: decoded.deviceName,
        deviceType: decoded.deviceType,
      },
    });
  } catch (error) {
    console.error("Pending device login error:", error);
    return res.status(401).json({
      success: false,
      code: "PENDING_EXPIRED",
      message: "This sign-in request expired. Please try again.",
    });
  }
};

export const continueDeviceLogin = async (req, res) => {
  try {
    const { pendingToken, revokeDeviceId } = req.body || {};
    if (!pendingToken || !revokeDeviceId) {
      return res.status(400).json({
        success: false,
        message: "pendingToken and revokeDeviceId are required",
      });
    }

    const decoded = verifyDevicePendingToken(pendingToken);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const active = listActiveSessions(user);
    const revokeTarget = active.find(
      (device) => device.deviceId === revokeDeviceId,
    );

    if (!revokeTarget) {
      return res.status(400).json({
        success: false,
        message: "Selected device is no longer active",
      });
    }

    revokeDeviceSession(user, revokeDeviceId);
    upsertDeviceSession(user, {
      deviceId: decoded.deviceId,
      deviceName: decoded.deviceName,
      deviceType: decoded.deviceType,
      userAgent: decoded.userAgent,
    });

    user.lastLogin = new Date();
    user.lastLoginDevice = decoded.userAgent;

    const session = await issueUserSession(user, res, {
      preservePrevious: false,
      deviceId: decoded.deviceId,
      deviceName: decoded.deviceName,
      deviceType: decoded.deviceType,
      userAgent: decoded.userAgent,
    });

    if (!user.hasCompletedOnboarding) {
      return res.json({
        success: true,
        requiresOnboarding: true,
      });
    }

    return res.json({
      success: true,
      accessToken: session.accessToken,
    });
  } catch (error) {
    console.error("Continue device login error:", error);
    return res.status(401).json({
      success: false,
      code: "PENDING_EXPIRED",
      message: "This sign-in request expired. Please try again.",
    });
  }
};

export const revokeDevice = async (req, res) => {
  try {
    const user = req.user;
    const { deviceId } = req.body || {};
    const currentDeviceId = req.headers["device-id"];

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: "deviceId is required",
      });
    }

    if (deviceId === currentDeviceId) {
      return res.status(400).json({
        success: false,
        message: "Use logout to sign out this device",
      });
    }

    const revoked = revokeDeviceSession(user, deviceId);
    if (!revoked) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    await user.save();

    return res.json({
      success: true,
      message: "Device signed out",
    });
  } catch (error) {
    console.error("Revoke device error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not sign out device",
    });
  }
};

export const createPendingLoginRedirect = (user, ctx) => {
  const pendingToken = createDevicePendingToken({
    userId: user._id,
    deviceId: ctx.deviceId,
    deviceName: ctx.deviceName,
    deviceType: ctx.deviceType,
    userAgent: ctx.userAgent,
  });

  return `${process.env.FRONTEND_URL}/auth/devices?pending=${encodeURIComponent(pendingToken)}`;
};

export const completeOAuthDeviceLogin = async (req, res, user) => {
  const deviceIdHeader = req.query.state || req.headers["device-id"];
  const userAgent = req.headers["user-agent"];
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const ctx = resolveDeviceContext(userAgent, ip, deviceIdHeader);
  const evaluation = evaluateDeviceLogin(user, ctx);

  if (!evaluation.ok) {
    return res.redirect(createPendingLoginRedirect(user, ctx));
  }

  upsertDeviceSession(user, ctx);
  user.lastLogin = new Date();
  user.lastLoginDevice = userAgent;

  const session = await issueUserSession(user, res, {
    preservePrevious: false,
    deviceId: ctx.deviceId,
    deviceName: ctx.deviceName,
    deviceType: ctx.deviceType,
    userAgent: ctx.userAgent,
  });

  if (!user.hasCompletedOnboarding) {
    return res.redirect(`${process.env.FRONTEND_URL}/onboarding`);
  }

  if (process.env.AUTH_REDIRECT_TOKEN === "true") {
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth?token=${session.accessToken}`,
    );
  }

  return res.redirect(`${process.env.FRONTEND_URL}/auth`);
};
