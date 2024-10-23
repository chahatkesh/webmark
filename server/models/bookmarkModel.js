import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model("Bookmark", bookmarkSchema);