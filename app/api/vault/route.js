import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VaultTransaction from '@/lib/models/VaultTransaction';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

const verifyToken = (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) throw new Error('No token');
    
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch {
    throw new Error('Invalid token');
  }
};

export async function GET(request) {
  try {
    await connectDB();
    
    const decoded = verifyToken(request);
    const userId = decoded.userId;
    
    const user = await User.findById(userId);
    const transactions = await VaultTransaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    const deposits = transactions.filter(t => t.type && t.type.includes('deposit'));
    const withdrawals = transactions.filter(t => t.type && t.type.includes('withdrawal'));
    
    const totalDeposits = deposits.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalWithdrawals = withdrawals.reduce((sum, t) => sum + (t.amount || 0), 0);
    const interestRate = 0.08;
    const interestEarned = Math.round((user?.totalSavings || 0) * interestRate / 12);
    
    return NextResponse.json({
      success: true,
      data: {
        currentBalance: user?.vaultBalance || 0,
        totalSavings: user?.totalSavings || 0,
        interestEarned,
        transactions: transactions || [],
        statistics: {
          totalDeposits,
          totalWithdrawals,
          transactionCount: transactions.length
        }
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const decoded = verifyToken(request);
    const userId = decoded.userId;
    
    const body = await request.json();
    const { type, amount, reason } = body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (type && type.includes('withdrawal') && amount > user.vaultBalance) {
      return NextResponse.json({ error: 'Insufficient vault balance' }, { status: 400 });
    }
    
    if (type && type.includes('deposit')) {
      user.vaultBalance = (user.vaultBalance || 0) + amount;
      user.totalSavings = (user.totalSavings || 0) + amount;
    } else if (type && type.includes('withdrawal')) {
      user.vaultBalance = (user.vaultBalance || 0) - amount;
    }
    
    await user.save();
    
    const transaction = await VaultTransaction.create({
      userId,
      type: type || 'deposit',
      amount: amount || 0,
      balanceAfter: user.vaultBalance,
      reason: reason || 'Manual transaction',
      triggeredBy: 'user'
    });
    
    return NextResponse.json({
      success: true,
      data: transaction,
      newBalance: user.vaultBalance
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}