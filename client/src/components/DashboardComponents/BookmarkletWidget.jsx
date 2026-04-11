import { useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useCategories } from "../../hooks/useBookmarks";
import { Copy, Check, FolderOpen, GripHorizontal, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";

// Generates a bookmarklet that opens a small popup inside our own app.
// The popup (/save) makes the API call from OUR security context,
// bypassing any Content-Security-Policy the host page might set.
// appUrl  — the frontend origin (e.g. http://localhost:5173 or https://webmark.site)
const buildBookmarklet = (appUrl, token, categoryId) => {
  const code =
    `(function(){` +
    `var t=encodeURIComponent(document.title||location.hostname),` +
    `u=encodeURIComponent(location.href),` +
    `fav=encodeURIComponent('https://www.google.com/s2/favicons?domain='+location.hostname+'&sz=128'),` +
    `w=420,h=300,` +
    `x=Math.round(screen.width/2-210),` +
    `y=Math.round(screen.height/2-150),` +
    `dest='${appUrl}/save?url='+u+'&title='+t+'&logo='+fav+'&catId=${categoryId}&token=${token}';` +
    `window.open(dest,'_webmark','width='+w+',height='+h+',top='+y+',left='+x+',noopener=no');` +
    `})();`;

  return `javascript:${encodeURIComponent(code)}`;
};

const BookmarkletWidget = () => {
  const { url } = useContext(StoreContext);
  // appUrl = frontend origin (used for /save popup); url = API backend
  const appUrl = typeof window !== "undefined" ? window.location.origin : url;
  const token = localStorage.getItem("token") || "";
  const { data: categories, isLoading } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [copied, setCopied] = useState(false);

  const effectiveCategoryId =
    selectedCategoryId || (categories && categories.length > 0 ? categories[0]._id : "");

  const bookmarkletHref =
    token && effectiveCategoryId
      ? buildBookmarklet(appUrl, token, effectiveCategoryId)
      : null;

  const handleCopy = () => {
    if (!bookmarkletHref) return;
    navigator.clipboard.writeText(bookmarkletHref).then(() => {
      setCopied(true);
      toast.success("Bookmarklet copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDragStart = (e) => {
    if (!bookmarkletHref) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/uri-list", bookmarkletHref);
    e.dataTransfer.setData("text/plain", bookmarkletHref);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-blue-200 shadow-sm">
      {/* Gradient header band */}
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
        {/* Category selector */}
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

        {/* Drag target */}
        {bookmarkletHref ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500">
              Drag this button to your bookmarks bar:
            </p>
            <div className="flex items-center gap-3">
              <a
                href={bookmarkletHref}
                draggable
                onDragStart={handleDragStart}
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 cursor-grab active:cursor-grabbing hover:bg-blue-100 transition-colors select-none"
                title="Drag me to your bookmarks toolbar"
              >
                <GripHorizontal className="h-4 w-4 text-blue-400" />
                🔖 Save to Webmark
              </a>

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

        {/* How to use */}
        <div className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-3 space-y-1.5">
          <p className="text-xs font-semibold text-gray-700">How to use</p>
          <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
            <li>Make sure your browser bookmarks bar is visible (Ctrl/Cmd + Shift + B).</li>
            <li>Drag the <span className="font-medium text-blue-600">🔖 Save to Webmark</span> button above into your bookmarks bar.</li>
            <li>Visit any page you want to save and click the bookmark.</li>
            <li>A small popup confirms the save — AI sorts it automatically.</li>
          </ol>
          <p className="text-xs text-amber-600 mt-1.5">
            ⚠ If you change your password or log out, generate a new bookmarklet — the old one will stop working.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookmarkletWidget;
