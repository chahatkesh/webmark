# Search

Client-side, real-time search across the dashboard. No server search endpoint.

## Behavior

- Matches **bookmark name**, **URL**, **notes**, and **category name**
- Multi-word queries: any word may match (OR across terms)
- Categories without matches are hidden
- Result count shown in the header
- Drag-and-drop is disabled during an active search

## Coordination

Search state is shared between `Header.jsx` and `BookmarkList.jsx` via custom events (not React context):

| Event                  | Direction            | Purpose      |
| ---------------------- | -------------------- | ------------ |
| `searchTermChanged`    | Header → list        | Live query   |
| `searchResultsUpdated` | List → header        | Match counts |
| `clearBookmarkSearch`  | Empty state → header | Reset        |
| `focusBookmarkSearch`  | Shortcuts → header   | Focus input  |

Persistence: `sessionStorage.bookmarkSearchTerm` (survives refresh within the tab).

## Shortcuts

| Key                    | Action                                          |
| ---------------------- | ----------------------------------------------- |
| `/` or `⌘K` / `Ctrl+K` | Focus search                                    |
| `N`                    | Open new category (when not typing in an input) |

Category name matches can jump/scroll to that category with a highlight ring.

## Algorithm (simplified)

```javascript
const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);

categories
  .map((category) => {
    const filteredBookmarks = category.bookmarks.filter((b) =>
      searchWords.some(
        (word) =>
          b.name?.toLowerCase().includes(word) ||
          b.link?.toLowerCase().includes(word) ||
          b.notes?.toLowerCase().includes(word),
      ),
    );
    if (filteredBookmarks.length)
      return { ...category, bookmarks: filteredBookmarks };
    if (searchWords.some((w) => category.category?.toLowerCase().includes(w)))
      return category;
    return null;
  })
  .filter(Boolean);
```

## Performance

Search runs in-memory over the already-loaded categories payload. Suitable for typical personal libraries; very large collections may eventually want server-side full-text search.
