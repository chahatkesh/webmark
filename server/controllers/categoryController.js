import Category from "../models/categoryModel.js";
import Bookmark from "../models/bookmarkModel.js";

// Get all categories for a user with their bookmarks
export const getCategories = async (req, res) => {
  try {
    // Find all categories for the user
    const categories = await Category.find({ userId: req.body.userId })
      .sort("order")
      .lean(); // Using lean() for better performance

    // Get all bookmarks for these categories in one query
    const categoryIds = categories.map(cat => cat._id);
    const allBookmarks = await Bookmark.find({ categoryId: { $in: categoryIds } })
      .sort('order')
      .lean();

    // Group bookmarks by category
    const bookmarksByCategory = allBookmarks.reduce((acc, bookmark) => {
      if (!acc[bookmark.categoryId]) {
        acc[bookmark.categoryId] = [];
      }
      acc[bookmark.categoryId].push(bookmark);
      return acc;
    }, {});

    // Combine categories with their bookmarks
    const categoriesWithBookmarks = categories.map(category => ({
      ...category,
      bookmarks: bookmarksByCategory[category._id] || []
    }));

    res.json({ success: true, categories: categoriesWithBookmarks });
  } catch (error) {
    console.error("Error in getCategories:", error);
    res.json({ success: false, message: "Error fetching categories" });
  }
};

// Create new category
export const createCategory = async (req, res) => {
  try {
    const { category, bgcolor, hcolor, emoji } = req.body;

    // Get highest order number
    const lastCategory = await Category.findOne({
      userId: req.body.userId,
    }).sort("-order");
    const order = lastCategory ? lastCategory.order + 1 : 0;

    const newCategory = new Category({
      userId: req.body.userId,
      category,
      bgcolor,
      hcolor,
      emoji,
      order,
    });

    await newCategory.save();
    res.json({ success: true, category: newCategory });
  } catch (error) {
    res.json({ success: false, message: "Error creating category" });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { categoryId, category, bgcolor, hcolor, emoji } = req.body;

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: categoryId, userId: req.body.userId },
      { category, bgcolor, hcolor, emoji },
      { new: true }
    );

    if (!updatedCategory) {
      return res.json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, category: updatedCategory });
  } catch (error) {
    res.json({ success: false, message: "Error updating category" });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // Delete all bookmarks in the category first
    await Bookmark.deleteMany({ categoryId });

    await Category.findOneAndDelete({
      _id: categoryId,
      userId: req.body.userId,
    });

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error deleting category" });
  }
};