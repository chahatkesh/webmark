import { useContext, useEffect } from "react";
import { StoreContext } from "../context/StoreContext";
import { notifyBookmarksChanged } from "../hooks/useBookmarkSync";

/**
 * Loaded in a hidden iframe by the bookmarklet success page so open
 * dashboard tabs can refresh their SWR cache after an external save.
 */
export default function BookmarkletSync() {
  const { url } = useContext(StoreContext);

  useEffect(() => {
    notifyBookmarksChanged(url);
  }, [url]);

  return null;
}
