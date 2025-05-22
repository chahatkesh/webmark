import { useState, useEffect } from "react";
import { useCategories } from "../../hooks/useBookmarks";
import BookmarkItem from "./BookmarkItem";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import AddCategoryDialog from "./AddCategoryDialog";
import { CategoryListSkeleton } from "./LoadingSkeletons";

const BookmarkList = () => {
  const { data: categories, isLoading, error } = useCategories();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Get search term from Header component via sessionStorage
  useEffect(() => {
    const headerSearchTerm = sessionStorage.getItem("bookmarkSearchTerm") || "";
    setSearchTerm(headerSearchTerm);

    // Listen for search term changes from the Header component
    const handleSearchTermChanged = (event) => {
      setSearchTerm(event.detail.searchTerm);
    };

    window.addEventListener("searchTermChanged", handleSearchTermChanged);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("searchTermChanged", handleSearchTermChanged);
    };
  }, []);

  useEffect(() => {
    if (!categories) return;

    if (!searchTerm || !searchTerm.trim()) {
      setFilteredCategories(categories);
      return;
    }

    // Improved search logic
    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);

    const filtered = categories
      .map((category) => {
        try {
          // Filter bookmarks within each category
          const filteredBookmarks = Array.isArray(category.bookmarks)
            ? category.bookmarks.filter((bookmark) =>
                searchWords.some(
                  (word) =>
                    (bookmark.name &&
                      bookmark.name.toLowerCase().includes(word)) ||
                    (bookmark.link &&
                      bookmark.link.toLowerCase().includes(word)) ||
                    (bookmark.notes &&
                      bookmark.notes.toLowerCase().includes(word))
                )
              )
            : [];

          // Return category with filtered bookmarks if any match found
          if (filteredBookmarks.length > 0) {
            return {
              ...category,
              bookmarks: filteredBookmarks,
            };
          }

          // Check if category name matches
          if (
            category.category &&
            searchWords.some((word) =>
              category.category.toLowerCase().includes(word)
            )
          ) {
            return category;
          }

          return null;
        } catch (err) {
          console.error(
            "Error filtering bookmarks in category:",
            category,
            err
          );
          return null;
        }
      })
      .filter(Boolean); // Remove null categories

    console.log(
      "Search term:",
      searchTerm,
      "Filtered categories:",
      filtered.length
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  if (isLoading) return <CategoryListSkeleton />;
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
                  {totalBookmarks} bookmark{totalBookmarks !== 1 ? "s" : ""}{" "}
                  found
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Add Category Button */}
          <Button
            onClick={() => setIsAddingCategory(true)}
            className="h-10 px-4 bg-blue-500 hover:bg-blue-600 text-white gap-2 whitespace-nowrap">
            <PlusCircle className="h-5 w-5" />
            <span>Add Category</span>
          </Button>
        </div>
      </div>
      {/* Search Results Summary - Mobile Only */}{" "}
      {searchTerm && (
        <div className="sm:hidden mb-4 text-sm text-gray-600">
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
