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
    const { categoryId, name, link, logo } = req.body;

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
    const { bookmarkId, name, link, logo } = req.body;

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
      { name, link, logo },
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