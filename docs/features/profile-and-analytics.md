# Profile & Analytics

Authenticated profile page at `/user/profile`.

## Sections

| Component          | Shows                                                     |
| ------------------ | --------------------------------------------------------- |
| `ProfileHero`      | Avatar, greeting, editable display name, email, join date |
| `ProfileStatStrip` | Bookmarks, categories, clicks, time saved, last opened    |
| `ActivityCharts`   | Recharts area chart — clicks over time (7d / 30d)         |
| `TopBookmarksList` | Most-opened bookmarks                                     |
| `CreditsCard`      | AI sorts remaining / 5, imports remaining / 2             |
| `DevicesCard`      | Active devices + remote revoke                            |

## Data Hooks

### `useProfile`

- `POST /api/user/profile`
- Returns profile, click stats, update helpers
- Syncs `currentDeviceId`, credit limits, and header avatar/name

### `useProfileAnalytics`

- `GET /api/user/profile/analytics?range=7d|30d`
- Returns `clicksOverTime[]`
- Uses SWR `keepPreviousData` for smooth range toggles

## Profile Update

```
PUT /api/user/profile
Body: { "name": "...", "picture": "..." }
```

## Credits Display

Credits are authoritative on the server (`aiSortsRemaining`, import month fields) and mirrored in `localStorage` for Header badges. Import bonuses and AI sort decrements update both.

## Devices

See [Device Management](../auth/device-management.md). Profile lists `activeDevices` / `maxDevices` (2 sessions, any device type) and supports `POST /api/user/devices/revoke` (atomic remote sign-out). Logout only clears the current session; use Devices → Sign out for the other one.
