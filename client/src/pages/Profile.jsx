import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import useProfile from "../hooks/useProfile";
import useProfileAnalytics from "../hooks/useProfileAnalytics";
import SEO from "../components/SEO";
import ProfileHero from "../components/ProfileComponents/ProfileHero";
import ProfileStatStrip from "../components/ProfileComponents/ProfileStatStrip";
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

const ProfileSkeleton = () => (
  <div className="mx-auto mt-14 min-h-[calc(100vh-3.5rem)] w-full max-w-5xl px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
    <div className="h-44 animate-pulse rounded-xl bg-gray-100" />
    <div className="mt-4 h-28 animate-pulse rounded-xl bg-gray-100" />
    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="h-72 animate-pulse rounded-xl bg-gray-100" />
      <div className="h-72 animate-pulse rounded-xl bg-gray-100" />
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
    updateProfile,
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
      <div className="mx-auto mt-14 w-full max-w-5xl px-3 py-10 sm:px-6 lg:px-8">
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
        className="mx-auto mt-14 min-h-[calc(100vh-3.5rem)] w-full max-w-5xl px-3 py-5 sm:px-6 sm:py-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div variants={fadeIn} className="space-y-4">
          <ProfileHero profile={profile} updateProfile={updateProfile} />

          <ProfileStatStrip
            profile={profile}
            clickStats={clickStats}
            formatTimeSaved={formatTimeSaved}
            loading={statsLoading}
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
