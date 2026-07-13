import { useState, useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import { useCategories } from "../hooks/useBookmarks";
import {
  Copy,
  Check,
  GripHorizontal,
  Zap,
  MousePointerClick,
  ShieldCheck,
  RefreshCw,
  Download,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  applyBookmarkletDragData,
  buildBookmarklet,
  BOOKMARKLET_TITLE,
  downloadBookmarkletFile,
} from "../utils/bookmarklet";

const steps = [
  {
    icon: GripHorizontal,
    title: "Drag to bookmarks bar",
    description: `Drag the "${BOOKMARKLET_TITLE}" button into your browser's bookmarks bar.`,
  },
  {
    icon: MousePointerClick,
    title: "Click on any page",
    description:
      "Visit any page and click the bookmarklet. A small popup confirms the save.",
  },
  {
    icon: Sparkles,
    title: "AI picks the category",
    description:
      "Webmark's AI places the bookmark in the best matching category — or Uncategorized if none fit.",
  },
  {
    icon: Zap,
    title: "Done in one click",
    description:
      "No extension needed — save from any site straight to the right folder.",
  },
];

const Bookmarklet = () => {
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
    <div className="mx-auto w-full max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="px-8 py-6 bg-gradient-to-b from-white to-blue-50/40">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Add to your bookmarks bar
          </p>
          {isLoading ? (
            <div className="h-12 w-48 rounded-xl bg-gray-100 animate-pulse" />
          ) : (
            <div className="space-y-4">
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
                  {BOOKMARKLET_TITLE}
                </a>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="gap-1.5 text-xs h-9"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-1.5 text-xs h-9"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-500" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy code
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                Drag the button above into your bookmarks bar, or download the
                bookmark file and import it via{" "}
                <span className="font-medium text-gray-700">
                  Chrome → Bookmarks → Bookmark Manager → Import
                </span>
                . You can also right-click the button and choose{" "}
                <span className="font-medium text-gray-700">Bookmark link</span>
                .
              </p>
            </div>
          )}
          {!isLoading && (!categories || categories.length === 0) && (
            <p className="mt-3 text-xs text-gray-500">
              No categories yet? That&apos;s fine — saves go into an
              auto-created Uncategorized folder.
            </p>
          )}
          <p className="mt-3 text-xs text-gray-400">
            Chrome may still show a generic globe icon for JavaScript
            bookmarklets — look for{" "}
            <span className="font-medium text-gray-600">
              {BOOKMARKLET_TITLE}
            </span>{" "}
            by name. Use the download option above to install with the Webmark
            icon.
          </p>
        </div>
      </div>

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
                  <p className="text-sm font-semibold text-gray-800">
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 px-5 py-4 shadow-sm">
          <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">Privacy-safe.</span> The
            bookmarklet opens a small popup on Webmark's own domain to save your
            page — it cannot read the contents of the page you're on.
          </p>
        </div>
        <div className="flex items-start gap-3 bg-amber-50 rounded-xl border border-amber-100 px-5 py-4">
          <RefreshCw className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            <span className="font-medium">Heads up.</span> If you log out or
            change your password, regenerate your bookmarklet from this page —
            the old one will stop working.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Bookmarklet;
