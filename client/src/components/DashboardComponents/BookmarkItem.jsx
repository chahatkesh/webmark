import React from "react";
import { useBookmarks, useCreateBookmark } from "../../hooks/useBookmarks";
import { Button } from "../ui/button";
import { PlusCircle, Pencil, Trash } from "lucide-react";
import AddBookmarkDialog from "./AddBookmarkDialog";

const BookmarkItem = ({ category, categoryId, color, hcolor, emoji }) => {
  const { data: bookmarks, isLoading } = useBookmarks(categoryId);
  const [isAddingBookmark, setIsAddingBookmark] = React.useState(false);

  if (isLoading) return <div>Loading...</div>;

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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingBookmark(true)}>
            <PlusCircle size={20} />
          </Button>
        </div>

        <div className="grid grid-cols-2 mt-2 md:mt-4 gap-x-2 gap-y-2 md:gap-x-3 md:gap-y-3">
          {bookmarks?.map((item) => (
            <a
              target="_blank"
              href={item.link}
              key={item._id}
              className="flex justify-between items-center p-2 md:p-2.5 bg-white rounded hover:bg-blue-100 cursor-pointer gap-3">
              <div>
                <h2 className="text-[13px] md:text-[16px] font-[400]">
                  {item.name}
                </h2>
              </div>
              <img className="h-4 md:h-6 rounded" src={item.logo} alt="" />
            </a>
          ))}
        </div>
      </div>

      <AddBookmarkDialog
        open={isAddingBookmark}
        onClose={() => setIsAddingBookmark(false)}
        categoryId={categoryId}
      />
    </>
  );
};

export default BookmarkItem;
