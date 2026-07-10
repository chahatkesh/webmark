import { Star } from "lucide-react";
import { motion } from "framer-motion";
import useSWR from "swr";

const REPO_URL = "https://github.com/chahatkesh/webmark";
const GITHUB_API = "https://api.github.com/repos/chahatkesh/webmark";

const fetcher = (url) => fetch(url).then((res) => res.json());

const StarRepo = ({ variant = "hero", className = "" }) => {
  const { data } = useSWR(GITHUB_API, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600_000,
  });

  const starCount = data?.stargazers_count;

  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-[8px] leading-[1.5715] font-[500] whitespace-nowrap text-[0.875rem] transition-colors";

  const variantClasses = {
    hero: "w-full sm:w-auto shadow pl-4 pr-4 pt-2.5 pb-2.5 text-[#1f2937] bg-white hover:text-black hover:font-[600] border border-gray-200 hover:border-gray-300",
    navbar:
      "shadow-sm pl-3 pr-3 pt-[5px] pb-[5px] text-[#374252] bg-white border border-gray-200 hover:bg-gray-50 hover:text-black",
    cta: "w-full sm:w-auto shadow text-[#e5e7eb] bg-[#1f2937] hover:bg-black pl-4 pr-4 pt-2.5 pb-2.5 border border-gray-700",
  };

  const MotionTag = variant === "navbar" ? "a" : motion.a;
  const motionProps =
    variant === "navbar"
      ? {}
      : {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
        };

  return (
    <MotionTag
      {...motionProps}
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Star Webmark on GitHub"
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <Star
        className={`h-4 w-4 shrink-0 ${
          variant === "cta"
            ? "text-yellow-400 fill-yellow-400"
            : "text-yellow-500 fill-yellow-500"
        }`}
      />
      <span>Star on GitHub</span>
      {starCount != null && (
        <span
          className={`rounded-md px-1.5 py-0.5 text-xs font-[600] tabular-nums ${
            variant === "cta"
              ? "bg-gray-800 text-gray-300"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {starCount.toLocaleString()}
        </span>
      )}
    </MotionTag>
  );
};

export default StarRepo;
