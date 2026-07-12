# User Onboarding

First-time Google users complete a short username setup before reaching the dashboard.

## Flow

1. Google OAuth succeeds and cookies are set
2. `POST /api/user/userdata` returns `requiresOnboarding: true` (or equivalent flag)
3. Client navigates to `/onboarding`
4. User chooses a username
5. `POST /api/user/complete-onboarding` with `{ username }`
6. Server marks onboarding complete and seeds default categories/bookmarks
7. Redirect to `/user/dashboard`

Returning users skip onboarding and go straight to the dashboard.

## Username Rules

Client and server enforce:

```
/^[a-z0-9][a-z0-9_-]{2,29}$/
```

- 3–30 characters
- Starts with alphanumeric
- Only lowercase letters, digits, `_`, `-`

## Default Library

`server/utils/defaultBookmarks.js` creates starter categories such as:

- Social Media
- Productivity
- Entertainment
- Learning
- Dev Tools
- Uncategorized

Each includes a few sample bookmarks so the dashboard is immediately usable.

## Guards

`Onboarding.jsx`:

- Unauthenticated → `/auth`
- Already completed / has username → `/user/dashboard`
- SEO: `indexPage={false}`

## Related Auth

Device-limit conflicts can interrupt OAuth before onboarding — users finish `/auth/devices` first, then land on onboarding if still needed. See [Device Management](../auth/device-management.md).
