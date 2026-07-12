# Developer Setup

Local development for the Webmark monorepo.

## Prerequisites

- **Node.js** 20+
- **pnpm** ([pnpm.io](https://pnpm.io/) or `corepack enable`)
- **MongoDB** — local or [Atlas](https://www.mongodb.com/cloud/atlas)
- **Google OAuth** credentials — [setup guide](./google-oauth.md)
- **OpenAI API key** (optional) — AI sort and bookmarklet categorization

## Install

```bash
git clone https://github.com/chahatkesh/webmark.git
cd webmark
pnpm install
```

## Environment

### Server

```bash
cp server/.env.example server/.env
```

Minimum required values:

```bash
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/webmark
JWT_SECRET=your_very_secure_jwt_secret

FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
SERVER_URL=http://localhost:4000

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

COOKIE_SECURE=false
COOKIE_SAMESITE=lax

# Optional
OPENAI_API_KEY=sk-...
```

Full list: [Environment Variables](../deployment/environment-variables.md).

### Client

```bash
cp client/.env.example client/.env
```

```bash
VITE_API_URL=http://localhost:4000
```

## Run

```bash
pnpm dev
```

Uses [mprocs](https://github.com/pvolok/mprocs) to start both apps:

| App      | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:4000 |

Or separately:

```bash
pnpm dev:client
pnpm dev:server
```

## Scripts

| Command             | Description                               |
| ------------------- | ----------------------------------------- |
| `pnpm dev`          | Client + server via mprocs                |
| `pnpm lint`         | ESLint (client) + syntax check (server)   |
| `pnpm type-check`   | TypeScript check for client UI components |
| `pnpm format`       | Prettier write                            |
| `pnpm format:check` | Prettier check (CI)                       |

## Project Structure

### Server (`server/`)

```
config/        # db.js, passport.js
controllers/   # Route handlers
middleware/    # auth, bookmarklet, rateLimit
models/        # Mongoose schemas
routes/        # Express routers
utils/         # sessions, AI, devices, cron
server.js      # Entry (exports app for Vercel)
```

### Client (`client/`)

```
src/
  components/  # Dashboard, home, profile, UI
  context/     # AuthContext, StoreContext
  hooks/       # SWR hooks
  layouts/     # AuthenticatedLayout
  pages/       # Route pages
  utils/       # apiClient, DnD, SEO, deviceId
```

## Workflow

1. Branch: `git checkout -b feature/your-feature`
2. Commit with [conventional commits](https://www.conventionalcommits.org/)
3. Run `pnpm lint && pnpm format:check`
4. Open a PR against `main`

## Debugging Tips

- API calls use `credentials: "include"` via `client/src/utils/apiClient.js`
- On 401, the client single-flights `POST /api/user/refresh`
- Local cookies: `COOKIE_SECURE=false`, `COOKIE_SAMESITE=lax`
- Clear browser cookies + `localStorage` (`token`, `device-id`) if auth state is stuck

## Common Issues

| Symptom                  | Fix                                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| Mongo connection fails   | Start local MongoDB or fix Atlas URI / IP allowlist                                           |
| Google login fails       | Check client ID/secret and redirect URI `http://localhost:4000/api/user/auth/google/callback` |
| Frontend can't reach API | Both processes running; `VITE_API_URL` and `CORS_ORIGINS` match                               |
| Session not sticking     | See [Session Flow](../auth/session-flow.md)                                                   |

## Next

- [Google OAuth](./google-oauth.md)
- [Deployment](../deployment/vercel.md)
- [API Reference](../api/reference.md)
