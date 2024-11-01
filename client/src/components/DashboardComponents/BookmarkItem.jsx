import React, { useState } from "react";
import {
  useBookmarks,
  useDeleteCategory,
  useDeleteBookmark,
} from "../../hooks/useBookmarks";
import { Button } from "../ui/button";
import { PlusCircle, Pencil, Trash, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddBookmarkDialog from "./AddBookmarkDialog";
import EditBookmarkDialog from "./EditBookmarkDialog";
import EditCategoryDialog from "./EditCategoryDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { BookmarkItemSkeleton } from "./LoadingSkeletons";

const BookmarkItem = ({
  category,
  categoryId,
  color,
  hcolor,
  emoji,
  searchTerm,
  bookmarks: filteredBookmarks,
}) => {
  const { data: bookmarks, isLoading } = useBookmarks(categoryId);
  const deleteCategory = useDeleteCategory();
  const deleteBookmark = useDeleteBookmark();
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [bookmarkToDelete, setBookmarkToDelete] = useState(null);
  const displayBookmarks = filteredBookmarks || bookmarks;

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

  return (
    <>
      <div
        style={{ backgroundColor: color }}
        className="px-2 md:px-4 pt-3 md:pt-6 pb-4 md:pb-8 rounded relative">
        <div className="flex justify-between items-center mb-4">
          <h1
            style={{ color: hcolor }}
            className="text-[14px] md:text-[18px] font-medium pl-1 flex items-center gap-2">
            {emoji} {category}
          </h1>
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost2"
              size="sm"
              onClick={() => setIsAddingBookmark(true)}
              aria-label="Add bookmark">
              <PlusCircle size={20} />
            </Button>
            <Button
              variant="ghost2"
              size="sm"
              onClick={() => setIsEditingCategory(true)}
              aria-label="Edit category">
              <Pencil size={18} />
            </Button>
            <Button
              variant="ghost2"
              size="sm"
              onClick={() => setIsConfirmDeleteOpen(true)}
              aria-label="Delete category">
              <Trash size={18} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 mt-2 md:mt-4 gap-x-2 gap-y-2 md:gap-x-3 md:gap-y-3">
          {displayBookmarks?.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center p-2 md:p-2.5 bg-white rounded hover:bg-blue-100 cursor-pointer gap-3">
              {/* Left side with name */}
              <div className="min-w-0 flex-1">
                <a
                  target="_blank"
                  href={item.link}
                  className="block"
                  onClick={(e) => {
                    if (
                      e.target.closest("button") ||
                      e.target.closest("[role='menuitem']")
                    ) {
                      e.preventDefault();
                    }
                  }}>
                  <h2 className="text-[13px] md:text-[16px] font-[400] truncate">
                    {item.name}
                  </h2>
                </a>
              </div>

              {/* Right side with logo and menu */}
              <div className="flex items-center gap-2 shrink-0">
                <img
                  className="h-4 md:h-6 rounded"
                  src={item.logo}
                  alt=""
                  onError={(e) => {
                    e.target.src = "/api/placeholder/24/24";
                    e.target.onerror = null;
                  }}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="menu"
                      className="hover:bg-blue-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem
                      onClick={() => setSelectedBookmark(item)}
                      className="cursor-pointer">
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setBookmarkToDelete(item)}
                      className="cursor-pointer text-red-600">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddBookmarkDialog
        open={isAddingBookmark}
        onClose={() => setIsAddingBookmark(false)}
        categoryId={categoryId}
      />

      {selectedBookmark && (
        <EditBookmarkDialog
          open={!!selectedBookmark}
          onClose={() => setSelectedBookmark(null)}
          bookmark={selectedBookmark}
        />
      )}

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

      <ConfirmDeleteDialog
        open={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message="Are you sure you want to delete this category? All bookmarks in this category will be deleted. This action cannot be undone."
      />

      <ConfirmDeleteDialog
        open={!!bookmarkToDelete}
        onClose={() => setBookmarkToDelete(null)}
        onConfirm={handleDeleteBookmark}
        title="Delete Bookmark"
        message={`Are you sure you want to delete "${bookmarkToDelete?.name}"? This action cannot be undone.`}
      />
    </>
  );
};

export default BookmarkItem;
