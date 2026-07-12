import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { landingButtonVariants } from "./landingButtonVariants";

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
