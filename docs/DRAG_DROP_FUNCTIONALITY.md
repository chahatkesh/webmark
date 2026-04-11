# Drag and Drop Functionality in Webmark

This document explains the implementation and usage of drag and drop functionality in the Webmark application.

## Overview

Webmark implements an intuitive drag and drop system allowing users to:
1. Reorder bookmarks within categories
2. (Planned feature) Reorder categories themselves
3. (Planned feature) Move bookmarks between categories

The system provides visual feedback during drag operations and ensures data consistency by persisting changes to the database.

## Technology Implementation

Webmark uses **React Beautiful DnD** (react-beautiful-dnd) library to implement drag and drop functionality. This library provides:

- Accessible drag and drop for lists
- Natural animation of items when they are moved
- Touch screen compatibility
- Keyboard support for accessibility
- Performance optimizations for smooth interactions

## Components Structure

The drag and drop implementation is structured across the following components:

1. **BookmarkList.jsx**: Container component for categories and their bookmarks
2. **BookmarkItem.jsx**: Contains the drag and drop context for individual bookmark items
3. **useBookmarks.js**: Provides hooks for bookmark operations, including reordering

## Implementation Details

### DragDropContext

The top-level wrapper from react-beautiful-dnd that coordinates the drag and drop operations:

```jsx
<DragDropContext onDragEnd={onDragEnd}>
  {/* Droppable areas */}
</DragDropContext>
```

### Droppable Areas

Defines an area where items can be dropped:

```jsx
<Droppable droppableId={categoryId}>
  {(provided) => (
    <div
      {...provided.droppableProps}
      ref={provided.innerRef}
      className="grid grid-cols-2 gap-x-2 gap-y-2">
      {/* Draggable items */}
      {provided.placeholder}
    </div>
  )}
</Droppable>
```

### Draggable Items

Individual items that can be dragged:

```jsx
<Draggable key={item._id} draggableId={item._id} index={index}>
  {(provided, snapshot) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`flex justify-between items-center ${
        snapshot.isDragging ? "shadow-lg" : ""
      }`}>
      {/* Drag handle */}
      <div
        {...provided.dragHandleProps}
        className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>
      
      {/* Item content */}
    </div>
  )}
</Draggable>
```

## State Management

### Handling Drag End

When a drag operation completes, the system:
1. Updates the local state
2. Sends the new order to the backend
3. Uses optimistic updates to provide a responsive user experience

```javascript
const onDragEnd = (result) => {
  if (!result.destination) return;

  const items = Array.from(displayBookmarks);
  const [reorderedItem] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reorderedItem);

  // Create the updated bookmarks array with new orders
  const updatedBookmarks = items.map((item, index) => ({
    id: item._id,
    order: index,
  }));

  // Update the order in the backend with optimistic updates
  updateBookmarkOrder.mutate(
    {
      categoryId,
      bookmarks: updatedBookmarks,
    },
    {
      // The mutation will handle optimistic updates automatically
      onError: (error) => {
        console.error("Error updating bookmark order:", error);
      },
    }
  );
};
```

## Optimistic Updates

The system implements optimistic updates to provide a seamless user experience:

1. When a user performs a drag operation, the UI updates immediately
2. In the background, the changes are sent to the server
3. If the server operation fails, the UI reverts to the previous state

```javascript
// In useBookmarks.js
onMutate: async ({ categoryId, bookmarks }) => {
  // Cancel any outgoing refetches
  await queryClient.cancelQueries(['bookmarks', categoryId]);

  // Snapshot the previous value
  const previousBookmarks = queryClient.getQueryData(['bookmarks', categoryId]);

  // Optimistically update to the new value
  queryClient.setQueryData(['bookmarks', categoryId], (old) => {
    if (!old) return [];

    // Create a map of id to bookmark to preserve all properties
    const bookmarkMap = old.reduce((acc, bookmark) => {
      acc[bookmark._id] = bookmark;
      return acc;
    }, {});

    // Create new array with updated orders
    return bookmarks.map(({ id, order }) => ({
      ...bookmarkMap[id],
      order
    })).sort((a, b) => a.order - b.order);
  });

  // Return a context object with the snapshotted value
  return { previousBookmarks };
},
```

## Visual Feedback

The system provides several forms of visual feedback:

1. **Cursor Changes**: Cursor changes to "grabbing" when actively dragging
2. **Shadow Effect**: Dragged items have an elevated shadow
3. **Animation**: Smooth animation when items are reordered
4. **Placeholder**: Visual indication of where the item will be placed

## Backend Integration

When a user reorders bookmarks, the changes are persisted to the database:

```javascript
// In bookmarkController.js
export const reorderBookmarks = async (req, res) => {
  try {
    const { categoryId, bookmarks } = req.body;

    // Verify category belongs to user
    const category = await Category.findOne({
      _id: categoryId,
      userId: req.body.userId
    });

    if (!category) {
      return res.json({ success: false, message: "Category not found" });
    }

    // Update each bookmark's order
    const updatePromises = bookmarks.map(({ id, order }) =>
      Bookmark.findByIdAndUpdate(id, { order })
    );

    await Promise.all(updatePromises);

    res.json({ success: true, message: "Bookmark order updated successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error updating bookmark order" });
  }
};
```

## Mobile Responsiveness

The drag and drop functionality is designed to work well on mobile devices:

1. **Touch Support**: Works with touch events on mobile devices
2. **Responsive Layout**: Adjusts the layout for different screen sizes
3. **Larger Touch Targets**: Drag handles are sized appropriately for touch interaction

## Accessibility Features

The implementation includes several accessibility features:

1. **Keyboard Navigation**: Users can reorder items using keyboard
2. **Screen Reader Support**: Compatible with screen readers
3. **Focus Management**: Maintains focus appropriately during drag operations

## Performance Considerations

To ensure smooth performance even with many bookmarks:

1. **Virtualization**: (Planned) For large lists, implement virtualization
2. **Optimistic Updates**: Immediate UI updates without waiting for server response
3. **Batched Updates**: Multiple bookmark order changes are sent as a batch

## Future Enhancements

Planned enhancements to the drag and drop system:

1. **Cross-Category Movement**: Enable dragging bookmarks between categories
2. **Category Reordering**: Allow reordering of categories themselves
3. **Multi-Select Drag**: Allow selecting multiple bookmarks to drag together
4. **Grid Layout Options**: Toggle between list and grid layouts
