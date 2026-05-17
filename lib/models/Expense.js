import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['fuel', 'maintenance', 'food', 'discretionary', 'subscription', 'insurance', 'other'],
  },
  description: String,
  date: {
    type: Date,
    default: Date.now,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  isPaused: {
    type: Boolean,
    default: false,
  },
  metadata: {
    vendor: String,
    location: String,
    paymentMethod: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ExpenseSchema.index({ userId: 1, date: -1 });

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);