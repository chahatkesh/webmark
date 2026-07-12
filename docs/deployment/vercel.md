# Vercel Deployment

Webmark deploys as **two Vercel projects**: a Vite static client and a Node serverless API.

## Architecture Decision

| Concern | Approach                                       |
| ------- | ---------------------------------------------- |
| Client  | Static Vite build from `client/`               |
| Server  | `@vercel/node` from `server/server.js`         |
| Cron    | Vercel Cron → `GET /api/cron/stats` daily      |
| DB      | MongoDB Atlas (connection cached per isolate)  |
| State   | MongoDB only — no filesystem or process memory |

Keep the API on a long-running host only if you add WebSockets, workers, or jobs that exceed Vercel function duration limits.

## Project Setup

### 1. Client (`webmark-client`)

- Root directory: `client`
- Framework: Vite (see `client/vercel.json`)
- Install: `pnpm install --frozen-lockfile`
- Build: `pnpm run build`
- Output: `dist`
- SPA rewrites send non-asset paths to `index.html`

**Env:**

```bash
VITE_API_URL=https://your-server.vercel.app
```

### 2. Server (`webmark-server`)

- Root directory: `server`
- Config: `server/vercel.json`
- Builds `server.js` with `@vercel/node`
- Cron: `0 0 * * *` → `/api/cron/stats`

**Env:** see [Environment Variables](./environment-variables.md). Minimum production set includes `MONGO_URI`, `JWT_SECRET`, Google OAuth, `FRONTEND_URL`, `SERVER_URL`, `CORS_ORIGINS`, cookie flags, and `CRON_SECRET`.

## CLI Deploy

```bash
# Client
cd client
vercel link
vercel env pull
vercel build --prod
vercel deploy --prebuilt --prod

# Server
cd server
vercel link
vercel env pull
vercel build --prod
vercel deploy --prebuilt --prod
```

## Cookie Cross-Origin Notes

When the SPA and API are on different subdomains:

```bash
COOKIE_SECURE=true
COOKIE_SAMESITE=none
CORS_ORIGINS=https://your-client.vercel.app
FRONTEND_URL=https://your-client.vercel.app
SERVER_URL=https://your-server.vercel.app
```

Optional: `COOKIE_DOMAIN=.example.com` only if both share a parent domain and you want shared cookies.

## Rollback

```bash
vercel rollback
# or
vercel promote <deployment-url>
```

## Post-Deploy Checks

```bash
vercel logs --since 1h
vercel logs --since 24h --level error
```

Expected idle traffic:

- Landing: one public stats request on mount (no 30s polling)
- Dashboard: userdata + categories (bookmarks embedded — no N+1 per category)

## Related

- [CI/CD](./cicd.md)
- [Environment Variables](./environment-variables.md)
