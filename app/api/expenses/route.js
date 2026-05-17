import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/lib/models/Expense';

// AI-powered expense classification (simplified)
function classifyExpense(merchant, amount) {
  const merchant_lower = merchant.toLowerCase();
  
  // Essential categories
  if (merchant_lower.includes('rent') || merchant_lower.includes('electricity') || 
      merchant_lower.includes('water') || merchant_lower.includes('gas')) {
    return { category: 'essential', subcategory: 'housing', confidence: 0.95 };
  }
  
  if (merchant_lower.includes('grocery') || merchant_lower.includes('vegetables') ||
      merchant_lower.includes('food') || merchant_lower.includes('mart')) {
    return { category: 'essential', subcategory: 'groceries', confidence: 0.9 };
  }
  
  // Discretionary
  if (merchant_lower.includes('netflix') || merchant_lower.includes('prime') ||
      merchant_lower.includes('spotify') || merchant_lower.includes('hotstar')) {
    return { category: 'discretionary', subcategory: 'entertainment', confidence: 0.95 };
  }
  
  if (merchant_lower.includes('restaurant') || merchant_lower.includes('cafe') ||
      merchant_lower.includes('zomato') || merchant_lower.includes('swiggy')) {
    return { category: 'discretionary', subcategory: 'dining', confidence: 0.9 };
  }
  
  // Investment
  if (merchant_lower.includes('mutual') || merchant_lower.includes('sip') ||
      merchant_lower.includes('stock') || merchant_lower.includes('insurance')) {
    return { category: 'investment', subcategory: 'financial', confidence: 0.9 };
  }
  
  // Default
  if (amount > 5000) {
    return { category: 'essential', subcategory: 'other', confidence: 0.5 };
  }
  
  return { category: 'discretionary', subcategory: 'other', confidence: 0.6 };
}

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '674d9a1e5f8c2a001234abcd';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');
    
    let query = { userId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (category) {
      query.category = category;
    }
    
    const expenses = await Expense.find(query).sort({ date: -1 });
    
    // Calculate statistics by category
    const byCategory = expenses.reduce((acc, exp) => {
      if (!acc[exp.category]) {
        acc[exp.category] = { total: 0, count: 0 };
      }
      acc[exp.category].total += exp.amount;
      acc[exp.category].count += 1;
      return acc;
    }, {});
    
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    return NextResponse.json({
      success: true,
      data: {
        expenses,
        statistics: {
          total,
          byCategory,
          count: expenses.length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Auto-classify if not provided
    if (!body.category || !body.subcategory) {
      const classification = classifyExpense(body.merchant || '', body.amount);
      body.category = classification.category;
      body.subcategory = classification.subcategory;
      body.aiClassified = true;
      body.confidence = classification.confidence;
    }
    
    const expense = await Expense.create(body);
    
    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}