import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

export const landingButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap text-sm leading-[1.5715] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "shadow text-white bg-blue-500 hover:bg-blue-600",
        secondary:
          "shadow text-gray-800 bg-white hover:text-black border border-gray-200 hover:border-gray-300",
        dark: "shadow text-gray-200 bg-gray-800 hover:bg-black",
        outline:
          "shadow-sm text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-black",
      },
      size: {
        default: "px-4 py-2.5 rounded-lg",
        sm: "px-3 py-[5px] rounded-lg",
      },
      fullWidth: {
        true: "w-full sm:w-auto",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      fullWidth: false,
    },
  },
);

const motionInteraction = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

const LandingButton = forwardRef(
  (
    {
      href,
      variant,
      size,
      fullWidth = false,
      arrow = false,
      animated,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const shouldAnimate = animated ?? size !== "sm";
    const classes = cn(
      landingButtonVariants({ variant, size, fullWidth }),
      className,
    );

    const content = arrow ? (
      <span className="inline-flex items-center">
        {children}
        <span className="ml-1 text-blue-300" aria-hidden="true">
          -&gt;
        </span>
      </span>
    ) : (
      children
    );

    if (shouldAnimate) {
      return (
        <motion.a
          ref={ref}
          href={href}
          className={classes}
          {...motionInteraction}
          {...props}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <a ref={ref} href={href} className={classes} {...props}>
        {content}
      </a>
    );
  },
);

LandingButton.displayName = "LandingButton";

export default LandingButton;
