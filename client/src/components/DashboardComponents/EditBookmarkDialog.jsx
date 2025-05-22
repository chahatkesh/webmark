import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, X, Loader2 } from "lucide-react";
import { useUpdateBookmark } from "../../hooks/useBookmarks";

const EditBookmarkDialog = ({ open, onClose, bookmark }) => {
  const updateBookmark = useUpdateBookmark();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    logo: "",
    notes: "",
  });
  const [showLogoSearch, setShowLogoSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    if (bookmark) {
      setFormData({
        name: bookmark.name,
        link: bookmark.link,
        logo: bookmark.logo,
        notes: bookmark.notes || "",
      });
    }
  }, [bookmark]);

  const extractDomain = (url) => {
    try {
      const urlObject = new URL(url);
      return urlObject.hostname;
    } catch {
      return url;
    }
  };

  const searchLogos = async (query) => {
    setIsSearching(true);
    setSearchError("");
    try {
      const domain = extractDomain(query);
      const results = [
        {
          url: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
          name: "Google Favicon",
        },
        {
          url: `https://icon.horse/icon/${domain}`,
          name: "Icon Horse",
        },
        {
          url: `https://favicon.io/favicon/${domain}`,
          name: "Favicon.io",
        },
      ];
      setSearchResults(results);
    } catch (error) {
      setSearchError(
        "Failed to fetch logos. Please try a different search or enter URL manually."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogoSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchLogos(searchQuery);
    }
  };

  const selectLogo = (logoUrl) => {
    setFormData({ ...formData, logo: logoUrl });
    setShowLogoSearch(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateBookmark.mutateAsync({
        bookmarkId: bookmark._id,
        ...formData,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl p-8 shadow-lg bg-white w-[95vw] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Edit Bookmark
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              Link
            </label>
            <Input
              type="url"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              placeholder="https://example.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-600">
                Logo URL
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700"
                disabled={isSubmitting}
                onClick={() => setShowLogoSearch(!showLogoSearch)}>
                {showLogoSearch ? "Hide Search" : "Search Logos"}
              </Button>
            </div>

            {showLogoSearch ? (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter website URL..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={handleLogoSearch}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {searchError && (
                  <div className="text-red-500 text-sm">{searchError}</div>
                )}

                {isSearching ? (
                  <div className="text-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {searchResults.map((logo, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectLogo(logo.url)}
                        disabled={isSubmitting}
                        className="p-2 border rounded hover:bg-gray-100 flex flex-col items-center gap-2">
                        <div className="w-12 h-12 flex items-center justify-center border rounded bg-white">
                          <img
                            src={logo.url}
                            alt={logo.name}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              e.target.src = "/api/placeholder/32/32";
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {logo.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  type="url"
                  value={formData.logo}
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.value })
                  }
                  required
                  disabled={isSubmitting}
                />
                {formData.logo && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isSubmitting}
                    onClick={() => setFormData({ ...formData, logo: "" })}
                    className="shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {formData.logo && (
              <div className="mt-2 flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center border rounded bg-white">
                  <img
                    src={formData.logo}
                    alt="Selected logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/24/24";
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500">
                  Selected logo preview
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Add notes about this bookmark..."
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Bookmark"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookmarkDialog;
