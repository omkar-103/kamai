// app/api/auth/verify/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

// Same demo users as in login
const DEMO_USERS = [
  {
    _id: 'demo1',
    name: 'Rahul Kumar',
    email: 'rahul@demo.com',
    monthlyIncome: 45000,
    vaultBalance: 12500,
    totalSavings: 25000,
    creditScore: 720
  },
  {
    _id: 'demo2',
    name: 'Priya Sharma',
    email: 'priya@demo.com',
    monthlyIncome: 38000,
    vaultBalance: 8200,
    totalSavings: 18500,
    creditScore: 685
  },
  {
    _id: 'demo3',
    name: 'Amit Singh',
    email: 'amit@demo.com',
    monthlyIncome: 52000,
    vaultBalance: 15700,
    totalSavings: 32000,
    creditScore: 740
  }
];

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    console.log('🔍 Verify - Auth header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    
    console.log('🎫 Decoded token:', decoded);

    // 🎮 Handle Demo Users
    if (decoded.isDemo || decoded.userId.startsWith('demo')) {
      const demoUser = DEMO_USERS.find(user => user._id === decoded.userId);
      
      if (!demoUser) {
        return NextResponse.json(
          { success: false, error: 'Demo user not found' },
          { status: 401 }
        );
      }

      console.log('✅ Demo user verified:', demoUser.email);
      
      return NextResponse.json({
        success: true,
        user: {
          _id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email,
          monthlyIncome: demoUser.monthlyIncome,
          vaultBalance: demoUser.vaultBalance,
          totalSavings: demoUser.totalSavings,
          creditScore: demoUser.creditScore,
          isDemo: true
        }
      });
    }

    // 🗄️ Handle Real Users
    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log('❌ Real user not found:', decoded.userId);
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      );
    }

    console.log('✅ Real user verified:', user.email);

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        monthlyIncome: user.monthlyIncome,
        vaultBalance: user.vaultBalance,
        totalSavings: user.totalSavings,
        creditScore: user.creditScore,
        isDemo: false
      }
    });

  } catch (err) {
    console.error('🚨 Verify failed:', err);
    return NextResponse.json(
      { success: false, error: 'Invalid token' },
      { status: 401 }
    );
  }
}