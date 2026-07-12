import { getOrCreateDeviceId } from "./deviceId.js";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

let refreshPromise = null;

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);

export class ApiError extends Error {
  constructor(message, response, data) {
    super(message);
    this.name = "ApiError";
    this.response = response;
    this.status = response?.status;
    this.data = data;
    this.code = data?.code;
  }
}

export const buildApiUrl = (path) => {
  if (isAbsoluteUrl(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

const readJson = async (response) => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const storeAccessTokenFromResponse = (response) => {
  const token = response.headers.get("x-auth-token");
  if (token) {
    localStorage.setItem("token", token);
  }
};

export const clearLocalSession = () => {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("webmark:auth-cleared"));
};

const withDeviceHeader = (headers = {}) => {
  const requestHeaders = new Headers(headers);
  const deviceId = getOrCreateDeviceId();
  if (deviceId && !requestHeaders.has("device-id")) {
    requestHeaders.set("device-id", deviceId);
  }
  return requestHeaders;
};

export const refreshSession = async () => {
  if (!refreshPromise) {
    refreshPromise = fetch(buildApiUrl("/api/user/refresh"), {
      method: "POST",
      credentials: "include",
      headers: withDeviceHeader({ "Content-Type": "application/json" }),
    })
      .then(async (response) => {
        storeAccessTokenFromResponse(response);
        const data = await readJson(response);

        if (!response.ok || data?.success === false) {
          throw new ApiError(
            data?.message || "Session refresh failed",
            response,
            data,
          );
        }

        if (data?.accessToken) {
          localStorage.setItem("token", data.accessToken);
        }

        return data;
      })
      .catch((error) => {
        clearLocalSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const apiRequest = async (path, options = {}) => {
  const {
    body,
    headers = {},
    retryOnAuth = true,
    skipAuthRefresh = false,
    parseJson = true,
    ...rest
  } = options;

  const requestHeaders = withDeviceHeader(headers);
  const legacyToken = localStorage.getItem("token");

  if (
    legacyToken &&
    !requestHeaders.has("Authorization") &&
    !requestHeaders.has("token")
  ) {
    requestHeaders.set("Authorization", `Bearer ${legacyToken}`);
  }

  if (
    body !== undefined &&
    !(body instanceof FormData) &&
    !requestHeaders.has("Content-Type")
  ) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(buildApiUrl(path), {
    credentials: "include",
    ...rest,
    headers: requestHeaders,
    body:
      body === undefined || body instanceof FormData || typeof body === "string"
        ? body
        : JSON.stringify(body),
  });

  storeAccessTokenFromResponse(response);

  if (response.status === 401 && retryOnAuth && !skipAuthRefresh) {
    await refreshSession();
    return apiRequest(path, {
      body,
      headers,
      retryOnAuth: false,
      skipAuthRefresh,
      parseJson,
      ...rest,
    });
  }

  if (!parseJson) {
    if (!response.ok) {
      throw new ApiError(
        response.statusText || "Request failed",
        response,
        null,
      );
    }
    return response;
  }

  const data = await readJson(response);

  if (!response.ok || data?.success === false) {
    throw new ApiError(
      data?.message || response.statusText || "Request failed",
      response,
      data,
    );
  }

  return data;
};
