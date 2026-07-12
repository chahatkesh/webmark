import { useEffect, useRef, useState, useCallback } from "react";
import {
  parseBookmarkLink,
  getFaviconOptions,
  getPrimaryFaviconUrl,
  resolveBestFavicon,
} from "../utils/bookmarkMetadata";

const FAVICON_PROBE_DEBOUNCE_MS = 350;

/**
 * Keeps bookmark name + favicon in sync with the link field as the user types.
 * Auto-filled values update when the domain changes unless the user customized
 * them away from the last auto suggestion.
 */
export function useBookmarkLinkMetadata(
  link,
  setFormData,
  { enabled = true } = {},
) {
  const [faviconOptions, setFaviconOptions] = useState([]);
  const [isResolvingFavicon, setIsResolvingFavicon] = useState(false);
  const [parsedDomain, setParsedDomain] = useState(null);

  const lastAutoNameRef = useRef("");
  const lastAutoLogoRef = useRef("");
  const lastDomainRef = useRef(null);
  const resolveRequestRef = useRef(0);

  const applySuggestions = useCallback(
    (suggestions) => {
      setFormData((current) => {
        const next = { ...current };
        let changed = false;

        if (suggestions.name !== undefined) {
          const canUpdateName =
            !current.name || current.name === lastAutoNameRef.current;
          if (canUpdateName && current.name !== suggestions.name) {
            next.name = suggestions.name;
            lastAutoNameRef.current = suggestions.name;
            changed = true;
          }
        }

        if (suggestions.logo !== undefined) {
          const canUpdateLogo =
            !current.logo || current.logo === lastAutoLogoRef.current;
          if (canUpdateLogo && current.logo !== suggestions.logo) {
            next.logo = suggestions.logo;
            lastAutoLogoRef.current = suggestions.logo;
            changed = true;
          }
        }

        return changed ? next : current;
      });
    },
    [setFormData],
  );

  const resetAutoTracking = useCallback(
    ({ name = "", logo = "", domain = null } = {}) => {
      lastAutoNameRef.current = name;
      lastAutoLogoRef.current = logo;
      lastDomainRef.current = domain;
      resolveRequestRef.current += 1;
      setFaviconOptions(domain ? getFaviconOptions(domain) : []);
      setParsedDomain(domain);
      setIsResolvingFavicon(false);
    },
    [],
  );

  const markNameManual = useCallback((value) => {
    lastAutoNameRef.current = value;
  }, []);

  const markLogoManual = useCallback((value) => {
    lastAutoLogoRef.current = value;
  }, []);

  // Instant metadata while typing (name + optimistic favicon)
  useEffect(() => {
    if (!enabled) return;

    const parsed = parseBookmarkLink(link);

    if (!parsed) {
      setParsedDomain(null);
      setFaviconOptions([]);
      setIsResolvingFavicon(false);
      return;
    }

    const { domain, suggestedName } = parsed;
    setParsedDomain(domain);
    setFaviconOptions(getFaviconOptions(domain));

    const domainChanged = domain !== lastDomainRef.current;
    lastDomainRef.current = domain;

    if (domainChanged) {
      applySuggestions({
        name: suggestedName,
        logo: getPrimaryFaviconUrl(domain),
      });
    } else {
      applySuggestions({ name: suggestedName });
    }
  }, [link, enabled, applySuggestions]);

  // Debounced favicon probe for best available icon
  useEffect(() => {
    if (!enabled || !parsedDomain) return undefined;

    const timer = window.setTimeout(async () => {
      setIsResolvingFavicon(true);
      const requestId = resolveRequestRef.current + 1;
      resolveRequestRef.current = requestId;

      const resolvedLogo = await resolveBestFavicon(parsedDomain);
      if (resolveRequestRef.current !== requestId) return;

      applySuggestions({ logo: resolvedLogo });
      setIsResolvingFavicon(false);
    }, FAVICON_PROBE_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [parsedDomain, enabled, applySuggestions]);

  return {
    faviconOptions,
    isResolvingFavicon,
    parsedDomain,
    resetAutoTracking,
    markNameManual,
    markLogoManual,
  };
}
