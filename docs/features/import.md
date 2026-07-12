# Bookmark Import

Import bookmarks from Chrome/Firefox HTML exports (Netscape Bookmark File Format).

## UI Flow

1. Header → Import (`ImportBookmarksDialog.jsx`)
2. User selects an HTML export file
3. Client parses folders and bookmarks
4. User chooses which folders to import
5. `POST /api/bookmarks/import` via `useImportBookmarks`

Successful imports can grant **+1 AI Sort credit** (toast) when eligible.

## Quotas & Limits

| Limit                         | Value                                |
| ----------------------------- | ------------------------------------ |
| Imports with AI bonus / month | **2**                                |
| Folders per request           | 50                                   |
| Bookmarks per folder          | 500                                  |
| Total bookmarks per request   | 2000                                 |
| Rate limit                    | 6 imports / hour (`importRateLimit`) |

Remaining imports shown in Header and Profile (`importsRemainingThisMonth`).

## Server Behavior

`importBookmarks` in `bookmarkController.js`:

- Creates categories for selected folders
- Inserts bookmarks with validated URLs
- Updates monthly import bonus fields on the user
- Returns updated credit counters for the client

## Related

- [AI Sort](./ai-sort.md) — bonus credit rules
- [Bookmarks & Categories](./bookmarks-and-categories.md)
