import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStats } from "../../hooks/useStats";
import { Bookmark, FolderKanban, Users, BarChart3 } from "lucide-react";

const StatsSection = () => {
  const { stats, isLoading, isError, error } = useStats();

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="flex justify-center items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="text-gray-600">Loading statistics...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {error || "Failed to load statistics"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <section id="about-us" className="relative">
      <div className="pointer-events-none absolute translate-x-[-50%] translate-y-[-50%] top-0 left-[50%] -z-10">
        <div className="filter blur-[160px] opacity-50 from-[#3b82f6] to-[#111827] bg-gradient-to-tr rounded-full w-80 h-80"></div>
      </div>
      <div className="pl-4 pr-4 sm:pl-6 sm:pr-6 max-w-[72rem] ml-auto mr-auto">
        <div className="pt-12 pb-12 md:pt-20 md:pb-20">
          <div className="pb-12 md:pb-16 text-center max-w-[48rem] ml-auto mr-auto">
            <h2 className="mb-4 md:leading-[1.2777] leading-[1.3333] text-[1.875rem] tracking-[-0.037em] md:text-[2.25rem] text-[#111827] font-[700]">
              Webmark by the Numbers
            </h2>
            <p className="text-[#374151] leading-[1.5] text-[1.125rem] tracking-[-0.017em]">
              Trusted by thousands of professionals to organize their digital
              resources. Join our growing community and experience the
              difference.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 overflow-hidden border-in-header">
            {/* Stat Card 1 */}
            <article className="relative p-6 md:p-10 hover:bg-blue-50 transition-colors duration-300">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Bookmark className="text-blue-600" size={24} />
                </div>
              </div>
              <h3 className="flex items-center font-bold text-3xl md:text-4xl mb-2 text-blue-600">
                {stats?.totalBookmarks?.toLocaleString() || 0}
              </h3>
              <p className="text-[#374151] text-sm">
                Bookmarks organized and accessible
              </p>
            </article>

            {/* Stat Card 2 */}
            <article className="relative p-6 md:p-10 lg-border-in-header-2 hover:bg-green-50 transition-colors duration-300">
              <div className="flex items-center mb-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <FolderKanban className="text-green-600" size={24} />
                </div>
              </div>
              <h3 className="flex items-center font-bold text-3xl md:text-4xl mb-2 text-green-600">
                {stats?.totalCategories?.toLocaleString() || 0}
              </h3>
              <p className="text-[#374151] text-sm">
                Categories for organized collections
              </p>
            </article>

            {/* Stat Card 3 */}
            <article className="relative p-6 md:p-10 lg-border-in-header-2 hover:bg-purple-50 transition-colors duration-300">
              <div className="flex items-center mb-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="text-purple-600" size={24} />
                </div>
              </div>
              <h3 className="flex items-center font-bold text-3xl md:text-4xl mb-2 text-purple-600">
                {stats?.totalUsers?.toLocaleString() || 0}
              </h3>
              <p className="text-[#374151] text-sm">
                Happy users enhancing productivity
              </p>
            </article>

            {/* Stat Card 4 */}
            <article className="relative p-6 md:p-10 hover:bg-amber-50 transition-colors duration-300">
              <div className="flex items-center mb-3">
                <div className="bg-amber-100 p-3 rounded-full">
                  <BarChart3 className="text-amber-600" size={24} />
                </div>
              </div>
              <h3 className="flex items-center font-bold text-3xl md:text-4xl mb-2 text-amber-600">
                {stats?.totalBookmarks && stats?.totalUsers
                  ? Math.round(
                      stats.totalBookmarks / stats.totalUsers
                    ).toLocaleString()
                  : 0}
              </h3>
              <p className="text-[#374151] text-sm">
                Average bookmarks per user
              </p>
            </article>
          </div>

          {/* Promotional Text */}
          <div className="mt-6 text-center">
            <p className="text-[#374151] text-sm">
              *Numbers updated daily. Join the productivity revolution today!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
