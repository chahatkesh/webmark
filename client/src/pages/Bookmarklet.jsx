import { useState, useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import { useCategories } from "../hooks/useBookmarks";
import {
  Copy,
  Check,
  FolderOpen,
  GripHorizontal,
  Zap,
  BookmarkPlus,
  MousePointerClick,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

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

const steps = [
  {
    icon: FolderOpen,
    title: "Pick a category",
    description: "Choose where new saves will land by default. You can always move them later.",
  },
  {
    icon: GripHorizontal,
    title: "Drag to bookmarks bar",
    description: 'Drag the "Save to Webmark" button into your browser\'s bookmarks bar.',
  },
  {
    icon: MousePointerClick,
    title: "Click on any page",
    description: "Visit any page and click the bookmarklet. A small popup confirms the save.",
  },
  {
    icon: Zap,
    title: "AI sorts it automatically",
    description: "Webmark's AI places the bookmark in the most relevant category.",
  },
];

const Bookmarklet = () => {
  const { url } = useContext(StoreContext);
  const appUrl = typeof window !== "undefined" ? window.location.origin : url;
  const token = localStorage.getItem("token") || "";
  const { data: categories, isLoading } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [copied, setCopied] = useState(false);

  const effectiveCategoryId =
    selectedCategoryId ||
    (categories && categories.length > 0 ? categories[0]._id : "");

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
    // Firefox: "URL\nTitle" format — stores name + icon from the page favicon
    e.dataTransfer.setData(
      "text/x-moz-url",
      `${bookmarkletHref}\nSave to Webmark`,
    );
    // RFC-compliant uri-list: comment line then URL (Chrome reads <a> text for the name)
    e.dataTransfer.setData(
      "text/uri-list",
      `# Save to Webmark\n${bookmarkletHref}`,
    );
    // Full HTML with favicon — some bookmark managers read <link rel="icon"> from this
    e.dataTransfer.setData(
      "text/html",
      `<html><head>` +
        `<link rel="shortcut icon" href="${appUrl}/favicon.png">` +
        `<title>Save to Webmark</title>` +
        `</head><body>` +
        `<a href="${bookmarkletHref}">Save to Webmark</a>` +
        `</body></html>`,
    );
    e.dataTransfer.setData("text/plain", bookmarkletHref);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-32">

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookmarklet</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Save any page to Webmark in one click directly from your browser toolbar — no extension needed.
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">

          {/* Step 1: Category selector */}
          <div className="px-8 py-6 border-b border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Step 1 — Choose default category
            </p>
            {isLoading ? (
              <div className="h-10 w-full rounded-lg bg-gray-100 animate-pulse" />
            ) : categories && categories.length > 0 ? (
              <select
                value={selectedCategoryId || (categories[0]?._id ?? "")}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.emoji} {cat.category}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-amber-600 bg-amber-50 rounded-lg px-4 py-3">
                Create at least one category on your dashboard first.
              </p>
            )}
          </div>

          {/* Step 2: Drag button */}
          <div className="px-8 py-6 bg-gradient-to-b from-white to-blue-50/40">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Step 2 — Drag to your bookmarks bar
            </p>
            {bookmarkletHref ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href={bookmarkletHref}
                  draggable
                  onDragStart={handleDragStart}
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-2.5 rounded-xl border-2 border-dashed border-blue-300 bg-white px-5 py-3 text-base font-semibold text-blue-700 cursor-grab active:cursor-grabbing hover:bg-blue-50 hover:border-blue-400 transition-all select-none shadow-sm"
                  title="Drag me to your bookmarks toolbar"
                >
                  <GripHorizontal className="h-5 w-5 text-blue-400" />
                  Save to Webmark
                </a>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">or</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-1.5 text-xs h-9"
                  >
                    {copied ? (
                      <><Check className="h-3.5 w-3.5 text-green-500" /> Copied</>
                    ) : (
                      <><Copy className="h-3.5 w-3.5" /> Copy code</>
                    )}
                  </Button>
                  <span className="text-xs text-gray-400">to paste manually</span>
                </div>
              </div>
            ) : (
              !isLoading && (
                <p className="text-sm text-gray-400 italic">
                  Select a category above to generate your bookmarklet.
                </p>
              )
            )}
            <p className="mt-3 text-xs text-gray-400">
              Tip: browsers show a generic icon for JavaScript bookmarklets — look for <span className="font-medium text-gray-600">Save to Webmark</span> by name on your bar.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-5 text-center">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-white rounded-xl border border-gray-100 px-5 py-4 shadow-sm"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notices */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 px-5 py-4 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">Privacy-safe.</span> The bookmarklet opens a small popup on Webmark's own domain to save your page — it cannot read the contents of the page you're on.
            </p>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 rounded-xl border border-amber-100 px-5 py-4">
            <RefreshCw className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              <span className="font-medium">Heads up.</span> If you log out or change your password, regenerate your bookmarklet from this page — the old one will stop working.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookmarklet;
