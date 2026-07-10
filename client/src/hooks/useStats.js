import useSWR, { mutate as globalMutate } from "swr";
import { useState, useCallback, useContext } from "react";
import { StoreContext } from "../context/StoreContext";

const statsFetcher = (url) =>
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (!data.success)
        throw new Error(data.message || "Failed to fetch statistics");
      return data;
    });

export const useStats = () => {
  const { url } = useContext(StoreContext);
  const [timeRange, setTimeRange] = useState("month");
  const [error, setError] = useState(null);

  const swrKey = `${url}/api/stats/public?range=${timeRange}`;

  const {
    data: stats,
    isLoading,
    error: swrError,
  } = useSWR(swrKey, statsFetcher, {
    refreshInterval: 0,
    dedupingInterval: 10 * 60 * 1000,
    errorRetryCount: 1,
    revalidateOnFocus: false,
    revalidateOnMount: true,
    onError: (err) => setError(err.message),
  });

  const isError = !!swrError;

  const refreshStats = useCallback(() => {
    globalMutate(
      (key) => typeof key === "string" && key.includes("/api/stats/"),
    );
    setError(null);
  }, []);

  const calculateGrowth = useCallback(
    (currentValue, type) => {
      if (!stats?.growth?.[type]) return 0;
      return stats.growth[type];
    },
    [stats],
  );

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
