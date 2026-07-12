import crypto from "crypto";
import jwt from "jsonwebtoken";

const getSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return process.env.JWT_SECRET;
};

export const createOAuthState = (deviceId = "") => {
  const safeDeviceId =
    typeof deviceId === "string" && deviceId.length <= 128 ? deviceId : "";

  return jwt.sign(
    {
      typ: "oauth_state",
      nonce: crypto.randomBytes(16).toString("hex"),
      deviceId: safeDeviceId,
    },
    getSecret(),
    { expiresIn: "10m" },
  );
};

export const verifyOAuthState = (state) => {
  if (!state || typeof state !== "string") {
    throw new Error("Missing OAuth state");
  }

  const decoded = jwt.verify(state, getSecret());
  if (decoded.typ !== "oauth_state") {
    throw new Error("Invalid OAuth state");
  }

  return {
    deviceId: typeof decoded.deviceId === "string" ? decoded.deviceId : "",
  };
};
