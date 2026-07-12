import userModel from "../models/userModel.js";
import {
  evaluateDeviceLogin,
  listActiveSessions,
  resolveDeviceContext,
  revokeDeviceSession,
  toDeviceResponse,
  upsertDeviceSession,
} from "../utils/deviceTracking.js";
import {
  createPendingLoginCode,
  loadPendingLogin,
} from "../utils/pendingLogin.js";
import { verifyOAuthState } from "../utils/oauthState.js";
import { issueUserSession } from "../utils/session.js";

export const getPendingDeviceLogin = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Missing sign-in code",
      });
    }

    const pending = await loadPendingLogin(code);
    if (!pending) {
      return res.status(401).json({
        success: false,
        code: "PENDING_EXPIRED",
        message: "This sign-in request expired. Please try again.",
      });
    }

    const user = await userModel.findById(pending.userId);
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
        toDeviceResponse(device, pending.deviceId),
      ),
      newDevice: {
        deviceId: pending.deviceId,
        deviceName: pending.deviceName,
        deviceType: pending.deviceType,
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
    const { code, revokeDeviceId } = req.body || {};
    if (!code || !revokeDeviceId) {
      return res.status(400).json({
        success: false,
        message: "code and revokeDeviceId are required",
      });
    }

    const pending = await loadPendingLogin(code, { consume: true });
    if (!pending) {
      return res.status(401).json({
        success: false,
        code: "PENDING_EXPIRED",
        message: "This sign-in request expired. Please try again.",
      });
    }

    const user = await userModel.findById(pending.userId);
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
      deviceId: pending.deviceId,
      deviceName: pending.deviceName,
      deviceType: pending.deviceType,
      userAgent: pending.userAgent,
    });

    user.lastLogin = new Date();
    user.lastLoginDevice = pending.userAgent;

    await issueUserSession(user, res, {
      preservePrevious: false,
      deviceId: pending.deviceId,
      deviceName: pending.deviceName,
      deviceType: pending.deviceType,
      userAgent: pending.userAgent,
    });

    if (!user.hasCompletedOnboarding) {
      return res.json({
        success: true,
        requiresOnboarding: true,
      });
    }

    return res.json({ success: true });
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
    const currentDeviceId = req.deviceId;

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

export const createPendingLoginRedirect = async (user, ctx) => {
  const code = await createPendingLoginCode({
    userId: user._id,
    deviceId: ctx.deviceId,
    deviceName: ctx.deviceName,
    deviceType: ctx.deviceType,
    userAgent: ctx.userAgent,
  });

  return `${process.env.FRONTEND_URL}/auth/devices?code=${encodeURIComponent(code)}`;
};

export const completeOAuthDeviceLogin = async (req, res, user) => {
  let deviceIdFromState = "";
  try {
    deviceIdFromState = verifyOAuthState(req.query.state).deviceId;
  } catch (error) {
    console.error("OAuth state verification failed:", error.message);
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth?error=oauth_state_invalid`,
    );
  }

  const userAgent = req.headers["user-agent"];
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const ctx = resolveDeviceContext(userAgent, ip, deviceIdFromState);
  const evaluation = evaluateDeviceLogin(user, ctx);

  if (!evaluation.ok) {
    const redirectUrl = await createPendingLoginRedirect(user, ctx);
    return res.redirect(redirectUrl);
  }

  upsertDeviceSession(user, ctx);
  user.lastLogin = new Date();
  user.lastLoginDevice = userAgent;

  await issueUserSession(user, res, {
    preservePrevious: false,
    deviceId: ctx.deviceId,
    deviceName: ctx.deviceName,
    deviceType: ctx.deviceType,
    userAgent: ctx.userAgent,
  });

  if (!user.hasCompletedOnboarding) {
    return res.redirect(`${process.env.FRONTEND_URL}/onboarding`);
  }

  return res.redirect(`${process.env.FRONTEND_URL}/auth`);
};
