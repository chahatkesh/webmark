# Drag & Drop

Webmark uses [@dnd-kit](https://docs.dndkit.com/) for reordering categories and bookmarks.

## Capabilities

1. Reorder bookmarks within a category
2. Move bookmarks between categories
3. Reorder categories across the dashboard

Drag is **disabled while search is active**.

## Packages

| Package              | Role                                          |
| -------------------- | --------------------------------------------- |
| `@dnd-kit/core`      | `DndContext`, sensors, collision detection    |
| `@dnd-kit/sortable`  | `SortableContext`, `useSortable`, `arrayMove` |
| `@dnd-kit/utilities` | Transform helpers                             |

## Key Files

| File                                                         | Role                                   |
| ------------------------------------------------------------ | -------------------------------------- |
| `client/src/components/DashboardComponents/BookmarkList.jsx` | `DndContext`, sortable lists           |
| `client/src/components/DashboardComponents/BookmarkItem.jsx` | Sortable items + category drop targets |
| `client/src/utils/bookmarkDnd.js`                            | Drag IDs, state moves, layout diffing  |
| `client/src/hooks/useBookmarks.js`                           | Optimistic SWR mutations               |

## Drag ID Conventions

From `bookmarkDnd.js`:

- Bookmarks: `bookmark-{id}`
- Categories: `category-{id}`
- Category containers: `container-{id}`

Category headers expose dedicated drag handles so clicking bookmarks does not start a category drag.

## Persistence

On drag end:

1. Local `itemsByCategory` map updates (`moveBookmarkInState` or category reorder)
2. `getLayoutUpdates()` diffs against the previous layout
3. Changed categories POST to the API
4. SWR cache revalidates

| Endpoint                                | When                                     |
| --------------------------------------- | ---------------------------------------- |
| `PUT /api/bookmarks/reorder-layout`     | Bookmark moves / cross-category updates  |
| `PUT /api/bookmarks/categories/reorder` | Category order changes                   |
| `PUT /api/bookmarks/reorder`            | Single-category reorder (also available) |

## Accessibility

@dnd-kit supports keyboard sensors. Drag handles keep category reordering distinct from bookmark open/edit actions. `DragOverlay` shows previews while dragging.
