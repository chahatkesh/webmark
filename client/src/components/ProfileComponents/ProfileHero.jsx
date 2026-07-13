import {
  Bookmark,
  CalendarDays,
  Clock,
  FolderOpen,
  Mail,
  MousePointer,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";

const BANNER_QUOTE = "Organise your web, one bookmark at a time.";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const formatJoinDate = (date) => {
  if (!date) return "Recently";
  return format(new Date(date), "MMM d, yyyy");
};

const formatCount = (value) => (Number(value) || 0).toLocaleString();

const ProfileHero = ({
  profile,
  clickStats,
  formatTimeSaved,
  statsLoading,
}) => {
  const displayName = profile?.name || profile?.username || "there";
  const greeting = getGreeting();

  const avatarFallback =
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(displayName) +
    "&size=200&background=4F46E5&color=fff";

  const avatar = profile?.profilePicture ? (
    <img
      src={profile.profilePicture}
      alt=""
      referrerPolicy="no-referrer"
      className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-gray-200 sm:h-16 sm:w-16"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = avatarFallback;
      }}
    />
  ) : (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-semibold text-white ring-1 ring-blue-500/20 sm:h-16 sm:w-16 sm:text-xl">
      {(profile?.username || "U").charAt(0).toUpperCase()}
    </div>
  );

  return (
    <Card className="overflow-hidden border-gray-100 shadow-sm">
      {/* Banner */}
      <div className="relative h-24 bg-blue-500 sm:h-28">
        {/* Subtle stripe texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.4) 10px, rgba(255,255,255,0.4) 11px)",
          }}
        />
        {/* Quote */}
        <div className="absolute inset-0 flex items-center justify-end px-5 sm:px-6">
          <p className="max-w-xs text-right text-[11px] font-medium italic leading-relaxed text-white/70 sm:text-xs">
            &ldquo;{BANNER_QUOTE}&rdquo;
          </p>
        </div>
      </div>

      {/* Profile info */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        {/* Avatar — overlaps banner */}
        <div className="relative -mt-8 mb-3 sm:-mt-10">
          <div className="inline-block rounded-2xl ring-4 ring-white">
            {avatar}
          </div>
        </div>

        {/* Greeting */}
        <p className="text-[12px] text-gray-400">
          {greeting},{" "}
          <span className="font-medium text-gray-500">
            @{profile?.username}
          </span>
        </p>

        {/* Name */}
        <h1 className="mt-0.5 truncate text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
          {displayName}
        </h1>

        {/* Email + join date */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="inline-flex min-w-0 items-center gap-1.5 text-[12px] text-gray-400">
            <Mail className="h-3 w-3 shrink-0" />
            <span className="truncate">{profile?.email}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-gray-400">
            <CalendarDays className="h-3 w-3 shrink-0" />
            Joined {formatJoinDate(profile?.joinedAt)}
          </span>
        </div>
      </div>

      {/* ── Stats strip ───────────────────────────────── */}
      <div className="border-t border-gray-100">
        <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-4 sm:divide-y-0">
          {[
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
              value: formatTimeSaved
                ? formatTimeSaved(clickStats?.timeSaved || 0)
                : "—",
              title: "Estimated time saved",
            },
          ].map(({ icon: Icon, label, value, title }) => (
            <div
              key={label}
              className="flex flex-col gap-1 px-5 py-4 sm:px-6"
              title={title}
            >
              <div className="flex items-center gap-1.5">
                <Icon className="h-3 w-3 shrink-0 text-blue-400" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  {label}
                </span>
              </div>
              {statsLoading ? (
                <div className="mt-1 h-6 w-14 animate-pulse rounded bg-gray-100" />
              ) : (
                <p className="mt-0.5 text-[22px] font-semibold leading-none tracking-tight text-gray-900 tabular-nums">
                  {value}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Last opened footer */}
        {clickStats?.lastClickedBookmark?.name && (
          <div className="flex items-center gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-2.5 sm:px-6">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
            <p className="min-w-0 truncate text-[11px] text-gray-400">
              Last opened{" "}
              <span className="font-medium text-gray-600">
                {clickStats.lastClickedBookmark.name}
              </span>
              {clickStats.lastClickedBookmark.timestamp && (
                <span className="text-gray-400">
                  {" · "}
                  {formatDistanceToNow(
                    new Date(clickStats.lastClickedBookmark.timestamp),
                    { addSuffix: true },
                  )}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileHero;
