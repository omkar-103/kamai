import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Income from '@/lib/models/Income';
import User from '@/lib/models/User';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '674d9a1e5f8c2a001234abcd';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const source = searchParams.get('source');
    
    let query = { userId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (source) {
      query.source = source;
    }
    
    const incomes = await Income.find(query).sort({ date: -1 });
    
    // Calculate statistics
    const total = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const average = incomes.length > 0 ? total / incomes.length : 0;
    
    return NextResponse.json({
      success: true,
      data: {
        incomes,
        statistics: {
          total,
          average,
          count: incomes.length,
        }
      }
    });
  } catch (error) {
    console.error('Error fetching income:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const income = await Income.create(body);
    
    // Update user's vault if auto-vault is enabled
    const user = await User.findById(body.userId);
    if (user && user.preferences.autoVault) {
      const vaultAmount = income.amount * (user.preferences.vaultPercentage / 100);
      user.vaultBalance += vaultAmount;
      user.totalSavings += vaultAmount;
      await user.save();
    }
    
    return NextResponse.json({ success: true, data: income }, { status: 201 });
  } catch (error) {
    console.error('Error creating income:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}