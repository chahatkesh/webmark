import { useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useCategories } from "../../hooks/useBookmarks";
import { Copy, Check, FolderOpen, GripHorizontal, Zap, Download } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import {
  applyBookmarkletDragData,
  buildBookmarklet,
  BOOKMARKLET_TITLE,
  downloadBookmarkletFile,
} from "../../utils/bookmarklet";

const BookmarkletWidget = () => {
  const { url } = useContext(StoreContext);
  const appUrl = typeof window !== "undefined" ? window.location.origin : url;
  const { data: categories, isLoading } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [copied, setCopied] = useState(false);

  const effectiveCategoryId =
    selectedCategoryId || (categories && categories.length > 0 ? categories[0]._id : "");

  const bookmarkletHref = effectiveCategoryId
    ? buildBookmarklet(appUrl, effectiveCategoryId)
    : null;

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
      toast.success("Bookmark file downloaded — import it via Chrome Bookmark Manager");
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
          <h3 className="font-semibold text-white leading-tight">Bookmarklet</h3>
          <p className="text-blue-100 text-xs mt-0.5">
            Save any page in one click from your browser toolbar
          </p>
        </div>
      </div>

      <div className="bg-white p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
            <FolderOpen className="h-3.5 w-3.5" />
            Default category for new saves
          </label>
          {isLoading ? (
            <div className="h-9 w-full rounded-md bg-gray-100 animate-pulse" />
          ) : categories && categories.length > 0 ? (
            <select
              value={selectedCategoryId || (categories[0]?._id ?? "")}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.emoji} {cat.category}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-amber-600 bg-amber-50 rounded-md px-3 py-2">
              Create at least one category on your dashboard first.
            </p>
          )}
        </div>

        {bookmarkletHref ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500">
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
                  <><Check className="h-3.5 w-3.5 text-green-500" /> Copied</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" /> Copy</>
                )}
              </Button>
            </div>
          </div>
        ) : (
          !isLoading && (
            <p className="text-sm text-gray-400 italic">
              Select a category above to generate your bookmarklet.
            </p>
          )
        )}

        <div className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-3 space-y-1.5">
          <p className="text-xs font-semibold text-gray-700">How to use</p>
          <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
            <li>Make sure your browser bookmarks bar is visible (Ctrl/Cmd + Shift + B).</li>
            <li>
              Drag <span className="font-medium text-blue-600">{BOOKMARKLET_TITLE}</span> into your bookmarks bar,
              or download and import the bookmark file for the Webmark icon.
            </li>
            <li>Visit any page you want to save and click the bookmark.</li>
            <li>A small popup confirms the save — AI sorts it automatically.</li>
          </ol>
          <p className="text-xs text-amber-600 mt-1.5">
            If you log out of Webmark, sign in again before using the bookmarklet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookmarkletWidget;
