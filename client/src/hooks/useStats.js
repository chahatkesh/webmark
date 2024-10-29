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
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch statistics');
      }

      return data;
    } catch (error) {
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
    }
  });

  const prefetchOtherRanges = useCallback(() => {
    const ranges = ['week', 'month', 'year', 'all'];
    ranges.forEach(range => {
      if (range !== timeRange) {
        queryClient.prefetchQuery({
          queryKey: ['public-stats', range],
          queryFn: () => fetch(`${url}/api/stats/public?range=${range}`).then(res => res.json())
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

  useEffect(() => {
    prefetchOtherRanges();
  }, [prefetchOtherRanges]);

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