import mongoose from 'mongoose';

const CreditScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 300,
    max: 900,
  },
  factors: {
    incomeStability: {
      score: Number,
      weight: Number,
    },
    platformRatings: {
      score: Number,
      weight: Number,
    },
    savingsHabit: {
      score: Number,
      weight: Number,
    },
    expenseDiscipline: {
      score: Number,
      weight: Number,
    },
    debtHistory: {
      score: Number,
      weight: Number,
    },
  },
  trend: {
    type: String,
    enum: ['up', 'down', 'stable'],
    default: 'stable',
  },
  previousScore: Number,
  recommendations: [String],
  calculatedAt: {
    type: Date,
    default: Date.now,
  },
});

CreditScoreSchema.index({ userId: 1, calculatedAt: -1 });

export default mongoose.models.CreditScore || mongoose.model('CreditScore', CreditScoreSchema);