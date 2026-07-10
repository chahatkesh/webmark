import { useState, useCallback } from "react";
import { apiRequest } from "../utils/apiClient";

export const useClicks = () => {
  const [clickStats, setClickStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Track a bookmark click
  const trackClick = useCallback(async (bookmarkId) => {
    try {
      const data = await apiRequest("/api/clicks/track", {
        method: "POST",
        body: { bookmarkId },
      });

      if (data.success) {
        return {
          clickCount: data.clickCount,
          totalClicks: data.totalClicks,
          timeSaved: data.timeSaved,
        };
      }
      return false;
    } catch (error) {
      console.error("Error tracking click:", error);
      return false;
    }
  }, []);

  // Get user click statistics
  const getClickStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest("/api/clicks/stats", {
        method: "POST",
      });

      if (data.success) {
        setClickStats(data.stats);
      } else {
        setError(data.message || "Failed to load click statistics");
      }
    } catch (error) {
      console.error("Error fetching click statistics:", error);
      setError(error.data?.message || "Error loading click statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  // Format time saved in human readable format
  const formatTimeSaved = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0 minutes";

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? "s" : ""}`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours < 24) {
      if (remainingMinutes === 0) {
        return `${hours} hour${hours !== 1 ? "s" : ""}`;
      }
      return `${hours} hour${hours !== 1 ? "s" : ""} and ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (remainingHours === 0) {
      return `${days} day${days !== 1 ? "s" : ""}`;
    }
    return `${days} day${days !== 1 ? "s" : ""} and ${remainingHours} hour${remainingHours !== 1 ? "s" : ""}`;
  };

  return {
    clickStats,
    loading,
    error,
    trackClick,
    getClickStats,
    formatTimeSaved,
  };
};

export default useClicks;
