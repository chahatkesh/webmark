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
      <div className="w-[95vw] h-auto m-auto bg-white rounded-md px-6 py-8 mt-11">
        <BookmarkList />
      </div>
    </>
  );
};

export default Dashboard;
