const BLOCKED_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "[::1]"]);

const isPrivateIp = (hostname) => {
  if (!hostname) return true;
  const lower = hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(lower)) return true;
  if (/^10\./.test(lower)) return true;
  if (/^192\.168\./.test(lower)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(lower)) return true;
  if (lower.endsWith(".local")) return true;
  return false;
};

export const isAllowedHttpUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) return false;

  let parsed;
  try {
    parsed = new URL(value.trim());
  } catch {
    return false;
  }

  if (!["http:", "https:"].includes(parsed.protocol)) return false;
  if (isPrivateIp(parsed.hostname)) return false;
  return true;
};

export const sanitizeHttpUrl = (value) =>
  isAllowedHttpUrl(value) ? value.trim() : null;

export const isAllowedImageUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) return false;
  const trimmed = value.trim();
  if (!trimmed.startsWith("https://")) return false;
  return isAllowedHttpUrl(trimmed);
};

export const sanitizeImageUrl = (value) =>
  isAllowedImageUrl(value) ? value.trim() : null;
