/**
 * URL Canonicalization Utility
 * 
 * This utility helps prevent duplicate content issues by enforcing consistent URL patterns
 * for improved SEO. It can:
 * 1. Create canonical URLs
 * 2. Normalize URL parameters
 * 3. Enforce trailing slash policy
 */

/**
 * Generate a canonical URL for the current page
 * 
 * @param {Object} options - Options for URL generation
 * @param {string} options.path - The current path (without domain)
 * @param {boolean} options.useTrailingSlash - Whether to enforce trailing slashes (default: false)
 * @param {Object} options.queryParams - Query parameters to include in canonical URL
 * @param {Array<string>} options.ignoreParams - Query parameters to exclude from canonical URL
 * @returns {string} The canonical URL
 */
export function getCanonicalUrl({
  path = window.location.pathname,
  useTrailingSlash = false,
  queryParams = {},
  ignoreParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid']
}) {
  // Base domain
  const domain = 'https://webmark.chahatkesh.me';

  // Normalize path
  let normalizedPath = path;

  // Enforce trailing slash policy
  if (useTrailingSlash && !normalizedPath.endsWith('/') && !normalizedPath.includes('.')) {
    normalizedPath = `${normalizedPath}/`;
  } else if (!useTrailingSlash && normalizedPath.endsWith('/') && normalizedPath !== '/') {
    normalizedPath = normalizedPath.slice(0, -1);
  }

  // Get current query parameters if any
  const currentParams = new URLSearchParams(window.location.search);
  const canonicalParams = new URLSearchParams();

  // Merge current query parameters with provided ones, excluding ignored params
  for (const [key, value] of currentParams.entries()) {
    if (!ignoreParams.includes(key)) {
      canonicalParams.append(key, value);
    }
  }

  // Add provided query parameters
  for (const [key, value] of Object.entries(queryParams)) {
    if (!ignoreParams.includes(key)) {
      canonicalParams.append(key, value);
    }
  }

  // Build the final URL
  let canonicalUrl = `${domain}${normalizedPath}`;

  // Add query parameters if any
  const queryString = canonicalParams.toString();
  if (queryString) {
    canonicalUrl += `?${queryString}`;
  }

  return canonicalUrl;
}

/**
 * Check if the current URL matches its canonical form, and redirect if it doesn't
 * Should be used in top-level components to enforce canonical URLs
 * 
 * @param {Object} options - Options as defined in getCanonicalUrl
 * @returns {boolean} Whether a redirect was performed
 */
export function enforceCanonicalUrl(options = {}) {
  const canonical = getCanonicalUrl(options);
  const current = window.location.href.split('#')[0]; // Ignore hash fragments

  if (current !== canonical) {
    // Preserve hash fragment if present
    const hash = window.location.hash;
    window.location.href = hash ? `${canonical}${hash}` : canonical;
    return true;
  }

  return false;
}

export default {
  getCanonicalUrl,
  enforceCanonicalUrl
};
