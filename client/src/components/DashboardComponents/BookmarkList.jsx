import {
  lazy,
  Suspense,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  useCategories,
  useAISort,
  useImportBookmarks,
  useRevertAISort,
  useUpdateCategoryOrder,
  useUpdateBookmarkLayout,
  useSeedDefaultBookmarks,
} from "../../hooks/useBookmarks";
import BookmarkItem, { BookmarkCard, CategoryCard } from "./BookmarkItem";
import { Button } from "../ui/button";
import { PlusCircle, LayoutGrid, Upload } from "lucide-react";
import { CategoryListSkeleton } from "./LoadingSkeletons";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  categoryDragId,
  stripBookmarkId,
  buildItemsByCategory,
  getLayoutUpdates,
  moveBookmarkInState,
  distributeToColumns,
} from "../../utils/bookmarkDnd";

const AddCategoryDialog = lazy(() => import("./AddCategoryDialog"));
const ImportBookmarksDialog = lazy(() => import("./ImportBookmarksDialog"));
const AISortDialog = lazy(() => import("./AISortDialog"));

const SORTABLE_TRANSITION = {
  duration: 200,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
};

function useCategoryColumnCount() {
  const [columnCount, setColumnCount] = useState(1);

  useEffect(() => {
    const lg = window.matchMedia("(min-width: 1024px)");
    const sm = window.matchMedia("(min-width: 640px)");

    const update = () => {
      if (lg.matches) setColumnCount(3);
      else if (sm.matches) setColumnCount(2);
      else setColumnCount(1);
    };

    update();
    lg.addEventListener("change", update);
    sm.addEventListener("change", update);
    return () => {
      lg.removeEventListener("change", update);
      sm.removeEventListener("change", update);
    };
  }, []);

  return columnCount;
}

const CategoryColumns = ({
  items,
  columnCount,
  renderCategory,
  sortable = false,
}) => {
  const columns = useMemo(
    () => distributeToColumns(items, columnCount),
    [items, columnCount],
  );

  if (columnCount <= 1) {
    const content = items.map(renderCategory);
    return (
      <div className="flex flex-col gap-y-4 md:gap-y-6">
        {sortable ? (
          <SortableContext
            items={items.map((item) => categoryDragId(item._id))}
            strategy={verticalListSortingStrategy}
          >
            {content}
          </SortableContext>
        ) : (
          content
        )}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-x-6">
      {columns.map((colItems, colIndex) => {
        const columnContent = colItems.map(renderCategory);
        return (
          <div
            key={colIndex}
            className="flex min-w-0 flex-1 flex-col gap-y-4 md:gap-y-6"
          >
            {sortable ? (
              <SortableContext
                items={colItems.map((item) => categoryDragId(item._id))}
                strategy={verticalListSortingStrategy}
              >
                {columnContent}
              </SortableContext>
            ) : (
              columnContent
            )}
          </div>
        );
      })}
    </div>
  );
};

const SortableCategory = ({ categoryItem, bookmarks }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: categoryDragId(categoryItem._id),
    data: { type: "category" },
    transition: SORTABLE_TRANSITION,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 0 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="min-w-0 outline-none focus:outline-none"
    >
      <BookmarkItem
        category={categoryItem.category}
        categoryId={categoryItem._id}
        color={categoryItem.bgcolor}
        hcolor={categoryItem.hcolor}
        emoji={categoryItem.emoji}
        bookmarks={bookmarks}
        sharedDrag
        categoryDragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

const filterCategories = (categories, searchTerm) => {
  if (!categories) return [];
  if (!searchTerm || !searchTerm.trim()) return categories;

  const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);

  return categories
    .map((category) => {
      try {
        const filteredBookmarks = Array.isArray(category.bookmarks)
          ? category.bookmarks.filter((bookmark) =>
              searchWords.some(
                (word) =>
                  (bookmark.name &&
                    bookmark.name.toLowerCase().includes(word)) ||
                  (bookmark.link &&
                    bookmark.link.toLowerCase().includes(word)) ||
                  (bookmark.notes &&
                    bookmark.notes.toLowerCase().includes(word)),
              ),
            )
          : [];

        if (filteredBookmarks.length > 0) {
          return {
            ...category,
            bookmarks: filteredBookmarks,
          };
        }

        if (
          category.category &&
          searchWords.some((word) =>
            category.category.toLowerCase().includes(word),
          )
        ) {
          return category;
        }

        return null;
      } catch (err) {
        console.error("Error filtering bookmarks in category:", category, err);
        return null;
      }
    })
    .filter(Boolean);
};

const BookmarkList = () => {
  const { data: categories, isLoading, error } = useCategories();
  const updateCategoryOrder = useUpdateCategoryOrder();
  const updateBookmarkLayout = useUpdateBookmarkLayout();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isAISortOpen, setIsAISortOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeBookmarkId, setActiveBookmarkId] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);
  const [itemsByCategory, setItemsByCategory] = useState({});
  const isDraggingCategoryRef = useRef(false);
  const isDraggingBookmarkRef = useRef(false);
  const columnCount = useCategoryColumnCount();
  const {
    mutate: aiSort,
    isPending: isSorting,
    data: sortResults,
    error: sortError,
    reset: resetSort,
  } = useAISort();
  const { mutate: revertSort, isPending: isReverting } = useRevertAISort();
  const importMutation = useImportBookmarks();
  const seedDefaults = useSeedDefaultBookmarks();

  const filteredCategories = useMemo(
    () => filterCategories(categories, searchTerm),
    [categories, searchTerm],
  );

  const totalBookmarks = useMemo(
    () =>
      filteredCategories.reduce(
        (sum, category) => sum + (category.bookmarks?.length || 0),
        0,
      ),
    [filteredCategories],
  );

  const matchingCategories = useMemo(() => {
    if (!categories || !searchTerm.trim()) return [];
    const words = searchTerm.toLowerCase().trim().split(/\s+/);
    return categories
      .filter(
        (category) =>
          category.category &&
          words.some((word) => category.category.toLowerCase().includes(word)),
      )
      .map((category) => ({
        id: category._id,
        name: category.category,
        emoji: category.emoji,
      }));
  }, [categories, searchTerm]);

  const uncategorizedCount = useMemo(() => {
    const uncategorized = categories?.find(
      (c) => c.category?.toLowerCase() === "uncategorized",
    );
    return uncategorized?.bookmarks?.length ?? 0;
  }, [categories]);

  const isDragDisabled = !!searchTerm.trim();

  useEffect(() => {
    if (!searchTerm.trim()) {
      window.dispatchEvent(
        new CustomEvent("searchResultsUpdated", {
          detail: { count: null, matchingCategories: [] },
        }),
      );
      return;
    }

    window.dispatchEvent(
      new CustomEvent("searchResultsUpdated", {
        detail: {
          count: totalBookmarks,
          matchingCategories,
        },
      }),
    );
  }, [searchTerm, totalBookmarks, matchingCategories]);

  useEffect(() => {
    if (!isDraggingCategoryRef.current && !isDraggingBookmarkRef.current) {
      setCategoryItems(categories || []);
      setItemsByCategory(buildItemsByCategory(categories));
    }
  }, [categories]);

  const activeCategory = useMemo(
    () =>
      categoryItems.find(
        (item) => categoryDragId(item._id) === activeCategoryId,
      ) ?? null,
    [categoryItems, activeCategoryId],
  );

  const activeBookmark = useMemo(() => {
    if (!activeBookmarkId) return null;
    const bookmarkId = stripBookmarkId(activeBookmarkId);
    for (const items of Object.values(itemsByCategory)) {
      const found = items.find((item) => String(item._id) === bookmarkId);
      if (found) return found;
    }
    return null;
  }, [itemsByCategory, activeBookmarkId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback((event) => {
    const type = event.active.data.current?.type;
    if (type === "category") {
      isDraggingCategoryRef.current = true;
      setActiveCategoryId(String(event.active.id));
      return;
    }

    if (type === "bookmark") {
      isDraggingBookmarkRef.current = true;
      setActiveBookmarkId(String(event.active.id));
    }
  }, []);

  const handleCategoryDragOver = useCallback((event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setCategoryItems((current) => {
      const oldIndex = current.findIndex(
        (item) => categoryDragId(item._id) === String(active.id),
      );
      const newIndex = current.findIndex(
        (item) => categoryDragId(item._id) === String(over.id),
      );
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return current;
      }
      return arrayMove(current, oldIndex, newIndex);
    });
  }, []);

  const handleBookmarkDragOver = useCallback((event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItemsByCategory((current) =>
      moveBookmarkInState(current, active.id, over.id),
    );
  }, []);

  const handleDragOver = useCallback(
    (event) => {
      const type = event.active.data.current?.type;
      if (type === "category") {
        handleCategoryDragOver(event);
      } else if (type === "bookmark") {
        handleBookmarkDragOver(event);
      }
    },
    [handleCategoryDragOver, handleBookmarkDragOver],
  );

  const handleDragEnd = useCallback(
    (event) => {
      const type = event.active.data.current?.type;

      if (type === "category") {
        isDraggingCategoryRef.current = false;
        setActiveCategoryId(null);
        const { over } = event;

        if (!over) {
          setCategoryItems(categories || []);
          return;
        }

        setCategoryItems((currentItems) => {
          const updatedCategories = currentItems.map((item, index) => ({
            id: item._id,
            order: index,
          }));

          updateCategoryOrder.mutate(
            { categories: updatedCategories },
            {
              onError: () => {
                setCategoryItems(categories || []);
              },
            },
          );

          return currentItems;
        });
        return;
      }

      if (type === "bookmark") {
        isDraggingBookmarkRef.current = false;
        setActiveBookmarkId(null);
        const { over } = event;

        if (!over) {
          setItemsByCategory(buildItemsByCategory(categories));
          return;
        }

        setItemsByCategory((current) => {
          const updates = getLayoutUpdates(current, categories || []);
          if (updates.length > 0) {
            updateBookmarkLayout.mutate(
              { categories: updates },
              {
                onError: () => {
                  setItemsByCategory(buildItemsByCategory(categories));
                },
              },
            );
          }
          return current;
        });
      }
    },
    [categories, updateCategoryOrder, updateBookmarkLayout],
  );

  const handleDragCancel = useCallback(() => {
    isDraggingCategoryRef.current = false;
    isDraggingBookmarkRef.current = false;
    setActiveCategoryId(null);
    setActiveBookmarkId(null);
    setCategoryItems(categories || []);
    setItemsByCategory(buildItemsByCategory(categories));
  }, [categories]);

  useEffect(() => {
    const headerSearchTerm = sessionStorage.getItem("bookmarkSearchTerm") || "";
    setSearchTerm(headerSearchTerm);

    const handleSearchTermChanged = (event) => {
      setSearchTerm(event.detail.searchTerm);
    };

    window.addEventListener("searchTermChanged", handleSearchTermChanged);
    return () => {
      window.removeEventListener("searchTermChanged", handleSearchTermChanged);
    };
  }, []);

  useEffect(() => {
    const handleDashboardAction = (event) => {
      const action = event.detail?.action;
      if (action === "addCategory") setIsAddingCategory(true);
      if (action === "aiSort") setIsAISortOpen(true);
      if (action === "import") setIsImporting(true);
    };

    window.addEventListener("dashboardAction", handleDashboardAction);
    return () => {
      window.removeEventListener("dashboardAction", handleDashboardAction);
    };
  }, []);

  const dialogs = (
    <Suspense fallback={null}>
      {isAddingCategory && (
        <AddCategoryDialog
          open={isAddingCategory}
          onClose={() => setIsAddingCategory(false)}
        />
      )}
      {isImporting && (
        <ImportBookmarksDialog
          open={isImporting}
          onClose={() => setIsImporting(false)}
          importMutation={importMutation}
        />
      )}
      {isAISortOpen && (
        <AISortDialog
          open={isAISortOpen}
          onClose={() => setIsAISortOpen(false)}
          onConfirm={(mode) => aiSort(mode)}
          uncategorizedCount={uncategorizedCount}
          isSorting={isSorting}
          results={sortResults ?? null}
          sortError={sortError}
          onReset={resetSort}
          onRevert={revertSort}
          isReverting={isReverting}
        />
      )}
    </Suspense>
  );

  if (isLoading) {
    return (
      <>
        <CategoryListSkeleton />
        {dialogs}
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center text-red-600">
          Failed to load bookmarks. Please refresh the page.
        </div>
        {dialogs}
      </>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <>
        <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
          <div className="flex w-full max-w-md flex-col gap-3">
            {/* Add category — blue */}
            <button
              type="button"
              onClick={() => setIsAddingCategory(true)}
              className="group flex items-center gap-4 rounded-xl border border-dashed border-blue-100 bg-blue-50/30 px-5 py-4 text-left transition duration-150 hover:border-blue-300 hover:bg-blue-50/60 active:scale-[0.99]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 transition-colors duration-150 group-hover:bg-blue-200">
                <PlusCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  Add a category
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  Create your first category manually
                </p>
              </div>
            </button>

            {/* Start with defaults — violet */}
            <button
              type="button"
              onClick={() => seedDefaults.mutate()}
              disabled={seedDefaults.isPending}
              className="group flex items-center gap-4 rounded-xl border border-dashed border-violet-100 bg-violet-50/30 px-5 py-4 text-left transition duration-150 hover:border-violet-300 hover:bg-violet-50/60 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 transition-colors duration-150 group-hover:bg-violet-200">
                {seedDefaults.isPending ? (
                  <svg
                    className="h-5 w-5 animate-spin text-violet-500"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                ) : (
                  <LayoutGrid className="h-5 w-5 text-violet-500" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700 group-hover:text-violet-600">
                  Start with defaults
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  5 ready-made categories with popular bookmarks
                </p>
              </div>
            </button>

            {/* Import from browser — amber */}
            <button
              type="button"
              onClick={() => setIsImporting(true)}
              className="group flex items-center gap-4 rounded-xl border border-dashed border-amber-100 bg-amber-50/30 px-5 py-4 text-left transition duration-150 hover:border-amber-300 hover:bg-amber-50/60 active:scale-[0.99]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 transition-colors duration-150 group-hover:bg-amber-200">
                <Upload className="h-5 w-5 text-amber-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700 group-hover:text-amber-600">
                  Import bookmarks
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  Import from Chrome, Firefox or Safari
                </p>
              </div>
            </button>
          </div>
        </div>
        {dialogs}
      </>
    );
  }

  return (
    <>
      {filteredCategories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
          <p className="text-base font-medium text-gray-900">
            No bookmarks match your search
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Try a different term, or clear search to see everything.
          </p>
          <Button
            variant="outline"
            className="mt-5"
            onClick={() => {
              window.dispatchEvent(new Event("clearBookmarkSearch"));
            }}
          >
            Clear search
          </Button>
        </div>
      ) : isDragDisabled ? (
        <CategoryColumns
          items={filteredCategories}
          columnCount={columnCount}
          renderCategory={(categoryItem) => (
            <BookmarkItem
              key={categoryItem._id}
              category={categoryItem.category}
              categoryId={categoryItem._id}
              color={categoryItem.bgcolor}
              hcolor={categoryItem.hcolor}
              emoji={categoryItem.emoji}
              bookmarks={categoryItem.bookmarks}
              dragDisabled
            />
          )}
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <CategoryColumns
            items={categoryItems}
            columnCount={columnCount}
            sortable
            renderCategory={(categoryItem) => (
              <SortableCategory
                key={categoryItem._id}
                categoryItem={categoryItem}
                bookmarks={itemsByCategory[String(categoryItem._id)] || []}
              />
            )}
          />
          <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
            {activeCategory ? (
              <CategoryCard
                category={activeCategory.category}
                color={activeCategory.bgcolor}
                hcolor={activeCategory.hcolor}
                emoji={activeCategory.emoji}
                bookmarks={
                  itemsByCategory[String(activeCategory._id)] ||
                  activeCategory.bookmarks ||
                  []
                }
                isOverlay
              />
            ) : activeBookmark ? (
              <BookmarkCard
                item={activeBookmark}
                onBookmarkClick={() => {}}
                onEdit={() => {}}
                onNotes={() => {}}
                onDelete={() => {}}
                isOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
      {dialogs}
    </>
  );
};

export default BookmarkList;
