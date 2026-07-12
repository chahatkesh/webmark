import ResponsiveModal from "../ui/ResponsiveModal";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { applyFaviconFallback } from "../../utils/faviconFallback";

const NotesDialog = ({ open, onClose, bookmark, onEdit }) => {
  if (!bookmark) return null;

  return (
    <ResponsiveModal
      open={open}
      onClose={onClose}
      size="sm"
      title={
        <span className="flex items-center gap-2">
          <img
            className="h-6 w-6 rounded"
            src={bookmark.logo || undefined}
            alt=""
            loading="lazy"
            decoding="async"
            onError={applyFaviconFallback}
          />
          Notes for {bookmark.name}
        </span>
      }
      footer={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full text-gray-600 sm:w-auto"
          >
            Close
          </Button>
          <Button
            onClick={onEdit}
            size="sm"
            className="flex w-full items-center gap-2 bg-blue-600 hover:bg-blue-700 sm:w-auto"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Notes
          </Button>
        </>
      }
    >
      <div className="rounded-lg bg-gray-50 p-4 min-h-[100px] max-h-[300px] overflow-y-auto">
        <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
          {bookmark.notes || (
            <span className="text-gray-400 italic">No notes available</span>
          )}
        </p>
      </div>
    </ResponsiveModal>
  );
};

export default NotesDialog;
