import jwt from "jsonwebtoken";
import { parseCookies } from "./authTokens.js";

export const ADMIN_COOKIE_NAME = "wm_admin";

const getAdminSessionHours = () => {
  const hours = Number(process.env.ADMIN_SESSION_HOURS || 8);
  return Number.isFinite(hours) && hours > 0 ? Math.min(hours, 24) : 8;
};

const getCookieOptions = (maxAge) => {
  const isProduction = process.env.NODE_ENV === "production";
  const secure = process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === "true"
    : isProduction;
  const sameSite =
    process.env.COOKIE_SAMESITE || (isProduction ? "none" : "lax");
  const domain = process.env.COOKIE_DOMAIN;

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
    maxAge,
    ...(domain ? { domain } : {}),
  };
};

export const createAdminToken = (adminId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    { id: String(adminId), typ: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: `${getAdminSessionHours()}h` },
  );
};

export const getAdminTokenFromRequest = (req) =>
  parseCookies(req)[ADMIN_COOKIE_NAME] || "";

export const setAdminCookie = (res, token) => {
  const maxAge = getAdminSessionHours() * 60 * 60 * 1000;
  res.cookie(ADMIN_COOKIE_NAME, token, getCookieOptions(maxAge));
};

export const clearAdminCookie = (res) => {
  res.clearCookie(ADMIN_COOKIE_NAME, getCookieOptions(0));
};
