import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateCategory } from "../../hooks/useBookmarks";

const AddCategoryDialog = ({ open, onClose }) => {
  const createCategory = useCreateCategory();
  const [formData, setFormData] = React.useState({
    category: "",
    bgcolor: "#ecfeff",
    hcolor: "#0e7490",
    emoji: "📑",
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Category Name</label>
            <Input
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Bg Color</label>
              <Input
                type="color"
                value={formData.bgcolor}
                onChange={(e) =>
                  setFormData({ ...formData, bgcolor: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Header Color</label>
              <Input
                type="color"
                value={formData.hcolor}
                onChange={(e) =>
                  setFormData({ ...formData, hcolor: e.target.value })
                }
              />
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
