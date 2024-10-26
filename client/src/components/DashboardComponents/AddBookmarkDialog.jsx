import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateBookmark } from "../../hooks/useBookmarks";

const AddBookmarkDialog = ({ open, onClose, categoryId }) => {
  const createBookmark = useCreateBookmark();
  const [formData, setFormData] = React.useState({
    name: "",
    link: "",
    logo: "",
    categoryId,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBookmark.mutateAsync(formData);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Bookmark</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Link</label>
            <Input
              type="url"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Logo URL</label>
            <Input
              type="url"
              value={formData.logo}
              onChange={(e) =>
                setFormData({ ...formData, logo: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Add Bookmark
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookmarkDialog;
