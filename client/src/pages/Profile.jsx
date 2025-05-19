import { useState } from "react";
import useProfile from "../hooks/useProfile";
import {
  CalendarDays,
  Mail,
  Bookmark,
  FolderOpen,
  Clock,
  Monitor,
  Edit,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import { format, formatDistanceToNow } from "date-fns";

const Profile = () => {
  const { profile, loading, error, fetchProfileData, updateProfile } =
    useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  // Format time for display
  const formatTime = (date) => {
    if (!date) return "";
    return format(new Date(date), "p");
  };

  // Format relative time (e.g., "2 days ago")
  const formatRelativeTime = (date) => {
    if (!date) return "";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[95vw] max-w-4xl mx-auto bg-white rounded-md px-6 py-8 mt-11">
        <div className="text-center py-8">
          <h2 className="text-xl font-medium text-red-500">
            Error loading profile
          </h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchProfileData}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[95vw] max-w-4xl mx-auto bg-white rounded-md px-6 py-8 mt-11">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        {!isEditing && (
          <Button
            variant="outline"
            onClick={handleEditClick}
            className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <div className="md:col-span-1">
          <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
            {profile?.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover mb-4"
                onLoad={() => console.log("Profile image loaded successfully")}
                onError={(e) => {
                  console.error(
                    "Profile image failed to load:",
                    profile.profilePicture
                  );
                  e.target.onerror = null;
                  // Make sure we have a valid name to use for the avatar
                  const displayName =
                    profile.name || profile.username || "User";
                  console.log("Using fallback avatar for:", displayName);
                  e.target.src =
                    "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(displayName) +
                    "&size=200&background=4F46E5&color=fff";
                }}
              />
            ) : (
              <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-medium mb-4">
                {profile?.username?.charAt(0).toUpperCase() || "U"}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="w-full mt-4">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1">
                      {submitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1"
                      disabled={submitting}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-xl font-medium mb-1">
                  {profile?.name || profile?.username || "User"}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  @{profile?.username}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Mail className="h-4 w-4 mr-2" />
                  {profile?.email}
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Joined {formatDate(profile?.joinedAt)}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats & Usage */}
        <div className="md:col-span-2">
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Account Statistics
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Total Bookmarks</span>
                  <div className="mt-2 flex items-center">
                    <Bookmark className="h-5 w-5 text-blue-500 mr-1" />
                    <span className="text-2xl font-semibold">
                      {profile?.bookmarkCount || 0}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">
                    Total Categories
                  </span>
                  <div className="mt-2 flex items-center">
                    <FolderOpen className="h-5 w-5 text-blue-500 mr-1" />
                    <span className="text-2xl font-semibold">
                      {profile?.categoryCount || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-2">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Bookmark className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-blue-600 font-medium">
                      Bookmarks per Category
                    </div>
                    <div className="text-lg font-semibold">
                      {profile?.categoryCount
                        ? (
                            profile.bookmarkCount / profile.categoryCount
                          ).toFixed(1)
                        : 0}
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 flex items-center gap-2">
                  <div className="bg-purple-100 rounded-full p-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-purple-600 font-medium">
                      Account Age
                    </div>
                    <div className="text-lg font-semibold">
                      {profile?.joinedAt
                        ? `${Math.floor(
                            (new Date() - new Date(profile.joinedAt)) /
                              (1000 * 60 * 60 * 24)
                          )} days`
                        : "0 days"}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Login Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium">Last Login</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(profile?.lastLogin)} at{" "}
                      {formatTime(profile?.lastLogin)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Monitor className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium">Active Devices</div>
                    <div className="text-sm text-gray-500">
                      {profile?.activeDevices?.filter((d) => d.isCurrent).length
                        ? `${profile.activeDevices.length} ${
                            profile.activeDevices.length === 1
                              ? "device"
                              : "devices"
                          } currently active`
                        : "Current session active"}
                    </div>
                  </div>
                </div>

                {profile?.activeDevices && profile.activeDevices.length > 0 && (
                  <div className="mt-4 border rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                      <h4 className="font-medium text-sm">Active Devices</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {profile.activeDevices.length}{" "}
                        {profile.activeDevices.length === 1
                          ? "device"
                          : "devices"}
                      </span>
                    </div>
                    <div className="divide-y">
                      {profile.activeDevices.map((device, index) => (
                        <div
                          key={device.deviceId || index}
                          className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`rounded-full p-1.5 ${
                                device.isCurrent
                                  ? "bg-green-100"
                                  : "bg-gray-100"
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
                              <div className="text-sm font-medium flex items-center gap-1">
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
                              Logout
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
