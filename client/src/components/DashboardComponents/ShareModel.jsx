import React, { useState } from "react";
import {
  X,
  Copy,
  Share2,
  Facebook,
  Instagram,
  MessageCircle,
  Twitter,
  LinkedinIcon,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ShareModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeMessage, setActiveMessage] = useState(0);
  const shareUrl = "https://www.webmark.site";

  const shareMessages = [
    {
      text: "🚀 Just discovered Webmark - it's revolutionizing how I organize my browser tabs! Try it out:",
      emoji: "🚀",
    },
    {
      text: "✨ Tired of losing your favorite websites? Webmark is the game-changer you need! Check it out:",
      emoji: "✨",
    },
    {
      text: "🎯 Finally found the perfect bookmark manager! Webmark makes digital organization a breeze. Join me here:",
      emoji: "🎯",
    },
  ];

  const socialLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      hoverText: "Share via WhatsApp",
      url: `https://wa.me/?text=${encodeURIComponent(
        `${shareMessages[activeMessage].text}\n${shareUrl}`
      )}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      hoverText: "Share on Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      name: "Instagram",
      icon: Instagram,
      color:
        "bg-gradient-to-r from-purple-500 via-pink-600 to-orange-500 hover:opacity-90",
      hoverText: "Share on Instagram",
      onClick: () => {
        navigator.clipboard.writeText(
          `${shareMessages[activeMessage].text}\n${shareUrl}`
        );
        alert("Message copied! Ready to share on Instagram.");
      },
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-500 hover:bg-sky-600",
      hoverText: "Share on Twitter",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `${shareMessages[activeMessage].text}\n${shareUrl}`
      )}`,
    },
    {
      name: "LinkedIn",
      icon: LinkedinIcon,
      color: "bg-blue-700 hover:bg-blue-800",
      hoverText: "Share on LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
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

  const handleShare = (url, customAction) => {
    if (customAction) {
      customAction();
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-xl mx-auto w-[calc(100%-2rem)] sm:w-full [&>button]:text-white [&>button]:hover:text-white/80 [&>button]:transition-colors">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-5 sm:p-6 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white">
              <Share2 className="h-5 w-5 sm:h-6 sm:w-6" />
              Invite Friends to Webmark
            </DialogTitle>
            <DialogDescription className="hidden sm:block text-blue-100 mt-2">
              Share the magic of organized bookmarking with your network
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {/* Message Selector */}
          <div className="mb-5 sm:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose your sharing message:
            </label>
            <div className="space-y-2">
              {shareMessages.map((message, index) => (
                <div
                  key={index}
                  onClick={() => setActiveMessage(index)}
                  className={cn(
                    "p-2.5 sm:p-3 rounded-lg border-2 cursor-pointer transition-all",
                    activeMessage === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-200"
                  )}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-gray-600 flex-1">
                      {message.text}
                    </p>
                    {activeMessage === index && (
                      <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Share Grid */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-5 sm:mb-6">
            {socialLinks.map((platform) => (
              <button
                key={platform.name}
                onClick={() => handleShare(platform.url, platform.onClick)}
                className={cn(
                  "group relative flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg sm:rounded-xl text-white transition-all",
                  "transform hover:scale-105 hover:shadow-lg",
                  platform.color
                )}>
                <platform.icon className="h-6 w-6" />
                <span className="hidden sm:block text-xs font-medium mt-2">
                  {platform.name}
                </span>

                {/* Desktop Hover Tooltip */}
                <span
                  className="hidden sm:block absolute -top-10 left-1/2 transform -translate-x-1/2 
                             px-3 py-1 bg-gray-900 text-white text-xs rounded-md 
                             opacity-0 group-hover:opacity-100 transition-opacity
                             whitespace-nowrap pointer-events-none">
                  {platform.hoverText}
                </span>
              </button>
            ))}
          </div>

          {/* Copy Link Section */}
          <div className="relative">
            <div className="flex items-center p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1 min-w-0 mr-2 sm:mr-3">
                <p className="text-sm font-medium text-gray-900 mb-0.5 sm:mb-1">
                  Quick Share Link
                </p>
                <p className="text-xs text-gray-500 truncate">{shareUrl}</p>
              </div>
              <Button
                size="sm"
                variant={copied ? "success" : "default"}
                onClick={handleCopyLink}
                className={cn(
                  "transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap",
                  copied
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                )}>
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span className="text-sm">Copy Link</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Footer Message */}
          <p className="text-center text-xs sm:text-sm text-gray-500 mt-5 sm:mt-6">
            Help your friends discover a better way to manage their bookmarks!
            🌟
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
