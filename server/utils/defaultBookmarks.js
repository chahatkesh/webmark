// utils/defaultBookmarks.js
import Category from "../models/categoryModel.js";
import Bookmark from "../models/bookmarkModel.js";

export const defaultCategories = [
  {
    category: "Social Media",
    bgcolor: "#eef2ff",
    hcolor: "#4f46e5",
    emoji: "🌐",
    bookmarks: [
      {
        name: "Twitter",
        link: "https://twitter.com/",
        logo: "https://www.google.com/s2/favicons?domain=twitter.com&sz=128",
        order: 0
      },
      {
        name: "LinkedIn",
        link: "https://www.linkedin.com/",
        logo: "https://www.google.com/s2/favicons?domain=www.linkedin.com&sz=128",
        order: 1
      },
      {
        name: "Instagram",
        link: "https://www.instagram.com/",
        logo: "https://www.google.com/s2/favicons?domain=www.instagram.com&sz=128",
        order: 2
      },
    ]
  },
  {
    category: "Productivity",
    bgcolor: "#ecfdf5",
    hcolor: "#059669",
    emoji: "⚡",
    bookmarks: [
      {
        name: "Gmail",
        link: "https://mail.google.com/mail/u/0/#inbox",
        logo: "https://cdn1.iconfinder.com/data/icons/google-new-logos-1/32/gmail_new_logo-512.png",
        order: 0
      },
      {
        name: "Google Calendar",
        link: "https://calendar.google.com",
        logo: "https://icon.horse/icon/calendar.google.com",
        order: 1
      },
      {
        name: "Notion",
        link: "https://notion.so",
        logo: "https://www.notion.so/images/favicon.ico",
        order: 2
      },
    ]
  },
  {
    category: "Entertainment",
    bgcolor: "#fffbeb",
    hcolor: "#b45309",
    emoji: "🎬",
    bookmarks: [
      {
        name: "YouTube",
        link: "https://youtube.com",
        logo: "https://www.google.com/s2/favicons?domain=youtube.com&sz=128",
        order: 0
      },
      {
        name: "Netflix",
        link: "https://netflix.com",
        logo: "https://www.google.com/s2/favicons?domain=netflix.com&sz=128",
        order: 1
      },
      {
        name: "Spotify",
        link: "https://spotify.com",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd-eHyIHkbiQ428WtDUb7s6dFnDK3CQ7YQog&s",
        order: 2
      }
    ]
  },
  {
    category: "Tools",
    bgcolor: "#fff1f2",
    hcolor: "#be123c",
    emoji: "📚",
    bookmarks: [
      {
        name: "Chat GPT",
        link: "https://chat.openai.com/",
        logo: "https://www.google.com/s2/favicons?domain=chat.openai.com&sz=128",
        order: 0
      },
      {
        name: "Claude AI",
        link: "https://claude.ai/new",
        logo: "https://www.google.com/s2/favicons?domain=claude.ai&sz=128",
        order: 1
      },
      {
        name: "Pinterest",
        link: "https://in.pinterest.com/",
        logo: "https://www.google.com/s2/favicons?domain=in.pinterest.com&sz=128",
        order: 2
      }
    ]
  },
  {
    category: "Let's Code",
    bgcolor: "#faf5ff",
    hcolor: "#7e22ce",
    emoji: "🐞",
    bookmarks: [
      {
        name: "Github",
        link: "https://github.com/",
        logo: "https://www.google.com/s2/favicons?domain=github.com&sz=128",
        order: 0
      },
      {
        name: "LeetCode",
        link: "https://leetcode.com/u/",
        logo: "https://www.google.com/s2/favicons?domain=leetcode.com&sz=128",
        order: 1
      },
      {
        name: "Geeksforgeeks",
        link: "https://www.geeksforgeeks.org/",
        logo: "https://www.google.com/s2/favicons?domain=www.geeksforgeeks.org&sz=128",
        order: 2
      }
    ]
  }
];

const createDefaultBookmarks = async (userId) => {
  try {
    for (const [index, categoryData] of defaultCategories.entries()) {
      const { bookmarks, ...categoryFields } = categoryData;

      // Create category
      const category = new Category({
        userId,
        ...categoryFields,
        order: index
      });
      await category.save();

      // Create bookmarks for this category
      const bookmarkPromises = bookmarks.map(bookmarkData => {
        const bookmark = new Bookmark({
          categoryId: category._id,
          ...bookmarkData
        });
        return bookmark.save();
      });

      await Promise.all(bookmarkPromises);
    }
    return true;
  } catch (error) {
    console.error('Error creating default bookmarks:', error);
    throw error;
  }
};

export default createDefaultBookmarks;