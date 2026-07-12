import crypto from "crypto";
import jwt from "jsonwebtoken";

export const ACCESS_COOKIE_NAME = "wm_access";
export const REFRESH_COOKIE_NAME = "wm_refresh";

const DEFAULT_ACCESS_TOKEN_TTL = "15m";
const DEFAULT_ACCESS_COOKIE_SECONDS = 15 * 60;
const DEFAULT_SESSION_DAYS = 365;
const DEFAULT_REFRESH_REUSE_SECONDS = 30;

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return process.env.JWT_SECRET;
};

const numberFromEnv = (name, fallback) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

export const getAccessCookieMaxAgeMs = () =>
  numberFromEnv(
    "ACCESS_COOKIE_MAX_AGE_SECONDS",
    DEFAULT_ACCESS_COOKIE_SECONDS,
  ) * 1000;

export const getSessionMaxAgeMs = () =>
  numberFromEnv("SESSION_MAX_AGE_DAYS", DEFAULT_SESSION_DAYS) *
  24 *
  60 *
  60 *
  1000;

export const getRefreshReuseWindowMs = () =>
  numberFromEnv("REFRESH_REUSE_WINDOW_SECONDS", DEFAULT_REFRESH_REUSE_SECONDS) *
  1000;

export const getSessionExpiresAt = () =>
  new Date(Date.now() + getSessionMaxAgeMs());

export const createAccessToken = (id, options = {}) =>
  jwt.sign({ id: String(id), typ: options.type || "access" }, getJwtSecret(), {
    expiresIn: process.env.ACCESS_TOKEN_TTL || DEFAULT_ACCESS_TOKEN_TTL,
  });

export const createRefreshToken = () => crypto.randomBytes(64).toString("hex");

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const tokenHashMatches = (token, expectedHash) => {
  if (!token || !expectedHash) return false;
  const actual = Buffer.from(hashToken(token));
  const expected = Buffer.from(expectedHash);
  return (
    actual.length === expected.length &&
    crypto.timingSafeEqual(actual, expected)
  );
};

export const parseCookies = (req) => {
  const header = req.headers.cookie;
  if (!header) return {};

  return header.split(";").reduce((cookies, pair) => {
    const separatorIndex = pair.indexOf("=");
    if (separatorIndex === -1) return cookies;

    const key = pair.slice(0, separatorIndex).trim();
    const value = pair.slice(separatorIndex + 1).trim();
    if (!key) return cookies;

    try {
      cookies[key] = decodeURIComponent(value);
    } catch {
      cookies[key] = value;
    }
    return cookies;
  }, {});
};

export const getAccessTokenFromRequest = (req) => {
  const authorization = req.headers.authorization;
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  if (req.headers.token) {
    return req.headers.token;
  }

  return parseCookies(req)[ACCESS_COOKIE_NAME] || "";
};

export const getRefreshTokenFromRequest = (req) =>
  parseCookies(req)[REFRESH_COOKIE_NAME] || "";

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

export const setAuthCookies = (res, { accessToken, refreshToken }) => {
  res.cookie(
    ACCESS_COOKIE_NAME,
    accessToken,
    getCookieOptions(getAccessCookieMaxAgeMs()),
  );
  res.cookie(
    REFRESH_COOKIE_NAME,
    refreshToken,
    getCookieOptions(getSessionMaxAgeMs()),
  );
};

export const clearAuthCookies = (res) => {
  const baseOptions = getCookieOptions(0);
  res.clearCookie(ACCESS_COOKIE_NAME, baseOptions);
  res.clearCookie(REFRESH_COOKIE_NAME, baseOptions);
};
