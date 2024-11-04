import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="rounded-xl p-6 bg-white w-full max-w-[95vw] sm:max-w-md"
        onKeyDown={handleKeyDown}>
        <DialogHeader className="space-y-4">
          {/* Title with warning icon */}
          <DialogTitle className="flex gap-3 items-center text-red-600">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="text-xl">{title}</span>
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600">{message}</p>

        <div className="flex gap-3 justify-end mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            ref={cancelRef}
            className="h-11 px-5 font-medium">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className={cn(
              "h-11 px-5 font-medium",
              "bg-red-500 hover:bg-red-600 text-white",
              "transition-colors",
              "relative",
              isDeleting && "pl-9"
            )}>
            {isDeleting && (
              <Loader2 className="h-4 w-4 absolute left-3 animate-spin" />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
