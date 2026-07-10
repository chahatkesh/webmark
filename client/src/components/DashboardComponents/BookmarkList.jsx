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
} from "../../hooks/useBookmarks";
import BookmarkItem, { BookmarkCard, CategoryCard } from "./BookmarkItem";
import { Button } from "../ui/button";
import { PlusCircle, Upload, Wand2 } from "lucide-react";
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
  const [sortsLeft, setSortsLeft] = useState(() =>
    parseInt(localStorage.getItem("aiSortsRemaining") ?? "5", 10),
  );
  const [importsLeft, setImportsLeft] = useState(() =>
    parseInt(localStorage.getItem("importsRemainingThisMonth") ?? "2", 10),
  );
  const {
    mutate: aiSort,
    isPending: isSorting,
    data: sortResults,
    error: sortError,
    reset: resetSort,
  } = useAISort();
  const { mutate: revertSort, isPending: isReverting } = useRevertAISort();
  const importMutation = useImportBookmarks();

  const filteredCategories = useMemo(
    () => filterCategories(categories, searchTerm),
    [categories, searchTerm],
  );

  const uncategorizedCount = useMemo(() => {
    const uncategorized = categories?.find(
      (c) => c.category?.toLowerCase() === "uncategorized",
    );
    return uncategorized?.bookmarks?.length ?? 0;
  }, [categories]);

  const isDragDisabled = !!searchTerm.trim();

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

  const syncLimitsFromStorage = () => {
    const storedSorts = parseInt(
      localStorage.getItem("aiSortsRemaining") ?? "5",
      10,
    );
    const storedImports = parseInt(
      localStorage.getItem("importsRemainingThisMonth") ?? "2",
      10,
    );
    setSortsLeft(storedSorts);
    setImportsLeft(storedImports);
  };

  useEffect(() => {
    syncLimitsFromStorage();
  }, [sortResults, sortError, importMutation.data]);

  useEffect(() => {
    window.addEventListener("storage", syncLimitsFromStorage);
    window.addEventListener("limitsUpdated", syncLimitsFromStorage);
    return () => {
      window.removeEventListener("storage", syncLimitsFromStorage);
      window.removeEventListener("limitsUpdated", syncLimitsFromStorage);
    };
  }, []);

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

  if (isLoading) return <CategoryListSkeleton />;
  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center text-red-600">
        Failed to load bookmarks. Please refresh the page.
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          No categories yet
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Create your first category to start organizing bookmarks.
        </p>
        <Button
          onClick={() => setIsAddingCategory(true)}
          className="mt-6 h-10 bg-blue-500 px-4 text-white hover:bg-blue-600"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Category
        </Button>
        <Suspense fallback={null}>
          {isAddingCategory && (
            <AddCategoryDialog
              open={isAddingCategory}
              onClose={() => setIsAddingCategory(false)}
            />
          )}
        </Suspense>
      </div>
    );
  }

  const totalBookmarks = filteredCategories.reduce(
    (sum, category) => sum + (category.bookmarks?.length || 0),
    0,
  );

  return (
    <>
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>
          {searchTerm && (
            <div className="ml-4 hidden text-sm text-gray-600 sm:block">
              {totalBookmarks === 0 ? (
                <span>No bookmarks found</span>
              ) : (
                <span>
                  {totalBookmarks} bookmark{totalBookmarks !== 1 ? "s" : ""}{" "}
                  found
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => setIsAISortOpen(true)}
            variant="outline"
            disabled={sortsLeft <= 0 || isSorting}
            title={
              sortsLeft <= 0
                ? "No AI Sort credits left. Import bookmarks to earn more."
                : `${sortsLeft} credit${sortsLeft !== 1 ? "s" : ""} remaining`
            }
            className="h-10 gap-2 whitespace-nowrap px-4"
          >
            <Wand2 className="h-5 w-5" />
            <span>AI Sort</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                sortsLeft <= 0
                  ? "bg-red-100 text-red-600"
                  : sortsLeft <= 2
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
              }`}
            >
              {sortsLeft}
            </span>
          </Button>
          <Button
            onClick={() => setIsImporting(true)}
            variant="outline"
            disabled={importMutation.isPending || importsLeft <= 0}
            title={
              importsLeft <= 0
                ? "Import limit reached for this month (2/month). Resets next month."
                : `${importsLeft} import${importsLeft !== 1 ? "s" : ""} remaining this month`
            }
            className="h-10 gap-2 whitespace-nowrap px-4"
          >
            <Upload className="h-5 w-5" />
            <span>Import</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                importsLeft <= 0
                  ? "bg-red-100 text-red-600"
                  : importsLeft <= 1
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
              }`}
            >
              {importsLeft}
            </span>
          </Button>
          <Button
            onClick={() => setIsAddingCategory(true)}
            className="h-10 gap-2 whitespace-nowrap bg-blue-500 px-4 text-white hover:bg-blue-600"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Category</span>
          </Button>
        </div>
      </div>
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600 sm:hidden">
          {totalBookmarks === 0 ? (
            <p>No bookmarks found for &quot;{searchTerm}&quot;</p>
          ) : (
            <p>
              Found {totalBookmarks} bookmark{totalBookmarks !== 1 ? "s" : ""}{" "}
              for &quot;{searchTerm}&quot;
            </p>
          )}
        </div>
      )}
      {filteredCategories.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-6 py-10 text-center text-gray-600">
          No bookmarks match your search.
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
                showCategoryGrip
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
    </>
  );
};

export default BookmarkList;
