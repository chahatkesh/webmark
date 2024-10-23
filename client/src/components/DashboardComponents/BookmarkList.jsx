import React from "react";
import { useCategories } from "../../hooks/useBookmarks";
import BookmarkItem from "./BookmarkItem";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import AddCategoryDialog from "./AddCategoryDialog";

const BookmarkList = () => {
  const { data: categories, isLoading, error } = useCategories();
  const [isAddingCategory, setIsAddingCategory] = React.useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Bookmarks</h1>
        <Button
          onClick={() => setIsAddingCategory(true)}
          className="flex items-center gap-2">
          <PlusCircle size={20} />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 md:gap-y-6">
        {categories?.map((categoryItem) => (
          <BookmarkItem
            key={categoryItem._id}
            category={categoryItem.category}
            categoryId={categoryItem._id}
            color={categoryItem.bgcolor}
            hcolor={categoryItem.hcolor}
            emoji={categoryItem.emoji}
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
