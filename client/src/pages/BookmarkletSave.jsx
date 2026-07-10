import { useEffect } from "react";
import { API_BASE_URL } from "../utils/apiClient";

/**
 * Legacy redirect — old bookmarklets pointed at the frontend /save route.
 * Immediately forwards to the server-side handler so the React app never loads.
 */
export default function BookmarkletSave() {
  useEffect(() => {
    const target = `${API_BASE_URL}/api/bookmarks/save${window.location.search}`;
    window.location.replace(target);
  }, []);

  return null;
}
