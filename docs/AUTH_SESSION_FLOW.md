# Authentication And Session Flow

## Overview

Webmark uses Google OAuth for sign-in, short-lived JWT access tokens for API authorization, and a long-lived refresh token stored in an `httpOnly` cookie for session persistence.

The client still accepts a legacy access token in `localStorage` for migration compatibility, but the durable session is the refresh cookie.

## Login

1. The client sends the user to `GET /api/user/auth/google`.
2. Google redirects back to `GET /api/user/auth/google/callback`.
3. The server creates:
   - `wm_access`: short-lived `httpOnly` access-token cookie.
   - `wm_refresh`: long-lived `httpOnly` refresh-token cookie.
   - `refreshTokenHash`: SHA-256 hash stored on the user record.
4. The server redirects to the frontend.
5. The frontend calls `POST /api/user/userdata` with `credentials: include`.

## Refresh

All client API calls go through `client/src/utils/apiClient.js`.

When an API call receives `401`:

1. The client starts one shared refresh request to `POST /api/user/refresh`.
2. Concurrent failed requests wait on the same promise.
3. The server verifies `wm_refresh` against the current refresh hash or the short previous-token grace window.
4. The server rotates the refresh token, sets new cookies, and returns one fresh access token for legacy compatibility.
5. The original request retries once.

This prevents duplicate refresh storms and infinite request loops.

## Logout

`POST /api/user/logout` clears:

- access and refresh cookies
- current device session (when bound to refresh token)
- previous refresh-token grace hash
- session expiration timestamp

## Device limit sign-in

When two devices are already active, OAuth redirects to `/auth/devices?code=...` with a one-time server code (10 minute TTL). The user picks a device to revoke, then `POST /api/user/devices/continue-login` completes sign-in. OAuth `state` is a signed JWT binding CSRF protection and client `deviceId`.

## Cookie Environment

Production cross-origin deployments should use:

```bash
COOKIE_SECURE=true
COOKIE_SAMESITE=none
```

For local development:

```bash
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
```

Use `COOKIE_DOMAIN=.example.com` only when the client and server share a parent domain and you intentionally want cookies shared across subdomains.

## Required Server Variables

```bash
JWT_SECRET=
FRONTEND_URL=
SERVER_URL=
CORS_ORIGINS=
ACCESS_TOKEN_TTL=15m
ACCESS_COOKIE_MAX_AGE_SECONDS=900
SESSION_MAX_AGE_DAYS=365
REFRESH_REUSE_WINDOW_SECONDS=30
COOKIE_SECURE=true
COOKIE_SAMESITE=none
```

Do not commit real values.
