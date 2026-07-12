# AI Sort

Bulk reorganization of bookmarks using OpenAI (`gpt-4o-mini`).

## Modes

| Mode            | Behavior                                        |
| --------------- | ----------------------------------------------- |
| `all`           | Rebuild taxonomy and reassign the whole library |
| `uncategorized` | Only move bookmarks currently in Uncategorized  |

UI: `AISortDialog.jsx` with staged progress (~20–40s). Triggered from the authenticated Header (`dashboardAction: aiSort`).

## Credits

| Rule              | Value                                             |
| ----------------- | ------------------------------------------------- |
| Starting AI sorts | **5** (`user.aiSortsRemaining`)                   |
| Import bonus      | +1 AI sort when below 5 (max **2** imports/month) |
| Rate limit        | 15 AI requests / hour (`aiRateLimit`)             |

Remaining credits appear in the Header badge and Profile `CreditsCard`. Synced to `localStorage` as `aiSortsRemaining`.

## API

```
POST /api/bookmarks/ai/sort
Body: { "mode": "all" | "uncategorized" }

POST /api/bookmarks/ai/sort/revert
```

Requires auth + `OPENAI_API_KEY` on the server. Without a key, the feature fails gracefully with an error message.

## Pipeline

Implemented in `server/utils/aiCategorizer.js` + `aiPrompts.js`:

1. **Taxonomy** — `generateTaxonomy` proposes category names/emojis/colors
2. **Assignment** — `assignToCategories` in batches of ~50
3. Snapshot stored on `user.aiSortSnapshot` for revert
4. Categories/bookmarks updated in MongoDB

## Revert

`POST /api/bookmarks/ai/sort/revert` restores the previous snapshot (one-shot). UI exposes Undo after a successful sort (`useRevertAISort`).

## Related

- Bookmarklet single-item categorization uses the same OpenAI helpers
- [Import](./import.md) for the monthly bonus credit
- [Profile & Analytics](./profile-and-analytics.md) for credit display
