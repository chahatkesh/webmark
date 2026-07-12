# Bookmarks & Categories

Core organization model for Webmark.

## Concepts

- **Category** — Named collection with emoji, background color (`bgcolor`), header color (`hcolor`), and `order`
- **Bookmark** — Name, URL, logo, optional notes, `order` within a category, click stats

Every authenticated user owns categories; bookmarks belong to exactly one category. Deleting a category deletes its bookmarks.

## Dashboard Load

The dashboard uses a single request:

```
GET /api/bookmarks/categories
```

The handler (`getCategories`) returns categories **with bookmarks embedded**, avoiding N+1 fetches per category. UI: `BookmarkList.jsx` + `BookmarkItem.jsx`.

Layout: responsive masonry (1 / 2 / 3 columns at 640px / 1024px breakpoints).

## Category CRUD

| Action  | Endpoint                                | UI                                                |
| ------- | --------------------------------------- | ------------------------------------------------- |
| Create  | `POST /api/bookmarks/category`          | `AddCategoryDialog` (emoji picker + color themes) |
| Update  | `PUT /api/bookmarks/category`           | `EditCategoryDialog`                              |
| Delete  | `DELETE /api/bookmarks/category`        | `ConfirmDeleteDialog`                             |
| Reorder | `PUT /api/bookmarks/categories/reorder` | Drag category handles                             |

## Bookmark CRUD

| Action                    | Endpoint                            | UI                   |
| ------------------------- | ----------------------------------- | -------------------- |
| Create                    | `POST /api/bookmarks/bookmark`      | `AddBookmarkDialog`  |
| Update                    | `PUT /api/bookmarks/bookmark`       | `EditBookmarkDialog` |
| Delete                    | `DELETE /api/bookmarks/bookmark`    | Confirm dialog       |
| Notes                     | Same update path                    | `NotesDialog`        |
| Reorder (single category) | `PUT /api/bookmarks/reorder`        | DnD                  |
| Cross-category layout     | `PUT /api/bookmarks/reorder-layout` | DnD                  |

Favicon / metadata auto-fill: `useBookmarkLinkMetadata` + `bookmarkMetadata.js`. Broken logos fall back via `faviconFallback.js`.

## Clicks

Opening a bookmark calls `POST /api/clicks/track` (`useClicks`). Counts feed profile analytics and top-bookmark lists.

## URL Safety

Server-side `urlValidation.js`:

- Blocks localhost, private IPs, `.local`
- Sanitizes http(s) links
- Logo URLs must be `https://`

## Default Content

Onboarding seeds categories via `server/utils/defaultBookmarks.js` (Social Media, Productivity, Entertainment, Learning, Dev Tools, Uncategorized). AI sort also relies on an **Uncategorized** category helper (`uncategorizedCategory.js`).

## Related Features

- [Drag & Drop](./drag-and-drop.md)
- [Search](./search.md)
- [AI Sort](./ai-sort.md)
- [Import](./import.md)
- [Bookmarklet](./bookmarklet.md)
