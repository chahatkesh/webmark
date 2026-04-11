import Bookmark from "../models/bookmarkModel.js";
import Category from "../models/categoryModel.js";
import User from "../models/userModel.js";
import {
  generateTaxonomy,
  assignToCategories,
  categorizeSingle,
} from "../utils/aiCategorizer.js";

// Emoji lookup for auto-generated categories
const EMOJI_MAP = {
  "ai tools": "🤖",
  "artificial intelligence": "🤖",
  "machine learning": "🧠",
  social: "📱",
  "social media": "📱",
  news: "📰",
  security: "🔒",
  cybersecurity: "🛡️",
  development: "💻",
  "dev tools": "🛠️",
  programming: "👨‍💻",
  coding: "👨‍💻",
  flutter: "🦋",
  dart: "🎯",
  "mobile dev": "📲",
  design: "🎨",
  "ui/ux": "🎨",
  learning: "📚",
  education: "🎓",
  courses: "📖",
  productivity: "⚡",
  tools: "🔧",
  utilities: "🔧",
  "system design": "🏗️",
  architecture: "🏗️",
  finance: "💰",
  work: "💼",
  entertainment: "🎮",
  reference: "📑",
  documentation: "📄",
  "web development": "🌐",
  frontend: "🌐",
  backend: "⚙️",
  uncategorized: "📂",
};

function pickEmoji(name) {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(key) || key.includes(lower)) return emoji;
  }
  return "📑";
}

// Color palette for auto-generated categories
const COLORS = [
  { bgcolor: "#f7fee7", hcolor: "#4d7c0f" },
  { bgcolor: "#eff6ff", hcolor: "#1d4ed8" },
  { bgcolor: "#fef2f2", hcolor: "#b91c1c" },
  { bgcolor: "#fefce8", hcolor: "#a16207" },
  { bgcolor: "#f0fdf4", hcolor: "#15803d" },
  { bgcolor: "#faf5ff", hcolor: "#7e22ce" },
  { bgcolor: "#fff7ed", hcolor: "#c2410c" },
  { bgcolor: "#f0f9ff", hcolor: "#0369a1" },
  { bgcolor: "#fdf2f8", hcolor: "#be185d" },
  { bgcolor: "#ecfdf5", hcolor: "#047857" },
  { bgcolor: "#fefce8", hcolor: "#854d0e" },
  { bgcolor: "#f5f3ff", hcolor: "#6d28d9" },
];

/**
 * POST /api/bookmarks/ai/sort
 * Bulk AI sort — reorganize all user bookmarks using two-pass approach.
 */
export const aiSortBookmarks = async (req, res) => {
  try {
    const userId = req.body.userId;

    // 0. Check credits
    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    const sortsLeft = user.aiSortsRemaining ?? 5;
    if (sortsLeft <= 0) {
      return res.json({
        success: false,
        message: "You've used all your AI Sort credits. Import bookmarks to earn more (up to 2 per month).",
        aiSortsRemaining: 0,
      });
    }

    // 1. Gather everything
    const categories = await Category.find({ userId }).lean();
    const categoryIds = categories.map((c) => c._id);
    const allBookmarks = await Bookmark.find({
      categoryId: { $in: categoryIds },
    }).lean();

    if (allBookmarks.length === 0) {
      return res.json({ success: false, message: "No bookmarks to sort" });
    }

    const existingCatNames = categories.map((c) => c.category);

    // 2. Pass 1 — generate taxonomy
    const titles = allBookmarks.map((b) => b.name);
    const taxonomy = await generateTaxonomy(titles, existingCatNames);

    // 3. Pass 2 — assign each bookmark
    const assignments = await assignToCategories(allBookmarks, taxonomy);

    // 4. Ensure all taxonomy categories exist
    const catMap = {};
    for (const cat of categories) {
      catMap[cat.category.toLowerCase()] = cat;
    }

    let categoriesCreated = 0;
    let bookmarksMoved = 0;
    let maxOrder = categories.reduce((m, c) => Math.max(m, c.order || 0), 0);

    for (const catName of taxonomy) {
      if (!catMap[catName.toLowerCase()]) {
        maxOrder++;
        const colorIdx = categoriesCreated % COLORS.length;
        const newCat = await Category.create({
          userId,
          category: catName,
          emoji: pickEmoji(catName),
          bgcolor: COLORS[colorIdx].bgcolor,
          hcolor: COLORS[colorIdx].hcolor,
          order: maxOrder,
        });
        catMap[catName.toLowerCase()] = newCat;
        categoriesCreated++;
      }
    }

    // 5. Move bookmarks to assigned categories
    for (const assignment of assignments) {
      const bookmark = allBookmarks[assignment.index];
      if (!bookmark) continue;

      const targetCat = catMap[assignment.category.toLowerCase()];
      if (!targetCat) continue;

      if (bookmark.categoryId.toString() !== targetCat._id.toString()) {
        await Bookmark.findByIdAndUpdate(bookmark._id, {
          categoryId: targetCat._id,
        });
        bookmarksMoved++;
      }
    }

    // 6. Cleanup — remove categories that are now empty
    const updatedCats = await Category.find({ userId }).lean();
    let categoriesRemoved = 0;
    for (const cat of updatedCats) {
      const count = await Bookmark.countDocuments({ categoryId: cat._id });
      if (count === 0) {
        await Category.findByIdAndDelete(cat._id);
        categoriesRemoved++;
      }
    }

    // 7. Decrement credits
    user.aiSortsRemaining = sortsLeft - 1;
    await user.save();

    res.json({
      success: true,
      results: {
        taxonomy,
        categoriesCreated,
        categoriesRemoved,
        bookmarksMoved,
        totalBookmarks: allBookmarks.length,
        aiSortsRemaining: user.aiSortsRemaining,
      },
    });
  } catch (error) {
    console.error("AI sort error:", error);
    res.json({
      success: false,
      message: error.message?.includes("OPENAI_API_KEY")
        ? "OpenAI API key not configured. Add OPENAI_API_KEY to your server .env file."
        : "AI sorting failed: " + error.message,
    });
  }
};

/**
 * Auto-categorize a single bookmark after save (fire-and-forget).
 * NOT a route handler — called internally from createBookmark.
 */
export async function autoCategorizeSingle(bookmarkId, userId) {
  try {
    if (!process.env.OPENAI_API_KEY) return; // silently skip if no key

    const bookmark = await Bookmark.findById(bookmarkId);
    if (!bookmark) return;

    const categories = await Category.find({ userId }).lean();
    if (categories.length <= 1) return; // no point with only 1 category

    const catNames = categories.map((c) => c.category);
    const bestCategory = await categorizeSingle(
      bookmark.name,
      bookmark.link,
      catNames
    );

    if (!bestCategory) return;

    const targetCat = categories.find(
      (c) => c.category.toLowerCase() === bestCategory.toLowerCase()
    );
    if (!targetCat) return;

    // Only move if different from current
    if (bookmark.categoryId.toString() !== targetCat._id.toString()) {
      const lastBm = await Bookmark.findOne({
        categoryId: targetCat._id,
      }).sort("-order");
      const order = lastBm ? lastBm.order + 1 : 0;

      await Bookmark.findByIdAndUpdate(bookmarkId, {
        categoryId: targetCat._id,
        order,
      });
      console.log(`AI: Moved "${bookmark.name}" → "${targetCat.category}"`);
    }
  } catch (error) {
    // Non-fatal — bookmark stays where it was originally saved
    console.error("AI auto-categorize failed (non-fatal):", error.message);
  }
}
