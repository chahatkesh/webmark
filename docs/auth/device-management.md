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
- A device stays “active” if `tokenExpiresAt` is future **or** `lastActive` is within 30 days
- On OAuth success, `evaluateDeviceLogin` either upserts the device session or creates a pending login

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
- Cannot revoke the current device from this endpoint

## Endpoints

| Method | Path                               | Auth         | Purpose                      |
| ------ | ---------------------------------- | ------------ | ---------------------------- |
| GET    | `/api/user/devices/pending`        | Pending code | List devices for conflict UI |
| POST   | `/api/user/devices/continue-login` | Pending code | Revoke + complete login      |
| POST   | `/api/user/devices/revoke`         | Session      | Revoke another device        |

All pending/continue routes use `deviceLoginRateLimit` (20 / 15 min).

## Data Shape

Each `loginDevices[]` entry stores `deviceId`, `deviceName`, `deviceType` (`desktop` \| `mobile`), `userAgent`, `lastActive`, `isActive`, and device-scoped refresh hashes. See [Data Model](../architecture/data-model.md).
