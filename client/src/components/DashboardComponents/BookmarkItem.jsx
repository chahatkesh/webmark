import React, {
  lazy,
  Suspense,
  useState,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from "react";
import {
  useBookmarks,
  useDeleteCategory,
  useOptimisticRemoveBookmark,
  useMoveBookmark,
  useCategories,
} from "../../hooks/useBookmarks";
import { StoreContext } from "../../context/StoreContext";
import { apiRequest } from "../../utils/apiClient";
import { toast } from "react-toastify";
import useClicks from "../../hooks/useClicks";
import {
  PlusCircle,
  Pencil,
  Trash2,
  MoreVertical,
  StickyNote,
  ArrowRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { bookmarkDragId } from "../../utils/bookmarkDnd";
import { applyFaviconFallback } from "../../utils/faviconFallback";
import { BookmarkItemSkeleton } from "./LoadingSkeletons";
import { playToastSound } from "../../utils/toastSound";

const AddBookmarkDialog = lazy(() => import("./AddBookmarkDialog"));
const EditBookmarkDialog = lazy(() => import("./EditBookmarkDialog"));
const EditCategoryDialog = lazy(() => import("./EditCategoryDialog"));
const ConfirmDeleteDialog = lazy(() => import("./ConfirmDeleteDialog"));
const NotesDialog = lazy(() => import("./NotesDialog"));

const SORTABLE_TRANSITION = {
  duration: 200,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
};

export const BookmarkCard = ({
  item,
  onBookmarkClick,
  onEdit,
  onNotes,
  onDelete,
  categories = [],
  onMoveToCategory,
  isOverlay = false,
  isPreview = false,
  dragHandleProps = null,
}) => (
  <div
    {...(dragHandleProps || {})}
    className={`group flex justify-between items-center p-2 md:p-2.5 bg-white rounded gap-3 transition duration-150 ${
      dragHandleProps ? "touch-none" : ""
    } ${
      isOverlay
        ? "shadow-lg scale-[1.02] cursor-grabbing"
        : isPreview
          ? ""
          : dragHandleProps
            ? "hover:shadow-sm hover:-translate-y-px cursor-grab active:cursor-grabbing active:shadow-none active:translate-y-0"
            : "hover:shadow-sm hover:-translate-y-px cursor-pointer active:shadow-none active:translate-y-0"
    }`}
  >
    <img
      className="h-4 md:h-5 rounded shrink-0"
      src={item.logo || undefined}
      alt=""
      loading="lazy"
      decoding="async"
      onError={applyFaviconFallback}
    />

    <div className="min-w-0 flex-1">
      {isPreview ? (
        <h2 className="text-[13px] md:text-[16px] font-[400] truncate">
          {item.name}
        </h2>
      ) : (
        <a
          target="_blank"
          href={item.link}
          className="block"
          onClick={(e) => onBookmarkClick(item._id, e)}
          draggable={false}
        >
          <h2 className="text-[13px] md:text-[16px] font-[400] truncate">
            {item.name}
          </h2>
        </a>
      )}
    </div>

    <div className="flex items-center shrink-0">
      {!isOverlay && !isPreview && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded-md p-1 text-gray-300 opacity-0 transition-[opacity,color] duration-150 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100 data-[state=open]:opacity-100 data-[state=open]:text-gray-600 hover:text-gray-600 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => onEdit(item)}
              className="cursor-pointer"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <ArrowRight className="h-4 w-4 mr-2" />
                Move to
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-44">
                {categories.length === 0 ? (
                  <DropdownMenuItem disabled>
                    No other categories
                  </DropdownMenuItem>
                ) : (
                  categories.map((cat) => (
                    <DropdownMenuItem
                      key={cat._id}
                      onClick={() => onMoveToCategory(item, cat._id)}
                      className="cursor-pointer gap-2"
                    >
                      <span className="text-sm leading-none">{cat.emoji}</span>
                      <span className="truncate">{cat.category}</span>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem
              onClick={() => onNotes(item)}
              className="cursor-pointer"
            >
              <StickyNote className="h-4 w-4 mr-2" />
              Notes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(item)}
              className="cursor-pointer text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  </div>
);

export const CategoryCard = ({
  category,
  color,
  hcolor,
  emoji,
  bookmarks = [],
  isOverlay = false,
}) => (
  <div
    style={{ backgroundColor: color }}
    className={`px-2 md:px-4 pt-3 md:pt-6 pb-4 md:pb-8 rounded relative w-full ${
      isOverlay
        ? "shadow-lg scale-[1.01] cursor-grabbing pointer-events-none"
        : ""
    }`}
  >
    <div className="flex justify-between items-center mb-4">
      <h1
        style={{ color: hcolor }}
        className="text-[14px] md:text-[18px] font-medium pl-1 flex items-center gap-2 min-w-0"
      >
        <span className="truncate">
          {emoji} {category}
        </span>
      </h1>
      <div className="flex items-center justify-center gap-1">
        <PlusCircle size={20} className="opacity-80" />
        <Pencil size={18} className="opacity-80" />
        <Trash2 size={18} className="opacity-80" />
      </div>
    </div>

    <div className="grid grid-cols-2 mt-2 md:mt-4 gap-x-2 gap-y-2 md:gap-x-3 md:gap-y-3 min-h-[2.5rem]">
      {bookmarks.map((item) => (
        <div key={item._id} className="min-w-0">
          <BookmarkCard
            item={item}
            onBookmarkClick={() => {}}
            onEdit={() => {}}
            onNotes={() => {}}
            onDelete={() => {}}
            isPreview={isOverlay}
          />
        </div>
      ))}
    </div>
  </div>
);

const CategoryDropZone = ({ categoryId, children }) => {
  const { setNodeRef } = useDroppable({
    id: `container-${categoryId}`,
    data: { type: "container", containerId: String(categoryId) },
  });

  return (
    <div ref={setNodeRef} className="rounded-md">
      {children}
    </div>
  );
};

export const SortableBookmark = ({
  item,
  categoryId,
  onBookmarkClick,
  onEdit,
  onNotes,
  onDelete,
  categories,
  onMoveToCategory,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: bookmarkDragId(item._id),
    data: {
      type: "bookmark",
      containerId: String(categoryId),
      bookmark: item,
    },
    transition: SORTABLE_TRANSITION,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 0 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="min-w-0 outline-none focus:outline-none"
    >
      <BookmarkCard
        item={item}
        onBookmarkClick={onBookmarkClick}
        onEdit={onEdit}
        onNotes={onNotes}
        onDelete={onDelete}
        categories={categories}
        onMoveToCategory={onMoveToCategory}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

const BookmarkItem = ({
  category,
  categoryId,
  color,
  hcolor,
  emoji,
  bookmarks: filteredBookmarks,
  dragDisabled = false,
  sharedDrag = false,
  categoryDragHandleProps = null,
}) => {
  const { url } = useContext(StoreContext);
  const shouldFetchBookmarks = !Array.isArray(filteredBookmarks);
  const { data: bookmarks, isLoading } = useBookmarks(
    shouldFetchBookmarks ? categoryId : null,
  );
  const deleteCategory = useDeleteCategory();
  const optimisticRemove = useOptimisticRemoveBookmark();
  const moveBookmark = useMoveBookmark();
  const { data: allCategories } = useCategories();
  const undoTimersRef = useRef({});
  const { trackClick } = useClicks();
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedBookmarkForNotes, setSelectedBookmarkForNotes] =
    useState(null);

  const displayBookmarks = filteredBookmarks || bookmarks;
  const otherCategories = useMemo(
    () => (allCategories || []).filter((c) => c._id !== categoryId),
    [allCategories, categoryId],
  );

  const handleBookmarkClick = useCallback(
    async (bookmarkId, e) => {
      if (e.target.closest("button") || e.target.closest("[role='menuitem']")) {
        e.preventDefault();
        return;
      }

      try {
        const result = await trackClick(bookmarkId);
        if (result) {
          console.log(
            `Click tracked: ${result.clickCount} clicks for this bookmark`,
          );
        }
      } catch (err) {
        console.error("Error tracking click:", err);
      }
    },
    [trackClick],
  );

  const bookmarkIds = useMemo(
    () => (displayBookmarks || []).map((item) => bookmarkDragId(item._id)),
    [displayBookmarks],
  );

  if (isLoading) return <BookmarkItemSkeleton />;

  const handleDeleteCategory = () => {
    deleteCategory.mutate(categoryId);
    setIsConfirmDeleteOpen(false);
  };

  const handleBookmarkDelete = (item) => {
    const rollback = optimisticRemove({ bookmarkId: item._id, categoryId });
    let undone = false;
    let toastId;

    const handleUndo = () => {
      undone = true;
      rollback();
      clearTimeout(undoTimersRef.current[item._id]);
      toast.dismiss(toastId);
    };

    playToastSound("delete");
    toastId = toast(
      <div className="flex items-center gap-3">
        <span className="flex-1 text-[13px] text-white/88">
          Deleted &ldquo;{item.name}&rdquo;
        </span>
        <button
          className="shrink-0 font-medium text-white/60 text-[13px] hover:text-white transition-colors"
          onClick={handleUndo}
        >
          Undo
        </button>
      </div>,
      { autoClose: 5000, closeButton: false },
    );

    undoTimersRef.current[item._id] = setTimeout(async () => {
      if (undone) return;
      try {
        await apiRequest(`${url}/api/bookmarks/bookmark`, {
          method: "DELETE",
          body: { bookmarkId: item._id },
        });
      } catch {
        rollback();
        toast.error("Failed to delete bookmark");
      }
    }, 4800);
  };

  const handleMoveToCategory = async (item, targetCategoryId) => {
    await moveBookmark.mutateAsync({
      bookmarkId: item._id,
      sourceCategoryId: categoryId,
      targetCategoryId,
    });
  };

  const renderBookmark = (item) =>
    dragDisabled ? (
      <div key={item._id} className="min-w-0">
        <BookmarkCard
          item={item}
          onBookmarkClick={handleBookmarkClick}
          onEdit={setSelectedBookmark}
          onNotes={setSelectedBookmarkForNotes}
          onDelete={handleBookmarkDelete}
          categories={otherCategories}
          onMoveToCategory={handleMoveToCategory}
        />
      </div>
    ) : (
      <SortableBookmark
        key={item._id}
        item={item}
        categoryId={categoryId}
        onBookmarkClick={handleBookmarkClick}
        onEdit={setSelectedBookmark}
        onNotes={setSelectedBookmarkForNotes}
        onDelete={handleBookmarkDelete}
        categories={otherCategories}
        onMoveToCategory={handleMoveToCategory}
      />
    );

  const isEmpty = !displayBookmarks || displayBookmarks.length === 0;

  const bookmarkGrid = (
    <div className="mt-2 grid min-h-[2.5rem] grid-cols-2 gap-x-2 gap-y-2 md:mt-4 md:gap-x-3 md:gap-y-3">
      {isEmpty ? (
        <button
          type="button"
          onClick={() => setIsAddingBookmark(true)}
          className="flex items-center justify-center gap-2 rounded border border-dashed border-gray-300/80 bg-white/50 px-4 py-2 md:py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-blue-300 hover:bg-white hover:text-blue-600"
        >
          <PlusCircle size={18} className="opacity-80" />
          Add bookmark
        </button>
      ) : (
        displayBookmarks.map(renderBookmark)
      )}
    </div>
  );

  const bookmarkList = sharedDrag ? (
    <SortableContext
      id={String(categoryId)}
      items={bookmarkIds}
      strategy={rectSortingStrategy}
    >
      <CategoryDropZone categoryId={categoryId}>
        {bookmarkGrid}
      </CategoryDropZone>
    </SortableContext>
  ) : (
    bookmarkGrid
  );

  return (
    <>
      <div
        id={`category-${categoryId}`}
        style={{ backgroundColor: color }}
        className="group/cat relative scroll-mt-20 rounded px-2 pb-4 pt-3 transition-shadow md:px-4 md:pb-8 md:pt-6"
      >
        <div
          {...(categoryDragHandleProps || {})}
          className={`mb-4 flex items-center justify-between gap-2 ${
            categoryDragHandleProps
              ? "touch-none cursor-grab active:cursor-grabbing outline-none"
              : ""
          }`}
        >
          <h1
            style={{ color: hcolor }}
            className="flex min-w-0 items-center gap-2 pl-1 text-[14px] font-medium md:text-[18px] pointer-events-none select-none"
          >
            <span className="truncate">
              {emoji} {category}
            </span>
          </h1>
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover/cat:opacity-100 group-focus-within/cat:opacity-100 [@media(hover:none)]:opacity-100 pointer-events-auto cursor-auto">
            <button
              type="button"
              onClick={() => setIsAddingBookmark(true)}
              aria-label="Add bookmark"
              title="Add bookmark"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-gray-500 transition-colors duration-150 hover:text-gray-900 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            >
              <PlusCircle size={15} strokeWidth={2} />
              <span className="hidden sm:inline">Add</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditingCategory(true)}
              aria-label="Edit category"
              title="Edit category"
              className="rounded-lg p-1.5 text-gray-400 transition-colors duration-150 hover:text-gray-800 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            >
              <Pencil size={14} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmDeleteOpen(true)}
              aria-label="Delete category"
              title="Delete category"
              className="rounded-lg p-1.5 text-gray-400 transition-colors duration-150 hover:text-red-400 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
            >
              <Trash2 size={14} strokeWidth={2} />
            </button>
          </div>
        </div>

        {dragDisabled ? bookmarkGrid : bookmarkList}
      </div>

      <Suspense fallback={null}>
        {isAddingBookmark && (
          <AddBookmarkDialog
            open={isAddingBookmark}
            onClose={() => setIsAddingBookmark(false)}
            categoryId={categoryId}
          />
        )}

        {selectedBookmark && (
          <EditBookmarkDialog
            open={!!selectedBookmark}
            onClose={() => setSelectedBookmark(null)}
            bookmark={selectedBookmark}
          />
        )}

        {isEditingCategory && (
          <EditCategoryDialog
            open={isEditingCategory}
            onClose={() => setIsEditingCategory(false)}
            category={{
              _id: categoryId,
              category,
              bgcolor: color,
              hcolor,
              emoji,
            }}
          />
        )}

        {isConfirmDeleteOpen && (
          <ConfirmDeleteDialog
            open={isConfirmDeleteOpen}
            onClose={() => setIsConfirmDeleteOpen(false)}
            onConfirm={handleDeleteCategory}
            title="Delete Category"
            message="Are you sure you want to delete this category? All bookmarks in this category will be deleted permanently."
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        <NotesDialog
          open={!!selectedBookmarkForNotes}
          onClose={() => setSelectedBookmarkForNotes(null)}
          bookmark={selectedBookmarkForNotes}
        />
      </Suspense>
    </>
  );
};

export default BookmarkItem;
