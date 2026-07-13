import Bookmark from "../models/bookmarkModel.js";
import Category from "../models/categoryModel.js";
import User from "../models/userModel.js";
import createDefaultBookmarks from "../utils/defaultBookmarks.js";
import { pickCategoryForSingleBookmark } from "./aiController.js";
import { sendBookmarkletPage } from "../utils/bookmarkletPage.js";
import {
  isAllowedHttpUrl,
  isAllowedImageUrl,
  sanitizeHttpUrl,
  sanitizeImageUrl,
} from "../utils/urlValidation.js";
import {
  findUncategorizedCategory,
  getOrCreateUncategorizedCategory,
} from "../utils/uncategorizedCategory.js";

const MAX_IMPORT_FOLDERS = 50;
const MAX_BOOKMARKS_PER_FOLDER = 500;
const MAX_TOTAL_IMPORT_BOOKMARKS = 2000;

const normalizeBookmarkInput = ({ name, link, logo, notes = "" }) => {
  const safeLink = sanitizeHttpUrl(link);
  if (!safeLink) {
    return { error: "Bookmark link must be a valid http(s) URL" };
  }

  const safeLogo = logo ? sanitizeImageUrl(logo) : null;
  if (logo && !safeLogo) {
    return { error: "Bookmark logo must be a valid https URL" };
  }

  const safeName =
    typeof name === "string" && name.trim()
      ? name.trim().slice(0, 500)
      : safeLink;

  return {
    value: {
      name: safeName,
      link: safeLink,
      logo: safeLogo || undefined,
      notes: typeof notes === "string" ? notes.slice(0, 2000) : "",
    },
  };
};

const saveBookmarkToCategory = async ({
  userId,
  categoryId,
  name,
  link,
  logo,
  notes = "",
}) => {
  const normalized = normalizeBookmarkInput({ name, link, logo, notes });
  if (normalized.error) {
    return { success: false, message: normalized.error };
  }

  const category = await Category.findOne({ _id: categoryId, userId });
  if (!category) {
    return { success: false, message: "Category not found" };
  }

  const lastBookmark = await Bookmark.findOne({
    categoryId: category._id,
  }).sort("-order");
  const order = lastBookmark ? lastBookmark.order + 1 : 0;

  const bookmark = await Bookmark.create({
    categoryId: category._id,
    ...normalized.value,
    order,
  });

  return {
    success: true,
    bookmark,
    categoryName: category.category,
  };
};

/**
 * Bookmarklet-only save path.
 * Runs AI on exactly one incoming bookmark to pick a category — no bulk sort.
 */
const saveBookmarkViaBookmarklet = async ({ userId, name, link, logo }) => {
  const normalized = normalizeBookmarkInput({ name, link, logo });
  if (normalized.error) {
    return { success: false, message: normalized.error };
  }

  let categories = await Category.find({ userId }).sort("order");

  if (!categories.length) {
    const uncategorized = await getOrCreateUncategorizedCategory(userId);
    categories = [uncategorized];
  } else if (!findUncategorizedCategory(categories)) {
    const uncategorized = await getOrCreateUncategorizedCategory(userId);
    categories = [...categories, uncategorized];
  }

  const fallbackCategory =
    findUncategorizedCategory(categories) || categories[0];
  let targetCategory = fallbackCategory;

  try {
    targetCategory =
      (await pickCategoryForSingleBookmark(name, link, categories)) ||
      fallbackCategory;
  } catch (error) {
    console.error(
      "Bookmarklet AI category pick failed, using Uncategorized:",
      error.message,
    );
    targetCategory = fallbackCategory;
  }

  const lastBookmark = await Bookmark.findOne({
    categoryId: targetCategory._id,
  }).sort("-order");
  const order = lastBookmark ? lastBookmark.order + 1 : 0;

  const bookmark = await Bookmark.create({
    categoryId: targetCategory._id,
    ...normalized.value,
    order,
  });

  return {
    success: true,
    bookmark,
    categoryName: targetCategory.category,
  };
};

// Get all bookmarks for a category
export const getBookmarks = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Verify category belongs to user
    const category = await Category.findOne({
      _id: categoryId,
      userId: req.body.userId,
    });

    if (!category) {
      return res.json({ success: false, message: "Category not found" });
    }

    const bookmarks = await Bookmark.find({ categoryId }).sort("order");
    res.json({ success: true, bookmarks });
  } catch (error) {
    res.json({ success: false, message: "Error fetching bookmarks" });
  }
};

// Create new bookmark (dashboard — no AI, saves to the chosen category)
export const createBookmark = async (req, res) => {
  try {
    const { categoryId, name, link, logo, notes } = req.body;
    const result = await saveBookmarkToCategory({
      userId: req.body.userId,
      categoryId,
      name,
      link,
      logo,
      notes,
    });

    if (!result.success) {
      return res.json({ success: false, message: result.message });
    }

    res.json({
      success: true,
      bookmark: result.bookmark,
      categoryName: result.categoryName,
    });
  } catch (error) {
    res.json({ success: false, message: "Error creating bookmark" });
  }
};

// Bookmarklet popup — server-rendered, no frontend bundle
export const bookmarkletSave = async (req, res) => {
  try {
    const rawUrl = req.query.url;
    if (!rawUrl) {
      return sendBookmarkletPage(res, {
        status: "error",
        title: "Could not save",
        message: "Missing page URL. Please regenerate your bookmarklet.",
      });
    }

    const link = decodeURIComponent(rawUrl);
    if (!isAllowedHttpUrl(link)) {
      return sendBookmarkletPage(res, {
        status: "error",
        title: "Could not save",
        message: "Only http(s) page URLs can be saved.",
      });
    }

    const title = req.query.title ? decodeURIComponent(req.query.title) : link;
    const rawLogo = req.query.logo ? decodeURIComponent(req.query.logo) : "";
    const favicon = `https://www.google.com/s2/favicons?domain=${(() => {
      try {
        return new URL(link).hostname;
      } catch {
        return "";
      }
    })()}&sz=128`;
    const logo = rawLogo ? sanitizeImageUrl(rawLogo) || favicon : favicon;

    const result = await saveBookmarkViaBookmarklet({
      userId: req.body.userId,
      name: title,
      link,
      logo,
    });

    if (!result.success) {
      return sendBookmarkletPage(res, {
        status: "error",
        title: "Could not save",
        message: result.message || "Failed to save bookmark.",
      });
    }

    const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "");

    return sendBookmarkletPage(res, {
      status: "success",
      title: "Saved!",
      message: `Placed in ${result.categoryName}.`,
      autoCloseMs: 700,
      syncUrl: frontendUrl ? `${frontendUrl}/bookmarklet-sync` : null,
    });
  } catch (error) {
    console.error("Bookmarklet save error:", error);
    return sendBookmarkletPage(res, {
      status: "error",
      title: "Could not save",
      message: "Something went wrong while saving your bookmark.",
    });
  }
};

// Update bookmark
export const updateBookmark = async (req, res) => {
  try {
    const { bookmarkId, name, link, logo, notes, targetCategoryId } = req.body;

    const bookmark = await Bookmark.findById(bookmarkId);
    if (!bookmark) {
      return res.json({ success: false, message: "Bookmark not found" });
    }

    // Verify current category belongs to user
    const category = await Category.findOne({
      _id: bookmark.categoryId,
      userId: req.body.userId,
    });

    if (!category) {
      return res.json({ success: false, message: "Not authorized" });
    }

    const updates = {};
    if (name !== undefined) {
      updates.name =
        typeof name === "string" && name.trim()
          ? name.trim().slice(0, 500)
          : bookmark.name;
    }
    if (link !== undefined) {
      const safeLink = sanitizeHttpUrl(link);
      if (!safeLink) {
        return res.json({
          success: false,
          message: "Bookmark link must be a valid http(s) URL",
        });
      }
      updates.link = safeLink;
    }
    if (logo !== undefined) {
      const safeLogo = sanitizeImageUrl(logo);
      if (logo && !safeLogo) {
        return res.json({
          success: false,
          message: "Bookmark logo must be a valid https URL",
        });
      }
      updates.logo = safeLogo || undefined;
    }
    if (notes !== undefined) {
      updates.notes =
        typeof notes === "string" ? notes.slice(0, 2000) : bookmark.notes;
    }
    if (
      targetCategoryId !== undefined &&
      String(targetCategoryId) !== String(bookmark.categoryId)
    ) {
      const targetCategory = await Category.findOne({
        _id: targetCategoryId,
        userId: req.body.userId,
      });
      if (!targetCategory) {
        return res.json({
          success: false,
          message: "Target category not found",
        });
      }
      const lastBookmarkInTarget = await Bookmark.findOne({
        categoryId: targetCategoryId,
      }).sort("-order");
      updates.categoryId = targetCategoryId;
      updates.order = lastBookmarkInTarget ? lastBookmarkInTarget.order + 1 : 0;
    }

    const updatedBookmark = await Bookmark.findByIdAndUpdate(
      bookmarkId,
      updates,
      { new: true },
    );

    res.json({ success: true, bookmark: updatedBookmark });
  } catch (error) {
    res.json({ success: false, message: "Error updating bookmark" });
  }
};

// Delete bookmark
export const deleteBookmark = async (req, res) => {
  try {
    const { bookmarkId } = req.body;

    const bookmark = await Bookmark.findById(bookmarkId);
    if (!bookmark) {
      return res.json({ success: false, message: "Bookmark not found" });
    }

    // Verify category belongs to user
    const category = await Category.findOne({
      _id: bookmark.categoryId,
      userId: req.body.userId,
    });

    if (!category) {
      return res.json({ success: false, message: "Not authorized" });
    }

    await Bookmark.findByIdAndDelete(bookmarkId);
    res.json({ success: true, message: "Bookmark deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error deleting bookmark" });
  }
};

export const reorderBookmarks = async (req, res) => {
  try {
    const { categoryId, bookmarks } = req.body;

    // Verify category belongs to user
    const category = await Category.findOne({
      _id: categoryId,
      userId: req.body.userId,
    });

    if (!category) {
      return res.json({ success: false, message: "Category not found" });
    }

    // Update each bookmark's order, scoped to the verified category.
    await Bookmark.bulkWrite(
      bookmarks.map(({ id, order }) => ({
        updateOne: {
          filter: { _id: id, categoryId },
          update: { $set: { order } },
        },
      })),
    );

    res.json({ success: true, message: "Bookmark order updated successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error updating bookmark order" });
  }
};

export const reorderBookmarkLayout = async (req, res) => {
  try {
    const { categories } = req.body;
    const userId = req.body.userId;

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.json({ success: false, message: "Invalid layout payload" });
    }

    // 1. Verify every target category belongs to this user
    for (const { categoryId, bookmarks } of categories) {
      const category = await Category.findOne({ _id: categoryId, userId });
      if (!category) {
        return res.json({ success: false, message: "Category not found" });
      }
      if (!Array.isArray(bookmarks)) {
        return res.json({
          success: false,
          message: "Invalid bookmarks payload",
        });
      }
    }

    // 2. Collect all bookmark IDs referenced in the payload
    const allBookmarkIds = categories.flatMap(({ bookmarks }) =>
      bookmarks.map(({ id }) => id),
    );

    // 3. Verify all those bookmarks currently belong to a category owned by
    //    this user — prevents moving another user's bookmarks via crafted payload
    if (allBookmarkIds.length > 0) {
      const userCategoryIds = await Category.find({ userId }, "_id").then(
        (cats) => cats.map((c) => c._id),
      );
      const unauthorizedCount = await Bookmark.countDocuments({
        _id: { $in: allBookmarkIds },
        categoryId: { $nin: userCategoryIds },
      });
      if (unauthorizedCount > 0) {
        return res.json({ success: false, message: "Not authorized" });
      }
    }

    // 4. Bulk-update order AND categoryId so cross-category DnD moves persist
    const writes = categories.flatMap(({ categoryId, bookmarks }) =>
      bookmarks.map(({ id, order }) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { order, categoryId } },
        },
      })),
    );

    if (writes.length > 0) {
      await Bookmark.bulkWrite(writes);
    }

    res.json({
      success: true,
      message: "Bookmark layout updated successfully",
    });
  } catch (error) {
    res.json({ success: false, message: "Error updating bookmark layout" });
  }
};

// Bulk import bookmarks from browser export
// Body: { folders: [{ name, bookmarks: [{ name, link, logo }] }] }
export const importBookmarks = async (req, res) => {
  try {
    const { folders } = req.body;
    const userId = req.body.userId;

    if (!Array.isArray(folders) || folders.length === 0) {
      return res.json({ success: false, message: "No folders provided" });
    }

    if (folders.length > MAX_IMPORT_FOLDERS) {
      return res.json({
        success: false,
        message: `Imports are limited to ${MAX_IMPORT_FOLDERS} folders per request`,
      });
    }

    const totalIncomingBookmarks = folders.reduce(
      (sum, folder) =>
        sum + (Array.isArray(folder.bookmarks) ? folder.bookmarks.length : 0),
      0,
    );

    if (totalIncomingBookmarks > MAX_TOTAL_IMPORT_BOOKMARKS) {
      return res.json({
        success: false,
        message: `Imports are limited to ${MAX_TOTAL_IMPORT_BOOKMARKS} bookmarks per request`,
      });
    }

    // Check monthly import limit (max 2 imports per calendar month)
    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
    if (user.importBonusMonthKey !== monthKey) {
      user.importBonusUsedThisMonth = 0;
      user.importBonusMonthKey = monthKey;
    }

    if (user.importBonusUsedThisMonth >= 2) {
      return res.json({
        success: false,
        message:
          "You can only import bookmarks 2 times per month. Your limit resets at the start of next month.",
        aiSortsRemaining: user.aiSortsRemaining ?? 5,
      });
    }

    const results = { categoriesCreated: 0, bookmarksCreated: 0, skipped: 0 };

    for (const folder of folders) {
      if (
        !folder.name ||
        !Array.isArray(folder.bookmarks) ||
        folder.bookmarks.length === 0
      ) {
        results.skipped++;
        continue;
      }

      if (folder.bookmarks.length > MAX_BOOKMARKS_PER_FOLDER) {
        return res.json({
          success: false,
          message: `Each folder can include up to ${MAX_BOOKMARKS_PER_FOLDER} bookmarks`,
        });
      }

      // Reuse existing category with same name, or create a new one
      let category = await Category.findOne({ userId, category: folder.name });

      if (!category) {
        const lastCat = await Category.findOne({ userId }).sort("-order");
        category = await Category.create({
          userId,
          category: folder.name,
          order: lastCat ? lastCat.order + 1 : 0,
        });
        results.categoriesCreated++;
      }

      // Find current max order in this category
      const lastBm = await Bookmark.findOne({ categoryId: category._id }).sort(
        "-order",
      );
      let order = lastBm ? lastBm.order + 1 : 0;

      const docs = folder.bookmarks
        .filter((bm) => bm.link && bm.name)
        .map((bm) => {
          const safeLink = sanitizeHttpUrl(bm.link);
          if (!safeLink) return null;

          let safeLogo;
          if (bm.logo) {
            safeLogo = sanitizeImageUrl(bm.logo);
            if (!safeLogo) return null;
          } else {
            try {
              safeLogo = `https://www.google.com/s2/favicons?domain=${new URL(safeLink).hostname}&sz=128`;
            } catch {
              safeLogo = undefined;
            }
          }

          return {
            categoryId: category._id,
            name: String(bm.name).trim().slice(0, 500),
            link: safeLink,
            logo: safeLogo,
            order: order++,
          };
        })
        .filter(Boolean);

      if (docs.length > 0) {
        await Bookmark.insertMany(docs, { ordered: false });
        results.bookmarksCreated += docs.length;
      }
    }

    // Grant import bonus credit and record this import
    user.importBonusUsedThisMonth += 1;
    let importBonusGranted = false;
    const currentCredits = user.aiSortsRemaining ?? 5;
    if (currentCredits < 5) {
      user.aiSortsRemaining = currentCredits + 1;
      importBonusGranted = true;
    }
    await user.save();

    res.json({
      success: true,
      results,
      importBonusGranted,
      aiSortsRemaining: user.aiSortsRemaining ?? 5,
      importsRemainingThisMonth: 2 - user.importBonusUsedThisMonth,
    });
  } catch (error) {
    console.error("Import error:", error);
    res.json({
      success: false,
      message: "Import failed",
      error: error.message,
    });
  }
};
// Seed default categories + bookmarks for a user who has none
export const seedDefaultBookmarks = async (req, res) => {
  try {
    const userId = req.body.userId;

    // Prevent seeding if user already has categories
    const existing = await Category.countDocuments({ userId });
    if (existing > 0) {
      return res.json({
        success: false,
        message: "Categories already exist",
      });
    }

    await createDefaultBookmarks(userId);
    res.json({ success: true, message: "Default bookmarks created" });
  } catch (error) {
    console.error("Seed defaults error:", error);
    res.json({ success: false, message: "Failed to create default bookmarks" });
  }
};
