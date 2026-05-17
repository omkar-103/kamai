// app/api/agent/spending-protection/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { transactions, monthlyIncome } = body;

    // Validate input
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json(
        { error: 'Transaction data is required' },
        { status: 400 }
      );
    }

    // Define spending categories
    const categories = {
      food: { keywords: ['swiggy', 'zomato', 'restaurant', 'cafe', 'food', 'dining', 'eat'], limit: 0.15 },
      transport: { keywords: ['uber', 'ola', 'petrol', 'fuel', 'metro', 'bus', 'auto'], limit: 0.10 },
      entertainment: { keywords: ['netflix', 'spotify', 'movie', 'game', 'hotstar', 'prime'], limit: 0.05 },
      shopping: { keywords: ['amazon', 'flipkart', 'myntra', 'mall', 'shop', 'store'], limit: 0.10 },
      utilities: { keywords: ['electric', 'water', 'gas', 'internet', 'phone', 'recharge', 'bill'], limit: 0.10 },
      health: { keywords: ['pharmacy', 'hospital', 'doctor', 'medical', 'medicine'], limit: 0.05 },
      education: { keywords: ['course', 'book', 'udemy', 'skill', 'training'], limit: 0.05 },
      other: { keywords: [], limit: 0.10 }
    };

    // Categorize transactions
    const categorizedSpending = {};
    const flaggedTransactions = [];
    let totalSpending = 0;

    Object.keys(categories).forEach(cat => {
      categorizedSpending[cat] = { total: 0, transactions: [], percentage: 0 };
    });

    transactions.forEach(transaction => {
      const { description, amount, date, merchant } = transaction;
      const searchText = `${description} ${merchant}`.toLowerCase();
      let categoryFound = 'other';

      // Find category
      for (const [category, { keywords }] of Object.entries(categories)) {
        if (keywords.some(keyword => searchText.includes(keyword))) {
          categoryFound = category;
          break;
        }
      }

      categorizedSpending[categoryFound].total += amount;
      categorizedSpending[categoryFound].transactions.push({
        description,
        amount,
        date,
        merchant
      });
      totalSpending += amount;

      // Flag unusual transactions
      const avgForCategory = categorizedSpending[categoryFound].total / 
        Math.max(categorizedSpending[categoryFound].transactions.length, 1);
      
      if (amount > avgForCategory * 2 && amount > 500) {
        flaggedTransactions.push({
          ...transaction,
          category: categoryFound,
          reason: 'Unusually high amount for this category',
          severity: amount > avgForCategory * 3 ? 'high' : 'medium'
        });
      }
    });

    // Calculate percentages and analyze
    const income = monthlyIncome || totalSpending * 1.3; // Estimate if not provided
    const alerts = [];
    const recommendations = [];

    Object.keys(categorizedSpending).forEach(category => {
      const catData = categorizedSpending[category];
      catData.percentage = ((catData.total / income) * 100).toFixed(1);
      
      const limit = categories[category].limit * 100;
      
      if (parseFloat(catData.percentage) > limit) {
        const overBy = (parseFloat(catData.percentage) - limit).toFixed(1);
        alerts.push({
          category: category,
          severity: parseFloat(catData.percentage) > limit * 1.5 ? 'critical' : 'warning',
          message: `${category.charAt(0).toUpperCase() + category.slice(1)} spending is ${overBy}% over recommended limit`,
          currentSpending: catData.total,
          recommendedLimit: Math.round(income * categories[category].limit),
          overSpent: Math.round(catData.total - (income * categories[category].limit))
        });
      }
    });

    // Generate recommendations
    if (categorizedSpending.food.percentage > 15) {
      recommendations.push({
        priority: 'high',
        category: 'food',
        action: 'Consider meal prepping or cooking at home more often',
        potentialSavings: Math.round(categorizedSpending.food.total * 0.3),
        tip: 'Cooking at home can save 50-60% compared to food delivery'
      });
    }

    if (categorizedSpending.entertainment.percentage > 5) {
      recommendations.push({
        priority: 'medium',
        category: 'entertainment',
        action: 'Review your subscriptions - you might have unused services',
        potentialSavings: Math.round(categorizedSpending.entertainment.total * 0.4),
        tip: 'Share family plans with friends to reduce costs'
      });
    }

    if (categorizedSpending.transport.percentage > 10) {
      recommendations.push({
        priority: 'medium',
        category: 'transport',
        action: 'Consider public transport or carpooling for regular commutes',
        potentialSavings: Math.round(categorizedSpending.transport.total * 0.25),
        tip: 'Metro/Bus passes can save up to 40% on daily commute'
      });
    }

    // Calculate savings potential
    const totalPotentialSavings = recommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0);

    // Spending health score (0-100)
    let spendingHealthScore = 100;
    alerts.forEach(alert => {
      spendingHealthScore -= alert.severity === 'critical' ? 15 : 8;
    });
    spendingHealthScore = Math.max(0, spendingHealthScore);

    const response = {
      success: true,
      agentType: 'defense',
      timestamp: new Date().toISOString(),
      analysis: {
        summary: {
          totalTransactions: transactions.length,
          totalSpending: totalSpending,
          estimatedIncome: income,
          spendingRatio: ((totalSpending / income) * 100).toFixed(1) + '%',
          spendingHealthScore: spendingHealthScore
        },
        categoryBreakdown: Object.entries(categorizedSpending).map(([category, data]) => ({
          category: category,
          total: data.total,
          percentage: data.percentage + '%',
          transactionCount: data.transactions.length,
          status: parseFloat(data.percentage) > categories[category].limit * 100 ? 'over_limit' : 'healthy'
        })),
        alerts: alerts,
        flaggedTransactions: flaggedTransactions,
        recommendations: recommendations,
        savings: {
          potentialMonthlySavings: totalPotentialSavings,
          potentialYearlySavings: totalPotentialSavings * 12,
          message: totalPotentialSavings > 0 
            ? `💰 You could save ₹${totalPotentialSavings.toLocaleString()} per month by following our recommendations!`
            : '✅ Your spending habits look healthy!'
        }
      },
      aiModel: {
        name: 'SpendGuard-AI-v1.8',
        transactionsAnalyzed: transactions.length,
        patternsDetected: alerts.length + flaggedTransactions.length,
        lastUpdated: new Date().toISOString()
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Spending Protection Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze spending', details: error.message },
      { status: 500 }
    );
  }
}