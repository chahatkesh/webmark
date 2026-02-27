import Bookmark from "../models/bookmarkModel.js";
import Category from "../models/categoryModel.js";

// Get all bookmarks for a category
export const getBookmarks = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Verify category belongs to user
    const category = await Category.findOne({
      _id: categoryId,
      userId: req.body.userId
    });

    if (!category) {
      return res.json({ success: false, message: "Category not found" });
    }

    const bookmarks = await Bookmark.find({ categoryId })
      .sort('order');
    res.json({ success: true, bookmarks });
  } catch (error) {
    res.json({ success: false, message: "Error fetching bookmarks" });
  }
};

// Create new bookmark
export const createBookmark = async (req, res) => {
  try {
    const { categoryId, name, link, logo, notes } = req.body;

    // Verify category belongs to user
    const category = await Category.findOne({
      _id: categoryId,
      userId: req.body.userId
    });

    if (!category) {
      return res.json({ success: false, message: "Category not found" });
    }

    // Get highest order number
    const lastBookmark = await Bookmark.findOne({ categoryId })
      .sort('-order');
    const order = lastBookmark ? lastBookmark.order + 1 : 0;

    const newBookmark = new Bookmark({
      categoryId,
      name,
      link,
      logo,
      notes: notes || "",
      order
    });

    await newBookmark.save();
    res.json({ success: true, bookmark: newBookmark });
  } catch (error) {
    res.json({ success: false, message: "Error creating bookmark" });
  }
};

// Update bookmark
export const updateBookmark = async (req, res) => {
  try {
    const { bookmarkId, name, link, logo, notes } = req.body;

    const bookmark = await Bookmark.findById(bookmarkId);
    if (!bookmark) {
      return res.json({ success: false, message: "Bookmark not found" });
    }

    // Verify category belongs to user
    const category = await Category.findOne({
      _id: bookmark.categoryId,
      userId: req.body.userId
    });

    if (!category) {
      return res.json({ success: false, message: "Not authorized" });
    }

    const updatedBookmark = await Bookmark.findByIdAndUpdate(
      bookmarkId,
      { name, link, logo, notes },
      { new: true }
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
      userId: req.body.userId
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
      userId: req.body.userId
    });

    if (!category) {
      return res.json({ success: false, message: "Category not found" });
    }

    // Update each bookmark's order
    const updatePromises = bookmarks.map(({ id, order }) =>
      Bookmark.findByIdAndUpdate(id, { order })
    );

    await Promise.all(updatePromises);

    res.json({ success: true, message: "Bookmark order updated successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error updating bookmark order" });
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

    const results = { categoriesCreated: 0, bookmarksCreated: 0, skipped: 0 };

    for (const folder of folders) {
      if (!folder.name || !Array.isArray(folder.bookmarks) || folder.bookmarks.length === 0) {
        results.skipped++;
        continue;
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
      const lastBm = await Bookmark.findOne({ categoryId: category._id }).sort("-order");
      let order = lastBm ? lastBm.order + 1 : 0;

      const docs = folder.bookmarks
        .filter(bm => bm.link && bm.name)
        .map(bm => ({
          categoryId: category._id,
          name: bm.name,
          link: bm.link,
          logo: bm.logo || `https://www.google.com/s2/favicons?domain=${new URL(bm.link).hostname}&sz=128`,
          order: order++,
        }));

      if (docs.length > 0) {
        await Bookmark.insertMany(docs, { ordered: false });
        results.bookmarksCreated += docs.length;
      }
    }

    res.json({ success: true, results });
  } catch (error) {
    console.error("Import error:", error);
    res.json({ success: false, message: "Import failed", error: error.message });
  }
};