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
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>
          {searchTerm && (
            <div className="ml-4 hidden sm:block text-sm text-gray-600">
              {totalBookmarks === 0 ? (
                <span>No bookmarks found</span>
              ) : (
                <span>
                  {totalBookmarks} bookmark{totalBookmarks !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 h-10 bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Add Category Button */}
          <Button
            onClick={() => setIsAddingCategory(true)}
            className="h-10 px-4 bg-blue-500 hover:bg-blue-600 text-white gap-2 whitespace-nowrap">
            <PlusCircle className="h-5 w-5" />
            <span>Add Category</span>
          </Button>
        </div>
      </div>

      {/* Search Results Summary - Mobile Only */}
      {searchTerm && (
        <div className="sm:hidden mb-4 text-sm text-gray-600">
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
