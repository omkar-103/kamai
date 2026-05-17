/**
 * lib/mockData.ts
 * 
 * Centralized mock data for all API endpoints.
 * This file contains sample data structures that match the backend API schema.
 * When backend APIs are ready, only the API routes need to be updated.
 */

// ============================================
// INCOME DATA
// ============================================
export const mockIncome = [
  { date: "2025-11-01", predicted_income: 2300, actual_income: 2100 },
  { date: "2025-11-02", predicted_income: 2400, actual_income: 2250 },
  { date: "2025-11-03", predicted_income: 2500, actual_income: 2420 },
  { date: "2025-11-04", predicted_income: 2350, actual_income: 2380 },
  { date: "2025-11-05", predicted_income: 2600, actual_income: 2550 },
  { date: "2025-11-06", predicted_income: 2450, actual_income: 2400 },
  { date: "2025-11-07", predicted_income: 2700, actual_income: 2680 },
  { date: "2025-11-08", predicted_income: 2550, actual_income: 2500 },
  { date: "2025-11-09", predicted_income: 2800, actual_income: 2750 },
  { date: "2025-11-10", predicted_income: 2650, actual_income: 2600 },
  { date: "2025-11-11", predicted_income: 2900, actual_income: 2850 },
  { date: "2025-11-12", predicted_income: 2750, actual_income: 2700 },
];

// ============================================
// EXPENSE DATA
// ============================================
export const mockExpenses = [
  { category: "Food & Dining", amount: 12500 },
  { category: "Transportation", amount: 8300 },
  { category: "Shopping", amount: 15200 },
  { category: "Bills & Utilities", amount: 9800 },
  { category: "Entertainment", amount: 6500 },
];

// ============================================
// VAULT DATA
// ============================================
export const mockVault = {
  current_balance: 45000,
  total_deposits: 120000,
  total_withdrawals: 75000,
  interest_earned: 3200,
  growth_rate: 7.8,
  last_updated: "2025-11-12T09:30:00Z",
  recent_transactions: [
    {
      id: "txn_001",
      type: "deposit",
      amount: 5000,
      date: "2025-11-10",
      description: "Monthly savings",
      status: "completed",
    },
    {
      id: "txn_002",
      type: "withdrawal",
      amount: 2000,
      date: "2025-11-08",
      description: "Emergency fund usage",
      status: "completed",
    },
    {
      id: "txn_003",
      type: "deposit",
      amount: 3000,
      date: "2025-11-05",
      description: "Bonus deposit",
      status: "completed",
    },
    {
      id: "txn_004",
      type: "interest",
      amount: 150,
      date: "2025-11-01",
      description: "Monthly interest",
      status: "completed",
    },
  ],
  growth_history: [
    { date: "2025-10-01", balance: 38000 },
    { date: "2025-10-08", balance: 39500 },
    { date: "2025-10-15", balance: 41000 },
    { date: "2025-10-22", balance: 42200 },
    { date: "2025-10-29", balance: 43500 },
    { date: "2025-11-05", balance: 44800 },
    { date: "2025-11-12", balance: 45000 },
  ],
};

// ============================================
// AGENTS DATA
// ============================================
export const mockAgents = [
  {
    id: "agent_001",
    name: "Savings Optimizer",
    status: "active",
    last_action: "Transferred ₹500 to vault",
    timestamp: "2025-11-12T08:45:00Z",
    actions_count: 24,
    success_rate: 96.5,
    category: "savings",
  },
  {
    id: "agent_002",
    name: "Bill Reminder",
    status: "active",
    last_action: "Reminded about electricity bill",
    timestamp: "2025-11-12T07:30:00Z",
    actions_count: 18,
    success_rate: 100,
    category: "bills",
  },
  {
    id: "agent_003",
    name: "Expense Analyzer",
    status: "idle",
    last_action: "Analyzed weekly spending patterns",
    timestamp: "2025-11-11T22:15:00Z",
    actions_count: 32,
    success_rate: 94.2,
    category: "analytics",
  },
  {
    id: "agent_004",
    name: "Investment Advisor",
    status: "active",
    last_action: "Suggested mutual fund allocation",
    timestamp: "2025-11-12T09:00:00Z",
    actions_count: 15,
    success_rate: 91.8,
    category: "investment",
  },
  {
    id: "agent_005",
    name: "Credit Score Monitor",
    status: "active",
    last_action: "Detected credit score improvement",
    timestamp: "2025-11-12T06:00:00Z",
    actions_count: 12,
    success_rate: 98.5,
    category: "credit",
  },
];

// ============================================
// ANALYTICS DATA
// ============================================
export const mockAnalytics = {
  overview: {
    total_income: 32450,
    total_expenses: 52300,
    net_savings: -19850,
    savings_rate: -61.2,
    flex_score: 745,
    credit_score: 720,
  },
  monthly_trends: {
    income_growth: 12.5,
    expense_growth: -8.3,
    savings_growth: 15.2,
  },
  top_categories: [
    { category: "Shopping", amount: 15200, percentage: 29.1 },
    { category: "Food & Dining", amount: 12500, percentage: 23.9 },
    { category: "Bills & Utilities", amount: 9800, percentage: 18.7 },
  ],
  predictions: {
    next_month_income: 34500,
    next_month_expenses: 48900,
    projected_savings: -14400,
    confidence_score: 87.5,
  },
  goals: [
    {
      id: "goal_001",
      name: "Emergency Fund",
      target_amount: 100000,
      current_amount: 45000,
      progress: 45,
      deadline: "2025-12-31",
      status: "on_track",
    },
    {
      id: "goal_002",
      name: "Vacation Savings",
      target_amount: 50000,
      current_amount: 12000,
      progress: 24,
      deadline: "2026-06-30",
      status: "needs_attention",
    },
  ],
  spending_insights: [
    {
      insight: "Shopping expenses increased by 35% this month",
      severity: "warning",
      category: "Shopping",
    },
    {
      insight: "You're on track to meet your savings goal",
      severity: "success",
      category: "Savings",
    },
    {
      insight: "Electricity bill due in 3 days",
      severity: "info",
      category: "Bills",
    },
  ],
};

// ============================================
// CREDIT SCORE DATA
// ============================================
export const mockCreditScore = {
  current_score: 720,
  previous_score: 695,
  score_change: 25,
  rating: "Good",
  last_updated: "2025-11-01",
  factors: [
    { name: "Payment History", impact: "positive", score: 85 },
    { name: "Credit Utilization", impact: "neutral", score: 72 },
    { name: "Credit Age", impact: "positive", score: 78 },
    { name: "Credit Mix", impact: "negative", score: 65 },
    { name: "Recent Inquiries", impact: "neutral", score: 70 },
  ],
  recommendations: [
    "Keep credit utilization below 30%",
    "Pay all bills on time",
    "Avoid opening multiple credit accounts",
  ],
};

// ============================================
// TRANSACTION HISTORY
// ============================================
export const mockTransactions = [
  {
    id: "tx_001",
    date: "2025-11-12",
    description: "Amazon Purchase",
    category: "Shopping",
    amount: -2499,
    type: "expense",
    status: "completed",
  },
  {
    id: "tx_002",
    date: "2025-11-12",
    description: "Salary Credit",
    category: "Income",
    amount: 35000,
    type: "income",
    status: "completed",
  },
  {
    id: "tx_003",
    date: "2025-11-11",
    description: "Restaurant - Taj",
    category: "Food & Dining",
    amount: -1850,
    type: "expense",
    status: "completed",
  },
  {
    id: "tx_004",
    date: "2025-11-10",
    description: "Uber Ride",
    category: "Transportation",
    amount: -320,
    type: "expense",
    status: "completed",
  },
  {
    id: "tx_005",
    date: "2025-11-10",
    description: "Electricity Bill",
    category: "Bills & Utilities",
    amount: -1200,
    type: "expense",
    status: "completed",
  },
];

// ============================================
// USER PROFILE DATA
// ============================================
export const mockUserProfile = {
  id: "user_001",
  name: "Rahul Sharma",
  email: "rahul.sharma@example.com",
  phone: "+91 98765 43210",
  avatar: null,
  joined_date: "2025-01-15",
  subscription: "premium",
  preferences: {
    currency: "INR",
    language: "en",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    theme: "dark",
  },
  linked_accounts: [
    {
      id: "acc_001",
      bank_name: "HDFC Bank",
      account_number: "****1234",
      account_type: "Savings",
      status: "active",
      last_synced: "2025-11-12T09:00:00Z",
    },
    {
      id: "acc_002",
      bank_name: "ICICI Bank",
      account_number: "****5678",
      account_type: "Credit Card",
      status: "active",
      last_synced: "2025-11-12T08:30:00Z",
    },
  ],
};

// ============================================
// EXPORT ALL
// ============================================
export default {
  mockIncome,
  mockExpenses,
  mockVault,
  mockAgents,
  mockAnalytics,
  mockCreditScore,
  mockTransactions,
  mockUserProfile,
};
