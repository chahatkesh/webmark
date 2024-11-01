import React from "react";

export const BookmarkItemSkeleton = () => {
  return (
    <div className="px-4 pt-6 pb-8 rounded bg-gray-50 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 mt-4 gap-3">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="flex justify-between items-center p-2.5 bg-gray-200 rounded">
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CategoryListSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <BookmarkItemSkeleton key={n} />
        ))}
      </div>
    </div>
  );
};

export const DialogSkeleton = () => {
  return (
    <div className="p-8 space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded"></div>
      <div className="space-y-4">
        <div className="h-10 w-full bg-gray-200 rounded"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
      </div>
      <div className="flex justify-end gap-3">
        <div className="h-10 w-24 bg-gray-200 rounded"></div>
        <div className="h-10 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};
