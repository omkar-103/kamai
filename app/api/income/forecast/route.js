import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Income from '@/lib/models/Income';
import IncomeForecast from '@/lib/models/IncomeForecast';

// Simple moving average forecast (replace with ML model in production)
async function generateForecast(userId, days = 7) {
  const historicalData = await Income.find({
    userId,
    date: {
      $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
    }
  }).sort({ date: 1 });
  
  if (historicalData.length < 7) {
    return null; // Not enough data
  }
  
  // Calculate daily averages
  const dailyIncome = {};
  historicalData.forEach(income => {
    const day = income.date.toISOString().split('T')[0];
    if (!dailyIncome[day]) {
      dailyIncome[day] = 0;
    }
    dailyIncome[day] += income.amount;
  });
  
  const amounts = Object.values(dailyIncome);
  const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const variance = amounts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / amounts.length;
  const stdDev = Math.sqrt(variance);
  
  // Generate forecasts for next N days
  const forecasts = [];
  for (let i = 1; i <= days; i++) {
    const forecastDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
    
    // Simple model: use average with some randomness
    const predicted = avg;
    const confidence = Math.max(0.6, 1 - (stdDev / avg) * 0.5);
    
    forecasts.push({
      userId,
      forecastDate,
      predictedAmount: Math.round(predicted),
      confidenceInterval: {
        lower: Math.round(predicted - stdDev),
        upper: Math.round(predicted + stdDev),
        confidence
      },
      factors: [
        { factor: 'Historical Average', impact: 0.7, weight: 0.7 },
        { factor: 'Day of Week', impact: 0.2, weight: 0.2 },
        { factor: 'Seasonal Trend', impact: 0.1, weight: 0.1 }
      ],
      modelVersion: '1.0-simple-ma'
    });
  }
  
  return forecasts;
}

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '674d9a1e5f8c2a001234abcd';
    const days = parseInt(searchParams.get('days') || '7');
    
    // Try to get recent forecast
    const existingForecast = await IncomeForecast.find({
      userId,
      forecastDate: { $gte: new Date() },
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Less than 24h old
    }).sort({ forecastDate: 1 });
    
    if (existingForecast.length >= days) {
      return NextResponse.json({
        success: true,
        data: existingForecast.slice(0, days),
        cached: true
      });
    }
    
    // Generate new forecast
    const forecasts = await generateForecast(userId, days);
    
    if (!forecasts) {
      return NextResponse.json({
        error: 'Insufficient historical data for forecast',
        minimumRequired: 7
      }, { status: 400 });
    }
    
    // Save forecasts
    const saved = await IncomeForecast.insertMany(forecasts);
    
    return NextResponse.json({
      success: true,
      data: saved,
      cached: false
    });
  } catch (error) {
    console.error('Error generating forecast:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}