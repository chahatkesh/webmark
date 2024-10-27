import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateCategory } from "../../hooks/useBookmarks";
import EmojiPicker from "emoji-picker-react"; // Direct import for React projects

const defaultBgColors = [
  "#fdf2f8",
  "#f0fdf4",
  "#faf5ff",
  "#fffbeb",
  "#f7fee7",
  "#fff1f2",
  "#ecfeff",
  "#fff7ed",
];
const defaultHColors = [
  "#be185d",
  "#15803d",
  "#7e22ce",
  "#b45309",
  "#4d7c0f",
  "#be123c",
  "#0e7490",
  "#c2410c",
];

const AddCategoryDialog = ({ open, onClose }) => {
  const createCategory = useCreateCategory();
  const [formData, setFormData] = useState({
    category: "",
    bgcolor: "#fdf2f8",
    hcolor: "#be185d",
    emoji: "📌",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategory.mutateAsync(formData);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmojiClick = (emoji) => {
    setFormData({ ...formData, emoji: emoji.emoji });
    setShowEmojiPicker(false);
  };

  const handleColorChange = (colorType, color) => {
    setFormData({ ...formData, [colorType]: color });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl p-8 shadow-lg bg-white w-[95vw] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Add New Category
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-3">
            {/* emoji */}
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
                  <div className="absolute left-2 top-[40%]">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>
            </div>
            {/* category */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-600">
                Category Name
              </label>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                className="w-full mt-2 p-2 rounded-lg border border-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Background Color
            </label>
            <div className="flex items-center mt-2 space-x-3">
              {defaultBgColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-6 h-6 md:w-10 md:h-10 shadow-md rounded-full cursor-pointer ${
                    formData.bgcolor === color
                      ? "ring-2 ring-offset-2 ring-blue-500"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange("bgcolor", color)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Heading Color
            </label>
            <div className="flex items-center mt-2 space-x-3">
              {defaultHColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-6 h-6 md:w-10 md:h-10 shadow-md rounded-full cursor-pointer ${
                    formData.hcolor === color
                      ? "ring-2 ring-offset-2 ring-blue-500"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange("hcolor", color)}
                />
              ))}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Add Category
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
