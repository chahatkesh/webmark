import { useState, useEffect } from "react";
import ResponsiveModal from "../ui/ResponsiveModal";
import { Button } from "../ui/button";
import { Loader2, Pencil } from "lucide-react";
import { applyFaviconFallback } from "../../utils/faviconFallback";
import { useUpdateBookmark } from "../../hooks/useBookmarks";

const NotesDialog = ({ open, onClose, bookmark }) => {
  const updateBookmark = useUpdateBookmark();
  const hasNotes = !!bookmark?.notes?.trim();
  const [isEditing, setIsEditing] = useState(!hasNotes);
  const [draft, setDraft] = useState(bookmark?.notes ?? "");

  // Sync state when a different bookmark opens
  useEffect(() => {
    if (open && bookmark) {
      const noteExists = !!bookmark.notes?.trim();
      setIsEditing(!noteExists);
      setDraft(bookmark.notes ?? "");
    }
  }, [open, bookmark?._id]);

  if (!bookmark) return null;

  const handleSave = async () => {
    try {
      await updateBookmark.mutateAsync({
        bookmarkId: bookmark._id,
        notes: draft,
      });
      onClose();
    } catch {
      // toast handled by hook
    }
  };

  const handleCancel = () => {
    if (hasNotes) {
      setDraft(bookmark.notes ?? "");
      setIsEditing(false);
    } else {
      onClose();
    }
  };

  const title = (
    <span className="flex items-center gap-2">
      <img
        className="h-5 w-5 rounded shrink-0"
        src={bookmark.logo || undefined}
        alt=""
        loading="lazy"
        decoding="async"
        onError={applyFaviconFallback}
      />
      <span className="truncate">{bookmark.name}</span>
    </span>
  );

  const footer = isEditing ? (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCancel}
        disabled={updateBookmark.isPending}
        className="w-full sm:w-auto"
      >
        Cancel
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={handleSave}
        disabled={updateBookmark.isPending}
        className="w-full sm:w-auto"
      >
        {updateBookmark.isPending ? (
          <>
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            Saving…
          </>
        ) : (
          "Save"
        )}
      </Button>
    </>
  ) : (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClose}
        className="w-full sm:w-auto"
      >
        Close
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={() => setIsEditing(true)}
        className="flex w-full items-center gap-2 sm:w-auto"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Button>
    </>
  );

  return (
    <ResponsiveModal
      open={open}
      onClose={onClose}
      size="sm"
      title={title}
      footer={footer}
    >
      {isEditing ? (
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add notes about this bookmark…"
          rows={5}
          className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none resize-none"
          disabled={updateBookmark.isPending}
        />
      ) : (
        <div className="rounded-lg bg-gray-50 p-4 min-h-[80px] max-h-[300px] overflow-y-auto">
          <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
            {bookmark.notes || (
              <span className="text-gray-400 italic">No notes yet.</span>
            )}
          </p>
        </div>
      )}
    </ResponsiveModal>
  );
};

export default NotesDialog;
