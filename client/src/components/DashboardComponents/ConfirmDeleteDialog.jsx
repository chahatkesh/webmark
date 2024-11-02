import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ConfirmDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const cancelRef = React.useRef(null);

  // Focus trap and keyboard handling
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

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isDeleting) {
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[440px] w-[94vw] rounded-lg",
          "transform transition-all",
          "shadow-xl",
          "border-red-100",
          isDeleting && "opacity-80"
        )}
        onKeyDown={handleKeyDown}>
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className={cn(
            "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background",
            "transition-opacity hover:opacity-100 focus:outline-none focus:ring-2",
            "focus:ring-red-500 focus:ring-offset-2 disabled:pointer-events-none",
            "data-[state=open]:bg-red-100"
          )}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="space-y-4">
          {/* Title with warning icon */}
          <DialogTitle className="flex gap-3 items-center text-red-600">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="text-xl">{title}</span>
          </DialogTitle>

          {/* Enhanced message */}
          <DialogDescription className="space-y-3 text-base">
            <p>{message}</p>
            {/* <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200">
              <Trash2 className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">{itemName}</span>
            </div> */}
          </DialogDescription>
        </DialogHeader>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            ref={cancelRef}
            className={cn(
              "min-w-[80px]",
              "focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
              "transition-all duration-200"
            )}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className={cn(
              "min-w-[80px]",
              "focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
              "transition-all duration-200",
              "relative",
              isDeleting && "pl-8"
            )}>
            {isDeleting && (
              <Loader2 className="h-4 w-4 absolute left-2.5 animate-spin" />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>

        {/* Warning badge */}
        {!isDeleting && (
          <div className="absolute -top-2 -right-2">
            <span className="flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
