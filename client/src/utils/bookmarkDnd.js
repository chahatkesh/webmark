import { arrayMove } from "@dnd-kit/sortable";

export const BOOKMARK_PREFIX = "bookmark-";
export const CATEGORY_PREFIX = "category-";
export const CONTAINER_PREFIX = "container-";

export const bookmarkDragId = (id) => `${BOOKMARK_PREFIX}${id}`;
export const categoryDragId = (id) => `${CATEGORY_PREFIX}${id}`;
export const containerDragId = (id) => `${CONTAINER_PREFIX}${id}`;

export const stripBookmarkId = (dragId) =>
  String(dragId).replace(BOOKMARK_PREFIX, "");
export const stripCategoryId = (dragId) =>
  String(dragId).replace(CATEGORY_PREFIX, "");
export const stripContainerId = (dragId) =>
  String(dragId).replace(CONTAINER_PREFIX, "");

export const isBookmarkDragId = (id) =>
  String(id).startsWith(BOOKMARK_PREFIX);
export const isCategoryDragId = (id) =>
  String(id).startsWith(CATEGORY_PREFIX);
export const isContainerDragId = (id) =>
  String(id).startsWith(CONTAINER_PREFIX);

export const buildItemsByCategory = (categories = []) =>
  Object.fromEntries(
    categories.map((c) => [String(c._id), [...(c.bookmarks || [])]]),
  );

export const distributeToColumns = (items, columnCount) => {
  if (columnCount <= 1) return [items];
  return Array.from({ length: columnCount }, (_, col) =>
    items.filter((_, index) => index % columnCount === col),
  );
};

export const findBookmarkContainer = (itemsByCategory, dragId) => {
  const bookmarkId = stripBookmarkId(dragId);
  for (const [containerId, items] of Object.entries(itemsByCategory)) {
    if (items.some((item) => String(item._id) === bookmarkId)) {
      return containerId;
    }
  }
  return null;
};

export const getLayoutUpdates = (itemsByCategory, originalCategories = []) => {
  const updates = [];
  const categoryIds = new Set([
    ...Object.keys(itemsByCategory),
    ...originalCategories.map((c) => String(c._id)),
  ]);

  for (const categoryId of categoryIds) {
    const current = itemsByCategory[categoryId] || [];
    const original = originalCategories.find(
      (c) => String(c._id) === categoryId,
    );
    const origIds = (original?.bookmarks || [])
      .map((b) => String(b._id))
      .join(",");
    const currIds = current.map((b) => String(b._id)).join(",");

    if (origIds !== currIds) {
      updates.push({
        categoryId,
        bookmarks: current.map((b, order) => ({ id: b._id, order })),
      });
    }
  }

  return updates;
};

export const moveBookmarkInState = (itemsByCategory, activeId, overId) => {
  const activeContainer = findBookmarkContainer(itemsByCategory, activeId);
  if (!activeContainer) return itemsByCategory;

  let overContainer = null;
  if (isContainerDragId(overId)) {
    overContainer = stripContainerId(overId);
  } else if (isBookmarkDragId(overId)) {
    overContainer = findBookmarkContainer(itemsByCategory, overId);
  }

  if (!overContainer) return itemsByCategory;

  const activeBookmarkId = stripBookmarkId(activeId);

  if (activeContainer === overContainer && isBookmarkDragId(overId)) {
    const items = [...itemsByCategory[activeContainer]];
    const oldIndex = items.findIndex(
      (b) => String(b._id) === activeBookmarkId,
    );
    const overBookmarkId = stripBookmarkId(overId);
    const newIndex = items.findIndex(
      (b) => String(b._id) === overBookmarkId,
    );
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
      return itemsByCategory;
    }
    return {
      ...itemsByCategory,
      [activeContainer]: arrayMove(items, oldIndex, newIndex),
    };
  }

  if (activeContainer !== overContainer) {
    const activeItems = [...itemsByCategory[activeContainer]];
    const overItems = [...(itemsByCategory[overContainer] || [])];
    const activeIndex = activeItems.findIndex(
      (b) => String(b._id) === activeBookmarkId,
    );
    if (activeIndex === -1) return itemsByCategory;

    const [moved] = activeItems.splice(activeIndex, 1);
    let insertIndex = overItems.length;
    if (isBookmarkDragId(overId)) {
      const overBookmarkId = stripBookmarkId(overId);
      const overIndex = overItems.findIndex(
        (b) => String(b._id) === overBookmarkId,
      );
      if (overIndex >= 0) insertIndex = overIndex;
    }

    overItems.splice(insertIndex, 0, moved);
    return {
      ...itemsByCategory,
      [activeContainer]: activeItems,
      [overContainer]: overItems,
    };
  }

  return itemsByCategory;
};
