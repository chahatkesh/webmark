# Deployment And CI/CD

## Architecture Decision

The client should deploy as a Vercel Vite static app from `client/`.

The server can deploy as a separate Vercel Node function project from `server/` after the serverless refactor:

- `server.js` exports the Express app and only calls `listen()` outside Vercel.
- MongoDB connections are reused through a cached Mongoose connection promise.
- In-process cron startup is disabled on Vercel.
- Scheduled stats collection runs through `GET /api/cron/stats` via Vercel Cron.
- API state lives in MongoDB, not local filesystem or process memory.

Keep the server on a long-running host only if future features add WebSockets, persistent workers, or jobs that exceed Vercel function duration limits.

## Vercel Projects

Create two Vercel projects:

1. `webmark-client`
   - Root directory: `client`
   - Framework: Vite
   - Build command: `pnpm run build`
   - Output directory: `dist`

2. `webmark-server`
   - Root directory: `server`
   - Framework: Other
   - Build handled by `server/vercel.json`

## Required Environment Variables

Client:

```bash
VITE_API_URL=https://your-server.vercel.app
```

Server:

```bash
NODE_ENV=production
MONGO_URI=
JWT_SECRET=
FRONTEND_URL=https://your-client.vercel.app
SERVER_URL=https://your-server.vercel.app
CORS_ORIGINS=https://your-client.vercel.app
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
OPENAI_API_KEY=
CRON_SECRET=
COOKIE_SECURE=true
COOKIE_SAMESITE=none
ACCESS_TOKEN_TTL=15m
ACCESS_COOKIE_MAX_AGE_SECONDS=900
SESSION_MAX_AGE_DAYS=365
PUBLIC_STATS_CACHE_TTL_SECONDS=300
ALLOW_VERCEL_PREVIEWS=true
```

CI secrets:

```bash
VERCEL_TOKEN=
VERCEL_ORG_ID=
VERCEL_CLIENT_PROJECT_ID=
VERCEL_SERVER_PROJECT_ID=
```

## CLI Setup

From `client/`:

```bash
vercel link
vercel env pull
vercel build
vercel deploy --prebuilt
vercel build --prod
vercel deploy --prebuilt --prod
```

From `server/`:

```bash
vercel link
vercel env pull
vercel build
vercel deploy --prebuilt
vercel build --prod
vercel deploy --prebuilt --prod
```

## GitHub Actions

The repository includes:

- `.github/workflows/ci.yml`: installs, lints, and builds client and server.
- `.github/workflows/vercel-deploy.yml`: creates preview deployments for pull requests and production deployments for `main`.

If Vercel Git integration is also enabled, disable duplicate auto-deploys or remove the deploy workflow to avoid two deployments for each push.

## Rollback

Use Vercel's instant rollback:

```bash
vercel rollback
```

Or promote a known-good preview:

```bash
vercel promote <deployment-url>
```

## Request-Volume Monitoring

After deployment:

```bash
vercel logs --since 1h
vercel logs --since 24h --level error
```

Expected idle behavior:

- The landing page performs one public stats request on mount.
- Public stats no longer poll every 30 seconds.
- The dashboard performs one user/session request and one categories request on entry.
- Category cards no longer issue one `/bookmarks/:categoryId` request per category.
- Route prefetch no longer requests non-existent `/about` or `/features` documents.
