import { lazy, Suspense, useState, useEffect, useMemo } from "react";
import { useCategories, useAISort, useImportBookmarks, useRevertAISort } from "../../hooks/useBookmarks";
import BookmarkItem from "./BookmarkItem";
import { Button } from "../ui/button";
import { PlusCircle, Upload, Wand2 } from "lucide-react";
import { CategoryListSkeleton } from "./LoadingSkeletons";

const AddCategoryDialog = lazy(() => import("./AddCategoryDialog"));
const ImportBookmarksDialog = lazy(() => import("./ImportBookmarksDialog"));
const AISortDialog = lazy(() => import("./AISortDialog"));

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
                  (bookmark.name && bookmark.name.toLowerCase().includes(word)) ||
                  (bookmark.link && bookmark.link.toLowerCase().includes(word)) ||
                  (bookmark.notes && bookmark.notes.toLowerCase().includes(word)),
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
          searchWords.some((word) => category.category.toLowerCase().includes(word))
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
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isAISortOpen, setIsAISortOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortsLeft, setSortsLeft] = useState(
    () => parseInt(localStorage.getItem("aiSortsRemaining") ?? "5", 10),
  );
  const [importsLeft, setImportsLeft] = useState(
    () => parseInt(localStorage.getItem("importsRemainingThisMonth") ?? "2", 10),
  );
  const { mutate: aiSort, isPending: isSorting, data: sortResults, error: sortError, reset: resetSort } = useAISort();
  const { mutate: revertSort, isPending: isReverting } = useRevertAISort();
  const importMutation = useImportBookmarks();

  const filteredCategories = useMemo(
    () => filterCategories(categories, searchTerm),
    [categories, searchTerm],
  );

  const syncLimitsFromStorage = () => {
    const storedSorts = parseInt(localStorage.getItem("aiSortsRemaining") ?? "5", 10);
    const storedImports = parseInt(localStorage.getItem("importsRemainingThisMonth") ?? "2", 10);
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
        <h2 className="text-lg font-semibold text-gray-900">No categories yet</h2>
        <p className="mt-2 text-sm text-gray-500">Create your first category to start organizing bookmarks.</p>
        <Button
          onClick={() => setIsAddingCategory(true)}
          className="mt-6 h-10 bg-blue-500 px-4 text-white hover:bg-blue-600">
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
                  {totalBookmarks} bookmark{totalBookmarks !== 1 ? "s" : ""} found
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
            title={sortsLeft <= 0 ? "No AI Sort credits left. Import bookmarks to earn more." : `${sortsLeft} credit${sortsLeft !== 1 ? 's' : ''} remaining`}
            className="h-10 gap-2 whitespace-nowrap px-4">
            <Wand2 className="h-5 w-5" />
            <span>AI Sort</span>
            <span className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
              sortsLeft <= 0
                ? "bg-red-100 text-red-600"
                : sortsLeft <= 2
                ? "bg-amber-100 text-amber-700"
                : "bg-blue-100 text-blue-700"
            }`}>{sortsLeft}</span>
          </Button>
          <Button
            onClick={() => setIsImporting(true)}
            variant="outline"
            disabled={importMutation.isPending || importsLeft <= 0}
            title={importsLeft <= 0 ? "Import limit reached for this month (2/month). Resets next month." : `${importsLeft} import${importsLeft !== 1 ? 's' : ''} remaining this month`}
            className="h-10 gap-2 whitespace-nowrap px-4">
            <Upload className="h-5 w-5" />
            <span>Import</span>
            <span className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
              importsLeft <= 0
                ? "bg-red-100 text-red-600"
                : importsLeft <= 1
                ? "bg-amber-100 text-amber-700"
                : "bg-blue-100 text-blue-700"
            }`}>{importsLeft}</span>
          </Button>
          <Button
            onClick={() => setIsAddingCategory(true)}
            className="h-10 gap-2 whitespace-nowrap bg-blue-500 px-4 text-white hover:bg-blue-600">
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
              Found {totalBookmarks} bookmark{totalBookmarks !== 1 ? "s" : ""} for &quot;{searchTerm}&quot;
            </p>
          )}
        </div>
      )}
      {filteredCategories.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-6 py-10 text-center text-gray-600">
          No bookmarks match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 md:gap-y-6 lg:grid-cols-3">
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
            onConfirm={() => aiSort()}
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
