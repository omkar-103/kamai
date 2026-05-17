// lib/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // Personal Information
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date },

  // Work Information
  workDetails: {
    platforms: [{ type: String }], // ['swiggy', 'zomato', etc.]
    vehicleType: { type: String },
    workingHours: { type: String },
    city: { type: String },
    experience: { type: String }
  },

  // Financial Information
  monthlyIncome: { type: Number, default: 0 },
  vaultBalance: { type: Number, default: 0 },
  totalSavings: { type: Number, default: 0 },
  creditScore: { type: Number, default: 650 },

  // Goals and Preferences
  goals: {
    savingGoal: { type: String },
    financialPriority: { type: String },
    riskTolerance: { type: String, default: 'moderate' }
  },

  // KYC Information
  kyc: {
    panCard: { type: String },
    aadharNumber: { type: String },
    isVerified: { type: Boolean, default: false }
  },

  // Settings
  preferences: {
    notifications: { type: Boolean, default: true },
    monthlyReports: { type: Boolean, default: true },
    savingsReminders: { type: Boolean, default: true }
  },

  // Transaction History
  transactions: [{
    type: { type: String, enum: ['deposit', 'withdrawal', 'earning'] },
    amount: Number,
    description: String,
    date: { type: Date, default: Date.now },
    balance: Number
  }],

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes for better performance
UserSchema.index({ 'kyc.panCard': 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);