import { Toaster } from "sonner";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      expand
      richColors
      duration={4000}
      closeButton
      style={{
        "--toast-border-radius": "0.75rem",
      }}
    />
  );
};
