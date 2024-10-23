import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  bgcolor: {
    type: String,
    default: "#f7fee7"
  },
  hcolor: {
    type: String,
    default: "#4d7c0f"
  },
  emoji: {
    type: String,
    default: "📑"
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);