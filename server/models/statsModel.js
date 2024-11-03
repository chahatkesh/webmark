import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly'],
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  bookmarks: {
    type: Number,
    default: 0,
    min: 0
  },
  categories: {
    type: Number,
    default: 0,
    min: 0
  },
  users: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  // Add this to ensure virtual fields are included in JSON
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create compound indexes
statsSchema.index({ type: 1, date: -1 });
statsSchema.index({ date: -1 });

// Add validation
statsSchema.pre('save', function (next) {
  if (this.bookmarks < 0) this.bookmarks = 0;
  if (this.categories < 0) this.categories = 0;
  if (this.users < 0) this.users = 0;
  next();
});

const Stats = mongoose.model('Stats', statsSchema);

export default Stats;