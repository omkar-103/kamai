// lib/models/Income.js
import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    required: true,
    enum: ['swiggy', 'zomato', 'uber', 'ola', 'dunzo', 'urban_company', 'other'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  metadata: {
    orderId: String,
    distance: Number,
    duration: Number,
    tips: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

IncomeSchema.index({ userId: 1, date: -1 });

export default mongoose.models.Income || mongoose.model('Income', IncomeSchema);