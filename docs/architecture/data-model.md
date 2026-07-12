# Data Model

All collections are Mongoose schemas under `server/models/`.

## User

**Collection:** `users` · **File:** `server/models/userModel.js`

| Field                           | Type                    | Notes                                             |
| ------------------------------- | ----------------------- | ------------------------------------------------- |
| `username`                      | String (unique)         | Temp `user_<random>` until onboarding             |
| `email`                         | String (unique)         | From Google                                       |
| `googleId`                      | String (unique, sparse) | Google subject                                    |
| `name`, `profilePicture`        | String                  | Synced from Google                                |
| `joinedAt`                      | Date                    |                                                   |
| `hasCompletedOnboarding`        | Boolean                 | Default `false`                                   |
| `refreshTokenHash`              | String                  | SHA-256 of current refresh token                  |
| `previousRefreshTokenHash`      | String                  | Grace window after rotation                       |
| `previousRefreshTokenExpiresAt` | Date                    | Default grace: 30s                                |
| `tokenExpiresAt`                | Date                    | Session max age                                   |
| `lastLogin`, `lastLoginDevice`  | Date / String           |                                                   |
| `loginDevices[]`                | Subdocs                 | Per-device sessions (see below)                   |
| `stats`                         | Object                  | `totalClicks`, `timeSaved`, `lastClickedBookmark` |
| `aiSortsRemaining`              | Number                  | Default `5`                                       |
| `importBonusUsedThisMonth`      | Number                  | Monthly import bonus counter                      |
| `importBonusMonthKey`           | String                  | `YYYY-MM`                                         |
| `aiSortSnapshot`                | Object                  | Last AI sort revert payload                       |
| `refreshToken`                  | String                  | Legacy plaintext; migrated on auth                |

### `loginDevices` subdocument

| Field                                                                             | Notes                                |
| --------------------------------------------------------------------------------- | ------------------------------------ |
| `deviceId`                                                                        | Client-stable ID                     |
| `deviceName`, `deviceType`                                                        | `desktop` or `mobile`                |
| `userAgent`                                                                       |                                      |
| `lastActive`                                                                      |                                      |
| `isActive`                                                                        | `false` after logout / remote revoke |
| `refreshTokenHash` / `previousRefreshTokenHash` / `previousRefreshTokenExpiresAt` | Device-bound refresh                 |
| `tokenExpiresAt`                                                                  |                                      |

**Cap:** max **2** active devices. See [Device Management](../auth/device-management.md).

## Category

**Collection:** `categories` · **File:** `server/models/categoryModel.js`

| Field               | Type     | Notes              |
| ------------------- | -------- | ------------------ |
| `userId`            | ObjectId | Owner              |
| `category`          | String   | Display name       |
| `bgcolor`, `hcolor` | String   | HEX colors         |
| `emoji`             | String   | Icon               |
| `order`             | Number   | Dashboard position |

Deleting a category cascades and removes its bookmarks.

## Bookmark

**Collection:** `bookmarks` · **File:** `server/models/bookmarkModel.js`

| Field                  | Type                      | Notes                |
| ---------------------- | ------------------------- | -------------------- |
| `categoryId`           | ObjectId                  | Parent category      |
| `name`, `link`, `logo` | String                    |                      |
| `order`                | Number                    | Position in category |
| `notes`                | String                    | Optional notes       |
| `clickCount`           | Number                    |                      |
| `lastClicked`          | Date                      |                      |
| `clickHistory[]`       | `{ timestamp, deviceId }` | Per-click history    |

URLs are validated on write (`server/utils/urlValidation.js`) — private/localhost targets are blocked; logos must be `https://`.

## PendingLogin

**Collection:** `pendinglogins` · **File:** `server/models/pendingLoginModel.js`

Used when OAuth succeeds but the account already has 2 active devices.

| Field                                   | Notes                   |
| --------------------------------------- | ----------------------- |
| `code`                                  | Unique one-time code    |
| `userId`, `deviceId`                    | Intended new session    |
| `deviceName`, `deviceType`, `userAgent` |                         |
| `used`                                  | Boolean                 |
| `expiresAt`                             | TTL index (~10 minutes) |

## Stats

**Collection:** `stats` · **File:** `server/models/statsModel.js`

Aggregated public metrics collected by cron.

| Field                              | Notes                            |
| ---------------------------------- | -------------------------------- |
| `type`                             | `daily` \| `weekly` \| `monthly` |
| `date`                             | Period key                       |
| `bookmarks`, `categories`, `users` | Counts                           |

## Relationships

```
User 1──* Category 1──* Bookmark
User 1──* loginDevices
User 1──* PendingLogin (transient)
```

Onboarding seeds default categories and bookmarks via `server/utils/defaultBookmarks.js` (Social Media, Productivity, Entertainment, Learning, Dev Tools, plus Uncategorized).
