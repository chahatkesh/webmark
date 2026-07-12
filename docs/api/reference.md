# API Reference

Base URL: `VITE_API_URL` (local default `http://localhost:4000`). All JSON APIs under `/api/`.

## Authentication

Protected routes require a valid access token from (in order):

1. `wm_access` httpOnly cookie (primary)
2. `Authorization: Bearer <token>`
3. `token` request header (legacy)

Send cookies with every SPA request: `credentials: "include"`. Include `device-id` header for session binding.

Refresh: `POST /api/user/refresh` with `wm_refresh` cookie.

Error shape:

```json
{ "success": false, "message": "...", "code": "OPTIONAL_CODE" }
```

Common auth `code` values: `AUTH_REQUIRED`, `ACCESS_TOKEN_EXPIRED`, `INVALID_TOKEN`, `SESSION_EXPIRED`, `SESSION_REVOKED`, `REFRESH_EXPIRED`, `RATE_LIMITED`.

`SESSION_REVOKED` means this device was signed out remotely (Profile → Devices). Cookies are cleared; the client must OAuth again.

Rate-limit responses use HTTP `429` and `code: "RATE_LIMITED"`.

---

## User (`/api/user`)

| Method | Path                      | Auth           | Limiter     | Handler                        |
| ------ | ------------------------- | -------------- | ----------- | ------------------------------ |
| GET    | `/auth/google`            | —              | auth        | Start OAuth (`?deviceId=`)     |
| GET    | `/auth/google/callback`   | —              | auth        | OAuth callback                 |
| GET    | `/devices/pending`        | pending code   | deviceLogin | Device conflict UI data        |
| POST   | `/devices/continue-login` | pending code   | deviceLogin | Revoke + complete login        |
| POST   | `/refresh`                | refresh cookie | refresh     | Rotate session                 |
| POST   | `/userdata`               | access         | —           | Current user / onboarding flag |
| POST   | `/complete-onboarding`    | access         | —           | Set username + seed defaults   |
| POST   | `/logout`                 | access         | —           | Clear **this** device session  |
| POST   | `/devices/revoke`         | access         | —           | Sign out another device        |
| POST   | `/profile`                | access         | —           | Profile + devices + credits    |
| GET    | `/profile/analytics`      | access         | —           | `?range=7d\|30d` click series  |
| PUT    | `/profile`                | access         | —           | Update name/picture            |

### Continue login body

```json
{ "code": "pending_code", "revokeDeviceId": "device_id" }
```

### Revoke device body

```json
{ "deviceId": "device_id" }
```

Cannot revoke the current device; use `/logout` instead.

### Profile update body

```json
{ "name": "Display Name", "picture": "https://..." }
```

---

## Bookmarks (`/api/bookmarks`)

| Method | Path                         | Auth        | Limiter | Handler                         |
| ------ | ---------------------------- | ----------- | ------- | ------------------------------- |
| GET    | `/save`                      | bookmarklet | —       | HTML popup save                 |
| GET    | `/categories`                | access      | —       | Categories + embedded bookmarks |
| GET    | `/categories-with-bookmarks` | access      | —       | Same as `/categories`           |
| POST   | `/category`                  | access      | —       | Create category                 |
| PUT    | `/category`                  | access      | —       | Update category                 |
| PUT    | `/categories/reorder`        | access      | —       | Reorder categories              |
| DELETE | `/category`                  | access      | —       | Delete category (+ bookmarks)   |
| GET    | `/bookmarks/:categoryId`     | access      | —       | Bookmarks for one category      |
| POST   | `/bookmark`                  | access      | —       | Create bookmark                 |
| PUT    | `/bookmark`                  | access      | —       | Update bookmark                 |
| DELETE | `/bookmark`                  | access      | —       | Delete bookmark                 |
| PUT    | `/reorder`                   | access      | —       | Reorder within one category     |
| PUT    | `/reorder-layout`            | access      | —       | Batch cross-category layout     |
| POST   | `/import`                    | access      | import  | HTML import                     |
| POST   | `/ai/sort`                   | access      | ai      | Bulk AI sort                    |
| POST   | `/ai/sort/revert`            | access      | ai      | Revert last AI sort             |

### Create category

```json
{
  "category": "Reading",
  "bgcolor": "#f7fee7",
  "hcolor": "#4d7c0f",
  "emoji": "📚"
}
```

### Create bookmark

```json
{
  "categoryId": "...",
  "name": "Example",
  "link": "https://example.com",
  "logo": "https://example.com/favicon.ico"
}
```

### Reorder layout

Batch payload of categories with ordered bookmark IDs (see `reorderBookmarkLayout` / client `getLayoutUpdates`).

### AI sort

```json
{ "mode": "all" }
```

or `{ "mode": "uncategorized" }`.

---

## Clicks (`/api/clicks`)

| Method | Path     | Auth   | Purpose                               |
| ------ | -------- | ------ | ------------------------------------- |
| POST   | `/track` | access | Increment bookmark + user click stats |
| POST   | `/stats` | access | User click statistics                 |

```json
{ "bookmarkId": "..." }
```

---

## Stats (`/api/stats`)

| Method | Path                | Auth | Limiter     | Purpose                                        |
| ------ | ------------------- | ---- | ----------- | ---------------------------------------------- |
| GET    | `/public`           | —    | publicStats | Landing-page aggregates (`?range=`)            |
| GET    | `/historical/:type` | —    | publicStats | Historical series (`daily`/`weekly`/`monthly`) |

Cached in-memory for `PUBLIC_STATS_CACHE_TTL_SECONDS` (default 300).

---

## Cron (`/api/cron`)

| Method | Path     | Auth                                                 | Purpose              |
| ------ | -------- | ---------------------------------------------------- | -------------------- |
| GET    | `/stats` | `Authorization: Bearer ${CRON_SECRET}` in production | Collect public stats |

Scheduled daily via Vercel Cron (`0 0 * * *`).

---

## Tweets (`/api/tweets`)

| Method | Path   | Auth | Purpose                                                       |
| ------ | ------ | ---- | ------------------------------------------------------------- |
| GET    | `/:id` | —    | Public tweet fetch for landing testimonials (1h memory cache) |

---

## Rate Limits

| Name                   | Window | Max | Applied to                   |
| ---------------------- | ------ | --- | ---------------------------- |
| `authRateLimit`        | 15 min | 30  | Google auth start + callback |
| `refreshRateLimit`     | 15 min | 60  | `/refresh`                   |
| `deviceLoginRateLimit` | 15 min | 20  | pending + continue-login     |
| `aiRateLimit`          | 1 hour | 15  | AI sort + revert             |
| `importRateLimit`      | 1 hour | 6   | Import                       |
| `publicStatsRateLimit` | 1 min  | 60  | Public/historical stats      |

Defined in `server/middleware/rateLimit.js`.

## Related Docs

- [Session Flow](../auth/session-flow.md)
- [Device Management](../auth/device-management.md)
- [Architecture Overview](../architecture/overview.md)
