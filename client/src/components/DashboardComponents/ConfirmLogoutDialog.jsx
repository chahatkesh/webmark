import React from "react";
import ResponsiveModal from "../ui/ResponsiveModal";
import { Button } from "../ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ConfirmLogoutDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Log out",
  message = "Are you sure you want to log out of your account?",
}) => {
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const cancelRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
      setIsLoggingOut(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoggingOut) {
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
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <LogOut className="h-5 w-5 text-gray-700" />
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
            disabled={isLoggingOut}
            ref={cancelRef}
            className="h-11 w-full px-5 font-medium sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoggingOut}
            className={cn(
              "h-11 w-full px-5 font-medium sm:w-auto",
              "bg-red-500 hover:bg-red-600 text-white",
              "transition-colors relative",
              isLoggingOut && "pl-9",
            )}
          >
            {isLoggingOut && (
              <Loader2 className="h-4 w-4 absolute left-3 animate-spin" />
            )}
            {isLoggingOut ? "Logging out..." : "Log out"}
          </Button>
        </>
      }
    >
      <p className="text-sm text-gray-600">{message}</p>
    </ResponsiveModal>
  );
};

export default ConfirmLogoutDialog;
