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
  },
  clickCount: {
    type: Number,
    default: 0
  },
  lastClicked: {
    type: Date
  },
  notes: {
    type: String,
    default: ""
  },
  clickHistory: [{
    timestamp: { type: Date, default: Date.now },
    deviceId: { type: String }
  }]
}, { timestamps: true });

bookmarkSchema.index({ categoryId: 1, order: 1 });
bookmarkSchema.index({ categoryId: 1, clickCount: -1 });
bookmarkSchema.index({ createdAt: -1 });

export default mongoose.model("Bookmark", bookmarkSchema);
