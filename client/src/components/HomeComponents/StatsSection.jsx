import React from "react";
import { useStats } from "../../hooks/useStats";

const fmt = (n) => {
  if (!n) return "0";
  if (n >= 1000) return `${Math.floor(n / 1000)}k+`;
  return n.toLocaleString();
};

const StatsSection = () => {
  const { stats, isLoading } = useStats();

  const users = fmt(stats?.totalUsers);
  const bookmarks = fmt(stats?.totalBookmarks);

  return (
    <section id="about-us" className="py-10 md:py-14">
      <div className="mx-auto max-w-[72rem] px-4 sm:px-6">
        <p className="text-center text-[1rem] leading-[1.7] tracking-[-0.01em] text-[#6b7280] md:text-[1.0625rem]">
          {isLoading ? (
            <span className="inline-block h-5 w-56 animate-pulse rounded bg-gray-100" />
          ) : (
            <>
              <span className="font-semibold text-[#111827]">
                {users} people
              </span>
              {" have saved "}
              <span className="font-semibold text-[#111827]">
                {bookmarks} bookmarks
              </span>
              {" with Webmark"}
            </>
          )}
        </p>
      </div>
    </section>
  );
};

export default StatsSection;
