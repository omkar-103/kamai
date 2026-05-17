import mongoose from 'mongoose';

const VaultTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'auto_deposit', 'emergency_withdrawal'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  balanceAfter: {
    type: Number,
    required: true,
  },
  reason: String,
  triggeredBy: {
    type: String,
    enum: ['user', 'agent', 'system'],
    default: 'user',
  },
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

VaultTransactionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.VaultTransaction || mongoose.model('VaultTransaction', VaultTransactionSchema);