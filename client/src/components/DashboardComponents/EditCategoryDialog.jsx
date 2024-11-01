import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUpdateCategory } from "../../hooks/useBookmarks";
import EmojiPicker from "emoji-picker-react";

const colorThemes = {
  Nature: [
    {
      name: "Forest",
      bg: "#f0fdf4",
      h: "#15803d",
      preview: "Peaceful green theme",
    },
    {
      name: "Ocean",
      bg: "#ecfeff",
      h: "#0e7490",
      preview: "Calming blue theme",
    },
    {
      name: "Lavender",
      bg: "#faf5ff",
      h: "#7e22ce",
      preview: "Soft purple theme",
    },
  ],
  Warm: [
    {
      name: "Sunset",
      bg: "#fff7ed",
      h: "#c2410c",
      preview: "Warm orange theme",
    },
    {
      name: "Rose",
      bg: "#fdf2f8",
      h: "#be185d",
      preview: "Gentle pink theme",
    },
    {
      name: "Crimson",
      bg: "#fff1f2",
      h: "#be123c",
      preview: "Bold red theme",
    },
  ],
  Classic: [
    {
      name: "Golden",
      bg: "#fffbeb",
      h: "#b45309",
      preview: "Rich amber theme",
    },
    {
      name: "Sage",
      bg: "#f7fee7",
      h: "#4d7c0f",
      preview: "Fresh lime theme",
    },
  ],
};

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

  useEffect(() => {
    if (category) {
      setFormData({
        category: category.category,
        bgcolor: category.bgcolor,
        hcolor: category.hcolor,
        emoji: category.emoji,
        themeName: findThemeName(category.bgcolor, category.hcolor),
      });
    }
  }, [category]);

  const findThemeName = (bg, h) => {
    for (const category of Object.values(colorThemes)) {
      const theme = category.find((t) => t.bg === bg && t.h === h);
      if (theme) return theme.name;
    }
    return "Rose"; // Default theme
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    for (const [category, themes] of Object.entries(colorThemes)) {
      const theme = themes.find((t) => t.name === formData.themeName);
      if (theme) return { ...theme, category };
    }
    return null;
  };

  const currentTheme = getCurrentTheme();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl p-8 shadow-lg bg-white w-full max-w-[95vw] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Edit Category
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-3">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Icon
              </label>
              <div className="flex items-center mt-2">
                <button
                  type="button"
                  className="text-md py-[7px] px-3 rounded-md border border-gray-300 cursor-pointer"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  {formData.emoji}
                </button>
                {showEmojiPicker && (
                  <div className="absolute left-[6%] sm:left-[6%] top-[32%] sm:top-[34%] z-50">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>
            </div>
            <div className="w-full sm:w-auto flex-grow">
              <label className="block text-sm font-medium text-gray-600">
                Category Name
              </label>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                className="w-full mt-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-4">
              Color Theme
            </label>
            <div className="flex flex-wrap gap-4">
              {Object.entries(colorThemes).map(([category, themes]) => (
                <div key={category} className="flex items-center space-x-3">
                  {themes.map((theme) => (
                    <div
                      key={theme.name}
                      onClick={() => handleThemeChange(theme)}
                      className={`relative w-8 h-8 shadow-lg rounded-full cursor-pointer transition-all
                        ${
                          formData.themeName === theme.name
                            ? "ring-2 ring-blue-500"
                            : "ring-2 ring-white"
                        }`}
                      style={{ backgroundColor: theme.h }}
                      title={theme.name}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>

        {/* Preview */}
        <div className="mt-6 rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-3 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-600">Preview</div>
            {currentTheme && (
              <div className="hidden md:block text-xs text-gray-500 mt-1">
                {currentTheme.preview} - {currentTheme.category} collection
              </div>
            )}
          </div>
          <div className="p-4">
            <div
              className="p-3 rounded-lg flex items-center space-x-2"
              style={{ backgroundColor: formData.bgcolor }}>
              <span className="text-xl">{formData.emoji}</span>
              <span className="font-medium" style={{ color: formData.hcolor }}>
                {formData.category || "Category Name"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
