import React, { useState, useEffect } from "react";
import { useCategories } from "../../hooks/useBookmarks";
import BookmarkItem from "./BookmarkItem";
import { Button } from "../ui/button";
import { PlusCircle, Search as SearchIcon, X } from "lucide-react";
import { Input } from "../ui/input";
import AddCategoryDialog from "./AddCategoryDialog";

const BookmarkList = () => {
  const { data: categories, isLoading, error } = useCategories();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    if (!categories) return;

    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const searchWords = searchTerm.toLowerCase().split(" ");

    const filtered = categories
      .map((category) => {
        // Filter bookmarks within each category
        const filteredBookmarks = category.bookmarks.filter((bookmark) =>
          searchWords.every(
            (word) =>
              bookmark.name.toLowerCase().includes(word) ||
              bookmark.link.toLowerCase().includes(word)
          )
        );

        // Return category with filtered bookmarks if any match found
        if (filteredBookmarks.length > 0) {
          return {
            ...category,
            bookmarks: filteredBookmarks,
          };
        }

        // Check if category name matches
        if (
          searchWords.every((word) =>
            category.category.toLowerCase().includes(word)
          )
        ) {
          return category;
        }

        return null;
      })
      .filter(Boolean); // Remove null categories

    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Count total bookmarks in filtered results
  const totalBookmarks = filteredCategories.reduce(
    (sum, category) => sum + (category.bookmarks?.length || 0),
    0
  );

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold">My Bookmarks</h1>
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex items-center flex-1 md:flex-none">
            <SearchIcon className="absolute left-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-8 h-9 w-full md:w-[300px]"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 h-7 w-7 p-0 hover:bg-transparent"
                onClick={() => setSearchTerm("")}>
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            )}
          </div>

          {/* Add Category Button */}
          <Button
            onClick={() => setIsAddingCategory(true)}
            className="shrink-0">
            <PlusCircle size={18} />
            <span className="hidden sm:block ml-2">Add Category</span>
          </Button>
        </div>
      </div>

      {/* Search Results Summary */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600">
          {totalBookmarks === 0 ? (
            <p>No bookmarks found for "{searchTerm}"</p>
          ) : (
            <p>
              Found {totalBookmarks} bookmark{totalBookmarks !== 1 ? "s" : ""}{" "}
              for "{searchTerm}"
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 md:gap-y-6">
        {filteredCategories.map((categoryItem) => (
          <BookmarkItem
            key={categoryItem._id}
            category={categoryItem.category}
            categoryId={categoryItem._id}
            color={categoryItem.bgcolor}
            hcolor={categoryItem.hcolor}
            emoji={categoryItem.emoji}
            bookmarks={categoryItem.bookmarks}
          />
        ))}
      </div>

      <AddCategoryDialog
        open={isAddingCategory}
        onClose={() => setIsAddingCategory(false)}
      />
    </>
  );
};

export default BookmarkList;
