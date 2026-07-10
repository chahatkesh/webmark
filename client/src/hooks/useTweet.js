import useSWR from "swr";
import { apiRequest } from "../utils/apiClient";

export const useTweet = (tweetId) =>
  useSWR(
    tweetId ? `/api/tweets/${tweetId}` : null,
    (path) => apiRequest(path).then((response) => response.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );
