import React from "react";

// Shared shimmer base — wave animation over a light bg
const Shimmer = ({ className = "" }) => (
  <div
    className={`relative overflow-hidden rounded bg-gray-100 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.4s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent ${className}`}
  />
);

// Single bookmark row skeleton
const BookmarkRowSkeleton = ({ short = false }) => (
  <div className="flex items-center gap-3 rounded bg-white px-2 py-2 md:px-2.5 md:py-2.5">
    <Shimmer className="h-4 w-4 shrink-0 rounded" />
    <Shimmer
      className={`h-3 flex-1 rounded ${short ? "max-w-[55%]" : "max-w-[75%]"}`}
    />
    <Shimmer className="h-4 w-4 shrink-0 rounded-sm" />
  </div>
);

// Single category card skeleton — matches real card proportions
export const BookmarkItemSkeleton = () => (
  <div className="rounded px-2 pb-4 pt-3 md:px-4 md:pb-8 md:pt-6 bg-gray-50">
    {/* Header row */}
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Shimmer className="h-4 w-4 rounded-sm" />
        <Shimmer className="h-4 w-28 rounded" />
      </div>
      <Shimmer className="h-5 w-16 rounded-md" />
    </div>
    {/* 2-col bookmark grid */}
    <div className="grid grid-cols-2 gap-x-2 gap-y-2 md:gap-x-3 md:gap-y-3">
      <BookmarkRowSkeleton />
      <BookmarkRowSkeleton short />
      <BookmarkRowSkeleton short />
      <BookmarkRowSkeleton />
    </div>
  </div>
);

// Single category card skeleton
const CategoryCardSkeleton = ({ bookmarkCount = 4 }) => (
  <div className="rounded px-2 pb-4 pt-3 md:px-4 md:pb-8 md:pt-6 bg-gray-50">
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Shimmer className="h-4 w-4 rounded-sm" />
        <Shimmer className="h-4 w-24 rounded" />
      </div>
      <Shimmer className="h-5 w-14 rounded-md" />
    </div>
    <div className="grid grid-cols-2 gap-x-2 gap-y-2 md:gap-x-3 md:gap-y-3">
      {Array.from({ length: bookmarkCount }).map((_, i) => (
        <BookmarkRowSkeleton key={i} short={i % 3 === 1} />
      ))}
    </div>
  </div>
);

// Full dashboard skeleton — matches real responsive column layout exactly:
// 1 col on mobile, 2 on sm (640px), 3 on lg (1024px)
export const CategoryListSkeleton = () => (
  <>
    {/* Mobile: single column, 3 stacked cards */}
    <div className="flex flex-col gap-y-4 sm:hidden">
      <CategoryCardSkeleton bookmarkCount={4} />
      <CategoryCardSkeleton bookmarkCount={3} />
      <CategoryCardSkeleton bookmarkCount={4} />
    </div>

    {/* sm–lg: 2 columns */}
    <div className="hidden items-start gap-x-6 sm:flex lg:hidden">
      <div className="flex min-w-0 flex-1 flex-col gap-y-4">
        <CategoryCardSkeleton bookmarkCount={5} />
        <CategoryCardSkeleton bookmarkCount={3} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-y-4">
        <CategoryCardSkeleton bookmarkCount={4} />
        <CategoryCardSkeleton bookmarkCount={4} />
      </div>
    </div>

    {/* lg+: 3 columns with organic heights */}
    <div className="hidden items-start gap-x-6 lg:flex">
      <div className="flex min-w-0 flex-1 flex-col gap-y-6">
        <CategoryCardSkeleton bookmarkCount={6} />
        <CategoryCardSkeleton bookmarkCount={3} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-y-6">
        <CategoryCardSkeleton bookmarkCount={4} />
        <CategoryCardSkeleton bookmarkCount={5} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-y-6">
        <CategoryCardSkeleton bookmarkCount={3} />
        <CategoryCardSkeleton bookmarkCount={4} />
        <CategoryCardSkeleton bookmarkCount={2} />
      </div>
    </div>
  </>
);

export const DialogSkeleton = () => (
  <div className="space-y-4 p-8">
    <Shimmer className="h-7 w-44 rounded" />
    <div className="space-y-3">
      <Shimmer className="h-9 w-full rounded-md" />
      <Shimmer className="h-9 w-full rounded-md" />
      <Shimmer className="h-9 w-full rounded-md" />
    </div>
    <div className="flex justify-end gap-3 pt-2">
      <Shimmer className="h-9 w-20 rounded-md" />
      <Shimmer className="h-9 w-28 rounded-md" />
    </div>
  </div>
);
