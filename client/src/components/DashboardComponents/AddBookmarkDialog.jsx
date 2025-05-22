import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, X, Globe, AlertCircle, Loader2 } from "lucide-react";
import { useCreateBookmark } from "../../hooks/useBookmarks";

const AddBookmarkDialog = ({ open, onClose, categoryId }) => {
  const createBookmark = useCreateBookmark();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFormState = {
    name: "",
    link: "",
    logo: "",
    notes: "",
    categoryId,
  };
  const [formData, setFormData] = useState(initialFormState);
  const [showLogoSearch, setShowLogoSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData(initialFormState);
      setShowLogoSearch(false);
      setSearchQuery("");
      setSearchResults([]);
      setSearchError("");
      setIsSubmitting(false);
    }
  }, [open, categoryId]);

  const extractDomain = (url) => {
    try {
      const urlObject = new URL(url);
      return urlObject.hostname;
    } catch {
      return url;
    }
  };

  useEffect(() => {
    if (formData.link) {
      try {
        const domain = extractDomain(formData.link);
        if (!formData.name) {
          const domainName = domain.replace(/^www\./, "").split(".")[0];
          setFormData((prev) => ({
            ...prev,
            name: capitalize(domainName),
          }));
        }
        if (!formData.logo) {
          const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
          setFormData((prev) => ({ ...prev, logo: faviconUrl }));
        }
      } catch (error) {
        console.error("Error auto-populating fields:", error);
      }
    }
  }, [formData.link]);

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
      await createBookmark.mutateAsync(formData);
      setFormData(initialFormState);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkChange = (e) => {
    const newLink = e.target.value;
    setFormData((prev) => ({ ...prev, link: newLink }));
    if (newLink) {
      setSearchQuery(newLink);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl p-8 shadow-lg bg-white w-[95vw] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Add New Bookmark
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
              onChange={handleLinkChange}
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
                onClick={() => {
                  setShowLogoSearch(!showLogoSearch);
                  if (!showLogoSearch && formData.link) {
                    setSearchQuery(formData.link);
                    searchLogos(formData.link);
                  }
                }}>
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
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {searchError}
                  </div>
                )}

                {isSearching ? (
                  <div className="text-center py-4 text-gray-500">
                    Searching for logos...
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Bookmark...
              </>
            ) : (
              "Add Bookmark"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookmarkDialog;
