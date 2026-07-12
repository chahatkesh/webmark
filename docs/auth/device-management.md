# Device Management

Webmark limits each account to **2 active sessions**, regardless of device type (two phones, two browsers, or phone + laptop are all fine). Sessions are bound per client `deviceId` with separate refresh-token hashes.

## Why

Prevents unbounded session sprawl while still allowing a couple of concurrent signed-in clients. Excess logins must revoke an existing session first.

## Client Device ID

**File:** `client/src/utils/deviceId.js`

- Stored in `localStorage` as `device-id`
- Sent on every API request as the `device-id` header (`apiClient.js`)
- Passed into OAuth as `?deviceId=` and embedded in signed OAuth `state`

## Server Evaluation

**Files:** `server/utils/deviceTracking.js`, `server/controllers/deviceController.js`

- `MAX_DEVICES = 2` — count of active sessions only; **not** split by desktop/mobile
- A session is listed as active only when `isActive === true` **and** (`tokenExpiresAt` is in the future **or** `lastActive` is within 30 days)
- On OAuth success, `evaluateDeviceLogin` either upserts that `deviceId` or creates a pending login when two other sessions are already active
- New sessions join **only** via OAuth / continue-login — profile activity pings never create or reactivate sessions
- `deviceType` (`desktop` \| `mobile`) is display metadata for icons/labels only

## Pending Login Flow

When the limit is exceeded:

1. Server creates a `PendingLogin` document with a one-time `code` (10 minute TTL)
2. Browser redirects to `/auth/devices?code=...`
3. `AuthDevices` page loads devices via `GET /api/user/devices/pending?code=...`
4. User selects a session to revoke
5. `POST /api/user/devices/continue-login` with `{ code, revokeDeviceId }`
6. Server consumes the code, revokes the chosen session, issues cookies, redirects to dashboard or onboarding

Pending codes are single-use (`server/utils/pendingLogin.js`).

## Profile Revoke

Authenticated users can manage sessions on the Profile page (`DevicesCard`):

- Lists `activeDevices` from `POST /api/user/profile`
- Remote revoke: `POST /api/user/devices/revoke` with `{ deviceId }`
- Cannot revoke the current session from this endpoint (use logout instead)

### What revoke does

Atomic Mongo update (`updateOne` + `arrayFilters`):

1. Sets `loginDevices.$.isActive = false`
2. Unsets that device’s refresh hashes and `tokenExpiresAt`
3. If the user-level refresh mirror matched that device, clears it too

The revoked client’s next API call (with its `device-id` header) gets `401` + `code: "SESSION_REVOKED"`. Refresh is rejected the same way. Cookies are cleared; the client must sign in again.

### Activity pings

After `POST /api/user/profile`, `persistDeviceActivity` only bumps `lastActive` / `userAgent` on an **already-active** matching `deviceId` via an atomic `$set`. It does not upsert or flip `isActive` back to `true`, so it cannot undo a remote revoke.

## Logout vs revoke

| Action                          | Scope                    |
| ------------------------------- | ------------------------ |
| `POST /api/user/logout`         | Current session only     |
| `POST /api/user/devices/revoke` | Another session (remote) |

There is no “sign out everywhere” endpoint. To clear the other session, use Profile → Devices → Sign out.

## Endpoints

| Method | Path                               | Auth         | Purpose                       |
| ------ | ---------------------------------- | ------------ | ----------------------------- |
| GET    | `/api/user/devices/pending`        | Pending code | List sessions for conflict UI |
| POST   | `/api/user/devices/continue-login` | Pending code | Revoke + complete login       |
| POST   | `/api/user/devices/revoke`         | Session      | Revoke another session        |

All pending/continue routes use `deviceLoginRateLimit` (20 / 15 min).

## Data Shape

Each `loginDevices[]` entry stores `deviceId`, `deviceName`, `deviceType` (UI metadata: `desktop` \| `mobile`), `userAgent`, `lastActive`, `isActive`, and device-scoped refresh hashes. See [Data Model](../architecture/data-model.md).
