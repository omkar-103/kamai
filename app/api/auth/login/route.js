// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

// Demo users - these work without database
const DEMO_USERS = [
  {
    _id: 'demo1',
    name: 'Rahul Kumar',
    email: 'rahul@demo.com',
    password: 'password123',
    monthlyIncome: 45000,
    vaultBalance: 12500,
    totalSavings: 25000,
    creditScore: 720
  },
  {
    _id: 'demo2',
    name: 'Priya Sharma',
    email: 'priya@demo.com',
    password: 'password123',
    monthlyIncome: 38000,
    vaultBalance: 8200,
    totalSavings: 18500,
    creditScore: 685
  },
  {
    _id: 'demo3',
    name: 'Amit Singh',
    email: 'amit@demo.com',
    password: 'password123',
    monthlyIncome: 52000,
    vaultBalance: 15700,
    totalSavings: 32000,
    creditScore: 740
  }
];

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    console.log('🔐 Login attempt for:', email);

    // 🎯 FIRST: Check if it's a demo user
    const demoUser = DEMO_USERS.find(user => 
      user.email === email && user.password === password
    );

    if (demoUser) {
      console.log('🎮 Demo user login successful:', email);
      
      const token = jwt.sign(
        { userId: demoUser._id, email: demoUser.email, isDemo: true },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '7d' }
      );

      return NextResponse.json({
        success: true,
        token,
        isDemo: true,
        user: {
          _id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email,
          monthlyIncome: demoUser.monthlyIncome,
          vaultBalance: demoUser.vaultBalance,
          totalSavings: demoUser.totalSavings,
          creditScore: demoUser.creditScore
        }
      });
    }

    // 🗄️ SECOND: Check database for real users
    try {
      await connectDB();
      const user = await User.findOne({ email });

      if (!user) {
        console.log('❌ User not found:', email);
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Compare password with bcrypt if it's hashed, otherwise simple comparison
      let isValidPassword = false;
      if (user.password.startsWith('\$2')) {
        // It's a bcrypt hash
        isValidPassword = await bcryptjs.compare(password, user.password);
      } else {
        // Plain text password (for development)
        isValidPassword = user.password === password;
      }

      if (!isValidPassword) {
        console.log('❌ Invalid password for:', email);
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Update last login for real users
      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign(
        { userId: user._id, email: user.email, isDemo: false },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '7d' }
      );

      console.log('✅ Real user login successful:', email);

      return NextResponse.json({
        success: true,
        token,
        isDemo: false,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          monthlyIncome: user.monthlyIncome,
          vaultBalance: user.vaultBalance,
          totalSavings: user.totalSavings,
          creditScore: user.creditScore
        }
      });
    } catch (dbError) {
      console.log('Database connection failed, continuing without DB');
      // If database fails, return error for non-demo users
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

  } catch (err) {
    console.error('🚨 Login error:', err);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}