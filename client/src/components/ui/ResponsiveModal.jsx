import React, { useRef, useCallback } from "react";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetBody,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-xl",
};

/**
 * ResponsiveModal — bottom sheet on mobile, centered dialog on desktop.
 *
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {React.ReactNode} title
 * @param {React.ReactNode} [description]
 * @param {React.ReactNode} children — scrollable body content
 * @param {React.ReactNode} [footer] — sticky action area
 * @param {'sm'|'md'|'lg'} [size='md']
 * @param {boolean} [preventClose=false]
 * @param {boolean} [hideClose=false]
 * @param {string} [contentClassName]
 * @param {string} [titleClassName]
 * @param {string} [descriptionClassName]
 * @param {string} [bodyClassName]
 * @param {string} [footerClassName]
 * @param {(e: KeyboardEvent) => void} [onKeyDown]
 * @param {(e: Event) => void} [onInteractOutside]
 */
export function ResponsiveModal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  preventClose = false,
  hideClose = false,
  contentClassName,
  titleClassName,
  descriptionClassName,
  bodyClassName,
  footerClassName,
  onKeyDown,
  onInteractOutside,
}) {
  const isDesktop = useIsDesktop();
  const bodyRef = useRef(null);

  const handleBodyFocus = useCallback(
    (event) => {
      if (isDesktop) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.matches("input, textarea, select, button")
      ) {
        window.setTimeout(() => {
          target.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }, 300);
      }
    },
    [isDesktop],
  );

  const handleOpenChange = (nextOpen) => {
    if (nextOpen) return;
    if (preventClose) return;
    onClose?.();
  };

  const handleInteractOutside = (event) => {
    if (preventClose) {
      event.preventDefault();
      return;
    }
    onInteractOutside?.(event);
  };

  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

  const header = (
    <>
      {title != null && (
        <DialogTitle className={titleClassName}>{title}</DialogTitle>
      )}
      {description != null && (
        <DialogDescription className={descriptionClassName}>
          {description}
        </DialogDescription>
      )}
    </>
  );

  const sheetHeader = (
    <>
      {title != null && (
        <SheetTitle className={titleClassName}>{title}</SheetTitle>
      )}
      {description != null && (
        <SheetDescription className={descriptionClassName}>
          {description}
        </SheetDescription>
      )}
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          hideClose={hideClose || preventClose}
          className={cn(
            "flex max-h-[90vh] w-[95vw] flex-col overflow-hidden p-0",
            sizeClass,
            contentClassName,
          )}
          onKeyDown={onKeyDown}
          onInteractOutside={handleInteractOutside}
          onEscapeKeyDown={(event) => {
            if (preventClose) event.preventDefault();
          }}
        >
          {(title != null || description != null) && (
            <DialogHeader>{header}</DialogHeader>
          )}
          <DialogBody
            ref={bodyRef}
            onFocusCapture={handleBodyFocus}
            className={cn("flex-1 overflow-y-auto", bodyClassName)}
          >
            {children}
          </DialogBody>
          {footer != null && (
            <DialogFooter className={footerClassName}>{footer}</DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet
      open={open}
      onOpenChange={handleOpenChange}
      dismissible={!preventClose}
    >
      <SheetContent
        hideClose={hideClose || preventClose}
        className={cn("p-0", contentClassName)}
        onKeyDown={onKeyDown}
        onInteractOutside={handleInteractOutside}
        onEscapeKeyDown={(event) => {
          if (preventClose) event.preventDefault();
        }}
      >
        {(title != null || description != null) && (
          <SheetHeader>{sheetHeader}</SheetHeader>
        )}
        <SheetBody
          ref={bodyRef}
          onFocusCapture={handleBodyFocus}
          className={bodyClassName}
        >
          {children}
        </SheetBody>
        {footer != null && (
          <SheetFooter className={footerClassName}>{footer}</SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default ResponsiveModal;
