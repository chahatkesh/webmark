import Bookmark from "../models/bookmarkModel.js";
import Category from "../models/categoryModel.js";
import User from "../models/userModel.js";
import {
  generateTaxonomy,
  assignToCategories,
  categorizeSingle,
} from "../utils/aiCategorizer.js";
import { findUncategorizedCategory } from "../utils/uncategorizedCategory.js";

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
 * Bulk AI sort — reorganize bookmarks using two-pass approach.
 * Body: { mode: "all" | "uncategorized" }
 */
export const aiSortBookmarks = async (req, res) => {
  try {
    const userId = req.body.userId;
    const sortMode =
      req.body.mode === "uncategorized" ? "uncategorized" : "all";

    // 0. Check credits
    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    const sortsLeft = user.aiSortsRemaining ?? 5;
    if (sortsLeft <= 0) {
      return res.json({
        success: false,
        message:
          "You've used all your AI Sort credits. Import bookmarks to earn more (up to 2 per month).",
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

    const uncategorizedCat = findUncategorizedCategory(categories);
    let bookmarksToSort = allBookmarks;

    if (sortMode === "uncategorized") {
      if (!uncategorizedCat) {
        return res.json({
          success: false,
          message: "No Uncategorized category found.",
        });
      }

      bookmarksToSort = allBookmarks.filter(
        (b) => b.categoryId.toString() === uncategorizedCat._id.toString(),
      );

      if (bookmarksToSort.length === 0) {
        return res.json({
          success: false,
          message: "No uncategorized bookmarks to sort.",
        });
      }
    }

    // 1.5 Save snapshot for revert
    user.aiSortSnapshot = {
      mode: sortMode,
      bookmarks: bookmarksToSort.map((b) => ({
        bookmarkId: b._id,
        categoryId: b.categoryId,
        order: b.order,
      })),
      categories: categories.map((c) => ({
        categoryId: c._id,
        category: c.category,
        emoji: c.emoji,
        bgcolor: c.bgcolor,
        hcolor: c.hcolor,
        order: c.order,
      })),
      createdAt: new Date(),
    };

    const existingCatNames = categories.map((c) => c.category);

    // 2. Pass 1 — build taxonomy
    let taxonomy;
    if (sortMode === "uncategorized") {
      const targetCatNames = categories
        .filter((c) => c.category.toLowerCase() !== "uncategorized")
        .map((c) => c.category);

      if (targetCatNames.length === 0) {
        taxonomy = await generateTaxonomy(
          bookmarksToSort.map((b) => b.name),
          [],
        );
      } else {
        taxonomy = targetCatNames;
      }
    } else {
      taxonomy = await generateTaxonomy(
        bookmarksToSort.map((b) => b.name),
        existingCatNames,
      );
    }

    // 3. Pass 2 — assign each bookmark
    const assignments = await assignToCategories(bookmarksToSort, taxonomy);

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
    // First, collect assignments per category
    const categoryAssignments = {};
    for (const assignment of assignments) {
      const bookmark = bookmarksToSort[assignment.index];
      if (!bookmark) continue;

      const catKey = assignment.category.toLowerCase();
      const targetCat = catMap[catKey];
      if (!targetCat) continue;

      if (!categoryAssignments[catKey]) {
        categoryAssignments[catKey] = { cat: targetCat, bookmarks: [] };
      }
      categoryAssignments[catKey].bookmarks.push(bookmark);
    }

    // Split categories with > 10 bookmarks (full sort only)
    const MAX_PER_CATEGORY = 10;
    if (sortMode === "all") {
      for (const [catKey, data] of Object.entries(categoryAssignments)) {
        if (data.bookmarks.length <= MAX_PER_CATEGORY) continue;

        const chunks = [];
        for (let i = 0; i < data.bookmarks.length; i += MAX_PER_CATEGORY) {
          chunks.push(data.bookmarks.slice(i, i + MAX_PER_CATEGORY));
        }

        categoryAssignments[catKey].bookmarks = chunks[0];

        for (let c = 1; c < chunks.length; c++) {
          const splitName = `${data.cat.category} ${c + 1}`;
          const splitKey = splitName.toLowerCase();

          if (!catMap[splitKey]) {
            maxOrder++;
            const colorIdx = (categoriesCreated + c) % COLORS.length;
            const newCat = await Category.create({
              userId,
              category: splitName,
              emoji: data.cat.emoji || pickEmoji(splitName),
              bgcolor: COLORS[colorIdx].bgcolor,
              hcolor: COLORS[colorIdx].hcolor,
              order: maxOrder,
            });
            catMap[splitKey] = newCat;
            categoriesCreated++;
          }

          categoryAssignments[splitKey] = {
            cat: catMap[splitKey],
            bookmarks: chunks[c],
          };
        }
      }
    }

    // Move bookmarks to assigned categories
    if (sortMode === "uncategorized") {
      for (const data of Object.values(categoryAssignments)) {
        const existingBookmarks = await Bookmark.find({
          categoryId: data.cat._id,
          _id: { $nin: data.bookmarks.map((b) => b._id) },
        })
          .sort("order")
          .lean();

        let startOrder = existingBookmarks.length
          ? existingBookmarks[existingBookmarks.length - 1].order + 1
          : 0;

        for (let i = 0; i < data.bookmarks.length; i++) {
          const bookmark = data.bookmarks[i];
          await Bookmark.findByIdAndUpdate(bookmark._id, {
            categoryId: data.cat._id,
            order: startOrder + i,
          });
          bookmarksMoved++;
        }
      }
    } else {
      for (const data of Object.values(categoryAssignments)) {
        for (let i = 0; i < data.bookmarks.length; i++) {
          const bookmark = data.bookmarks[i];
          const needsMove =
            bookmark.categoryId.toString() !== data.cat._id.toString();
          if (needsMove) {
            await Bookmark.findByIdAndUpdate(bookmark._id, {
              categoryId: data.cat._id,
              order: i,
            });
            bookmarksMoved++;
          } else {
            await Bookmark.findByIdAndUpdate(bookmark._id, { order: i });
          }
        }
      }
    }

    // 6. Cleanup empty categories
    const updatedCats = await Category.find({ userId }).lean();
    let categoriesRemoved = 0;
    const snapshotCatIds = new Set(
      user.aiSortSnapshot.categories.map((c) => c.categoryId.toString()),
    );

    for (const cat of updatedCats) {
      const count = await Bookmark.countDocuments({ categoryId: cat._id });
      if (count > 0) continue;

      if (sortMode === "uncategorized") {
        if (!snapshotCatIds.has(cat._id.toString())) {
          await Category.findByIdAndDelete(cat._id);
          categoriesRemoved++;
        }
        continue;
      }

      await Category.findByIdAndDelete(cat._id);
      categoriesRemoved++;
    }

    // 6.5 Reorder split siblings (full sort only)
    if (sortMode === "all") {
      const finalCats = await Category.find({ userId })
        .lean()
        .sort({ order: 1 });
      const splitChildPattern = /^(.+)\s(\d+)$/;
      const baseNames = new Set(finalCats.map((c) => c.category.toLowerCase()));
      const baseCats = [];
      const splitMap = {};

      for (const cat of finalCats) {
        const match = cat.category.match(splitChildPattern);
        if (match) {
          const base = match[1].toLowerCase();
          const num = parseInt(match[2], 10);
          if (baseNames.has(base) && num >= 2) {
            if (!splitMap[base]) splitMap[base] = [];
            splitMap[base].push({ cat, num });
            continue;
          }
        }
        baseCats.push(cat);
      }

      const orderedList = [];
      for (const base of baseCats) {
        orderedList.push(base);
        const splits = (splitMap[base.category.toLowerCase()] || [])
          .sort((a, b) => a.num - b.num)
          .map((s) => s.cat);
        orderedList.push(...splits);
      }

      const orderUpdates = orderedList.map((cat, idx) =>
        Category.findByIdAndUpdate(cat._id, { order: idx }),
      );
      await Promise.all(orderUpdates);
    }

    // 7. Decrement credits
    user.aiSortsRemaining = sortsLeft - 1;
    await user.save();

    res.json({
      success: true,
      results: {
        sortMode,
        taxonomy,
        categoriesCreated,
        categoriesRemoved,
        bookmarksMoved,
        totalBookmarks: bookmarksToSort.length,
        aiSortsRemaining: user.aiSortsRemaining,
        canRevert: true,
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
 * POST /api/bookmarks/ai/sort/revert
 * Reverts the last AI sort by restoring the snapshot.
 */
export const revertAISort = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    const snapshot = user.aiSortSnapshot;
    if (!snapshot || !snapshot.bookmarks || snapshot.bookmarks.length === 0) {
      return res.json({
        success: false,
        message:
          "No sort to revert. You can only revert the most recent AI sort.",
      });
    }

    // 1. Restore categories that existed before the sort
    const snapshotCatIds = new Set(
      snapshot.categories.map((c) => c.categoryId.toString()),
    );
    const currentCats = await Category.find({ userId }).lean();
    const currentCatIds = new Set(currentCats.map((c) => c._id.toString()));

    // Recreate categories that were deleted during the sort
    for (const snapCat of snapshot.categories) {
      if (!currentCatIds.has(snapCat.categoryId.toString())) {
        await Category.create({
          _id: snapCat.categoryId,
          userId,
          category: snapCat.category,
          emoji: snapCat.emoji,
          bgcolor: snapCat.bgcolor,
          hcolor: snapCat.hcolor,
          order: snapCat.order,
        });
      }
    }

    // 2. Move all bookmarks back to their original categories
    for (const snap of snapshot.bookmarks) {
      await Bookmark.findByIdAndUpdate(snap.bookmarkId, {
        categoryId: snap.categoryId,
        order: snap.order,
      });
    }

    // 3. Remove categories created by the sort that didn't exist before
    const postRevertCats = await Category.find({ userId }).lean();
    for (const cat of postRevertCats) {
      if (!snapshotCatIds.has(cat._id.toString())) {
        const count = await Bookmark.countDocuments({ categoryId: cat._id });
        if (count === 0) {
          await Category.findByIdAndDelete(cat._id);
        }
      }
    }

    // 4. Clear the snapshot so revert can only be done once
    user.aiSortSnapshot = undefined;
    await user.save();

    res.json({ success: true, message: "AI Sort reverted successfully." });
  } catch (error) {
    console.error("AI sort revert error:", error);
    res.json({ success: false, message: "Revert failed: " + error.message });
  }
};

/**
 * Pick the best category for exactly one bookmark (bookmarklet only).
 * Makes a single categorizeSingle() call — never runs bulk AI sort.
 */
export async function pickCategoryForSingleBookmark(name, link, categories) {
  if (!categories.length) return null;

  const fallback =
    findUncategorizedCategory(categories) || categories[categories.length - 1];

  if (categories.length === 1) return categories[0];

  if (!process.env.OPENAI_API_KEY) return fallback;

  const catNames = categories.map((c) => c.category);
  const bestCategory = await categorizeSingle(name, link, catNames);
  if (!bestCategory) return fallback;

  const normalized = String(bestCategory).trim().toLowerCase();
  if (
    normalized === "uncategorized" ||
    normalized === "none" ||
    normalized === "other"
  ) {
    return findUncategorizedCategory(categories) || fallback;
  }

  const targetCat = categories.find(
    (c) => c.category.toLowerCase() === normalized,
  );
  return targetCat || fallback;
}

export const pickCategoryForBookmark = pickCategoryForSingleBookmark;
