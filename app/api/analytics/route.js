// app/api/analytics/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Income from '@/lib/models/Income';
import Expense from '@/lib/models/Expense';
import User from '@/lib/models/User';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '674d9a1e5f8c2a001234abcd';
    const period = searchParams.get('period') || '30'; // days
    
    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);
    
    const [user, incomes, expenses] = await Promise.all([
      User.findById(userId),
      Income.find({ userId, date: { $gte: startDate } }),
      Expense.find({ userId, date: { $gte: startDate } })
    ]);
    
    // Income analytics
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const incomeBySource = incomes.reduce((acc, inc) => {
      acc[inc.source] = (acc[inc.source] || 0) + inc.amount;
      return acc;
    }, {});
    
    // Expense analytics
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const expensesByCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});
    
    // Daily trends
    const dailyData = {};
    incomes.forEach(inc => {
      const day = inc.date.toISOString().split('T')[0];
      if (!dailyData[day]) dailyData[day] = { income: 0, expenses: 0 };
      dailyData[day].income += inc.amount;
    });
    
    expenses.forEach(exp => {
      const day = exp.date.toISOString().split('T')[0];
      if (!dailyData[day]) dailyData[day] = { income: 0, expenses: 0 };
      dailyData[day].expenses += exp.amount;
    });
    
    const dailyTrends = Object.entries(dailyData).map(([date, data]) => ({
      date,
      ...data,
      net: data.income - data.expenses
    })).sort((a, b) => a.date.localeCompare(b.date));
    
    // Calculate metrics
    const savingsRate = ((totalIncome - totalExpenses) / Math.max(totalIncome, 1)) * 100;
    const avgDailyIncome = totalIncome / parseInt(period);
    const avgDailyExpense = totalExpenses / parseInt(period);
    
    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpenses,
          netSavings: totalIncome - totalExpenses,
          savingsRate: Math.round(savingsRate * 10) / 10,
          avgDailyIncome: Math.round(avgDailyIncome),
          avgDailyExpense: Math.round(avgDailyExpense),
          vaultBalance: user?.vaultBalance || 0,
          flexScore: user?.flexScore || 0
        },
        incomeBySource,
        expensesByCategory,
        dailyTrends,
        period: parseInt(period)
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}