# Bookmarklet

Save the current page into Webmark from the browser toolbar. The save UI is a **server-rendered popup**, not a SPA page.

## Install

Protected page: `/user/bookmarklet` (`client/src/pages/Bookmarklet.jsx`).

Users can:

- Drag the bookmarklet to the bookmarks bar
- Copy the `javascript:` snippet
- Download an `.html` bookmark file with favicon

Builder: `client/src/utils/bookmarklet.js` — opens:

```
{API_URL}/api/bookmarks/save?url=...&title=...&logo=...
```

## Save Flow

1. Bookmarklet opens a small popup to `GET /api/bookmarks/save`
2. `bookmarkletAuthMiddleware` authenticates via cookies; on expired access it silently refreshes using `wm_refresh`
3. `bookmarkletSave` creates the bookmark (AI may pick a category if `OPENAI_API_KEY` is set)
4. Server returns HTML success/error via `bookmarkletPage.js`
5. Open dashboard tabs revalidate through `/bookmarklet-sync` (BroadcastChannel + localStorage) and `useBookmarkSync`

Origin guard on the API **exempts** `/api/bookmarks/save` so the popup works without a SPA `Origin`.

## Related Routes

| Path                      | Role                                   |
| ------------------------- | -------------------------------------- |
| `/user/bookmarklet`       | Install UI (auth required)             |
| `/save`                   | Legacy client redirect to API          |
| `/bookmarklet-sync`       | Hidden iframe target for cache refresh |
| `GET /api/bookmarks/save` | Actual save endpoint                   |

## AI Categorization

When OpenAI is configured, the bookmarklet path categorizes a **single** bookmark into an existing category (`aiController` / `categorizeSingle`). Without a key, the bookmark lands in a default/Uncategorized flow.

## Auth Notes

- Requires an existing logged-in session in the browser that shares cookies with the API origin
- Cross-origin production setups need `SameSite=None; Secure` cookies
- HTML responses escape user-controlled strings (`escapeHtml`)
