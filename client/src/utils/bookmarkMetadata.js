const COMMON_SUBDOMAINS = new Set([
  "www",
  "app",
  "docs",
  "mail",
  "blog",
  "api",
  "m",
  "mobile",
  "dev",
  "staging",
]);

const capitalize = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

/**
 * Parse partial or full URL input while the user is typing.
 * Returns null until the input looks like a valid hostname.
 */
export function parseBookmarkLink(input) {
  const trimmed = (input || "").trim().replace(/\s/g, "");
  if (!trimmed) return null;

  try {
    const href = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(href);
    const hostname = url.hostname.toLowerCase();

    if (!hostname) return null;
    if (hostname !== "localhost" && !hostname.includes(".")) return null;

    const tld = hostname.split(".").pop();
    if (tld && tld.length < 2) return null;

    return {
      domain: hostname,
      normalizedUrl: url.href,
      suggestedName: suggestNameFromHostname(hostname),
    };
  } catch {
    return null;
  }
}

export function suggestNameFromHostname(hostname) {
  const parts = hostname.replace(/^www\./i, "").split(".");

  if (parts.length === 1) {
    return capitalize(parts[0]);
  }

  if (parts.length >= 3 && COMMON_SUBDOMAINS.has(parts[0])) {
    return capitalize(parts[1]);
  }

  if (parts.length >= 2) {
    return capitalize(parts[parts.length - 2]);
  }

  return capitalize(parts[0]);
}

export function getFaviconOptions(domain) {
  const encoded = encodeURIComponent(domain);

  return [
    {
      url: `https://www.google.com/s2/favicons?domain=${encoded}&sz=128`,
      name: "Google",
    },
    {
      url: `https://icons.duckduckgo.com/ip3/${encoded}.ico`,
      name: "DuckDuckGo",
    },
    {
      url: `https://icon.horse/icon/${encoded}`,
      name: "Icon Horse",
    },
    {
      url: `https://${domain}/favicon.ico`,
      name: "Site icon",
    },
  ];
}

export function getPrimaryFaviconUrl(domain) {
  return getFaviconOptions(domain)[0].url;
}

function probeFavicon(url, timeoutMs = 2200) {
  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      img.onload = null;
      img.onerror = null;
      resolve(result);
    };

    const timer = window.setTimeout(() => finish(null), timeoutMs);

    img.onload = () => {
      if (img.naturalWidth >= 8 && img.naturalHeight >= 8) {
        finish(url);
        return;
      }
      finish(null);
    };

    img.onerror = () => finish(null);
    img.src = url;
  });
}

/**
 * Try favicon providers in parallel and return the first that loads.
 */
export async function resolveBestFavicon(domain) {
  const options = getFaviconOptions(domain);
  const results = await Promise.all(
    options.map(async (option) => {
      const loaded = await probeFavicon(option.url);
      return loaded ? option : null;
    }),
  );

  return results.find(Boolean)?.url ?? options[0].url;
}
