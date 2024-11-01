import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  reorderBookmarks,
} from "../controllers/bookmarkController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// Category routes
router.get("/categories", authMiddleware, getCategories);
router.post("/category", authMiddleware, createCategory);
router.put("/category", authMiddleware, updateCategory);
router.delete("/category", authMiddleware, deleteCategory);

// Bookmark routes
router.get("/bookmarks/:categoryId", authMiddleware, getBookmarks);
router.post("/bookmark", authMiddleware, createBookmark);
router.put("/bookmark", authMiddleware, updateBookmark);
router.delete("/bookmark", authMiddleware, deleteBookmark);
router.put("/reorder", authMiddleware, reorderBookmarks);

export default router;