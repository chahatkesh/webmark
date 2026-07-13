import useSWR from "swr";
import { useContext } from "react";
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
  const swrKey = `${url}/api/stats/public?scope=hero`;

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
  });

  return {
    stats,
    isLoading,
    isError: !!swrError,
    error: swrError?.message ?? null,
  };
};

export default useStats;
