import { useContext, useEffect } from "react";
import { StoreContext } from "../context/StoreContext";
import { revalidateCategories } from "./useBookmarks";

const SYNC_CHANNEL = "webmark-bookmarks";
const SYNC_STORAGE_KEY = "webmark:bookmarks-changed";

export const notifyBookmarksChanged = (apiUrl) => {
  revalidateCategories(apiUrl);

  try {
    localStorage.setItem(SYNC_STORAGE_KEY, String(Date.now()));
  } catch (_) {
    /* private browsing */
  }

  try {
    const channel = new BroadcastChannel(SYNC_CHANNEL);
    channel.postMessage({ type: "bookmarks-changed" });
    channel.close();
  } catch (_) {
    /* unsupported */
  }
};

/**
 * Keeps the dashboard in sync when bookmarks are added outside the SPA
 * (e.g. via the bookmarklet popup on the API domain).
 */
export const useBookmarkSync = () => {
  const { url } = useContext(StoreContext);

  useEffect(() => {
    const refresh = () => revalidateCategories(url);

    let channel;
    try {
      channel = new BroadcastChannel(SYNC_CHANNEL);
      channel.onmessage = refresh;
    } catch (_) {
      /* unsupported */
    }

    const onStorage = (event) => {
      if (event.key === SYNC_STORAGE_KEY) refresh();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      channel?.close();
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [url]);
};
