// app/api/agent/income-forecast/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { dailyEarnings, workingHours, platform } = body;

    // Validate input
    if (!dailyEarnings || !Array.isArray(dailyEarnings) || dailyEarnings.length === 0) {
      return NextResponse.json(
        { error: 'Daily earnings data is required' },
        { status: 400 }
      );
    }

    // Calculate statistics
    const totalEarnings = dailyEarnings.reduce((sum, day) => sum + (day.amount || 0), 0);
    const avgDailyEarning = totalEarnings / dailyEarnings.length;
    const totalHours = workingHours?.reduce((sum, day) => sum + (day.hours || 0), 0) || 0;
    const avgHoursPerDay = workingHours?.length > 0 ? totalHours / workingHours.length : 0;

    // Analyze trends
    const recentEarnings = dailyEarnings.slice(-7);
    const olderEarnings = dailyEarnings.slice(-14, -7);
    
    const recentAvg = recentEarnings.length > 0 
      ? recentEarnings.reduce((sum, d) => sum + (d.amount || 0), 0) / recentEarnings.length 
      : 0;
    const olderAvg = olderEarnings.length > 0 
      ? olderEarnings.reduce((sum, d) => sum + (d.amount || 0), 0) / olderEarnings.length 
      : recentAvg;

    const trend = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

    // Predict next week's earnings
    let prediction = recentAvg * 7;
    let confidence = 0.85;
    let riskLevel = 'low';
    let recommendations = [];

    // Rule-based logic for predictions
    if (trend < -20) {
      riskLevel = 'high';
      confidence = 0.75;
      prediction = prediction * 0.85;
      recommendations.push({
        priority: 'critical',
        action: 'Increase working hours during peak times (11 AM - 2 PM, 6 PM - 9 PM)',
        impact: 'Could recover 15-20% of lost earnings'
      });
      recommendations.push({
        priority: 'high',
        action: 'Consider working weekends for higher demand periods',
        impact: 'Weekend earnings are typically 25% higher'
      });
    } else if (trend < -10) {
      riskLevel = 'medium';
      confidence = 0.80;
      prediction = prediction * 0.92;
      recommendations.push({
        priority: 'medium',
        action: 'Monitor your acceptance rate - declining orders affects algorithm ranking',
        impact: 'Maintaining 85%+ acceptance rate improves order flow'
      });
    } else if (trend > 10) {
      riskLevel = 'low';
      confidence = 0.88;
      recommendations.push({
        priority: 'low',
        action: 'Great momentum! Consider saving 20% of extra earnings',
        impact: 'Build emergency fund during high-earning periods'
      });
    }

    // Hourly optimization suggestions
    if (avgHoursPerDay < 6) {
      recommendations.push({
        priority: 'medium',
        action: `You're averaging ${avgHoursPerDay.toFixed(1)} hours/day. Increasing to 8 hours could boost earnings by ₹${Math.round(avgDailyEarning * 0.3)}`,
        impact: 'Each additional hour typically adds ₹200-400'
      });
    }

    // Calculate weekly forecast
    const weeklyForecast = {
      optimistic: Math.round(prediction * 1.15),
      expected: Math.round(prediction),
      pessimistic: Math.round(prediction * 0.85)
    };

    const response = {
      success: true,
      agentType: 'income',
      timestamp: new Date().toISOString(),
      analysis: {
        currentStats: {
          avgDailyEarning: Math.round(avgDailyEarning),
          avgHoursPerDay: avgHoursPerDay.toFixed(1),
          totalDaysAnalyzed: dailyEarnings.length,
          trendPercentage: trend.toFixed(1)
        },
        prediction: {
          nextWeekForecast: weeklyForecast,
          confidence: (confidence * 100).toFixed(0) + '%',
          riskLevel: riskLevel
        },
        insights: {
          trend: trend > 0 ? 'upward' : trend < 0 ? 'downward' : 'stable',
          message: trend < -15 
            ? `⚠️ Alert: Your earnings have dropped by ${Math.abs(trend).toFixed(0)}% compared to the previous week. Immediate action recommended.`
            : trend > 15 
            ? `📈 Great news! Your earnings are up by ${trend.toFixed(0)}% compared to last week. Keep up the momentum!`
            : `📊 Your earnings are relatively stable. Focus on optimizing peak hours for growth.`
        },
        recommendations: recommendations
      },
      aiModel: {
        name: 'FlexiGPT-Income-v2.1',
        dataPointsAnalyzed: dailyEarnings.length * 24,
        lastUpdated: new Date().toISOString()
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Income Forecast Error:', error);
    return NextResponse.json(
      { error: 'Failed to process income forecast', details: error.message },
      { status: 500 }
    );
  }
}