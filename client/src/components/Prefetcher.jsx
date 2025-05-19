import { useEffect } from "react";

/**
 * Prefetcher component that preloads common routes and resources
 * This improves performance by fetching resources during idle time
 */
const Prefetcher = () => {
  useEffect(() => {
    // Only run in production and only after main content is loaded
    if (process.env.NODE_ENV !== "production") return;

    // Use requestIdleCallback to run during browser idle time
    const idleCallback =
      window.requestIdleCallback || ((cb) => setTimeout(cb, 1000));

    idleCallback(() => {
      const prefetchLinks = [
        "/docs",
        "/about",
        "/features",
        "/privacy-policy",
        "/terms",
      ];

      // Create link elements for prefetching
      prefetchLinks.forEach((href) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = href;
        link.as = "document";
        document.head.appendChild(link);
      });

      // Prefetch key assets
      const prefetchAssets = ["/hero_image.png", "/src/assets/logo_color.png"];

      prefetchAssets.forEach((href) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = href;
        link.as = href.endsWith(".png") ? "image" : "fetch";
        document.head.appendChild(link);
      });
    });
  }, []);

  // This component doesn't render anything
  return null;
};

export default Prefetcher;
