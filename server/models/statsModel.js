import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'daily', 'weekly', 'monthly'
  date: { type: Date, required: true },
  bookmarks: { type: Number, default: 0 },
  categories: { type: Number, default: 0 },
  users: { type: Number, default: 0 }
}, { timestamps: true });

const Stats = mongoose.model('Stats', statsSchema);
export default Stats;

statsSchema.index({ type: 1, date: -1 });
statsSchema.index({ date: -1 });
