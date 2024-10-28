import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ConfirmDeleteDialog = ({ open, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset deleting state when dialog closes
  useEffect(() => {
    if (!open) {
      setIsDeleting(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [open, isDeleting, onClose]);

  const DeleteButton = () => (
    <Button
      variant="destructive"
      onClick={handleConfirm}
      disabled={isDeleting}
      className="min-w-[80px] flex items-center gap-2">
      {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
      <span>{isDeleting ? "Deleting..." : "Delete"}</span>
    </Button>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isDeleting && !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md max-w-[94vw] rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription className="text-base">
            Are you sure you want to delete this category and all its bookmarks?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="min-w-[80px]">
            Cancel
          </Button>
          <DeleteButton />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
