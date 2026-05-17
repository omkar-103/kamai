// data/aiChatData.js

export const AI_RESPONSES = {
  greetings: [
    "Hey there! 👋 I'm Kamai AI — your intelligent financial advisor. How can I help you achieve financial stability today?",
    "Hello! Ready to help you make smarter financial decisions and build long-term financial resilience. What's on your mind?",
    "Hi! I'm here to help with income forecasting, taxes, savings, credit building, and more. What would you like to know?"
  ],
  
  earnings: {
    keywords: ['earning', 'income', 'money', 'made', 'salary', 'revenue', 'today', 'week', 'month'],
    responses: [
      "📊 **Your Earnings Overview**\n\nToday: ₹2,450 (+12% vs yesterday)\nThis Week: ₹18,500 (+8% vs last week)\nThis Month: ₹72,300 (+15% vs last month)\n\nYou're on track to exceed your monthly goal by ₹8,000! Keep up the great work! 🎯",
      "💰 **Earnings Snapshot**\n\nYou've earned ₹2,450 today across 8 completed orders. Your peak earning hours were 12-2 PM and 7-9 PM.\n\n**Pro Tip:** Tomorrow's weather looks great - consider extending your working hours!",
      "📈 **Financial Update**\n\nGreat news! Your earnings are up 15% compared to last month. At this pace, you'll hit ₹75,000 by month-end.\n\nWould you like me to break down earnings by platform?"
    ]
  },
  
  tax: {
    keywords: ['tax', 'gst', 'itr', 'filing', 'deduction', 'save tax', 'income tax'],
    responses: [
      "🧾 **Tax Insights**\n\nEstimated Tax Liability: ₹8,500\nPotential Deductions Found: ₹12,400\nNet Savings Opportunity: ₹3,720\n\n**Deductions Available:**\n• Vehicle maintenance: ₹4,200\n• Phone & internet: ₹2,800\n• Equipment depreciation: ₹5,400\n\nWant me to help you claim these deductions?",
      "💡 **Tax Saving Tip**\n\nBased on your income pattern, you could save approximately ₹15,000 this year by:\n\n1. Tracking fuel expenses (₹6,000 potential)\n2. Claiming phone bills (₹3,600 potential)\n3. Vehicle maintenance receipts (₹5,400 potential)\n\nShall I set up automatic expense tracking?",
      "📋 **Tax Status Update**\n\nYour tax documents are 80% ready for filing. Missing items:\n\n• Bank statement (Oct-Dec)\n• 2 fuel receipts\n\nDeadline: July 31st\nEstimated refund: ₹2,100\n\nNeed help gathering these documents?"
    ]
  },
  
  savings: {
    keywords: ['save', 'saving', 'vault', 'budget', 'goal', 'target', 'invest'],
    responses: [
      "🏦 **Vault Status**\n\nCurrent Balance: ₹2,45,000\nMonthly Auto-Save: ₹5,000\nGoal Progress: 68% complete\n\n**Upcoming Goals:**\n• Emergency Fund: ₹50,000 (2 months away)\n• Bike Upgrade: ₹1,20,000 (8 months away)\n\nWant to increase your auto-save amount?",
      "💎 **Smart Savings Insights**\n\nYou've saved ₹15,000 more than last month! Here's what I noticed:\n\n• Reduced dining expenses by 20%\n• Fuel costs optimized with better routes\n• No unnecessary subscriptions\n\nAt this rate, you'll reach your goal 2 months early! 🎉",
      "📊 **Savings Opportunities**\n\nBased on your spending patterns, here are ways to save more:\n\n1. Switch to weekly fuel filling (Save ₹400/month)\n2. Use partner discounts (Save ₹600/month)\n3. Optimize working routes (Save ₹800/month)\n\nTotal potential: ₹1,800/month extra savings!"
    ]
  },
  
  loans: {
    keywords: ['loan', 'credit', 'borrow', 'emi', 'interest', 'lending'],
    responses: [
      "🏧 **Loan Eligibility**\n\nBased on your profile:\n\n• Credit Score: 750 (Excellent)\n• Max Eligible Amount: ₹2,50,000\n• Best Interest Rate: 10.5% p.a.\n• Recommended EMI: ₹5,500/month\n\nYou qualify for instant approval! Want to explore options?",
      "💳 **Credit Overview**\n\nYour credit health is excellent! Here's what you can access:\n\n• Personal Loan: Up to ₹2.5L @ 10.5%\n• Business Loan: Up to ₹5L @ 12%\n• Credit Line: ₹75,000 instant\n\nNo active loans - your debt-free status is impressive! 👏",
      "📈 **Improve Your Loan Terms**\n\nYour current score: 750\nTarget for best rates: 800\n\n**Tips to boost your score:**\n1. Keep credit utilization below 30%\n2. Pay bills before due dates\n3. Avoid multiple loan inquiries\n\nEstimated improvement: +30 points in 3 months"
    ]
  },
  
  insurance: {
    keywords: ['insurance', 'health', 'accident', 'coverage', 'claim', 'policy'],
    responses: [
      "🛡️ **Insurance Coverage**\n\nActive Policies:\n\n• Health Insurance: ₹5L coverage ✓\n• Accident Cover: ₹10L coverage ✓\n• Vehicle Insurance: Valid till Dec 2025 ✓\n\n**Recommendation:** Consider adding critical illness cover for complete protection.",
      "💊 **Health Cover Analysis**\n\nYour current health cover: ₹5,00,000\n\nBased on your profile, I recommend:\n• Super top-up: ₹10L (₹200/month)\n• Personal accident: ₹15L (₹150/month)\n\nTotal additional cost: ₹350/month for ₹25L extra coverage",
      "📋 **Insurance Tip**\n\nDid you know? As a gig worker, you can claim:\n\n• Vehicle insurance as business expense\n• Health premium under 80D (₹25,000 limit)\n• Accident cover premium deduction\n\nPotential tax saving: ₹7,500/year"
    ]
  },
  
  help: {
    keywords: ['help', 'support', 'how', 'what', 'guide', 'explain', 'assist'],
    responses: [
      "🤖 **How Can I Help?**\n\nI can assist you with:\n\n💰 **Earnings** - Track income & analytics\n🧾 **Taxes** - Deductions & filing help\n💎 **Savings** - Vault & goal management\n🏧 **Loans** - Eligibility & applications\n🛡️ **Insurance** - Coverage & claims\n📊 **Reports** - Financial summaries\n\nJust ask me anything about these topics!",
      "👋 **Welcome to Kamai AI!**\n\nI'm your personal financial stability advisor. Here's what I can do:\n\n• Answer questions about your financial health\n• Provide personalized income forecasts\n• Help with tax optimization calculations\n• Track your savings and credit goals\n• Guide you to financial growth\n\nTry asking: \"How much did I earn today?\"",
      "💡 **Quick Guide**\n\nHere are some things you can ask me:\n\n• \"Show my earnings summary\"\n• \"How can I save on taxes?\"\n• \"What's my savings progress?\"\n• \"Am I eligible for a loan?\"\n• \"Check my insurance coverage\"\n\nI'm here to make finances simple for you!"
    ]
  },

  fallback: [
    "I'm not quite sure about that, but I'm always learning! Could you try asking about your earnings, taxes, savings, loans, or insurance?",
    "Hmm, that's an interesting question! While I figure that out, is there anything else I can help you with - like checking your earnings or tax savings?",
    "I want to give you the best answer possible. Could you rephrase that, or ask me about your financial dashboard, goals, or any specific feature?",
    "I'm still learning about that topic. In the meantime, I can definitely help you with earnings tracking, tax optimization, savings goals, and more!"
  ]
};

export const QUICK_PROMPTS = [
  {
    id: 1,
    icon: '💰',
    label: 'Earnings Today',
    prompt: 'How much have I earned today?',
    category: 'earnings'
  },
  {
    id: 2,
    icon: '🧾',
    label: 'Tax Savings',
    prompt: 'How can I reduce my tax liability?',
    category: 'tax'
  },
  {
    id: 3,
    icon: '🎯',
    label: 'Savings Goal',
    prompt: "What's my savings progress?",
    category: 'savings'
  },
  {
    id: 4,
    icon: '💳',
    label: 'Loan Options',
    prompt: 'Am I eligible for a loan?',
    category: 'loans'
  },
  {
    id: 5,
    icon: '🛡️',
    label: 'Insurance',
    prompt: 'Review my insurance coverage',
    category: 'insurance'
  },
  {
    id: 6,
    icon: '📊',
    label: 'Weekly Report',
    prompt: 'Give me a weekly financial summary',
    category: 'earnings'
  }
];

export const AI_INSIGHTS = [
  {
    id: 1,
    type: 'positive',
    icon: '📈',
    title: 'Earnings Surge',
    description: 'Your earnings are up 23% this week compared to last week',
    action: 'View Details',
    color: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-400'
  },
  {
    id: 2,
    type: 'tip',
    icon: '💡',
    title: 'Tax Saving Alert',
    description: 'You have ₹12,400 in unclaimed deductions this quarter',
    action: 'Claim Now',
    color: 'from-yellow-500/20 to-orange-500/20',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-400'
  },
  {
    id: 3,
    type: 'goal',
    icon: '🎯',
    title: 'Goal Achievement',
    description: "You're just ₹8,000 away from your emergency fund goal",
    action: 'Add Funds',
    color: 'from-[#1BD4CA]/20 to-[#7B6BFF]/20',
    borderColor: 'border-[#1BD4CA]/30',
    textColor: 'text-[#1BD4CA]'
  },
  {
    id: 4,
    type: 'warning',
    icon: '⚠️',
    title: 'Bill Reminder',
    description: 'Vehicle insurance renewal due in 15 days',
    action: 'Renew Now',
    color: 'from-red-500/20 to-pink-500/20',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400'
  }
];

export const DOCUMENT_TYPES = [
  { id: 'receipt', label: 'Receipt/Bill', icon: '🧾' },
  { id: 'invoice', label: 'Invoice', icon: '📄' },
  { id: 'bank', label: 'Bank Statement', icon: '🏦' },
  { id: 'tax', label: 'Tax Document', icon: '📋' },
  { id: 'id', label: 'ID Document', icon: '🪪' },
  { id: 'other', label: 'Other', icon: '📎' }
];

// Function to get AI response based on user message
export function getAIResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check each category for keyword matches
  for (const [category, data] of Object.entries(AI_RESPONSES)) {
    if (category === 'greetings' || category === 'fallback') continue;
    
    if (data.keywords && data.keywords.some(keyword => lowerMessage.includes(keyword))) {
      const responses = data.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  // Check for greetings
  const greetingKeywords = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
  if (greetingKeywords.some(keyword => lowerMessage.includes(keyword))) {
    const greetings = AI_RESPONSES.greetings;
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // Return fallback response
  const fallbacks = AI_RESPONSES.fallback;
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}