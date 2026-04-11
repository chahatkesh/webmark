import useSWR, { mutate as globalMutate } from 'swr';
import { useState, useCallback, useContext, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';

const statsFetcher = (url) =>
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (!data.success) throw new Error(data.message || 'Failed to fetch statistics');
      return data;
    });

export const useStats = () => {
  const { url } = useContext(StoreContext);
  const [timeRange, setTimeRange] = useState('month');
  const [error, setError] = useState(null);

  const swrKey = `${url}/api/stats/public?range=${timeRange}`;

  const { data: stats, isLoading, error: swrError } = useSWR(
    swrKey,
    statsFetcher,
    {
      refreshInterval: 30000,
      dedupingInterval: 25000,
      errorRetryCount: 2,
      revalidateOnFocus: true,
      revalidateOnMount: true,
      onError: (err) => setError(err.message),
    },
  );

  const isError = !!swrError;

  // Prefetch other ranges
  const prefetchOtherRanges = useCallback(() => {
    const ranges = ['week', 'month', 'year', 'all'];
    ranges.forEach((range) => {
      if (range !== timeRange) {
        globalMutate(`${url}/api/stats/public?range=${range}`, statsFetcher(`${url}/api/stats/public?range=${range}`), { revalidate: false });
      }
    });
  }, [timeRange, url]);

  const refreshStats = useCallback(() => {
    globalMutate((key) => typeof key === 'string' && key.includes('/api/stats/'));
    setError(null);
  }, []);

  const calculateGrowth = useCallback((currentValue, type) => {
    if (!stats?.growth?.[type]) return 0;
    return stats.growth[type];
  }, [stats]);

  useEffect(() => {
    if (stats) {
      console.log('Stats updated:', {
        timeRange,
        totalUsers: stats.totalUsers,
        totalBookmarks: stats.totalBookmarks,
        totalCategories: stats.totalCategories,
        growth: stats.growth,
      });
    }
  }, [stats, timeRange]);

  useEffect(() => {
    prefetchOtherRanges();
  }, [prefetchOtherRanges, timeRange]);

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