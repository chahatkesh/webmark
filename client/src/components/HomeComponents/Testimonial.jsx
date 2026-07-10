import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { BsPatchCheckFill } from "react-icons/bs";
import testimonialTweets from "../../config/testimonialTweets";
import { useTweet } from "../../hooks/useTweet";

const getTweetId = (url) => {
  const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
  return match?.[1] ?? null;
};

const getColumnCount = () => {
  if (typeof window === "undefined") return 1;
  if (window.matchMedia("(min-width: 1024px)").matches) return 3;
  if (window.matchMedia("(min-width: 640px)").matches) return 2;
  return 1;
};

const buildBentoColumns = (tweets, columnCount) => {
  const columns = Array.from({ length: columnCount }, () => []);

  tweets.forEach((tweet, index) => {
    columns[index % columnCount].push({ tweet, index });
  });

  return columns;
};

const useBentoColumnCount = () => {
  const [columnCount, setColumnCount] = useState(getColumnCount);

  useEffect(() => {
    const updateColumnCount = () => setColumnCount(getColumnCount());
    updateColumnCount();

    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  return columnCount;
};

const formatTweetDate = (createdAt) => {
  if (!createdAt) return "";
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";
  return format(date, "MMM d, yyyy");
};

const XIcon = () => (
  <svg
    className="fill-current text-gray-400"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="14"
    viewBox="0 0 17 15"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M16.928 14.054H11.99L8.125 9.162l-4.427 4.892H1.243L6.98 7.712.928.054H5.99L9.487 4.53 13.53.054h2.454l-5.358 5.932 6.303 8.068Zm-4.26-1.421h1.36L5.251 1.4H3.793l8.875 11.232Z"
    />
  </svg>
);

const VerifiedBadge = () => (
  <BsPatchCheckFill
    aria-label="Verified account"
    className="h-[1.05rem] w-[1.05rem] flex-shrink-0 text-[#1D9BF0]"
  />
);

const TweetCardSkeleton = ({ className = "" }) => (
  <article className={`tweet-card ${className}`.trim()}>
    <div className="tweet-card-surface animate-pulse">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-11 w-11 rounded-full bg-gray-200/80" />
        <div className="space-y-2">
          <div className="h-3.5 w-28 rounded-full bg-gray-200/80" />
          <div className="h-3 w-20 rounded-full bg-gray-200/60" />
        </div>
      </div>
      <div className="space-y-2.5">
        <div className="h-3 w-full rounded-full bg-gray-200/70" />
        <div className="h-3 w-[92%] rounded-full bg-gray-200/60" />
        <div className="h-3 w-[75%] rounded-full bg-gray-200/50" />
      </div>
    </div>
  </article>
);

const TweetCard = ({ tweetUrl, className = "" }) => {
  const tweetId = getTweetId(tweetUrl);
  const { data: tweet, isLoading, error } = useTweet(tweetId);

  if (isLoading) return <TweetCardSkeleton className={className} />;

  if (error || !tweet) {
    return (
      <article className={`tweet-card ${className}`.trim()}>
        <div className="tweet-card-surface text-sm text-gray-500">
          Unable to load tweet.
        </div>
      </article>
    );
  }

  return (
    <article className={`tweet-card ${className}`.trim()}>
      <a
        href={tweet.url || tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="tweet-card-surface group"
      >
        <header className="flex items-center gap-3 mb-5">
          <img
            className="h-11 w-11 rounded-full object-cover ring-1 ring-black/5"
            src={tweet.user.avatar}
            alt={`${tweet.user.name}'s profile`}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tweet.user.name)}&background=f3f4f6&color=374151`;
            }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="truncate font-semibold text-gray-900">
                {tweet.user.name}
              </span>
              {tweet.user.verified && <VerifiedBadge />}
            </div>
            <span className="block truncate text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
              {tweet.user.handle}
            </span>
          </div>
        </header>

        <p className="text-[0.9375rem] leading-relaxed text-gray-700 whitespace-pre-wrap">
          {tweet.text}
        </p>

        {tweet.mediaUrl && (
          <img
            className="mt-4 w-full rounded-xl object-cover ring-1 ring-black/5"
            src={tweet.mediaUrl}
            alt=""
            loading="lazy"
          />
        )}

        <footer className="mt-5 flex items-center gap-2 text-xs text-gray-400">
          <XIcon />
          <span>{formatTweetDate(tweet.createdAt)}</span>
        </footer>
      </a>
    </article>
  );
};

const Testimonial = () => {
  const columnCount = useBentoColumnCount();

  if (testimonialTweets.length === 0) {
    return null;
  }

  const columns =
    columnCount === 1
      ? [testimonialTweets.map((tweet, index) => ({ tweet, index }))]
      : buildBentoColumns(testimonialTweets, columnCount);

  return (
    <section className="relative py-12 md:py-20">
      <div className="pl-4 pr-4 sm:pl-6 sm:pr-6 max-w-[72rem] ml-auto mr-auto">
        <div className="max-w-[48rem] text-center ml-auto mr-auto">
          <h2 className="md:leading-[1.2777] leading-[1.3333] text-[1.875rem] tracking-[-0.037em] md:text-[2.25rem] font-[700]">
            Trusted and loved by Professionals
          </h2>
        </div>

        <div className="relative mt-10 md:mt-14">
          <div className="translate-x-[-9rem] absolute top-[4rem] -z-10">
            <div className="blur-[160px] opacity-35 to-[#111827] from-[#3b82f6] bg-gradient-to-tr h-80 w-80 rounded-full" />
          </div>
          <div className="absolute top-[10rem] right-0 -z-10">
            <div className="blur-[160px] opacity-40 to-[#111827] from-[#3b82f6] bg-gradient-to-tr h-80 w-80 rounded-full" />
          </div>

          <div className="testimonial-bento">
            {columns.map((column, columnIndex) => (
              <div
                key={`column-${columnIndex}`}
                className="testimonial-bento-column"
              >
                {column.map(({ tweet, index }) => (
                  <TweetCard
                    key={`${tweet.url}-${index}`}
                    tweetUrl={tweet.url}
                    className="testimonial-bento-item"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
