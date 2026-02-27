import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2, Bookmark } from "lucide-react";

/**
 * BookmarkletSave — a lightweight popup that receives URL params from the
 * bookmarklet (window.open), saves the bookmark via our own API, and
 * auto-closes on success.
 *
 * This bypasses CSP on 3rd-party pages because the fetch runs in OUR
 * app's security context, not the external page's.
 */
export default function BookmarkletSave() {
  const [status, setStatus] = useState("saving"); // saving | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawUrl = params.get("url");
    const rawTitle = params.get("title");
    const rawLogo = params.get("logo");
    const catId = params.get("catId");
    const token = params.get("token");

    if (!rawUrl || !token || !catId) {
      setStatus("error");
      setMessage(
        "Missing parameters. Please re-generate your bookmarklet from the Profile page."
      );
      return;
    }

    const url = decodeURIComponent(rawUrl);
    const title = rawTitle ? decodeURIComponent(rawTitle) : url;
    const logo =
      rawLogo ||
      `https://www.google.com/s2/favicons?domain=${
        (() => { try { return new URL(url).hostname; } catch { return ""; } })()
      }&sz=128`;

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

    fetch(`${apiUrl}/api/bookmarks/bookmark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({
        categoryId: catId,
        name: title,
        link: url,
        logo,
        autoCateg: true, // triggers background AI categorization
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          // Auto-close after 2 s; AI re-categorization happens in background
          setTimeout(() => {
            try {
              window.close();
            } catch (_) {
              /* some browsers block window.close() if not opened by script */
            }
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.message || "Failed to save bookmark.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage(
          "Could not reach the Webmark server. Make sure it is running."
        );
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xs w-full text-center space-y-5">
        {/* Logo + brand */}
        <div className="flex items-center justify-center gap-2 text-blue-600 font-bold text-lg">
          <Bookmark className="h-5 w-5" />
          Webmark
        </div>

        {status === "saving" && (
          <>
            <Loader2 className="h-14 w-14 text-blue-500 animate-spin mx-auto" />
            <div>
              <p className="text-gray-800 font-semibold text-base">
                Saving bookmark…
              </p>
              <p className="text-xs text-gray-400 mt-1">
                AI will place it in the right category
              </p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
            <div>
              <p className="text-gray-800 font-semibold text-base">Saved!</p>
              <p className="text-xs text-gray-400 mt-1">
                AI is sorting it in the background. Closing…
              </p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-14 w-14 text-red-500 mx-auto" />
            <div>
              <p className="text-gray-800 font-semibold text-base">
                Could not save
              </p>
              <p className="text-sm text-gray-500 mt-1">{message}</p>
            </div>
            <button
              onClick={() => window.close()}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
