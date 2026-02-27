import { useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useCategories } from "../../hooks/useBookmarks";
import { Bookmark, Copy, Check, FolderOpen, GripHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";

// Generates a self-contained bookmarklet href.
// The token and categoryId are embedded at generation time so the bookmarklet
// works on any domain without needing access to Webmark's localStorage.
const buildBookmarklet = (apiUrl, token, categoryId) => {
  // Keep this minified — browsers cap bookmark URL length
  const code = `(function(){` +
    `var t=document.title||location.hostname,` +
    `u=location.href,` +
    `h=location.hostname;` +
    `fetch('${apiUrl}/api/bookmarks/bookmark',{` +
    `method:'POST',` +
    `headers:{'Content-Type':'application/json',token:'${token}'},` +
    `body:JSON.stringify({categoryId:'${categoryId}',name:t,link:u,logo:'https://www.google.com/s2/favicons?domain='+h+'&sz=128'})` +
    `}).then(function(r){return r.json()}).then(function(d){` +
    `if(d.success){` +
    `var e=document.createElement('div');` +
    `e.style='position:fixed;bottom:20px;right:20px;background:#1d4ed8;color:#fff;padding:12px 18px;border-radius:8px;z-index:2147483647;font:600 13px/1 system-ui,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.25)';` +
    `e.textContent='\\u2713 Saved to Webmark';` +
    `document.body.appendChild(e);` +
    `setTimeout(function(){e.remove()},2500)` +
    `}else{alert('Webmark: '+d.message)}` +
    `}).catch(function(){alert('Webmark: Could not save bookmark')})` +
    `})();`;

  return `javascript:${encodeURIComponent(code)}`;
};

const BookmarkletWidget = () => {
  const { url } = useContext(StoreContext);
  const token = localStorage.getItem("token") || "";
  const { data: categories, isLoading } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [copied, setCopied] = useState(false);

  const effectiveCategoryId =
    selectedCategoryId || (categories && categories.length > 0 ? categories[0]._id : "");

  const bookmarkletHref =
    token && effectiveCategoryId
      ? buildBookmarklet(url, token, effectiveCategoryId)
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
    // Setting the href as text/uri-list allows the browser to treat it as a
    // bookmark drag (works in Firefox; Chrome picks it up from the anchor href).
    e.dataTransfer.setData("text/uri-list", bookmarkletHref);
    e.dataTransfer.setData("text/plain", bookmarkletHref);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-blue-50 p-2">
          <Bookmark className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Bookmarklet</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Save any page to Webmark with one click from your browser toolbar.
          </p>
        </div>
      </div>

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
          <p className="text-xs font-medium text-gray-600">
            Drag this to your bookmarks bar:
          </p>
          <div className="flex items-center gap-3">
            {/* The draggable anchor IS the bookmarklet */}
            <a
              href={bookmarkletHref}
              draggable
              onDragStart={handleDragStart}
              onClick={(e) => e.preventDefault()} // prevent navigation when clicked in-page
              className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 cursor-grab active:cursor-grabbing hover:bg-blue-100 transition-colors select-none"
              title="Drag me to your bookmarks toolbar"
            >
              <GripHorizontal className="h-4 w-4 text-blue-400" />
              Save to Webmark
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
          <li>Drag the <span className="font-medium text-blue-600">Save to Webmark</span> button above into your bookmarks bar.</li>
          <li>Visit any page you want to save and click the bookmark.</li>
          <li>A confirmation toast will appear on the page — done!</li>
        </ol>
        <p className="text-xs text-amber-600 mt-1.5">
          ⚠ If you change your password or log out, generate a new bookmarklet — the old one will stop working.
        </p>
      </div>
    </div>
  );
};

export default BookmarkletWidget;
