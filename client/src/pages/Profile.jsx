import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import useProfile from "../hooks/useProfile";
import useProfileAnalytics from "../hooks/useProfileAnalytics";
import SEO from "../components/SEO";
import ProfileHero from "../components/ProfileComponents/ProfileHero";
import ActivityCharts from "../components/ProfileComponents/ActivityCharts";
import TopBookmarksList from "../components/ProfileComponents/TopBookmarksList";
import CreditsCard from "../components/ProfileComponents/CreditsCard";
import DevicesCard from "../components/ProfileComponents/DevicesCard";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

// Reuse the shimmer primitive from dashboard skeletons
const Shimmer = ({ className = "" }) => (
  <div
    className={`relative overflow-hidden rounded bg-gray-100 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.4s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent ${className}`}
  />
);

const ProfileSkeleton = () => (
  <div className="mx-auto w-full max-w-5xl space-y-4 px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
    {/* Unified hero + stats card skeleton */}
    <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
      {/* Banner */}
      <div className="h-24 bg-blue-100 sm:h-28" />

      {/* Identity section */}
      <div className="px-5 pb-4 pt-0 sm:px-6">
        {/* Avatar overlapping banner */}
        <div className="-mt-8 mb-3 sm:-mt-10">
          <Shimmer className="h-14 w-14 rounded-2xl ring-4 ring-white sm:h-16 sm:w-16" />
        </div>
        <Shimmer className="h-3 w-24 rounded" />
        <Shimmer className="mt-1.5 h-6 w-44 rounded sm:w-52" />
        <div className="mt-2 flex gap-4">
          <Shimmer className="h-3 w-32 rounded" />
          <Shimmer className="h-3 w-28 rounded" />
        </div>
      </div>

      {/* Stats strip skeleton */}
      <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 border-t border-gray-100 sm:grid-cols-4 sm:divide-y-0">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex flex-col gap-2 px-5 py-4 sm:px-6">
            <Shimmer className="h-2.5 w-16 rounded" />
            <Shimmer className="h-6 w-12 rounded" />
          </div>
        ))}
      </div>
    </div>

    {/* Activity chart skeleton */}
    <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 sm:px-6">
        <div className="space-y-1.5">
          <Shimmer className="h-4 w-28 rounded" />
          <Shimmer className="h-3 w-36 rounded" />
        </div>
        <div className="flex gap-2">
          <Shimmer className="h-7 w-10 rounded-lg" />
          <Shimmer className="h-7 w-10 rounded-lg" />
        </div>
      </div>
      <Shimmer className="mx-5 mb-5 h-48 rounded-lg sm:mx-6" />
    </div>

    {/* Bottom grid: top bookmarks + credits + devices */}
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-5">
      <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm lg:col-span-3">
        <div className="px-5 py-4 sm:px-6">
          <Shimmer className="mb-4 h-4 w-32 rounded" />
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex items-center gap-3 py-2.5">
              <Shimmer className="h-3 w-4 rounded" />
              <Shimmer className="h-4 w-4 rounded" />
              <Shimmer className="h-3 flex-1 rounded" />
              <Shimmer className="h-3 w-10 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:col-span-2">
        <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
          <div className="space-y-3 px-5 py-4 sm:px-6">
            <Shimmer className="h-4 w-24 rounded" />
            <Shimmer className="h-12 w-full rounded-lg" />
            <Shimmer className="h-12 w-full rounded-lg" />
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
          <div className="space-y-3 px-5 py-4 sm:px-6">
            <Shimmer className="h-4 w-20 rounded" />
            <Shimmer className="h-14 w-full rounded-lg" />
            <Shimmer className="h-14 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Profile = () => {
  const [analyticsRange, setAnalyticsRange] = useState("30d");

  const {
    profile,
    clickStats,
    loading,
    error,
    fetchProfileData,
    formatTimeSaved,
  } = useProfile();

  const {
    clicksOverTime,
    loading: analyticsLoading,
    error: analyticsError,
  } = useProfileAnalytics(analyticsRange);

  const profileLoading = loading && !profile;
  const statsLoading = loading && !clickStats;

  if (error && !profile) {
    return (
      <div className="mx-auto w-full max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-100 bg-red-50 px-6 py-10 text-center">
          <h2 className="text-lg font-medium text-red-600">
            {error || "Could not load your profile"}
          </h2>
          <Button
            className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
            onClick={fetchProfileData}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      <SEO
        title="Your Profile - Webmark"
        description="View your Webmark activity, credits, and account details."
        canonicalUrl="https://webmark.chahatkesh.me/user/profile"
        keywords="webmark profile, bookmark stats, account"
        path="/user/profile"
        indexPage={false}
      />

      <motion.div
        className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-6 sm:py-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div variants={fadeIn} className="space-y-4">
          <ProfileHero
            profile={profile}
            clickStats={clickStats}
            formatTimeSaved={formatTimeSaved}
            statsLoading={statsLoading}
          />

          <div>
            {analyticsError && (
              <p className="mb-2 text-xs text-amber-600">
                Click activity unavailable right now.
              </p>
            )}
            <ActivityCharts
              range={analyticsRange}
              onRangeChange={setAnalyticsRange}
              clicksOverTime={clicksOverTime}
              loading={analyticsLoading}
            />
          </div>

          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <TopBookmarksList
                bookmarks={clickStats?.topBookmarks || []}
                loading={statsLoading}
              />
            </div>
            <div className="flex flex-col gap-4 lg:col-span-2">
              <CreditsCard profile={profile} loading={statsLoading} />
              <DevicesCard
                devices={profile?.activeDevices || []}
                maxDevices={profile?.maxDevices ?? 2}
                loading={statsLoading}
                onRevoked={fetchProfileData}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Profile;
