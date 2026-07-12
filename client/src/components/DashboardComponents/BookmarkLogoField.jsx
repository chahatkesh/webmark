import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, ChevronDown, ChevronUp, X } from "lucide-react";
import { applyFaviconFallback } from "../../utils/faviconFallback";
import { cn } from "@/lib/utils";

const BookmarkLogoField = ({
  logo,
  faviconOptions,
  isResolvingFavicon,
  parsedDomain,
  disabled,
  onLogoChange,
  onLogoSelect,
}) => {
  const [showAlternatives, setShowAlternatives] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-600">Icon</label>
        {parsedDomain && faviconOptions.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-blue-600 hover:text-blue-700"
            disabled={disabled}
            onClick={() => setShowAlternatives((open) => !open)}
          >
            {showAlternatives ? (
              <>
                Hide options
                <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Change icon
                <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2.5">
        <div
          className={cn(
            "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white",
            isResolvingFavicon && "opacity-70",
          )}
        >
          {logo ? (
            <img
              src={logo}
              alt=""
              className="h-7 w-7 object-contain"
              onError={applyFaviconFallback}
            />
          ) : (
            <span className="text-xs text-gray-400">?</span>
          )}
          {isResolvingFavicon && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <Input
            type="text"
            value={logo}
            onChange={(e) => onLogoChange(e.target.value)}
            placeholder={
              parsedDomain
                ? "Icon updates automatically from the link"
                : "Paste a link to fetch the icon"
            }
            disabled={disabled}
            className="h-9 border-gray-200 bg-white text-sm"
          />
          {parsedDomain && (
            <p className="mt-1 truncate text-xs text-gray-500">
              Detected from {parsedDomain}
            </p>
          )}
        </div>

        {logo && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            onClick={() => onLogoChange("")}
            className="shrink-0 text-gray-400 hover:text-gray-600"
            aria-label="Clear icon"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showAlternatives && faviconOptions.length > 0 && (
        <div className="grid grid-cols-4 gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:grid-cols-4">
          {faviconOptions.map((option) => {
            const selected = logo === option.url;
            return (
              <button
                key={option.url}
                type="button"
                disabled={disabled}
                onClick={() => {
                  onLogoSelect(option.url);
                  setShowAlternatives(false);
                }}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-colors",
                  selected
                    ? "border-blue-300 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/40",
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-100 bg-white">
                  <img
                    src={option.url}
                    alt=""
                    className="h-7 w-7 object-contain"
                    onError={applyFaviconFallback}
                  />
                </div>
                <span className="text-[10px] font-medium text-gray-500">
                  {option.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookmarkLogoField;
