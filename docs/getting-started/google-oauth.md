# Google OAuth Setup

Webmark uses Google OAuth 2.0 only (no email/password). Passport strategy: `server/config/passport.js`.

## Create Credentials

1. Open [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create or select a project
3. Configure the **OAuth consent screen** (External or Internal)
4. Create an **OAuth 2.0 Client ID** (Web application)

### Authorized JavaScript origins

| Environment | Origin                                                  |
| ----------- | ------------------------------------------------------- |
| Local       | `http://localhost:4000`                                 |
| Production  | Your API origin (e.g. `https://your-server.vercel.app`) |

### Authorized redirect URIs

| Environment | Redirect URI                                                   |
| ----------- | -------------------------------------------------------------- |
| Local       | `http://localhost:4000/api/user/auth/google/callback`          |
| Production  | `https://your-server.vercel.app/api/user/auth/google/callback` |

## Server Environment

```bash
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
SERVER_URL=http://localhost:4000          # callback base
FRONTEND_URL=http://localhost:5173        # post-login redirect
```

In production, set `SERVER_URL` and `FRONTEND_URL` to the live API and SPA origins.

## Flow Summary

1. Client opens `GET /api/user/auth/google?deviceId=...`
2. Server embeds `deviceId` in a signed JWT `state` (`server/utils/oauthState.js`)
3. Google redirects to `/api/user/auth/google/callback`
4. Passport finds or creates the user
5. Device evaluation either issues cookies or redirects to `/auth/devices?code=...`

Details: [Session Flow](../auth/session-flow.md) and [Device Management](../auth/device-management.md).

## Security Checklist

- Keep `GOOGLE_CLIENT_SECRET` and `JWT_SECRET` server-only
- Use HTTPS in production
- Production cookies: `COOKIE_SECURE=true`, `COOKIE_SAMESITE=none` for cross-origin SPA/API
- Auth endpoints are rate-limited (`authRateLimit`)

## Scopes

Passport requests standard Google profile scopes (email + profile). No Google Drive or other APIs are required.
