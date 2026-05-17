import mongoose from 'mongoose';

const AgentActionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  agentType: {
    type: String,
    required: true,
    enum: ['income', 'defense', 'credit', 'growth'],
  },
  actionType: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'success', 'error'],
    default: 'info',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'user_action_required', 'cancelled'],
    default: 'pending',
  },
  impact: {
    financial: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  userInteraction: {
    required: {
      type: Boolean,
      default: false,
    },
    responded: {
      type: Boolean,
      default: false,
    },
    response: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
});

AgentActionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.AgentAction || mongoose.model('AgentAction', AgentActionSchema);