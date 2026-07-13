import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import BookmarkList from "../components/DashboardComponents/BookmarkList";
import SEO from "../components/SEO";

const BOOKMARKLET_NOTE_STORAGE_KEY =
  "webmark:dashboard:bookmarklet-note-dismissed";

const Dashboard = () => {
  const [showBookmarkletNote, setShowBookmarkletNote] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(BOOKMARKLET_NOTE_STORAGE_KEY) !== "1";
  });

  const dismissBookmarkletNote = () => {
    setShowBookmarkletNote(false);
    localStorage.setItem(BOOKMARKLET_NOTE_STORAGE_KEY, "1");
  };

  return (
    <>
      <SEO
        title="Your Bookmarks Dashboard - Webmark"
        description="Manage your bookmarks efficiently with Webmark's intuitive dashboard. Organize, categorize, and access your web bookmarks all in one place."
        canonicalUrl="https://webmark.chahatkesh.me/user/dashboard"
        keywords="bookmark dashboard, bookmark manager, organize bookmarks, bookmark categories"
        path="/user/dashboard"
        indexPage={false}
      />
      <div className="mx-auto w-full max-w-[1600px] px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
        {showBookmarkletNote && (
          <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            <div className="flex items-start justify-between gap-3">
              <p className="pr-2 leading-6">
                Save pages in one click from anywhere. Add the bookmarklet to
                your browser bar from{" "}
                <Link
                  to="/user/bookmarklet"
                  className="font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-800"
                >
                  Bookmarklet setup
                </Link>
                .
              </p>
              <button
                type="button"
                onClick={dismissBookmarkletNote}
                className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                aria-label="Close bookmarklet tip"
                title="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        <BookmarkList />
      </div>
    </>
  );
};

export default Dashboard;
