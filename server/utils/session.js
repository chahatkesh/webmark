import {
  clearAuthCookies,
  createAccessToken,
  createRefreshToken,
  getRefreshReuseWindowMs,
  getSessionExpiresAt,
  hashToken,
  setAuthCookies,
} from "./authTokens.js";

export const issueUserSession = async (user, res, options = {}) => {
  const { preservePrevious = true } = options;
  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken();

  if (preservePrevious && user.refreshTokenHash) {
    user.previousRefreshTokenHash = user.refreshTokenHash;
    user.previousRefreshTokenExpiresAt = new Date(
      Date.now() + getRefreshReuseWindowMs(),
    );
  } else {
    user.previousRefreshTokenHash = undefined;
    user.previousRefreshTokenExpiresAt = undefined;
  }

  user.refreshTokenHash = hashToken(refreshToken);
  user.refreshToken = undefined;
  user.tokenExpiresAt = getSessionExpiresAt();
  await user.save();

  setAuthCookies(res, { accessToken, refreshToken });

  return {
    accessToken,
    expiresAt: user.tokenExpiresAt,
  };
};

export const clearUserSession = async (user, res) => {
  if (user) {
    user.refreshToken = undefined;
    user.refreshTokenHash = undefined;
    user.previousRefreshTokenHash = undefined;
    user.previousRefreshTokenExpiresAt = undefined;
    user.tokenExpiresAt = undefined;
    await user.save();
  }

  clearAuthCookies(res);
};
