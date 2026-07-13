import { Github, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { landingButtonVariants } from "./landingButtonVariants";

const REPO_URL = "https://github.com/chahatkesh/webmark";

const VARIANT_MAP = {
  hero: { variant: "secondary", size: "default", fullWidth: true },
  navbar: { variant: "outline", size: "sm", fullWidth: false },
  cta: { variant: "dark", size: "default", fullWidth: false },
};

const StarRepo = ({ variant = "hero", className = "" }) => {
  const { variant: buttonVariant, size, fullWidth } = VARIANT_MAP[variant];
  const isNavbar = variant === "navbar";
  const isGithubButton = variant === "navbar" || variant === "cta";
  const isDark = variant === "cta";

  const classes = cn(
    landingButtonVariants({ variant: buttonVariant, size, fullWidth }),
    isDark && "border border-gray-700",
    className,
  );

  const content = (
    <>
      {isGithubButton ? (
        <Github className="h-4 w-4 shrink-0" />
      ) : (
        <Star
          className={cn(
            "h-4 w-4 shrink-0",
            isDark
              ? "text-yellow-400 fill-yellow-400"
              : "text-yellow-500 fill-yellow-500",
          )}
        />
      )}
      <span>{isGithubButton ? "Github" : "Star on GitHub"}</span>
    </>
  );

  if (isNavbar) {
    return (
      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Webmark on GitHub"
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <motion.a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        isGithubButton ? "View Webmark on GitHub" : "Star Webmark on GitHub"
      }
      className={classes}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.a>
  );
};

export default StarRepo;
