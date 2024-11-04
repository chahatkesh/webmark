import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Share2,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ShareModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeMessage, setActiveMessage] = useState(0);
  const shareUrl = "https://www.webmark.site";

  const shareMessages = [
    {
      text: "Check out Webmark - a beautifully simple way to organize your bookmarks.",
      icon: "✨",
    },
    {
      text: "I'm using Webmark to keep my online resources organized. It's quite impressive!",
      icon: "📚",
    },
    {
      text: "Discovered Webmark for bookmark management. Clean, simple, and efficient.",
      icon: "💫",
    },
  ];

  const socialLinks = [
    {
      name: "WhatsApp",
      icon: MessageSquare,
      color: "bg-[#25D366] hover:bg-[#1ea952]",
      url: `https://wa.me/?text=${encodeURIComponent(
        `${shareMessages[activeMessage].text}\n${shareUrl}`
      )}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-[#1DA1F2] hover:bg-[#1a8cd8]",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `${shareMessages[activeMessage].text}\n${shareUrl}`
      )}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-[#0A66C2] hover:bg-[#084d93]",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-[#1877F2] hover:bg-[#0c5dc9]",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${shareMessages[activeMessage].text}\n${shareUrl}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-xl mx-auto w-[calc(100%-2rem)] sm:w-full [&>button]:text-white [&>button]:hover:text-white/80 [&>button]:transition-colors">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-5 sm:p-6 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white">
              <Share2 className="h-5 w-5 sm:h-6 sm:w-6" />
              Invite Friends to Webmark
            </DialogTitle>
            <p className="text-center text-gray-100 text-sm">
              Share the magic of organized bookmarking with your network
            </p>
          </DialogHeader>
        </div>

        <div className="mt-6 px-6 pb-8 space-y-6">
          {/* Message Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Choose a message
            </label>
            <div className="space-y-2">
              {shareMessages.map((message, index) => (
                <button
                  key={index}
                  onClick={() => setActiveMessage(index)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border-2 transition-all",
                    "flex items-center gap-3",
                    activeMessage === index
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                  )}>
                  <span className="text-xl">{message.icon}</span>
                  <p className="text-sm text-gray-700 flex-1">{message.text}</p>
                  {activeMessage === index && (
                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Social Share */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Share via
            </label>
            <div className="grid grid-cols-4 gap-3">
              {socialLinks.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handleShare(platform.url)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl",
                    "text-white transition-all hover:shadow-md hover:scale-105",
                    platform.color
                  )}>
                  <platform.icon className="h-5 w-5" />
                  <span className="hidden md:block text-xs font-medium">
                    {platform.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Share Link */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Or copy link
            </label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{shareUrl}</p>
              </div>
              <Button
                size="sm"
                onClick={handleCopyLink}
                className={cn(
                  "transition-colors h-9 px-4",
                  copied
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                )}>
                {copied ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Copied
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    Copy
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
