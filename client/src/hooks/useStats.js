import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useContext, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';

export const useStats = () => {
  const { url } = useContext(StoreContext);
  const queryClient = useQueryClient();
  const [timeRange, setTimeRange] = useState('month');
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${url}/api/stats/public?range=${timeRange}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch statistics');
      }

      return data;
    } catch (error) {
      console.error('Stats fetch error:', error);
      setError(error.message);
      throw error;
    }
  };

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['public-stats', timeRange],
    queryFn: fetchStats,
    refetchInterval: 30000,
    staleTime: 25000,
    retry: 2,
    onError: (error) => {
      setError(error.message);
    },
    cacheTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  const prefetchOtherRanges = useCallback(() => {
    const ranges = ['week', 'month', 'year', 'all'];
    ranges.forEach(range => {
      if (range !== timeRange) {
        queryClient.prefetchQuery({
          queryKey: ['public-stats', range],
          queryFn: () =>
            fetch(`${url}/api/stats/public?range=${range}`)
              .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
              }),
          staleTime: 25000
        });
      }
    });
  }, [queryClient, timeRange, url]);

  const refreshStats = useCallback(() => {
    queryClient.invalidateQueries(['public-stats']);
    queryClient.invalidateQueries(['historical-stats']);
    setError(null);
  }, [queryClient]);

  const calculateGrowth = useCallback((currentValue, type) => {
    if (!stats?.growth?.[type]) return 0;
    return stats.growth[type];
  }, [stats]);

  // Debug effect
  useEffect(() => {
    if (stats) {
      console.log('Stats updated:', {
        timeRange,
        totalUsers: stats.totalUsers,
        totalBookmarks: stats.totalBookmarks,
        totalCategories: stats.totalCategories,
        growth: stats.growth
      });
    }
  }, [stats, timeRange]);

  // Prefetch other ranges when timeRange changes
  useEffect(() => {
    prefetchOtherRanges();
  }, [prefetchOtherRanges, timeRange]);

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      queryClient.cancelQueries(['public-stats']);
      setError(null);
    };
  }, [queryClient]);

  return {
    stats,
    isLoading,
    isError,
    error,
    timeRange,
    setTimeRange,
    refreshStats,
    calculateGrowth,
  };
};

export default useStats;