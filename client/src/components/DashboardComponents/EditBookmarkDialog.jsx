import React, { useState, useEffect, useCallback } from "react";
import ResponsiveModal from "../ui/ResponsiveModal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useUpdateBookmark } from "../../hooks/useBookmarks";
import { useBookmarkLinkMetadata } from "../../hooks/useBookmarkLinkMetadata";
import {
  parseBookmarkLink,
  getPrimaryFaviconUrl,
} from "../../utils/bookmarkMetadata";
import BookmarkLogoField from "./BookmarkLogoField";

const EditBookmarkDialog = ({ open, onClose, bookmark }) => {
  const updateBookmark = useUpdateBookmark();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    logo: "",
    notes: "",
  });

  const {
    faviconOptions,
    isResolvingFavicon,
    parsedDomain,
    resetAutoTracking,
    markNameManual,
    markLogoManual,
  } = useBookmarkLinkMetadata(formData.link, setFormData, {
    enabled: open && !!bookmark,
  });

  useEffect(() => {
    if (bookmark) {
      const next = {
        name: bookmark.name,
        link: bookmark.link,
        logo: bookmark.logo,
        notes: bookmark.notes || "",
      };
      setFormData(next);
      const parsed = parseBookmarkLink(bookmark.link);
      resetAutoTracking({
        name: next.name,
        logo: next.logo,
        domain: parsed?.domain ?? null,
      });
    }
  }, [bookmark, resetAutoTracking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const parsed = parseBookmarkLink(formData.link);
      await updateBookmark.mutateAsync({
        bookmarkId: bookmark._id,
        ...formData,
        link: parsed?.normalizedUrl ?? formData.link.trim(),
        logo:
          formData.logo || (parsed ? getPrimaryFaviconUrl(parsed.domain) : ""),
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = useCallback(
    (value) => {
      markNameManual(value);
      setFormData((prev) => ({ ...prev, name: value }));
    },
    [markNameManual],
  );

  const handleLogoChange = useCallback(
    (value) => {
      markLogoManual(value);
      setFormData((prev) => ({ ...prev, logo: value }));
    },
    [markLogoManual],
  );

  const handleLogoSelect = useCallback(
    (value) => {
      markLogoManual(value);
      setFormData((prev) => ({ ...prev, logo: value }));
    },
    [markLogoManual],
  );

  return (
    <ResponsiveModal
      open={open}
      onClose={onClose}
      title="Edit Bookmark"
      size="md"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-bookmark-form"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Bookmark"
            )}
          </Button>
        </>
      }
    >
      <form
        id="edit-bookmark-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600">
            Link
          </label>
          <Input
            type="text"
            inputMode="url"
            autoComplete="url"
            value={formData.link}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, link: e.target.value }))
            }
            placeholder="github.com or https://example.com"
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
            onChange={(e) => handleNameChange(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <BookmarkLogoField
          logo={formData.logo}
          faviconOptions={faviconOptions}
          isResolvingFavicon={isResolvingFavicon}
          parsedDomain={parsedDomain}
          disabled={isSubmitting}
          onLogoChange={handleLogoChange}
          onLogoSelect={handleLogoSelect}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Add notes about this bookmark..."
            rows="3"
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </ResponsiveModal>
  );
};

export default EditBookmarkDialog;
