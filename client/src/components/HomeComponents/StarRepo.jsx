import { Github, Star } from "lucide-react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { cn } from "../../lib/utils";
import { landingButtonVariants } from "./LandingButton";

const REPO_URL = "https://github.com/chahatkesh/webmark";
const GITHUB_API = "https://api.github.com/repos/chahatkesh/webmark";

const fetcher = (url) => fetch(url).then((res) => res.json());

const VARIANT_MAP = {
  hero: { variant: "secondary", size: "default", fullWidth: true },
  navbar: { variant: "outline", size: "sm", fullWidth: false },
  cta: { variant: "dark", size: "default", fullWidth: false },
};

const StarRepo = ({ variant = "hero", className = "" }) => {
  const { data } = useSWR(GITHUB_API, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600_000,
  });

  const starCount = data?.stargazers_count;
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
      {!isGithubButton && starCount != null && (
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums",
            isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600",
          )}
        >
          {starCount.toLocaleString()}
        </span>
      )}
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
