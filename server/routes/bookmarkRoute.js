import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from "../controllers/categoryController.js";
import {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  reorderBookmarks,
  reorderBookmarkLayout,
  importBookmarks,
  bookmarkletSave,
} from "../controllers/bookmarkController.js";
import { aiSortBookmarks, revertAISort } from "../controllers/aiController.js";
import authMiddleware from "../middleware/authmiddleware.js";
import bookmarkletAuthMiddleware from "../middleware/bookmarkletAuth.js";
import { aiRateLimit, importRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

// Bookmarklet popup save — handled entirely on the server
router.get("/save", bookmarkletAuthMiddleware, bookmarkletSave);

// Category routes
router.get("/categories", authMiddleware, getCategories);
router.get("/categories-with-bookmarks", authMiddleware, getCategories);
router.post("/category", authMiddleware, createCategory);
router.put("/category", authMiddleware, updateCategory);
router.put("/categories/reorder", authMiddleware, reorderCategories);
router.delete("/category", authMiddleware, deleteCategory);

// Bookmark routes
router.get("/bookmarks/:categoryId", authMiddleware, getBookmarks);
router.post("/bookmark", authMiddleware, createBookmark);
router.put("/bookmark", authMiddleware, updateBookmark);
router.delete("/bookmark", authMiddleware, deleteBookmark);
router.put("/reorder", authMiddleware, reorderBookmarks);
router.put("/reorder-layout", authMiddleware, reorderBookmarkLayout);
router.post("/import", authMiddleware, importRateLimit, importBookmarks);

// AI categorization
router.post("/ai/sort", authMiddleware, aiRateLimit, aiSortBookmarks);
router.post("/ai/sort/revert", authMiddleware, aiRateLimit, revertAISort);

export default router;
