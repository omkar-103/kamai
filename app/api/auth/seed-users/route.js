// app/api/auth/seed-users/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST() {
  try {
    await connectDB();
    
    // Clear existing users
    await User.deleteMany({});
    
    // Create dummy users
    const dummyUsers = [
      {
        name: 'Rahul Sharma',
        email: 'rahul@demo.com',
        password: 'password123',
        phone: '+91-9876543210',
        monthlyIncome: 85000,
        vaultBalance: 45000,
        totalSavings: 180000,
        creditScore: 780,
        riskProfile: 'moderate'
      },
      {
        name: 'Priya Patel',
        email: 'priya@demo.com',
        password: 'password123',
        phone: '+91-9876543211',
        monthlyIncome: 120000,
        vaultBalance: 75000,
        totalSavings: 350000,
        creditScore: 820,
        riskProfile: 'aggressive'
      },
      {
        name: 'Amit Kumar',
        email: 'amit@demo.com',
        password: 'password123',
        phone: '+91-9876543212',
        monthlyIncome: 65000,
        vaultBalance: 25000,
        totalSavings: 95000,
        creditScore: 720,
        riskProfile: 'conservative'
      }
    ];

    const users = await User.insertMany(dummyUsers);
    
    return NextResponse.json({ 
      success: true, 
      message: `Created ${users.length} dummy users`,
      users: users.map(u => ({ email: u.email, name: u.name }))
    });
  } catch (error) {
    console.error('Error seeding users:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}