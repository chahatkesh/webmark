# CI/CD

Continuous integration and deployment live in `.github/workflows/ci.yml`.

## Triggers

- **Pull requests** — quality jobs only
- **Push to `main`** — quality jobs, then production deploys

Concurrency: one run per workflow+ref; in-progress runs cancel.

## Jobs

### Quality

| Job      | What it runs                                                 |
| -------- | ------------------------------------------------------------ |
| `client` | `pnpm install --frozen-lockfile` → lint → type-check → build |
| `server` | install → lint → build                                       |
| `format` | `pnpm format:check`                                          |

Node 20 + pnpm with lockfile caching.

### Deploy (main only)

Both deploy jobs need `[client, server, format]` to pass.

| Job             | Target                                             |
| --------------- | -------------------------------------------------- |
| `deploy-client` | Vercel client project (`VERCEL_CLIENT_PROJECT_ID`) |
| `deploy-server` | Vercel server project (`VERCEL_SERVER_PROJECT_ID`) |

Flow per project:

1. `vercel pull --environment=production`
2. `vercel build --prod`
3. `vercel deploy --prebuilt --prod`

Server deploy additionally verifies the serverless bundle includes `node_modules` (pnpm monorepo needs Vercel CLI ≥ 55). The workflow pins `VERCEL_CLI_VERSION: 55.0.0`.

## Required Secrets

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_CLIENT_PROJECT_ID
VERCEL_SERVER_PROJECT_ID
```

## Duplicate Deploys

If Vercel Git integration is also enabled for the same projects, disable auto-deploys there **or** remove the deploy jobs — otherwise every push to `main` ships twice.

## Local Parity

Before opening a PR:

```bash
pnpm lint
pnpm type-check
pnpm format:check
pnpm --filter client run build
pnpm --filter server run build
```
