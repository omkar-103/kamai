// lib/models/ChatMessage.js
import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  intent: String,
  context: mongoose.Schema.Types.Mixed,
  agentType: {
    type: String,
    enum: ['income', 'defense', 'credit', 'growth', 'general'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ChatMessageSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);