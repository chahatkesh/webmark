import React from "react";
import BookmarkList from "../components/DashboardComponents/BookmarkList";

const Dashboard = () => {
  return (
    <div className="w-[95vw] h-auto m-auto bg-white rounded-md px-6 py-8 mt-11">
      <BookmarkList />
    </div>
  );
};

export default Dashboard;
