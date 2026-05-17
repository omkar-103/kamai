import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CreditScore from '@/lib/models/CreditScore';
import User from '@/lib/models/User';
import Income from '@/lib/models/Income';
import Expense from '@/lib/models/Expense';

async function calculateCreditScore(userId) {
  const user = await User.findById(userId);
  
  // Get last 90 days data
  const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  
  const incomes = await Income.find({ userId, date: { $gte: startDate } });
  const expenses = await Expense.find({ userId, date: { $gte: startDate } });
  
  // Calculate factors
  
  // 1. Income Stability (30% weight)
  const dailyIncome = {};
  incomes.forEach(inc => {
    const day = inc.date.toISOString().split('T')[0];
    dailyIncome[day] = (dailyIncome[day] || 0) + inc.amount;
  });
  
  const incomeValues = Object.values(dailyIncome);
  const avgIncome = incomeValues.reduce((a, b) => a + b, 0) / Math.max(incomeValues.length, 1);
  const variance = incomeValues.reduce((sum, val) => sum + Math.pow(val - avgIncome, 2), 0) / 
                  Math.max(incomeValues.length, 1);
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / avgIncome;
  
  const incomeStabilityScore = Math.max(300, Math.min(900, 900 - (coefficientOfVariation * 1000)));
  
  // 2. Platform Ratings (20% weight)
  const avgRating = user.platforms && user.platforms.length > 0
    ? user.platforms.reduce((sum, p) => sum + (p.rating || 0), 0) / user.platforms.length
    : 0;
  const platformScore = Math.max(300, avgRating * 180);
  
  // 3. Savings Habit (25% weight)
  const savingsRatio = user.vaultBalance / Math.max(avgIncome * 30, 1);
  const savingsScore = Math.max(300, Math.min(900, 300 + savingsRatio * 2000));
  
  // 4. Expense Discipline (15% weight)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const expenseRatio = totalExpenses / Math.max(totalIncome, 1);
  const disciplineScore = Math.max(300, Math.min(900, 900 - (expenseRatio * 600)));
  
  // 5. Debt History (10% weight) - placeholder
  const debtScore = 750; // Default good score
  
  // Calculate weighted final score
  const finalScore = Math.round(
    incomeStabilityScore * 0.30 +
    platformScore * 0.20 +
    savingsScore * 0.25 +
    disciplineScore * 0.15 +
    debtScore * 0.10
  );
  
  // Get previous score for trend
  const previousScore = await CreditScore.findOne({ userId })
    .sort({ calculatedAt: -1 });
  
  let trend = 'stable';
  if (previousScore) {
    if (finalScore > previousScore.score + 10) trend = 'up';
    else if (finalScore < previousScore.score - 10) trend = 'down';
  }
  
  // Generate recommendations
  const recommendations = [];
  if (incomeStabilityScore < 650) {
    recommendations.push('Increase income consistency by working regular hours');
  }
  if (savingsScore < 650) {
    recommendations.push('Build emergency savings to improve financial stability');
  }
  if (disciplineScore < 650) {
    recommendations.push('Reduce discretionary spending to improve expense discipline');
  }
  
  return {
    userId,
    score: finalScore,
    factors: {
      incomeStability: {
        score: Math.round(incomeStabilityScore),
        weight: 0.30
      },
      platformRatings: {
        score: Math.round(platformScore),
        weight: 0.20
      },
      savingsHabit: {
        score: Math.round(savingsScore),
        weight: 0.25
      },
      expenseDiscipline: {
        score: Math.round(disciplineScore),
        weight: 0.15
      },
      debtHistory: {
        score: debtScore,
        weight: 0.10
      }
    },
    trend,
    previousScore: previousScore?.score,
    recommendations
  };
}

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '674d9a1e5f8c2a001234abcd';
    
    // Get latest credit score
    const latestScore = await CreditScore.findOne({ userId })
      .sort({ calculatedAt: -1 });
    
    // If recent (< 24h), return it
    if (latestScore && 
        latestScore.calculatedAt > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      return NextResponse.json({ success: true, data: latestScore, cached: true });
    }
    
    // Calculate new score
    const scoreData = await calculateCreditScore(userId);
    const newScore = await CreditScore.create(scoreData);
    
    // Update user's flexScore
    await User.findByIdAndUpdate(userId, { flexScore: newScore.score });
    
    return NextResponse.json({ success: true, data: newScore, cached: false });
  } catch (error) {
    console.error('Error calculating credit score:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}