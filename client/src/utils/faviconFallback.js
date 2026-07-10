// Inline SVG — no network request, avoids Vercel edge hits from /api/placeholder rewrites.
export const FALLBACK_FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='4' fill='%23e5e7eb'/%3E%3Cpath d='M7 8h10v2H7zm0 4h7v2H7z' fill='%239ca3af'/%3E%3C/svg%3E";

export const applyFaviconFallback = (event) => {
  const img = event?.target;
  if (!img || img.dataset.fallbackApplied === "true") return;
  img.dataset.fallbackApplied = "true";
  img.src = FALLBACK_FAVICON;
};
