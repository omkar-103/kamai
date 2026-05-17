import mongoose from 'mongoose';

const IncomeForecastSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  forecastDate: {
    type: Date,
    required: true,
  },
  predictedAmount: {
    type: Number,
    required: true,
  },
  confidenceInterval: {
    lower: Number,
    upper: Number,
    confidence: Number, // 0-1
  },
  factors: [{
    factor: String,
    impact: Number,
    weight: Number,
  }],
  modelVersion: String,
  accuracy: Number, // Compare with actual after date passes
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

IncomeForecastSchema.index({ userId: 1, forecastDate: 1 });

export default mongoose.models.IncomeForecast || mongoose.model('IncomeForecast', IncomeForecastSchema);