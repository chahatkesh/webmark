import { ExternalLink, MousePointer, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TopBookmarksList = ({ bookmarks = [], loading }) => {
  if (loading) {
    return (
      <Card className="border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Most used</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!bookmarks.length) {
    return (
      <Card className="border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Most used</CardTitle>
          <CardDescription>
            Your most-opened bookmarks will show up here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-slate-50/50 px-4 py-10 text-center">
            <Sparkles className="mb-2 h-5 w-5 text-gray-400" />
            <p className="text-sm text-gray-500">
              Open a few bookmarks from your dashboard to build this list.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Most used</CardTitle>
        <CardDescription>Your top destinations by opens</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 p-3 pt-0 sm:p-4 sm:pt-0">
        {bookmarks.map((bookmark, index) => (
          <a
            key={bookmark.id}
            href={bookmark.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-slate-50"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-xs font-semibold text-blue-700">
              {index + 1}
            </span>
            {bookmark.logo ? (
              <img
                src={bookmark.logo}
                alt=""
                className="h-8 w-8 shrink-0 rounded-md object-cover ring-1 ring-gray-100"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900 group-hover:text-blue-700">
                {bookmark.name}
              </p>
              <p className="truncate text-xs text-gray-500">
                {bookmark.lastClicked
                  ? `Opened ${formatDistanceToNow(new Date(bookmark.lastClicked), { addSuffix: true })}`
                  : bookmark.link}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-gray-500">
              <span className="inline-flex items-center gap-1 text-xs font-medium tabular-nums text-gray-700">
                <MousePointer className="h-3.5 w-3.5" />
                {(bookmark.clickCount || 0).toLocaleString()}
              </span>
              <ExternalLink className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopBookmarksList;
