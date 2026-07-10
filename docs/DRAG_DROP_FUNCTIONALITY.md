# Drag and Drop Functionality in Webmark

This document explains the drag-and-drop implementation in Webmark.

## Overview

Webmark uses [@dnd-kit](https://docs.dndkit.com/) for drag-and-drop. Users can:

1. **Reorder bookmarks** within a category
2. **Move bookmarks** between categories
3. **Reorder categories** in the dashboard layout

Changes are persisted to the database via the reorder API endpoints.

## Technology

| Package              | Purpose                                         |
| -------------------- | ----------------------------------------------- |
| `@dnd-kit/core`      | `DndContext`, drag sensors, collision detection |
| `@dnd-kit/sortable`  | `SortableContext`, `useSortable`, `arrayMove`   |
| `@dnd-kit/utilities` | CSS transform helpers                           |

## Key Files

| File                                                         | Role                                                       |
| ------------------------------------------------------------ | ---------------------------------------------------------- |
| `client/src/components/DashboardComponents/BookmarkList.jsx` | `DndContext`, category and bookmark sortable lists         |
| `client/src/components/DashboardComponents/BookmarkItem.jsx` | Sortable bookmark items and category drop targets          |
| `client/src/utils/bookmarkDnd.js`                            | ID helpers, state mutations, layout diffing                |
| `client/src/hooks/useBookmarks.js`                           | SWR mutations for `reorder` and `reorder-layout` API calls |

## Drag ID Conventions

Defined in `bookmarkDnd.js`:

- Bookmarks: `bookmark-{id}`
- Categories: `category-{id}`
- Category containers (drop targets): `container-{id}`

## State Management

During a drag, bookmark positions are tracked in a local `itemsByCategory` map (category ID → bookmark array). On drag end:

1. `moveBookmarkInState()` or category reorder logic updates the local map
2. `getLayoutUpdates()` diffs the new layout against the original categories
3. Changed categories are sent to `PUT /api/bookmarks/reorder-layout`
4. SWR cache is revalidated on success

Cross-category moves update both the source and destination category in a single API call.

## DndContext Setup

```jsx
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragStart={handleDragStart}
  onDragOver={handleDragOver}
  onDragEnd={handleDragEnd}
>
  {/* SortableContext for categories and bookmarks */}
</DndContext>
```

## Sortable Items

Bookmarks and categories use `useSortable`:

```jsx
const { attributes, listeners, setNodeRef, transform, transition } =
  useSortable({ id: bookmarkDragId(bookmark._id) });
```

Category headers expose drag handles via `categoryDragHandleProps` so only the handle initiates a category drag.

## API Endpoints

| Endpoint                                | Purpose                                          |
| --------------------------------------- | ------------------------------------------------ |
| `PUT /api/bookmarks/reorder`            | Reorder bookmarks within a single category       |
| `PUT /api/bookmarks/reorder-layout`     | Batch update across categories (moves + reorder) |
| `PUT /api/bookmarks/categories/reorder` | Reorder category positions                       |

## Accessibility

@dnd-kit supports keyboard navigation and screen reader announcements. Drag handles are used for categories to avoid conflicting with bookmark click actions.
