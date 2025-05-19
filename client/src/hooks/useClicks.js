import { useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';
import { toast } from 'react-toastify';

export const useClicks = () => {
  const { url } = useContext(StoreContext);
  const [clickStats, setClickStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Track a bookmark click
  const trackClick = useCallback(async (bookmarkId) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await axios.post(
        `${url}/api/clicks/track`,
        { bookmarkId },
        { headers: { token } }
      );

      if (response.data.success) {
        return {
          clickCount: response.data.clickCount,
          totalClicks: response.data.totalClicks,
          timeSaved: response.data.timeSaved
        };
      }
      return false;
    } catch (error) {
      console.error('Error tracking click:', error);
      return false;
    }
  }, [url]);

  // Get user click statistics
  const getClickStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/clicks/stats`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setClickStats(response.data.stats);
      } else {
        setError(response.data.message || 'Failed to load click statistics');
      }
    } catch (error) {
      console.error('Error fetching click statistics:', error);
      setError('Error loading click statistics');
    } finally {
      setLoading(false);
    }
  }, [url]);

  // Format time saved in human readable format
  const formatTimeSaved = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0 minutes';

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours < 24) {
      if (remainingMinutes === 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
      }
      return `${hours} hour${hours !== 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (remainingHours === 0) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    }
    return `${days} day${days !== 1 ? 's' : ''} and ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
  };

  return {
    clickStats,
    loading,
    error,
    trackClick,
    getClickStats,
    formatTimeSaved
  };
};

export default useClicks;
