import React from "react";
import ResponsiveModal from "../ui/ResponsiveModal";
import { Button } from "../ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ConfirmDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Category",
  message = "This will permanently delete this category and all its bookmarks.",
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const cancelRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
    }
  }, [open]);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isDeleting) {
      handleConfirm();
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onClose={onClose}
      size="sm"
      onKeyDown={handleKeyDown}
      title={
        <span className="flex items-center gap-3 text-red-600">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-5 w-5" />
          </span>
          {title}
        </span>
      }
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            ref={cancelRef}
            className="w-full px-4 sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className={cn(
              "w-full px-4 sm:w-auto",
              "bg-red-500 hover:bg-red-600 text-white",
              "transition-colors relative",
              isDeleting && "pl-9",
            )}
          >
            {isDeleting && (
              <Loader2 className="h-4 w-4 absolute left-3 animate-spin" />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </>
      }
    >
      <p className="text-sm text-gray-600">{message}</p>
    </ResponsiveModal>
  );
};

export default ConfirmDeleteDialog;
