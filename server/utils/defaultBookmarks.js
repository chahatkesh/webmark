// utils/defaultBookmarks.js
import Category from "../models/categoryModel.js";
import Bookmark from "../models/bookmarkModel.js";
import { UNCATEGORIZED_CATEGORY } from "./uncategorizedCategory.js";

const fav = (domain) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

export const defaultCategories = [
  {
    category: "Social Media",
    bgcolor: "#eef2ff",
    hcolor: "#4f46e5",
    emoji: "🌐",
    bookmarks: [
      {
        name: "X (Twitter)",
        link: "https://x.com/",
        logo: fav("x.com"),
        order: 0,
      },
      {
        name: "LinkedIn",
        link: "https://www.linkedin.com/",
        logo: fav("linkedin.com"),
        order: 1,
      },
      {
        name: "Instagram",
        link: "https://www.instagram.com/",
        logo: fav("instagram.com"),
        order: 2,
      },
      {
        name: "Reddit",
        link: "https://www.reddit.com/",
        logo: fav("reddit.com"),
        order: 3,
      },
    ],
  },
  {
    category: "Productivity",
    bgcolor: "#ecfdf5",
    hcolor: "#059669",
    emoji: "⚡",
    bookmarks: [
      {
        name: "Gmail",
        link: "https://mail.google.com/",
        logo: fav("mail.google.com"),
        order: 0,
      },
      {
        name: "Google Calendar",
        link: "https://calendar.google.com/",
        logo: fav("calendar.google.com"),
        order: 1,
      },
      {
        name: "Notion",
        link: "https://notion.so/",
        logo: fav("notion.so"),
        order: 2,
      },
      {
        name: "Google Drive",
        link: "https://drive.google.com/",
        logo: fav("drive.google.com"),
        order: 3,
      },
    ],
  },
  {
    category: "Entertainment",
    bgcolor: "#fffbeb",
    hcolor: "#b45309",
    emoji: "🎬",
    bookmarks: [
      {
        name: "YouTube",
        link: "https://youtube.com/",
        logo: fav("youtube.com"),
        order: 0,
      },
      {
        name: "Netflix",
        link: "https://netflix.com/",
        logo: fav("netflix.com"),
        order: 1,
      },
      {
        name: "Spotify",
        link: "https://spotify.com/",
        logo: fav("spotify.com"),
        order: 2,
      },
      {
        name: "Twitch",
        link: "https://twitch.tv/",
        logo: fav("twitch.tv"),
        order: 3,
      },
    ],
  },
  {
    category: "AI Tools",
    bgcolor: "#fff1f2",
    hcolor: "#be123c",
    emoji: "🤖",
    bookmarks: [
      {
        name: "ChatGPT",
        link: "https://chat.openai.com/",
        logo: fav("chat.openai.com"),
        order: 0,
      },
      {
        name: "Claude",
        link: "https://claude.ai/new",
        logo: fav("claude.ai"),
        order: 1,
      },
      {
        name: "Gemini",
        link: "https://gemini.google.com/",
        logo: fav("gemini.google.com"),
        order: 2,
      },
      {
        name: "Perplexity",
        link: "https://www.perplexity.ai/",
        logo: fav("perplexity.ai"),
        order: 3,
      },
    ],
  },
  {
    category: "Dev Tools",
    bgcolor: "#faf5ff",
    hcolor: "#7e22ce",
    emoji: "💻",
    bookmarks: [
      {
        name: "GitHub",
        link: "https://github.com/",
        logo: fav("github.com"),
        order: 0,
      },
      {
        name: "Stack Overflow",
        link: "https://stackoverflow.com/",
        logo: fav("stackoverflow.com"),
        order: 1,
      },
      {
        name: "LeetCode",
        link: "https://leetcode.com/",
        logo: fav("leetcode.com"),
        order: 2,
      },
      {
        name: "MDN Web Docs",
        link: "https://developer.mozilla.org/",
        logo: fav("developer.mozilla.org"),
        order: 3,
      },
    ],
  },
  {
    ...UNCATEGORIZED_CATEGORY,
    bookmarks: [],
  },
];

const createDefaultBookmarks = async (userId) => {
  for (const [index, categoryData] of defaultCategories.entries()) {
    const { bookmarks, ...categoryFields } = categoryData;

    const category = await Category.create({
      userId,
      ...categoryFields,
      order: index,
    });

    if (bookmarks.length > 0) {
      await Bookmark.insertMany(
        bookmarks.map((b) => ({ categoryId: category._id, ...b })),
      );
    }
  }
};

export default createDefaultBookmarks;
