const SYNDICATION_URL = "https://cdn.syndication.twimg.com/tweet-result";
const TWEET_ID_PATTERN = /^[0-9]+$/;

const getSyndicationToken = (id) =>
  ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, "");

const getDisplayText = (tweet) => {
  const text = tweet.text || "";
  const range = tweet.display_text_range;

  if (Array.isArray(range) && range.length === 2) {
    return text.slice(range[0], range[1]).trimEnd();
  }

  return text;
};

const getMediaUrl = (tweet) => {
  const photo = tweet.photos?.[0]?.url;
  if (photo) return photo;

  const media = tweet.mediaDetails?.[0]?.media_url_https;
  if (media) return media;

  return null;
};

const normalizeTweet = (id, tweet) => {
  const screenName = tweet.user?.screen_name || "";
  const avatar = tweet.user?.profile_image_url_https?.replace(
    "_normal",
    "_400x400",
  );

  return {
    id,
    text: getDisplayText(tweet),
    createdAt: tweet.created_at || null,
    url: screenName ? `https://x.com/${screenName}/status/${id}` : null,
    user: {
      name: tweet.user?.name || "Unknown",
      handle: screenName ? `@${screenName}` : "",
      avatar: avatar || null,
      verified: Boolean(tweet.user?.verified || tweet.user?.is_blue_verified),
    },
    mediaUrl: getMediaUrl(tweet),
  };
};

export const fetchTweetById = async (id) => {
  if (!id || id.length > 40 || !TWEET_ID_PATTERN.test(id)) {
    const error = new Error("Invalid tweet id");
    error.status = 400;
    throw error;
  }

  const url = new URL(SYNDICATION_URL);
  url.searchParams.set("id", id);
  url.searchParams.set("lang", "en");
  url.searchParams.set("token", getSyndicationToken(id));

  const response = await fetch(url.toString());

  if (response.status === 404) {
    const error = new Error("Tweet not found");
    error.status = 404;
    throw error;
  }

  if (!response.ok) {
    const error = new Error("Failed to fetch tweet");
    error.status = response.status;
    throw error;
  }

  const data = await response.json();

  if (data?.__typename === "TweetTombstone") {
    const error = new Error("Tweet unavailable");
    error.status = 410;
    throw error;
  }

  return normalizeTweet(id, data);
};
