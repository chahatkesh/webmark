import React from "react";
import BookmarkList from "../components/DashboardComponents/BookmarkList";
import SEO from "../components/SEO";

const Dashboard = () => {
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
      <div className="mx-auto mt-14 min-h-[calc(100vh-3.5rem)] w-full max-w-[1600px] px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
        <BookmarkList />
      </div>
    </>
  );
};

export default Dashboard;
