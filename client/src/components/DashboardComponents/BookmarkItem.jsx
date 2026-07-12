import React, { lazy, Suspense, useState, useMemo, useCallback } from "react";
import {
  useBookmarks,
  useDeleteCategory,
  useDeleteBookmark,
} from "../../hooks/useBookmarks";
import useClicks from "../../hooks/useClicks";
import { Button } from "../ui/button";
import {
  PlusCircle,
  Pencil,
  Trash2,
  MoreVertical,
  GripVertical,
  StickyNote,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  isOverlay = false,
  isPreview = false,
  dragHandleProps = null,
}) => (
  <div
    className={`flex justify-between items-center p-2 md:p-2.5 bg-white rounded gap-3 ${
      isOverlay
        ? "shadow-lg scale-[1.01] cursor-grabbing"
        : isPreview
          ? ""
          : "hover:bg-blue-100 cursor-pointer"
    }`}
  >
    <div
      {...(dragHandleProps || {})}
      data-drag-handle
      className={`touch-none shrink-0 outline-none focus:outline-none ${
        dragHandleProps
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-default"
      }`}
    >
      <GripVertical className="h-4 w-4 text-gray-400" />
    </div>

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

    <div className="flex items-center gap-2 shrink-0">
      <img
        className="h-4 md:h-6 rounded"
        src={item.logo || undefined}
        alt=""
        loading="lazy"
        decoding="async"
        onError={applyFaviconFallback}
      />
      {!isOverlay && !isPreview && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="menu"
              className="hover:bg-blue-200 py-1"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={() => onNotes(item)}
              className="cursor-pointer"
            >
              <StickyNote className="h-4 w-4 mr-2" />
              Notes
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEdit(item)}
              className="cursor-pointer"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
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
  showCategoryGrip = false,
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
        {showCategoryGrip && (
          <div className="shrink-0">
            <GripVertical className="h-4 w-4 opacity-60" />
          </div>
        )}
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
  const shouldFetchBookmarks = !Array.isArray(filteredBookmarks);
  const { data: bookmarks, isLoading } = useBookmarks(
    shouldFetchBookmarks ? categoryId : null,
  );
  const deleteCategory = useDeleteCategory();
  const deleteBookmark = useDeleteBookmark();
  const { trackClick } = useClicks();
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [bookmarkToDelete, setBookmarkToDelete] = useState(null);
  const [selectedBookmarkForNotes, setSelectedBookmarkForNotes] =
    useState(null);

  const displayBookmarks = filteredBookmarks || bookmarks;

  const handleBookmarkClick = useCallback(
    async (bookmarkId, e) => {
      if (
        e.target.closest("button") ||
        e.target.closest("[role='menuitem']") ||
        e.target.closest("[data-drag-handle]")
      ) {
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

  const handleDeleteBookmark = async () => {
    if (bookmarkToDelete) {
      await deleteBookmark.mutateAsync({
        bookmarkId: bookmarkToDelete._id,
        categoryId,
      });
      setBookmarkToDelete(null);
    }
  };

  const renderBookmark = (item) =>
    dragDisabled ? (
      <div key={item._id} className="min-w-0">
        <BookmarkCard
          item={item}
          onBookmarkClick={handleBookmarkClick}
          onEdit={setSelectedBookmark}
          onNotes={setSelectedBookmarkForNotes}
          onDelete={setBookmarkToDelete}
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
        onDelete={setBookmarkToDelete}
      />
    );

  const isEmpty = !displayBookmarks || displayBookmarks.length === 0;

  const bookmarkGrid = (
    <div className="mt-2 grid min-h-[2.5rem] grid-cols-2 gap-x-2 gap-y-2 md:mt-4 md:gap-x-3 md:gap-y-3">
      {isEmpty ? (
        <button
          type="button"
          onClick={() => setIsAddingBookmark(true)}
          className="col-span-2 flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300/80 bg-white/50 px-4 py-6 text-sm font-medium text-gray-600 transition-colors hover:border-blue-300 hover:bg-white hover:text-blue-600"
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
        className="relative scroll-mt-20 rounded px-2 pb-4 pt-3 transition-shadow md:px-4 md:pb-8 md:pt-6"
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <h1
            style={{ color: hcolor }}
            className="flex min-w-0 items-center gap-2 pl-1 text-[14px] font-medium md:text-[18px]"
          >
            {categoryDragHandleProps && (
              <div
                {...categoryDragHandleProps}
                data-category-drag-handle
                className="touch-none shrink-0 cursor-grab outline-none focus:outline-none active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4 opacity-60" />
              </div>
            )}
            <span className="truncate">
              {emoji} {category}
            </span>
          </h1>
          <div className="flex shrink-0 items-center justify-center gap-0.5">
            <Button
              variant="ghost2"
              size="sm"
              onClick={() => setIsAddingBookmark(true)}
              aria-label="Add bookmark"
              title="Add bookmark"
              className="gap-1.5 text-gray-700"
            >
              <PlusCircle size={18} />
              <span className="hidden text-sm font-medium sm:inline">Add</span>
            </Button>
            <Button
              variant="ghost2"
              size="sm"
              onClick={() => setIsEditingCategory(true)}
              aria-label="Edit category"
              title="Edit category"
            >
              <Pencil size={18} />
            </Button>
            <Button
              variant="ghost2"
              size="sm"
              onClick={() => setIsConfirmDeleteOpen(true)}
              aria-label="Delete category"
              title="Delete category"
            >
              <Trash2 size={18} />
            </Button>
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

        {bookmarkToDelete && (
          <ConfirmDeleteDialog
            open={!!bookmarkToDelete}
            onClose={() => setBookmarkToDelete(null)}
            onConfirm={handleDeleteBookmark}
            title="Delete Bookmark"
            itemName={`${bookmarkToDelete?.name}`}
            message={`Are you sure you want to delete "${bookmarkToDelete?.name}"? This action cannot be undone.`}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        <NotesDialog
          open={!!selectedBookmarkForNotes}
          onClose={() => setSelectedBookmarkForNotes(null)}
          bookmark={selectedBookmarkForNotes}
          onEdit={() => {
            setSelectedBookmark(selectedBookmarkForNotes);
            setSelectedBookmarkForNotes(null);
          }}
        />
      </Suspense>
    </>
  );
};

export default BookmarkItem;
