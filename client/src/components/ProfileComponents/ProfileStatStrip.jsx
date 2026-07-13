import { formatDistanceToNow } from "date-fns";
import { Bookmark, Clock, FolderOpen, MousePointer } from "lucide-react";
import { Card } from "@/components/ui/card";

const formatCount = (value) => {
  const num = Number(value) || 0;
  return num.toLocaleString();
};

const ProfileStatStrip = ({
  profile,
  clickStats,
  formatTimeSaved,
  loading,
}) => {
  const timeSaved = formatTimeSaved(clickStats?.timeSaved || 0);

  const stats = [
    {
      icon: Bookmark,
      label: "Bookmarks",
      value: formatCount(profile?.bookmarkCount),
    },
    {
      icon: FolderOpen,
      label: "Categories",
      value: formatCount(profile?.categoryCount),
    },
    {
      icon: MousePointer,
      label: "Clicks",
      value: formatCount(clickStats?.totalClicks),
    },
    {
      icon: Clock,
      label: "Time saved",
      value: timeSaved,
      title: "Estimated time saved from quick opens",
    },
  ];

  const lastOpened = clickStats?.lastClickedBookmark;

  return (
    <Card className="overflow-hidden border-gray-100 shadow-sm">
      {/* Stat strip — horizontal row, divided by hairlines */}
      <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-4 sm:divide-y-0">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 px-5 py-5 sm:px-6"
            title={stat.title}
          >
            <div className="flex items-center gap-1.5">
              <stat.icon className="h-3.5 w-3.5 shrink-0 text-blue-400" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                {stat.label}
              </span>
            </div>
            {loading ? (
              <div className="mt-1 h-7 w-16 animate-pulse rounded bg-gray-100" />
            ) : (
              <p className="mt-0.5 text-[26px] font-semibold leading-none tracking-tight text-gray-900 tabular-nums">
                {stat.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Last opened — full-width footer strip */}
      {lastOpened?.name && (
        <div className="flex items-center gap-2.5 border-t border-gray-100 bg-gray-50/60 px-5 py-2.5 sm:px-6">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
          <p className="min-w-0 truncate text-[12px] text-gray-500">
            Last opened{" "}
            <span className="font-medium text-gray-700">{lastOpened.name}</span>
            {lastOpened.timestamp && (
              <span className="text-gray-400">
                {" · "}
                {formatDistanceToNow(new Date(lastOpened.timestamp), {
                  addSuffix: true,
                })}
              </span>
            )}
          </p>
        </div>
      )}
    </Card>
  );
};

export default ProfileStatStrip;
