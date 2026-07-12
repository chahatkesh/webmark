import { formatDistanceToNow } from "date-fns";
import { Bookmark, Clock, FolderOpen, MousePointer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const formatCount = (value) => {
  const num = Number(value) || 0;
  return num.toLocaleString();
};

const StatItem = ({ icon: Icon, label, value, loading, title }) => (
  <div className="rounded-xl bg-slate-50/90 px-3 py-3 sm:px-3.5" title={title}>
    <div className="mb-2 flex items-center gap-1.5 text-gray-500">
      <Icon className="h-3.5 w-3.5 shrink-0 text-blue-500" />
      <p className="text-[11px] font-medium uppercase tracking-wide">{label}</p>
    </div>
    {loading ? (
      <div className="h-7 w-14 animate-pulse rounded bg-gray-200" />
    ) : (
      <p className="break-words text-xl font-semibold leading-tight tracking-tight text-gray-900 tabular-nums">
        {value}
      </p>
    )}
  </div>
);

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
    <Card className="border-gray-100 shadow-sm">
      <CardContent className="p-3 sm:p-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stats.map((stat) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              loading={loading}
              title={stat.title}
            />
          ))}
        </div>
        {lastOpened?.name && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            <p className="min-w-0 truncate text-sm text-gray-600">
              Last opened{" "}
              <span className="font-medium text-gray-900">
                {lastOpened.name}
              </span>
              {lastOpened.timestamp && (
                <span className="text-gray-400">
                  {" "}
                  ·{" "}
                  {formatDistanceToNow(new Date(lastOpened.timestamp), {
                    addSuffix: true,
                  })}
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileStatStrip;
