# Device Management

Webmark limits each account to **2 active devices** (typically one desktop and one mobile). Sessions are bound per device with separate refresh-token hashes.

## Why

Prevents unbounded session sprawl while still allowing phone + laptop use. Excess logins must revoke an existing device first.

## Client Device ID

**File:** `client/src/utils/deviceId.js`

- Stored in `localStorage` as `device-id`
- Sent on every API request as the `device-id` header (`apiClient.js`)
- Passed into OAuth as `?deviceId=` and embedded in signed OAuth `state`

## Server Evaluation

**Files:** `server/utils/deviceTracking.js`, `server/controllers/deviceController.js`

- `MAX_DEVICES = 2`
- A device is listed as active only when `isActive === true` **and** (`tokenExpiresAt` is in the future **or** `lastActive` is within 30 days)
- On OAuth success, `evaluateDeviceLogin` either upserts the device session or creates a pending login
- New devices join **only** via OAuth / continue-login — profile activity pings never create or reactivate sessions

## Pending Login Flow

When the limit is exceeded:

1. Server creates a `PendingLogin` document with a one-time `code` (10 minute TTL)
2. Browser redirects to `/auth/devices?code=...`
3. `AuthDevices` page loads devices via `GET /api/user/devices/pending?code=...`
4. User selects a device to revoke
5. `POST /api/user/devices/continue-login` with `{ code, revokeDeviceId }`
6. Server consumes the code, revokes the chosen device, issues cookies, redirects to dashboard or onboarding

Pending codes are single-use (`server/utils/pendingLogin.js`).

## Profile Revoke

Authenticated users can manage devices on the Profile page (`DevicesCard`):

- Lists `activeDevices` from `POST /api/user/profile`
- Remote revoke: `POST /api/user/devices/revoke` with `{ deviceId }`
- Cannot revoke the current device from this endpoint (use logout instead)

### What revoke does

Atomic Mongo update (`updateOne` + `arrayFilters`):

1. Sets `loginDevices.$.isActive = false`
2. Unsets that device’s refresh hashes and `tokenExpiresAt`
3. If the user-level refresh mirror matched that device, clears it too

The revoked device’s next API call (with its `device-id` header) gets `401` + `code: "SESSION_REVOKED"`. Refresh is rejected the same way. Cookies are cleared; the client must sign in again.

### Activity pings

After `POST /api/user/profile`, `persistDeviceActivity` only bumps `lastActive` / `userAgent` on an **already-active** matching device via an atomic `$set`. It does not upsert or flip `isActive` back to `true`, so it cannot undo a remote revoke.

## Logout vs revoke

| Action                          | Scope                   |
| ------------------------------- | ----------------------- |
| `POST /api/user/logout`         | Current device only     |
| `POST /api/user/devices/revoke` | Another device (remote) |

There is no “sign out everywhere” endpoint. To clear the other session, use Profile → Devices → Sign out.

## Endpoints

| Method | Path                               | Auth         | Purpose                      |
| ------ | ---------------------------------- | ------------ | ---------------------------- |
| GET    | `/api/user/devices/pending`        | Pending code | List devices for conflict UI |
| POST   | `/api/user/devices/continue-login` | Pending code | Revoke + complete login      |
| POST   | `/api/user/devices/revoke`         | Session      | Revoke another device        |

All pending/continue routes use `deviceLoginRateLimit` (20 / 15 min).

## Data Shape

Each `loginDevices[]` entry stores `deviceId`, `deviceName`, `deviceType` (`desktop` \| `mobile`), `userAgent`, `lastActive`, `isActive`, and device-scoped refresh hashes. See [Data Model](../architecture/data-model.md).
