import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const formData = await request.json();
    console.log('🎯 New user signup attempt:', formData.email);

    // Validate required fields
    const requiredFields = ['name', 'email', 'password', 'phone'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        console.log(`❌ Missing field: ${field}`);
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.log('❌ Invalid email format');
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate PAN format if provided
    if (formData.panCard) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(formData.panCard)) {
        console.log('❌ Invalid PAN format');
        return NextResponse.json(
          { success: false, error: 'Invalid PAN card format' },
          { status: 400 }
        );
      }
    }

    // Connect to database
    console.log('🔗 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: formData.email.toLowerCase() },
        { phone: formData.phone }
      ]
    });

    if (existingUser) {
      const field = existingUser.email === formData.email.toLowerCase() ? 'email' : 'phone number';
      console.log(`❌ User already exists with ${field}: ${formData[field === 'email' ? 'email' : 'phone']}`);
      return NextResponse.json(
        { success: false, error: `User with this ${field} already exists` },
        { status: 409 }
      );
    }

    // Hash password
    console.log('🔒 Hashing password...');
    const hashedPassword = await bcrypt.hash(formData.password, 12);

    // Calculate initial financial metrics
    const monthlyIncomeNum = parseMonthlyIncome(formData.monthlyIncome);
    const currentSavingsNum = parseCurrentSavings(formData.currentSavings);
    const creditScore = calculateInitialCreditScore(formData);

    console.log('📊 Financial metrics:', { monthlyIncomeNum, currentSavingsNum, creditScore });

    // Create user
    const newUser = new User({
      // Personal Information
      name: formData.name,
      email: formData.email.toLowerCase(),
      phone: formData.phone,
      password: hashedPassword,
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,

      // Work Information
      workDetails: {
        platforms: formData.workPlatform || [],
        vehicleType: formData.vehicleType,
        workingHours: formData.workingHours,
        city: formData.city,
        experience: formData.workExperience
      },

      // Financial Information
      monthlyIncome: monthlyIncomeNum,
      vaultBalance: 0,
      totalSavings: currentSavingsNum,
      creditScore: creditScore,

      // Goals and Preferences
      goals: {
        savingGoal: formData.savingGoal,
        financialPriority: formData.financialPriority,
        riskTolerance: formData.riskTolerance || 'moderate'
      },

      // KYC Information
      kyc: {
        panCard: formData.panCard,
        aadharNumber: formData.aadharNumber,
        isVerified: false
      },

      // Settings
      preferences: {
        notifications: true,
        monthlyReports: true,
        savingsReminders: true
      },

      // Timestamps
      createdAt: new Date(),
      lastLogin: null,
      isActive: true
    });

    console.log('💾 Saving user to database...');
    await newUser.save();
    console.log('✅ User saved successfully:', newUser.email);

    // Generate JWT token for auto-login
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '30d' }
    );

    console.log('🎫 JWT token generated');
    console.log('✅ New user created successfully:', formData.email);
    console.log('📋 User details:', {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      platforms: newUser.workDetails.platforms,
      city: newUser.workDetails.city,
      monthlyIncome: newUser.monthlyIncome,
      creditScore: newUser.creditScore
    });

    // Return success with token for auto-login
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      token: token,
      user: {
        _id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        workDetails: newUser.workDetails,
        monthlyIncome: newUser.monthlyIncome,
        totalSavings: newUser.totalSavings,
        creditScore: newUser.creditScore
      }
    });

  } catch (error) {
    console.error('🚨 Signup error:', error);
    console.error('Error stack:', error.stack);
    
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyValue)[0];
      console.log(`❌ Duplicate ${field}:`, error.keyValue[field]);
      return NextResponse.json(
        { success: false, error: `${field} already exists` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Account creation failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Helper functions
function parseMonthlyIncome(incomeRange) {
  if (!incomeRange) return 25000;
  const ranges = {
    '10000-20000': 15000,
    '20000-30000': 25000,
    '30000-40000': 35000,
    '40000-50000': 45000,
    '50000+': 55000
  };
  return ranges[incomeRange] || 25000;
}

function parseCurrentSavings(savingsRange) {
  if (!savingsRange) return 5000;
  const ranges = {
    '0-5000': 2500,
    '5000-15000': 10000,
    '15000-50000': 30000,
    '50000+': 75000
  };
  return ranges[savingsRange] || 5000;
}

function calculateInitialCreditScore(formData) {
  let score = 600; // Base score

  // Adjust based on income
  if (formData.monthlyIncome) {
    const incomeRanges = {
      '10000-20000': -20,
      '20000-30000': 0,
      '30000-40000': +20,
      '40000-50000': +40,
      '50000+': +60
    };
    score += incomeRanges[formData.monthlyIncome] || 0;
  }

  // Adjust based on savings
  if (formData.currentSavings) {
    const savingsRanges = {
      '0-5000': -10,
      '5000-15000': +10,
      '15000-50000': +30,
      '50000+': +50
    };
    score += savingsRanges[formData.currentSavings] || 0;
  }

  // Adjust based on work experience
  if (formData.workExperience) {
    const experienceBonus = {
      'new': 0,
      'experienced': +20,
      'veteran': +40
    };
    score += experienceBonus[formData.workExperience] || 0;
  }

  // Ensure score stays within realistic bounds
  return Math.min(Math.max(score, 550), 750);
}