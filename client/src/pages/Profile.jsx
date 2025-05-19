import { useState, useEffect } from "react";
import useProfile from "../hooks/useProfile";
import useClicks from "../hooks/useClicks";
import { useAuth } from "../hooks/useAuth";
import {
  CalendarDays,
  Mail,
  Bookmark,
  FolderOpen,
  Clock,
  Monitor,
  Edit,
  MousePointer,
  Award,
  BarChart3,
  Calendar,
  Globe,
  Sparkles,
  LogOut,
} from "lucide-react";
import Loader from "../components/Loader";
import LoaderButton from "../components/ui/LoaderButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

const Profile = () => {
  const { profile, loading, error, fetchProfileData, updateProfile } =
    useProfile();
  const {
    clickStats,
    loading: clickStatsLoading,
    error: clickStatsError,
    getClickStats,
    formatTimeSaved,
  } = useClicks();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fade-in animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Scale animation for cards
  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Stagger children animation
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Card hover animation for interactive elements
  const cardHover = {
    hover: {
      y: -5,
      boxShadow:
        "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  // Fetch click statistics when component mounts
  useEffect(() => {
    getClickStats();
  }, [getClickStats]);

  // Enable editing mode
  const handleEditClick = () => {
    setFullName(profile?.name || "");
    setIsEditing(true);
  };

  // Save profile changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const success = await updateProfile({ name: fullName });
      if (success) {
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "N/A";
    return format(new Date(date), "PPP");
  };

  // Format relative time (e.g., "2 days ago")
  const formatRelativeTime = (date) => {
    if (!date) return "";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Calculate account age in days
  const getAccountAge = () => {
    if (!profile?.joinedAt) return "0 days";
    return `${Math.floor(
      (new Date() - new Date(profile.joinedAt)) / (1000 * 60 * 60 * 24)
    )} days`;
  };

  // Calculate bookmarks per category ratio
  const getBookmarksPerCategory = () => {
    if (!profile?.categoryCount || profile.categoryCount === 0) return "0";
    return (profile.bookmarkCount / profile.categoryCount).toFixed(1);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  if (loading || clickStatsLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="flex flex-col items-center gap-3">
          <Loader type="spinner" size="lg" />
          <p className="text-sm text-gray-500 animate-pulse">
            Loading your profile data...
          </p>
        </div>
      </div>
    );
  }

  if (error || clickStatsError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 mt-8">
        <div className="text-center py-10 bg-red-50 rounded-2xl">
          <h2 className="text-xl font-medium text-red-500 mb-3">
            {error || clickStatsError || "Error loading data"}
          </h2>
          <Button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-all shadow-sm"
            onClick={fetchProfileData}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-20 mt-4 mb-20"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}>
      {/* Header Section */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
        variants={fadeIn}>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
            My Profile
          </h1>
          <p className="text-gray-500">
            Manage your account and view your bookmark statistics
          </p>
        </div>
        <Button
          onClick={handleLogout}
          className="mt-4 md:mt-0 bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800 px-5 py-2.5 rounded-md transition-all duration-200 shadow-sm flex items-center gap-2 font-medium"
          aria-label="Logout">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <motion.div
            variants={scaleUp}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-24" />
            <div className="px-6 py-6 relative">
              {/* Profile Image */}
              <div className="absolute -top-12 left-6">
                {profile?.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt="Profile"
                    className="h-20 w-20 rounded-xl border-4 border-white shadow-md object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      const displayName =
                        profile.name || profile.username || "User";
                      e.target.src =
                        "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(displayName) +
                        "&size=200&background=4F46E5&color=fff";
                    }}
                  />
                ) : (
                  <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-white shadow-md flex items-center justify-center text-white text-2xl font-medium">
                    {profile?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="mt-10 relative">
                {!isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="absolute right-0 top-0 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    title="Edit Profile">
                    <Edit className="h-4 w-4 text-gray-600" />
                  </button>
                )}
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-lg"
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-2">
                      <LoaderButton
                        type="submit"
                        isLoading={submitting}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white shadow-sm">
                        Save
                      </LoaderButton>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="flex-1"
                        disabled={submitting}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900">
                      {profile?.name || "User"}
                    </h2>
                    <p className="text-gray-500 mb-4">@{profile?.username}</p>

                    <div className="space-y-4">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{profile?.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <CalendarDays className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Joined {formatDate(profile?.joinedAt)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Time Saved Card */}
          <motion.div
            whileHover="hover"
            variants={scaleUp}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-sm">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Time Saved with Webmark
            </h3>
            <div className="mt-4">
              <p className="text-sm text-blue-100">
                Total time saved using our service
              </p>
              <div className="flex items-baseline mt-1">
                <h4 className="text-3xl font-bold">
                  {formatTimeSaved(clickStats?.timeSaved || 0)}
                </h4>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-blue-400 border-opacity-30">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  Based on {clickStats?.totalClicks || 0} total clicks
                </span>
                <Award className="h-5 w-5" />
              </div>
            </div>
          </motion.div>

          {/* Webmark Statistics */}
          <motion.div
            variants={scaleUp}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-blue-500" />
              Webmark Benefits
            </h3>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 p-3 bg-indigo-50 rounded-lg">
                  <Clock className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <h4 className="font-medium">Time Saved</h4>
                  <p className="text-sm text-gray-500">
                    You've saved {formatTimeSaved(clickStats?.timeSaved || 0)}{" "}
                    using Webmark's quick access
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 p-3 bg-purple-50 rounded-lg">
                  <MousePointer className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-medium">Efficient Navigation</h4>
                  <p className="text-sm text-gray-500">
                    {clickStats?.totalClicks || 0} clicks optimized through your
                    bookmark collection
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium">Organized Web</h4>
                  <p className="text-sm text-gray-500">
                    {profile?.categoryCount || 0} categories keeping your{" "}
                    {profile?.bookmarkCount || 0} bookmarks tidy
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Statistics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Usage Statistics Card */}
          <motion.div
            variants={scaleUp}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              Usage Statistics
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Bookmarks Stat */}
              <motion.div
                whileHover="hover"
                variants={cardHover}
                className="bg-blue-50 rounded-xl p-4 text-center">
                <Bookmark className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Total Bookmarks</p>
                <h4 className="text-2xl font-bold text-gray-900">
                  {profile?.bookmarkCount || 0}
                </h4>
              </motion.div>

              {/* Categories Stat */}
              <motion.div
                whileHover="hover"
                variants={cardHover}
                className="bg-indigo-50 rounded-xl p-4 text-center">
                <FolderOpen className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Categories</p>
                <h4 className="text-2xl font-bold text-gray-900">
                  {profile?.categoryCount || 0}
                </h4>
              </motion.div>

              {/* Clicks Stat */}
              <motion.div
                whileHover="hover"
                variants={cardHover}
                className="bg-purple-50 rounded-xl p-4 text-center">
                <MousePointer className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Total Clicks</p>
                <h4 className="text-2xl font-bold text-gray-900">
                  {clickStats?.totalClicks || 0}
                </h4>
              </motion.div>

              {/* Account Age Stat */}
              <motion.div
                whileHover="hover"
                variants={cardHover}
                className="bg-rose-50 rounded-xl p-4 text-center">
                <Calendar className="h-6 w-6 text-rose-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Account Age</p>
                <h4 className="text-2xl font-bold text-gray-900">
                  {getAccountAge()}
                </h4>
              </motion.div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <motion.div
                whileHover="hover"
                variants={cardHover}
                className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Bookmarks per Category
                    </p>
                    <h4 className="text-2xl font-bold text-gray-900">
                      {getBookmarksPerCategory()}
                    </h4>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <BarChart3 className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover="hover"
                variants={cardHover}
                className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Last Bookmark Click</p>
                    <h4 className="text-lg font-bold text-gray-900 truncate max-w-[180px]">
                      {clickStats?.lastClickedBookmark?.name || "None yet"}
                    </h4>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                {clickStats?.lastClickedBookmark?.timestamp && (
                  <p className="text-xs text-gray-500 mt-2">
                    {formatRelativeTime(
                      clickStats.lastClickedBookmark.timestamp
                    )}
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Top Bookmarks Card */}
          {clickStats?.topBookmarks && clickStats.topBookmarks.length > 0 && (
            <motion.div
              variants={scaleUp}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-500" />
                Most Clicked Bookmarks
              </h3>

              <div className="space-y-4 cursor-pointer">
                {clickStats.topBookmarks.map((bookmark, index) => (
                  <motion.div
                    key={bookmark.id}
                    whileHover=""
                    variants={cardHover}
                    className="flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-md flex items-center justify-center text-blue-800 font-bold mr-4">
                      #{index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {bookmark.name}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {bookmark.link}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-700">
                      <MousePointer className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {bookmark.clickCount}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Active Devices */}
          <motion.div
            variants={scaleUp}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Monitor className="h-5 w-5 mr-2 text-blue-500" />
              Active Devices
              {profile?.activeDevices && profile.activeDevices.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {profile.activeDevices.length}
                </span>
              )}
            </h3>

            {profile?.activeDevices && profile.activeDevices.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {profile.activeDevices.map((device, index) => (
                  <motion.div
                    key={device.deviceId || index}
                    whileHover=""
                    variants={cardHover}
                    className="py-3 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-full p-1.5 ${
                          device.isCurrent ? "bg-green-100" : "bg-gray-100"
                        }`}>
                        <Monitor
                          className={`h-4 w-4 ${
                            device.isCurrent
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {device.deviceName}
                          {device.isCurrent && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium ml-2">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Active: {formatRelativeTime(device.lastActive)}
                        </div>
                      </div>
                    </div>

                    {!device.isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => {
                          toast.info(
                            "Logout from other devices will be available in the next update."
                          );
                        }}>
                        <LogOut className="h-3 w-3 mr-1" />
                        Logout
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Only your current device is active.
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer Section */}
      <motion.div
        variants={fadeIn}
        className="mt-10 text-center text-sm text-gray-500">
        <p>Webmark - Simplifying Bookmark Management</p>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
