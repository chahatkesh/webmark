const AUTH_ERROR_MESSAGES = {
  auth_failed: "Authentication failed. Please try again.",
  oauth_state_invalid: "Sign-in expired. Please try again.",
  device_limit: "Device limit reached. Choose a device to sign out.",
};

export const resolveAuthError = (code) =>
  AUTH_ERROR_MESSAGES[code] || AUTH_ERROR_MESSAGES.auth_failed;
