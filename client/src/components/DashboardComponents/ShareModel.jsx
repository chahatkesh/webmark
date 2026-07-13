import { useState } from "react";
import { Bookmark, Check, Copy, Link2, Share2 } from "lucide-react";
import { toast } from "react-toastify";
import ResponsiveModal from "../ui/ResponsiveModal";
import { Button } from "../ui/button";

const SHARE_URL = "https://webmark.chahatkesh.me";
const SHARE_TITLE = "Webmark";
const SHARE_MESSAGE =
  "I've been using Webmark to keep my bookmarks clean and fast to open. Give it a try:";

const socialPlatforms = [
  {
    name: "WhatsApp",
    color: "bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/15",
    url: `https://wa.me/?text=${encodeURIComponent(`${SHARE_MESSAGE}\n${SHARE_URL}`)}`,
    icon: (
      <svg
        width="18"
        height="18"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M11.988 0C5.36 0 0 5.36 0 11.987c0 2.623.846 5.051 2.285 7.023L.789 23.75l4.87-1.562c1.891 1.244 4.139 1.97 6.562 1.97C18.616 23.988 24 18.628 24 12.001 24 5.374 18.616.012 11.988 0zm0 21.89c-2.365 0-4.564-.739-6.366-1.992l-.455-.272-4.72 1.536 1.56-4.55-.297-.476A9.878 9.878 0 0 1 0 12c0-5.455 4.453-9.89 9.992-9.89 5.539 0 9.996 4.435 9.996 9.89 0 5.455-4.457 9.89-10 9.89z" />
      </svg>
    ),
  },
  {
    name: "X",
    color: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${SHARE_MESSAGE}\n${SHARE_URL}`)}`,
    icon: (
      <svg
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.917L1.25 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    color: "bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/15",
    url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`,
    icon: (
      <svg
        width="18"
        height="18"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    color: "bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/15",
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`,
    icon: (
      <svg
        width="18"
        height="18"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

const ShareModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Couldn't copy link");
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(`${SHARE_MESSAGE}\n${SHARE_URL}`);
      toast.success("Message copied");
    } catch {
      toast.error("Couldn't copy message");
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: SHARE_TITLE,
        text: SHARE_MESSAGE,
        url: SHARE_URL,
      });
    } catch (err) {
      if (err?.name !== "AbortError") {
        toast.error("Couldn't open share sheet");
      }
    }
  };

  const handleShare = (url) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
  };

  return (
    <ResponsiveModal
      open={isOpen}
      onClose={onClose}
      size="md"
      footer={
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onClose}
        >
          Close
        </Button>
      }
      title={
        <span className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Share2 className="h-4 w-4" />
          </span>
          Share Webmark
        </span>
      }
      description="Invite a friend to organize their bookmarks the simple way."
    >
      <div className="space-y-5">
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-br from-slate-50 to-blue-50/40">
          <div className="flex items-start gap-3 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white shadow-sm">
              <Bookmark className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">Webmark</p>
              <p className="mt-0.5 text-sm leading-relaxed text-gray-600">
                A clean home for your bookmarks — organize once, open fast.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-100/80 bg-white/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <Link2 className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <p className="min-w-0 flex-1 truncate text-sm text-gray-600">
                {SHARE_URL.replace(/^https?:\/\//, "")}
              </p>
              <Button
                type="button"
                size="sm"
                onClick={handleCopyLink}
                className="h-8 shrink-0 gap-1.5 bg-blue-500 px-3 text-white hover:bg-blue-600"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2.5 text-xs font-medium uppercase tracking-wide text-gray-400">
            Share via
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {socialPlatforms.map((platform) => (
              <button
                key={platform.name}
                type="button"
                onClick={() => handleShare(platform.url)}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${platform.color}`}
                aria-label={`Share to ${platform.name}`}
              >
                {platform.icon}
                <span>{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-10 flex-1 border-gray-200"
            onClick={handleCopyMessage}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy invite message
          </Button>
          {canNativeShare && (
            <Button
              type="button"
              className="h-10 flex-1 bg-gray-900 text-white hover:bg-gray-800"
              onClick={handleNativeShare}
            >
              <Share2 className="mr-2 h-4 w-4" />
              More options
            </Button>
          )}
        </div>
      </div>
    </ResponsiveModal>
  );
};

export default ShareModal;
