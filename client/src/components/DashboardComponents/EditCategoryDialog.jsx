import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUpdateCategory } from "../../hooks/useBookmarks";
import EmojiPicker from "emoji-picker-react";

const colorThemes = {
  "Essential Colors": {
    Primary: [
      {
        name: "Royal Blue",
        bg: "#eef2ff",
        h: "#4f46e5",
        preview: "Webmark signature",
      },
      {
        name: "Deep Purple",
        bg: "#f5f3ff",
        h: "#7c3aed",
        preview: "Rich purple theme",
      },
      {
        name: "Ocean Blue",
        bg: "#f0f9ff",
        h: "#0369a1",
        preview: "Professional blue",
      },
      {
        name: "Indigo",
        bg: "#eef2ff",
        h: "#4338ca",
        preview: "Deep indigo theme",
      },
    ],
    Soft: [
      {
        name: "Rose",
        bg: "#fdf2f8",
        h: "#db2777",
        preview: "Gentle pink theme",
      },
      {
        name: "Mint",
        bg: "#ecfdf5",
        h: "#059669",
        preview: "Fresh mint theme",
      },
      {
        name: "Lavender",
        bg: "#f5f3ff",
        h: "#8b5cf6",
        preview: "Soft purple theme",
      },
      {
        name: "Sky",
        bg: "#f0f9ff",
        h: "#0ea5e9",
        preview: "Light blue theme",
      },
    ],
  },
  "Extended Palette": {
    Vibrant: [
      {
        name: "Amber",
        bg: "#fffbeb",
        h: "#d97706",
        preview: "Warm amber theme",
      },
      {
        name: "Ruby",
        bg: "#fef2f2",
        h: "#dc2626",
        preview: "Bold red theme",
      },
      {
        name: "Emerald",
        bg: "#ecfdf5",
        h: "#059669",
        preview: "Bright green theme",
      },
      {
        name: "Fuchsia",
        bg: "#fdf4ff",
        h: "#c026d3",
        preview: "Vibrant purple theme",
      },
    ],
    Neutral: [
      {
        name: "Slate",
        bg: "#f8fafc",
        h: "#475569",
        preview: "Professional gray theme",
      },
      {
        name: "Iron",
        bg: "#f9fafb",
        h: "#374151",
        preview: "Dark gray theme",
      },
      {
        name: "Sand",
        bg: "#fafaf9",
        h: "#78716c",
        preview: "Warm gray theme",
      },
      {
        name: "Steel",
        bg: "#f8fafc",
        h: "#64748b",
        preview: "Cool blue-gray theme",
      },
    ],
  },
};

const MAX_CATEGORY_LENGTH = 40;

const EditCategoryDialog = ({ open, onClose, category }) => {
  const updateCategory = useUpdateCategory();
  const [formData, setFormData] = useState({
    category: "",
    bgcolor: "",
    hcolor: "",
    emoji: "📌",
    themeName: "",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (category) {
      setFormData({
        category: category.category,
        bgcolor: category.bgcolor,
        hcolor: category.hcolor,
        emoji: category.emoji,
        themeName: findThemeName(category.bgcolor, category.hcolor),
      });
      setError("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [category]);

  const findThemeName = (bg, h) => {
    for (const categories of Object.values(colorThemes)) {
      for (const themes of Object.values(categories)) {
        const theme = themes.find((t) => t.bg === bg && t.h === h);
        if (theme) return theme.name;
      }
    }
    return "Royal Blue"; // Default theme
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value.length > MAX_CATEGORY_LENGTH) {
      setError(`Category name cannot exceed ${MAX_CATEGORY_LENGTH} characters`);
    } else {
      setError("");
    }
    setFormData({ ...formData, category: value.slice(0, MAX_CATEGORY_LENGTH) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category.trim()) return;

    setIsSubmitting(true);
    try {
      await updateCategory.mutateAsync({
        categoryId: category._id,
        ...formData,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmojiClick = (emoji) => {
    setFormData({ ...formData, emoji: emoji.emoji });
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleThemeChange = (theme) => {
    setFormData({
      ...formData,
      bgcolor: theme.bg,
      hcolor: theme.h,
      themeName: theme.name,
    });
  };

  const getCurrentTheme = () => {
    for (const [groupName, categories] of Object.entries(colorThemes)) {
      for (const [categoryName, themes] of Object.entries(categories)) {
        const theme = themes.find((t) => t.name === formData.themeName);
        if (theme)
          return { ...theme, category: categoryName, group: groupName };
      }
    }
    return null;
  };

  const currentTheme = getCurrentTheme();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl p-6 bg-white w-full max-w-[95vw] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900 text-center">
            Edit Category
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="flex space-x-3">
            {/* Emoji selector */}
            <div className="flex-shrink-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <button
                type="button"
                className="w-12 h-12 flex items-center justify-center text-md rounded-md border border-gray-200 bg-white hover:bg-gray-50"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                {formData.emoji}
              </button>
              {showEmojiPicker && (
                <div className="absolute z-50 left-0 sm:left-0 mt-2">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={300}
                    height={400}
                  />
                </div>
              )}
            </div>

            {/* Category name input */}
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <span
                  className={`text-xs ${
                    error ? "text-red-500" : "text-gray-500"
                  }`}>
                  {formData.category.length}/{MAX_CATEGORY_LENGTH}
                </span>
              </div>
              <Input
                ref={inputRef}
                value={formData.category}
                onChange={handleCategoryChange}
                placeholder="Enter category name..."
                className={`w-full h-12 px-4 bg-white border ${
                  error
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200"
                } rounded-md`}
              />
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Color Theme
            </label>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(colorThemes).map(([groupName, categories]) => (
                <div key={groupName}>
                  {Object.entries(categories).map(([categoryName, themes]) => (
                    <div key={categoryName} className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">
                        {categoryName}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {themes.map((theme) => (
                          <div key={theme.name} className="relative group">
                            <button
                              type="button"
                              onClick={() => handleThemeChange(theme)}
                              className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full transition-all
                                ${
                                  formData.themeName === theme.name
                                    ? "ring-2 ring-blue-500 ring-offset-2"
                                    : "hover:scale-110"
                                }`}
                              style={{ backgroundColor: theme.h }}></button>
                            <span
                              className="absolute hidden group-hover:block whitespace-nowrap 
                               left-1/2 -translate-x-1/2 -bottom-[13px] text-[10px] text-gray-600
                               pointer-events-none transition-opacity">
                              {theme.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-3 border-b border-gray-200">
              <div className="text-base font-medium text-gray-700">Preview</div>
              {currentTheme && (
                <div className="hidden md:block text-sm text-gray-500">
                  {currentTheme.preview} - {currentTheme.category} collection
                </div>
              )}
            </div>
            <div className="p-4">
              <div
                className="p-3 rounded-lg flex items-center space-x-2 max-w-full"
                style={{ backgroundColor: formData.bgcolor }}>
                <span className="text-xl flex-shrink-0">{formData.emoji}</span>
                <span
                  className="font-medium truncate flex-1 min-w-0"
                  style={{ color: formData.hcolor }}
                  title={formData.category || "Category Name"}>
                  {formData.category || "Category Name"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-12 text-base font-medium">
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-12 text-base font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              disabled={isSubmitting || !formData.category.trim() || !!error}>
              {isSubmitting ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
