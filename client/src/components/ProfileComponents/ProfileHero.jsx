import { useEffect, useRef, useState } from "react";
import { CalendarDays, Check, Edit2, Loader2, Mail, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const formatJoinDate = (date) => {
  if (!date) return "Recently";
  return format(new Date(date), "MMM d, yyyy");
};

const ProfileHero = ({ profile, updateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  const displayName = profile?.name || profile?.username || "there";
  const greeting = getGreeting();

  useEffect(() => {
    if (!isEditing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  const handleEditClick = () => {
    setFullName(profile?.name || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (submitting) return;
    setFullName(profile?.name || "");
    setIsEditing(false);
  };

  const handleSave = async () => {
    const nextName = fullName.trim();
    if (!nextName) {
      toast.error("Name can't be empty");
      inputRef.current?.focus();
      return;
    }

    if (nextName === (profile?.name || "").trim()) {
      setIsEditing(false);
      return;
    }

    setSubmitting(true);
    try {
      const success = await updateProfile({ name: nextName });
      if (success) {
        setIsEditing(false);
        toast.success("Name updated");
      }
    } catch {
      toast.error("Could not update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const avatarFallback =
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(displayName) +
    "&size=200&background=4F46E5&color=fff";

  const avatar = profile?.profilePicture ? (
    <img
      src={profile.profilePicture}
      alt=""
      referrerPolicy="no-referrer"
      className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-gray-200 sm:h-16 sm:w-16"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = avatarFallback;
      }}
    />
  ) : (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-semibold text-white ring-1 ring-blue-500/20 sm:h-16 sm:w-16 sm:text-xl">
      {(profile?.username || "U").charAt(0).toUpperCase()}
    </div>
  );

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex min-w-0 gap-3.5 sm:gap-4">
          <div className="shrink-0">{avatar}</div>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-500">
              {greeting},{" "}
              <span className="font-medium text-gray-700">
                @{profile?.username}
              </span>
            </p>

            <div className="mt-0.5 flex min-h-10 min-w-0 items-center gap-1.5">
              {isEditing ? (
                <>
                  <Input
                    ref={inputRef}
                    id="profile-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={submitting}
                    maxLength={80}
                    aria-label="Display name"
                    className="max-w-xs"
                  />
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={submitting}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
                    aria-label="Save name"
                    title="Save"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={submitting}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:opacity-60"
                    aria-label="Cancel editing"
                    title="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <h1 className="truncate text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    {displayName}
                  </h1>
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                    aria-label="Edit display name"
                    title="Edit name"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>

            <div className="mt-3 flex flex-col gap-1.5 text-sm text-gray-600 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1">
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                <span className="truncate">{profile?.email}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                Joined {formatJoinDate(profile?.joinedAt)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHero;
