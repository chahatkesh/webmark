import { useState, useEffect, useCallback } from "react";
import ResponsiveModal from "../ui/ResponsiveModal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useCreateBookmark } from "../../hooks/useBookmarks";
import { useBookmarkLinkMetadata } from "../../hooks/useBookmarkLinkMetadata";
import {
  parseBookmarkLink,
  getPrimaryFaviconUrl,
} from "../../utils/bookmarkMetadata";
import BookmarkLogoField from "./BookmarkLogoField";

const createInitialFormState = (categoryId) => ({
  name: "",
  link: "",
  logo: "",
  notes: "",
  categoryId,
});

const AddBookmarkDialog = ({ open, onClose, categoryId }) => {
  const createBookmark = useCreateBookmark();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(() =>
    createInitialFormState(categoryId),
  );

  const {
    faviconOptions,
    isResolvingFavicon,
    parsedDomain,
    resetAutoTracking,
    markNameManual,
    markLogoManual,
  } = useBookmarkLinkMetadata(formData.link, setFormData, { enabled: open });

  useEffect(() => {
    if (open) {
      setFormData(createInitialFormState(categoryId));
      resetAutoTracking();
      setIsSubmitting(false);
    }
  }, [open, categoryId, resetAutoTracking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const parsed = parseBookmarkLink(formData.link);
      await createBookmark.mutateAsync({
        ...formData,
        link: parsed?.normalizedUrl ?? formData.link.trim(),
        logo:
          formData.logo || (parsed ? getPrimaryFaviconUrl(parsed.domain) : ""),
      });
      setFormData(createInitialFormState(categoryId));
      resetAutoTracking();
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
      title="Add New Bookmark"
      size="md"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-bookmark-form"
            className="w-full sm:w-auto"
            disabled={
              isSubmitting || !formData.link.trim() || !formData.name.trim()
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Bookmark...
              </>
            ) : (
              "Add Bookmark"
            )}
          </Button>
        </>
      }
    >
      <form
        id="add-bookmark-form"
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
            autoFocus
          />
          <p className="text-xs text-gray-500">
            Name and icon update automatically as you type
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600">
            Name
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Bookmark name"
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

export default AddBookmarkDialog;
