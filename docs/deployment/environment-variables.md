# Environment Variables

## Client (`client/.env`)

| Variable       | Required | Default                 | Description                                         |
| -------------- | -------- | ----------------------- | --------------------------------------------------- |
| `VITE_API_URL` | Yes      | `http://localhost:4000` | API base URL used by `apiClient` and `StoreContext` |

Copy from `client/.env.example`.

## Server (`server/.env`)

Copy from `server/.env.example`.

### Core

| Variable                            | Required | Default | Description                      |
| ----------------------------------- | -------- | ------- | -------------------------------- |
| `PORT`                              | No       | `4000`  | Local listen port                |
| `HOST`                              | No       | —       | Optional bind host               |
| `NODE_ENV`                          | Prod     | —       | `development` / `production`     |
| `MONGO_URI`                         | **Yes**  | —       | MongoDB connection string        |
| `MONGO_MAX_POOL_SIZE`               | No       | `10`    | Mongoose pool size               |
| `MONGO_SERVER_SELECTION_TIMEOUT_MS` | No       | `5000`  | Selection timeout                |
| `JWT_SECRET`                        | **Yes**  | —       | Access JWT + OAuth state signing |

### URLs & CORS

| Variable                | Required | Default                                            | Description                             |
| ----------------------- | -------- | -------------------------------------------------- | --------------------------------------- |
| `FRONTEND_URL`          | **Yes**  | —                                                  | SPA origin; OAuth redirects             |
| `SERVER_URL`            | Prod     | `http://localhost:4000`                            | API origin; Google callback base        |
| `CORS_ORIGINS`          | Prod     | —                                                  | Extra allowed origins (comma-separated) |
| `ALLOW_VERCEL_PREVIEWS` | No       | `true` if unset in some docs; example uses `false` | Allow `*.vercel.app` origins            |

### Google OAuth

| Variable               | Required | Description         |
| ---------------------- | -------- | ------------------- |
| `GOOGLE_CLIENT_ID`     | **Yes**  | OAuth client ID     |
| `GOOGLE_CLIENT_SECRET` | **Yes**  | OAuth client secret |

### Session Cookies

| Variable                        | Required | Default                 | Description                   |
| ------------------------------- | -------- | ----------------------- | ----------------------------- |
| `ACCESS_TOKEN_TTL`              | No       | `15m`                   | JWT access TTL                |
| `ACCESS_COOKIE_MAX_AGE_SECONDS` | No       | `900`                   | `wm_access` max-age           |
| `SESSION_MAX_AGE_DAYS`          | No       | `365`                   | Refresh/session lifetime      |
| `REFRESH_REUSE_WINDOW_SECONDS`  | No       | `30`                    | Previous refresh hash grace   |
| `COOKIE_SECURE`                 | Prod     | `true` in prod if unset | Secure flag                   |
| `COOKIE_SAMESITE`               | Prod     | `none` prod / `lax` dev | SameSite                      |
| `COOKIE_DOMAIN`                 | No       | —                       | Optional shared parent domain |

### Cron & Stats

| Variable                         | Required | Default                | Description                                 |
| -------------------------------- | -------- | ---------------------- | ------------------------------------------- |
| `CRON_SECRET`                    | Prod     | —                      | Bearer token for `/api/cron/stats`          |
| `ENABLE_LOCAL_CRON`              | No       | enabled unless `false` | In-process node-cron                        |
| `RUN_CRON_ON_STARTUP`            | No       | —                      | Run stats job on boot when `true`           |
| `PUBLIC_STATS_CACHE_TTL_SECONDS` | No       | `300`                  | Public stats memory cache                   |
| `VERCEL`                         | Auto     | —                      | Set by Vercel; disables listen + local cron |

### AI

| Variable         | Required | Description                                  |
| ---------------- | -------- | -------------------------------------------- |
| `OPENAI_API_KEY` | No       | Enables AI sort + bookmarklet categorization |

## GitHub Actions Secrets

Used by `.github/workflows/ci.yml` deploy jobs:

| Secret                     | Purpose        |
| -------------------------- | -------------- |
| `VERCEL_TOKEN`             | Deploy auth    |
| `VERCEL_ORG_ID`            | Org            |
| `VERCEL_CLIENT_PROJECT_ID` | Client project |
| `VERCEL_SERVER_PROJECT_ID` | Server project |

## Local vs Production Cookies

```bash
# Local
COOKIE_SECURE=false
COOKIE_SAMESITE=lax

# Production (cross-origin SPA/API)
COOKIE_SECURE=true
COOKIE_SAMESITE=none
```

Never commit real `.env` values.
