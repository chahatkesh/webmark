import { useEffect } from "react";

/**
 * Prefetcher component that preloads common routes and resources
 * This improves performance by fetching resources during idle time
 */
const Prefetcher = () => {
  useEffect(() => {
    // Only run in production and only after main content is loaded
    if (!import.meta.env.PROD) return;
    if (document.querySelector('link[data-webmark-prefetch="true"]')) return;

    // Use requestIdleCallback to run during browser idle time
    const idleCallback =
      window.requestIdleCallback || ((cb) => setTimeout(cb, 1000));

    idleCallback(() => {
      const prefetchAssets = ["/hero_image.png", "/favicon.png"];

      prefetchAssets.forEach((href) => {
        const link = document.createElement("link");
        link.dataset.webmarkPrefetch = "true";
        link.rel = "prefetch";
        link.href = href;
        link.as = "image";
        document.head.appendChild(link);
      });
    });
  }, []);

  // This component doesn't render anything
  return null;
};

export default Prefetcher;
