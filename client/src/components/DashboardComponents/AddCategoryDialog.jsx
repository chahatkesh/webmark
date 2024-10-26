import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateCategory } from "../../hooks/useBookmarks";

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
  const [formData, setFormData] = React.useState({
    category: "",
    bgcolor: "#fdf2f8",
    hcolor: "#be185d",
    emoji: "📌",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategory.mutateAsync(formData);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleBgColorClick = (color) => {
    setFormData({ ...formData, bgcolor: color });
  };

  const handleHColorClick = (color) => {
    setFormData({ ...formData, hcolor: color });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category Name</label>
            <Input
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            />
          </div>
          <div className="flex flex-col">
            <div>
              <label className="text-sm font-medium">Background Color</label>
              <div className="flex items-center space-x-2">
                {defaultBgColors.map((color) => (
                  <div
                    key={color}
                    className="w-12 h-6 cursor-pointer rounded-sm shadow-sm"
                    style={{ backgroundColor: color }}
                    onClick={() => handleBgColorClick(color)}
                  />
                ))}
                <Input
                  type="color"
                  value={formData.bgcolor}
                  onChange={(e) =>
                    setFormData({ ...formData, bgcolor: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Heading Color</label>
              <div className="flex items-center space-x-2">
                {defaultHColors.map((color) => (
                  <div
                    key={color}
                    className="w-12 h-6 cursor-pointer rounded-sm shadow-sm"
                    style={{ backgroundColor: color }}
                    onClick={() => handleHColorClick(color)}
                  />
                ))}
                <Input
                  type="color"
                  value={formData.hcolor}
                  onChange={(e) =>
                    setFormData({ ...formData, hcolor: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Emoji</label>
              <Input
                value={formData.emoji}
                onChange={(e) =>
                  setFormData({ ...formData, emoji: e.target.value })
                }
                placeholder="📑"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Add Category
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
