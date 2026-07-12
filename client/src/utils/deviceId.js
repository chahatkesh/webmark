const STORAGE_KEY = "device-id";

export const getOrCreateDeviceId = () => {
  if (typeof window === "undefined") return "";

  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const nextId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `dev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  localStorage.setItem(STORAGE_KEY, nextId);
  return nextId;
};

export const setDeviceId = (deviceId) => {
  if (!deviceId || typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, deviceId);
};
