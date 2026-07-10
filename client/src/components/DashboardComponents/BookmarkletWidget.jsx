import { useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useCategories } from "../../hooks/useBookmarks";
import {
  Copy,
  Check,
  GripHorizontal,
  Zap,
  Download,
  Sparkles,
} from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import {
  applyBookmarkletDragData,
  buildBookmarklet,
  BOOKMARKLET_TITLE,
  downloadBookmarkletFile,
} from "../../utils/bookmarklet";

const BookmarkletWidget = () => {
  const { url: apiUrl } = useContext(StoreContext);
  const appUrl =
    typeof window !== "undefined" ? window.location.origin : apiUrl;
  const { data: categories, isLoading } = useCategories();
  const [copied, setCopied] = useState(false);

  const bookmarkletHref = buildBookmarklet(apiUrl);

  const handleCopy = () => {
    if (!bookmarkletHref) return;
    navigator.clipboard.writeText(bookmarkletHref).then(() => {
      setCopied(true);
      toast.success("Bookmarklet copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = async () => {
    if (!bookmarkletHref) return;
    try {
      await downloadBookmarkletFile(bookmarkletHref, appUrl);
      toast.success(
        "Bookmark file downloaded — import it via Chrome Bookmark Manager",
      );
    } catch (error) {
      console.error("Failed to export bookmarklet:", error);
      toast.error("Failed to download bookmark file");
    }
  };

  const handleDragStart = (e) => {
    if (!bookmarkletHref) {
      e.preventDefault();
      return;
    }
    applyBookmarkletDragData(e, bookmarkletHref, appUrl);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-blue-200 shadow-sm">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-4 flex items-center gap-3">
        <div className="rounded-lg bg-white/20 p-2">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white leading-tight">
            Bookmarklet
          </h3>
          <p className="text-blue-100 text-xs mt-0.5">
            Save any page in one click — AI picks the category
          </p>
        </div>
      </div>

      <div className="bg-white p-5 space-y-4">
        {isLoading ? (
          <div className="h-9 w-full rounded-md bg-gray-100 animate-pulse" />
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              Drag this button to your bookmarks bar:
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={bookmarkletHref}
                draggable
                onDragStart={handleDragStart}
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 cursor-grab active:cursor-grabbing hover:bg-blue-100 transition-colors select-none"
                title="Drag me to your bookmarks toolbar"
              >
                <GripHorizontal className="h-4 w-4 text-blue-400" />
                {BOOKMARKLET_TITLE}
              </a>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-1.5 text-xs"
                title="Download bookmark file with Webmark icon"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5 text-xs"
                title="Copy bookmarklet code"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-500" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {!isLoading && (!categories || categories.length === 0) && (
          <p className="text-xs text-gray-500">
            No categories yet? Saves will go into an auto-created Uncategorized
            folder.
          </p>
        )}

        <div className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-3 space-y-1.5">
          <p className="text-xs font-semibold text-gray-700">How to use</p>
          <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
            <li>
              Make sure your browser bookmarks bar is visible (Ctrl/Cmd + Shift
              + B).
            </li>
            <li>
              Drag{" "}
              <span className="font-medium text-blue-600">
                {BOOKMARKLET_TITLE}
              </span>{" "}
              into your bookmarks bar, or download and import the bookmark file
              for the Webmark icon.
            </li>
            <li>Visit any page you want to save and click the bookmark.</li>
            <li>
              AI places it in the best matching category, or Uncategorized if
              none fit.
            </li>
          </ol>
          <p className="text-xs text-amber-600 mt-1.5">
            If you log out of Webmark, sign in again before using the
            bookmarklet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookmarkletWidget;
