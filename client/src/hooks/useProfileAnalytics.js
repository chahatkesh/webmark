import { useContext } from "react";
import useSWR from "swr";
import { StoreContext } from "../context/StoreContext";
import { apiRequest } from "../utils/apiClient";

const analyticsFetcher = (url) => apiRequest(url);

export const useProfileAnalytics = (range = "30d") => {
  const { url } = useContext(StoreContext);
  const safeRange = range === "7d" ? "7d" : "30d";
  const analyticsKey = `${url}/api/user/profile/analytics?range=${safeRange}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    analyticsKey,
    analyticsFetcher,
    {
      dedupingInterval: 60 * 1000,
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );

  return {
    range: data?.range ?? safeRange,
    clicksOverTime: data?.clicksOverTime ?? [],
    categoryBreakdown: data?.categoryBreakdown ?? [],
    loading: isLoading && !data,
    validating: isValidating,
    error:
      error?.data?.message ||
      error?.message ||
      (data && !data.success ? data.message : null),
    refetch: mutate,
  };
};

export default useProfileAnalytics;
