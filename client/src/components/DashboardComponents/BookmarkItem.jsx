import React, { useState } from "react";
import {
  useBookmarks,
  useDeleteCategory,
  useDeleteBookmark,
  useUpdateBookmarkOrder,
} from "../../hooks/useBookmarks";
import { Button } from "../ui/button";
import {
  PlusCircle,
  Pencil,
  Trash2,
  MoreVertical,
  GripVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
  const updateBookmarkOrder = useUpdateBookmarkOrder();
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
        // The mutation will now handle optimistic updates automatically
        onError: (error) => {
          // If there's an error, the mutation will automatically revert the changes
          console.error("Error updating bookmark order:", error);
        },
      }
    );
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
              <Trash2 size={18} />
            </Button>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={categoryId}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-2 mt-2 md:mt-4 gap-x-2 gap-y-2 md:gap-x-3 md:gap-y-3">
                {displayBookmarks?.map((item, index) => (
                  <Draggable
                    key={item._id}
                    draggableId={item._id}
                    index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex justify-between items-center p-2 md:p-2.5 bg-white rounded hover:bg-blue-100 cursor-pointer gap-3 ${
                          snapshot.isDragging ? "shadow-lg" : ""
                        }`}>
                        {/* Drag Handle */}
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab active:cursor-grabbing">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                        </div>

                        {/* Content */}
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
                                className="hover:bg-blue-200 py-1">
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
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
        message="Are you sure you want to delete this category? All bookmarks in this category will be deleted permanently."
      />

      <ConfirmDeleteDialog
        open={!!bookmarkToDelete}
        onClose={() => setBookmarkToDelete(null)}
        onConfirm={handleDeleteBookmark}
        title="Delete Bookmark"
        itemName={`${bookmarkToDelete?.name}`}
        message={`Are you sure you want to delete "${bookmarkToDelete?.name}"? This action cannot be undone.`}
      />
    </>
  );
};

export default BookmarkItem;
