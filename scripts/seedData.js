const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGO_URI = process.env.MONGO_URI;

// Import models
const User = require('../lib/models/User');
const Income = require('../lib/models/Income');
const Expense = require('../lib/models/Expense');
const AgentAction = require('../lib/models/AgentAction');

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Income.deleteMany({}),
      Expense.deleteMany({}),
      AgentAction.deleteMany({})
    ]);

    // Create sample user
    const user = await User.create({
      _id: '674d9a1e5f8c2a001234abcd',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91 98765 43210',
      workType: 'delivery',
      platforms: [
        { name: 'Swiggy', userId: 'SW12345', rating: 4.7, joinedDate: new Date('2023-01-15') },
        { name: 'Zomato', userId: 'ZM67890', rating: 4.5, joinedDate: new Date('2023-03-20') }
      ],
      flexScore: 682,
      vaultBalance: 8500,
      totalSavings: 15000,
      creditLimit: 20000,
      preferences: {
        autoVault: true,
        vaultPercentage: 20,
        alertsEnabled: true
      }
    });

    console.log('User created:', user.name);

    // Create sample income data (last 30 days)
    const incomes = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Random income between 500-1500 per day
      const amount = Math.floor(Math.random() * 1000) + 500;
      const source = Math.random() > 0.5 ? 'Swiggy' : 'Zomato';
      
      incomes.push({
        userId: user._id,
        amount,
        source,
        category: 'delivery',
        date,
        hours: Math.floor(Math.random() * 6) + 4,
        trips: Math.floor(Math.random() * 15) + 10,
        tips: Math.floor(Math.random() * 200),
        incentives: Math.floor(Math.random() * 300)
      });
    }
    await Income.insertMany(incomes);
    console.log(`Created ${incomes.length} income records`);

    // Create sample expenses
    const expenses = [];
    const expenseCategories = [
      { category: 'essential', subcategory: 'groceries', merchants: ['DMart', 'BigBasket', 'Local Store'] },
      { category: 'essential', subcategory: 'housing', merchants: ['Rent', 'Electricity', 'Water Bill'] },
      { category: 'discretionary', subcategory: 'entertainment', merchants: ['Netflix', 'Prime Video', 'Spotify'] },
      { category: 'discretionary', subcategory: 'dining', merchants: ['Cafe', 'Restaurant', 'Food Court'] }
    ];

    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // 2-4 expenses per day
      const numExpenses = Math.floor(Math.random() * 3) + 2;
      
      for (let j = 0; j < numExpenses; j++) {
        const catData = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
        const merchant = catData.merchants[Math.floor(Math.random() * catData.merchants.length)];
        
        expenses.push({
          userId: user._id,
          amount: Math.floor(Math.random() * 500) + 50,
          category: catData.category,
          subcategory: catData.subcategory,
          merchant,
          description: `Purchase from ${merchant}`,
          date,
          aiClassified: true,
          confidence: 0.85 + Math.random() * 0.15
        });
      }
    }
    await Expense.insertMany(expenses);
    console.log(`Created ${expenses.length} expense records`);

    // Create sample agent actions
    const actions = [
      {
        userId: user._id,
        agentType: 'income',
        actionType: 'income_alert',
        title: 'Income Dip Detected',
        description: 'Your earnings this week are 22% below average. Consider working during peak hours (12-2 PM, 7-9 PM) for better income.',
        severity: 'warning',
        status: 'completed',
        impact: { financial: 2500, score: -3 }
      },
      {
        userId: user._id,
        agentType: 'defense',
        actionType: 'expense_alert',
        title: 'Unusual Spending Detected',
        description: 'Entertainment expenses are 180% above baseline this week. Consider pausing Netflix subscription temporarily.',
        severity: 'warning',
        status: 'user_action_required',
        impact: { financial: 299, score: 0 },
        userInteraction: { required: true, responded: false }
      },
      {
        userId: user._id,
        agentType: 'credit',
        actionType: 'score_improvement',
        title: 'Credit Score Milestone',
        description: 'Complete 8 more deliveries this week to reach FlexScore 700 and unlock ₹10,000 additional credit.',
        severity: 'success',
        status: 'pending',
        impact: { financial: 10000, score: 18 }
      },
      {
        userId: user._id,
        agentType: 'growth',
        actionType: 'platform_expansion',
        title: 'Income Diversification Opportunity',
        description: 'Adding Dunzo or Urban Company could increase your monthly income by ₹4,200. Auto-applying with your credentials.',
        severity: 'info',
        status: 'pending',
        impact: { financial: 4200, score: 0 }
      }
    ];
    await AgentAction.insertMany(actions);
    console.log(`Created ${actions.length} agent actions`);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedData();