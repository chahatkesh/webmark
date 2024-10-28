import React from "react";
import BookmarkList from "../components/DashboardComponents/BookmarkList";

const Dashboard = () => {
  return (
    <div className="w-[95vw] h-[95vh] m-auto bg-white rounded-md px-6 py-8 overflow-scroll scrollbar-modern">
      <BookmarkList />
    </div>
  );
};

export default Dashboard;
