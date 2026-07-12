import { useCallback, useContext, useEffect } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { StoreContext } from "../context/StoreContext";
import { apiRequest } from "../utils/apiClient";
import { setDeviceId } from "../utils/deviceId";

const profileFetcher = async (url) => {
  const data = await apiRequest(url, {
    method: "POST",
  });

  if (data.profile?.currentDeviceId) {
    setDeviceId(data.profile.currentDeviceId);
  }

  if (data.success) {
    let limitsUpdated = false;
    if (data.profile?.aiSortsRemaining !== undefined) {
      localStorage.setItem(
        "aiSortsRemaining",
        String(data.profile.aiSortsRemaining),
      );
      limitsUpdated = true;
    }
    if (data.profile?.importsRemainingThisMonth !== undefined) {
      localStorage.setItem(
        "importsRemainingThisMonth",
        String(data.profile.importsRemainingThisMonth),
      );
      limitsUpdated = true;
    }
    if (limitsUpdated) {
      window.dispatchEvent(new Event("limitsUpdated"));
    }
  }

  return data;
};

export const useProfile = () => {
  const { url, user, setUser } = useContext(StoreContext);
  const profileKey = `${url}/api/user/profile`;

  const { data, error, isLoading, mutate } = useSWR(
    profileKey,
    profileFetcher,
    {
      dedupingInterval: 60 * 1000,
      revalidateOnFocus: false,
    },
  );

  // Keep header avatar in sync with profile (same Google photo)
  useEffect(() => {
    const picture = data?.profile?.profilePicture;
    if (!data?.success || !picture || !user) return;
    if (user.profilePicture === picture) return;

    setUser({
      ...user,
      profilePicture: picture,
      name: data.profile.name || user.name,
      username: data.profile.username || user.username,
      email: data.profile.email || user.email,
    });
  }, [data, user, setUser]);

  const fetchProfileData = useCallback(() => mutate(), [mutate]);

  const updateProfile = async (updatedData) => {
    try {
      const response = await apiRequest("/api/user/profile", {
        method: "PUT",
        body: updatedData,
      });

      if (response.success) {
        mutate(
          (current) => ({
            ...current,
            profile: {
              ...current?.profile,
              ...response.profile,
            },
          }),
          { revalidate: false },
        );

        if (user) {
          setUser({
            ...user,
            name: response.profile?.name ?? user.name,
            profilePicture:
              response.profile?.profilePicture ?? user.profilePicture,
          });
        }
        return true;
      }

      toast.error(response.message || "Failed to update profile");
      return false;
    } catch (updateError) {
      console.error("Error updating profile:", updateError);
      toast.error(
        updateError.data?.message || "Error updating profile information",
      );
      return false;
    }
  };

  // Compact for tight UI (stat tiles); avoids truncation like "17 hours and …"
  const formatTimeSaved = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) return "0m";

    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours < 24) {
      return remainingMinutes === 0
        ? `${hours}h`
        : `${hours}h ${remainingMinutes}m`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours === 0 ? `${days}d` : `${days}d ${remainingHours}h`;
  };

  return {
    profile: data?.profile ?? null,
    clickStats: data?.clickStats ?? null,
    loading: isLoading,
    error:
      error?.data?.message ||
      error?.message ||
      (data && !data.success ? data.message : null),
    fetchProfileData,
    updateProfile,
    formatTimeSaved,
  };
};

export default useProfile;
