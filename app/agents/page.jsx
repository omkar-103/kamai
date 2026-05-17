// app/agents/page.jsx
'use client';

import { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

export default function AgentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actions, setActions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [user, setUser] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef(null);
  
  // Form states for each agent
  const [incomeFormData, setIncomeFormData] = useState({
    dailyEarnings: [
      { date: '2025-11-21', amount: 1200 },
      { date: '2025-11-22', amount: 1450 },
      { date: '2025-11-23', amount: 980 },
      { date: '2025-11-24', amount: 1600 },
      { date: '2025-11-25', amount: 1350 },
      { date: '2025-11-26', amount: 1100 },
      { date: '2025-11-27', amount: 1400 }
    ],
    workingHours: [
      { date: '2025-11-21', hours: 8 },
      { date: '2025-11-22', hours: 9 },
      { date: '2025-11-23', hours: 6 },
      { date: '2025-11-24', hours: 10 },
      { date: '2025-11-25', hours: 8 },
      { date: '2025-11-26', hours: 7 },
      { date: '2025-11-27', hours: 9 }
    ],
    platform: 'Swiggy'
  });

  const [spendingFormData, setSpendingFormData] = useState({
    transactions: [
      { description: 'Swiggy Food Order', amount: 450, date: '2025-11-27', merchant: 'Swiggy' },
      { description: 'Petrol', amount: 800, date: '2025-11-26', merchant: 'HP Petrol' },
      { description: 'Netflix Subscription', amount: 649, date: '2025-11-25', merchant: 'Netflix' },
      { description: 'Grocery Shopping', amount: 2200, date: '2025-11-24', merchant: 'BigBasket' },
      { description: 'Phone Recharge', amount: 299, date: '2025-11-23', merchant: 'Jio' },
      { description: 'Restaurant Dinner', amount: 1200, date: '2025-11-22', merchant: 'Restaurant' },
      { description: 'Amazon Shopping', amount: 3500, date: '2025-11-21', merchant: 'Amazon' }
    ],
    monthlyIncome: 45000
  });

  const [creditFormData, setCreditFormData] = useState({
    taskCompletionRate: 92,
    averageRating: 4.7,
    totalTasksCompleted: 450,
    onTimePayments: { rate: 95, months: 12 },
    accountAge: 18,
    incomeConsistency: 85,
    savingsRate: 15
  });

  const [growthFormData, setGrowthFormData] = useState({
    currentSkills: ['driving', 'navigation', 'customer service'],
    currentPlatforms: ['Swiggy'],
    monthlyEarnings: 28000,
    workingHoursPerWeek: 48,
    location: 'Mumbai',
    interests: ['delivery', 'driving'],
    experience: 12
  });

  const [aiStats, setAiStats] = useState({
    totalAnalyzed: 15420,
    accuracy: 89.2,
    activeSessions: 3,
    lastUpdate: null
  });

  // Fix hydration error - only render time on client
  useEffect(() => {
    setMounted(true);
    setAiStats(prev => ({ ...prev, lastUpdate: new Date() }));
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser({
        name: 'Rahul Kumar',
        email: 'rahul@demo.com',
        vaultBalance: 245000,
        creditScore: 750,
        todayEarnings: 2450,
        weeklyEarnings: 18500,
        isDemo: true
      });
    }
  }, []);

  useEffect(() => {
    fetchAgentActions();
    
    const interval = setInterval(() => {
      if (realTimeUpdates) {
        fetchAgentActions();
        updateAiStats();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [filter, realTimeUpdates]);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setActiveModal(null);
        setApiResponse(null);
      }
    };

    if (activeModal) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [activeModal]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveModal(null);
        setApiResponse(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const updateAiStats = () => {
    setAiStats(prev => ({
      ...prev,
      totalAnalyzed: prev.totalAnalyzed + Math.floor(Math.random() * 10),
      activeSessions: Math.max(1, prev.activeSessions + (Math.random() > 0.5 ? 1 : -1)),
      lastUpdate: new Date()
    }));
  };

  const fetchAgentActions = async () => {
    try {
      setTimeout(() => {
        setActions([
          {
            _id: '1',
            agentType: 'income',
            title: 'Peak Hours Optimization Opportunity',
            description: 'Our AI detected that you\'re missing high-earning opportunities during lunch hours (12-2 PM). Working these hours could increase your daily earnings by ₹850-1200.',
            status: 'active',
            severity: 'warning',
            urgent: true,
            confidence: 0.92,
            realTime: true,
            impact: {
              financial: 25500,
              score: 150,
              timeframe: '30 days'
            },
            aiInsights: {
              model: 'FlexiGPT-v2.1',
              accuracy: '92%',
              dataPoints: 4250,
              recommendation: 'Accept 70% more lunch-hour deliveries to maximize earnings during peak demand.'
            },
            createdAt: new Date()
          },
          {
            _id: '2',
            agentType: 'defense',
            title: 'Fuel Expense Tax Deduction Alert',
            description: 'You have unclaimed fuel receipts worth ₹12,400 that can be used for tax deductions. Upload them before month-end to save on taxes.',
            status: 'pending',
            severity: 'critical',
            urgent: false,
            confidence: 0.88,
            realTime: false,
            impact: {
              financial: 3720,
              score: 80,
              timeframe: '7 days'
            },
            aiInsights: {
              model: 'TaxOptimizer-ML',
              accuracy: '88%',
              dataPoints: 1280,
              recommendation: 'Upload all fuel receipts through the app to automatically claim deductions.'
            },
            createdAt: new Date()
          },
          {
            _id: '3',
            agentType: 'credit',
            title: 'Credit Score Improvement Detected',
            description: 'Your on-time bill payments have positively impacted your credit score. Maintaining this pattern will qualify you for premium financial products.',
            status: 'completed',
            severity: 'success',
            urgent: false,
            confidence: 0.95,
            realTime: true,
            impact: {
              financial: 0,
              score: 25,
              timeframe: 'Immediate'
            },
            aiInsights: {
              model: 'CreditAnalyzer-Pro',
              accuracy: '95%',
              dataPoints: 890,
              recommendation: 'Continue current payment patterns to reach 800+ credit score in 3 months.'
            },
            createdAt: new Date()
          },
          {
            _id: '4',
            agentType: 'growth',
            title: 'Investment Opportunity: High-Yield Savings',
            description: 'Based on your savings pattern, you can earn ₹2,100 more monthly by moving ₹50,000 to a high-yield savings account.',
            status: 'active',
            severity: 'info',
            urgent: false,
            confidence: 0.85,
            realTime: false,
            impact: {
              financial: 25200,
              score: 100,
              timeframe: '1 year'
            },
            aiInsights: {
              model: 'WealthAdvisor-AI',
              accuracy: '85%',
              dataPoints: 2150,
              recommendation: 'Open a Kamai high-yield account with 8.5% annual returns.'
            },
            createdAt: new Date()
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching actions:', error);
      setLoading(false);
    }
  };

  // API call functions
  const callIncomeAPI = async () => {
    setApiLoading(true);
    try {
      const response = await fetch('/api/agent/income-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incomeFormData)
      });
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      setApiResponse({ error: 'Failed to fetch data', details: error.message });
    }
    setApiLoading(false);
  };

  const callSpendingAPI = async () => {
    setApiLoading(true);
    try {
      const response = await fetch('/api/agent/spending-protection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spendingFormData)
      });
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      setApiResponse({ error: 'Failed to fetch data', details: error.message });
    }
    setApiLoading(false);
  };

  const callCreditAPI = async () => {
    setApiLoading(true);
    try {
      const response = await fetch('/api/agent/credit-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creditFormData)
      });
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      setApiResponse({ error: 'Failed to fetch data', details: error.message });
    }
    setApiLoading(false);
  };

  const callGrowthAPI = async () => {
    setApiLoading(true);
    try {
      const response = await fetch('/api/agent/growth-optimization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(growthFormData)
      });
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      setApiResponse({ error: 'Failed to fetch data', details: error.message });
    }
    setApiLoading(false);
  };

  // Color themes
  const agentThemes = {
    income: {
      badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      accent: 'text-emerald-600',
      icon: '💰',
      name: 'Income',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    defense: {
      badge: 'bg-red-100 text-red-800 border border-red-200',
      accent: 'text-red-600',
      icon: '🛡️',
      name: 'Defense',
      gradient: 'from-red-500 to-red-600'
    },
    credit: {
      badge: 'bg-blue-100 text-blue-800 border border-blue-200',
      accent: 'text-blue-600',
      icon: '💳',
      name: 'Credit',
      gradient: 'from-blue-500 to-blue-600'
    },
    growth: {
      badge: 'bg-violet-100 text-violet-800 border border-violet-200',
      accent: 'text-violet-600',
      icon: '📈',
      name: 'Growth',
      gradient: 'from-violet-500 to-violet-600'
    }
  };

  const severityThemes = {
    critical: {
      border: 'border-l-red-500',
      bg: 'bg-red-50',
      icon: '🚨'
    },
    warning: {
      border: 'border-l-amber-500',
      bg: 'bg-amber-50',
      icon: '⚠️'
    },
    success: {
      border: 'border-l-emerald-500',
      bg: 'bg-emerald-50',
      icon: '✅'
    },
    info: {
      border: 'border-l-blue-500',
      bg: 'bg-blue-50',
      icon: 'ℹ️'
    }
  };

  const statusThemes = {
    completed: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    pending: 'bg-amber-100 text-amber-800 border border-amber-200',
    failed: 'bg-red-100 text-red-800 border border-red-200',
    active: 'bg-blue-100 text-blue-800 border border-blue-200'
  };

  const getActionIcon = (action) => {
    if (action.urgent) return '🔥';
    if (action.realTime) return '⚡';
    if (action.confidence > 0.9) return '🎯';
    return severityThemes[action.severity]?.icon || agentThemes[action.agentType]?.icon;
  };

  const filteredActions = filter === 'all' ? actions : actions.filter(a => a.agentType === filter);

  // Format time safely for SSR
  const formatTime = (date) => {
    if (!mounted || !date) return '--:--:--';
    return date.toLocaleTimeString();
  };

  const formatDate = (date) => {
    if (!mounted || !date) return '--/--/----';
    return date.toLocaleDateString();
  };

  // Beautiful Response Display Components
  const IncomeResponseDisplay = ({ data }) => {
    if (!data || !data.success) return null;
    const { analysis, aiModel } = data;
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">💰</span>
            <h3 className="text-xl font-bold">Income Forecast Analysis</h3>
          </div>
          <p className="text-emerald-100">Powered by {aiModel.name}</p>
        </div>

        {/* Current Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            📊 Your Current Performance
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">₹{analysis.currentStats.avgDailyEarning}</p>
              <p className="text-sm text-gray-600">Average Daily Earning</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{analysis.currentStats.avgHoursPerDay} hrs</p>
              <p className="text-sm text-gray-600">Average Hours/Day</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-violet-600">{analysis.currentStats.totalDaysAnalyzed}</p>
              <p className="text-sm text-gray-600">Days Analyzed</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className={`text-2xl font-bold ${parseFloat(analysis.currentStats.trendPercentage) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {parseFloat(analysis.currentStats.trendPercentage) >= 0 ? '+' : ''}{analysis.currentStats.trendPercentage}%
              </p>
              <p className="text-sm text-gray-600">Weekly Trend</p>
            </div>
          </div>
        </div>

        {/* Prediction */}
       <div className="bg-[#14121C] rounded-xl border border-white/10 p-6">
  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
    🔮 Next Week's Earnings Forecast
  </h4>

  <div className="grid grid-cols-3 gap-4 mb-4">

    {/* PESSIMISTIC */}
    <div className="bg-amber-50/10 border border-amber-500/30 rounded-lg p-4 text-center">
      <p className="text-xs text-amber-300 font-medium mb-1">PESSIMISTIC</p>
      <p className="text-xl font-bold text-amber-200">
        ₹{analysis.prediction.nextWeekForecast.pessimistic.toLocaleString()}
      </p>
    </div>

    {/* EXPECTED */}
    <div className="bg-emerald-50/10 border border-emerald-500/30 rounded-lg p-4 text-center">
      <p className="text-xs text-emerald-300 font-medium mb-1">EXPECTED</p>
      <p className="text-2xl font-bold text-emerald-200">
        ₹{analysis.prediction.nextWeekForecast.expected.toLocaleString()}
      </p>
    </div>

    {/* OPTIMISTIC */}
    <div className="bg-blue-50/10 border border-blue-500/30 rounded-lg p-4 text-center">
      <p className="text-xs text-blue-300 font-medium mb-1">OPTIMISTIC</p>
      <p className="text-xl font-bold text-blue-200">
        ₹{analysis.prediction.nextWeekForecast.optimistic.toLocaleString()}
      </p>
    </div>

  </div>

  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-200">
      Confidence: <span className="font-semibold text-white">{analysis.prediction.confidence}</span>
    </span>

    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        analysis.prediction.riskLevel === 'low'
          ? 'bg-emerald-500/20 text-emerald-300'
          : analysis.prediction.riskLevel === 'medium'
          ? 'bg-amber-500/20 text-amber-300'
          : 'bg-red-500/20 text-red-300'
      }`}
    >
      {analysis.prediction.riskLevel.toUpperCase()} RISK
    </span>
  </div>
</div>


        {/* Insights */}
        <div className={`rounded-xl p-6 ${
          analysis.insights.trend === 'upward' ? 'bg-emerald-50 border border-emerald-200' :
          analysis.insights.trend === 'downward' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          <p className="text-lg">{analysis.insights.message}</p>
        </div>

        {/* Recommendations */}
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              💡 Personalized Recommendations
            </h4>
            <div className="space-y-3">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  rec.priority === 'critical' ? 'bg-red-50 border-red-500' :
                  rec.priority === 'high' ? 'bg-amber-50 border-amber-500' :
                  rec.priority === 'medium' ? 'bg-blue-50 border-blue-500' :
                  'bg-gray-50 border-gray-400'
                }`}>
                  <p className="font-medium text-gray-900">{rec.action}</p>
                  <p className="text-sm text-gray-600 mt-1">Impact: {rec.impact}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const SpendingResponseDisplay = ({ data }) => {
    if (!data || !data.success) return null;
    const { analysis, aiModel } = data;
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🛡️</span>
            <h3 className="text-xl font-bold">Spending Protection Report</h3>
          </div>
          <p className="text-red-100">Powered by {aiModel.name}</p>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            📋 Spending Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{analysis.summary.totalTransactions}</p>
              <p className="text-sm text-gray-600">Transactions</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-600">₹{analysis.summary.totalSpending.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{analysis.summary.spendingRatio}</p>
              <p className="text-sm text-gray-600">of Income</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className={`text-2xl font-bold ${
                analysis.summary.spendingHealthScore >= 80 ? 'text-emerald-600' :
                analysis.summary.spendingHealthScore >= 60 ? 'text-amber-600' :
                'text-red-600'
              }`}>
                {analysis.summary.spendingHealthScore}/100
              </div>
              <p className="text-sm text-gray-600">Health Score</p>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            📊 Category Breakdown
          </h4>
          <div className="space-y-3">
            {analysis.categoryBreakdown.filter(cat => cat.total > 0).map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {category.category === 'food' ? '🍔' :
                     category.category === 'transport' ? '🚗' :
                     category.category === 'entertainment' ? '🎬' :
                     category.category === 'shopping' ? '🛒' :
                     category.category === 'utilities' ? '💡' :
                     category.category === 'health' ? '🏥' :
                     category.category === 'education' ? '📚' : '📦'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{category.category}</p>
                    <p className="text-sm text-gray-500">{category.transactionCount} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{category.total.toLocaleString()}</p>
                  <p className={`text-sm ${category.status === 'over_limit' ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    {category.percentage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
      {analysis.alerts && analysis.alerts.length > 0 && (
  <div className="bg-[#14121C] rounded-xl border border-white/10 p-6">
    
    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
      ⚠️ Spending Alerts
    </h4>

    <div className="space-y-3">

      {analysis.alerts.map((alert, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border-l-4 ${
            alert.severity === "critical"
              ? "bg-red-500/10 border-red-500"
              : "bg-amber-500/10 border-amber-500"
          }`}
        >
          {/* Alert Message */}
          <p
            className={`font-medium ${
              alert.severity === "critical" ? "text-red-300" : "text-amber-300"
            }`}
          >
            {alert.message}
          </p>

          {/* Alert Details */}
          <div className="flex gap-4 mt-2 text-sm text-gray-300">
            <span>Current: ₹{alert.currentSpending.toLocaleString()}</span>
            <span>Limit: ₹{alert.recommendedLimit.toLocaleString()}</span>

            <span className="text-red-400 font-semibold">
              Over by: ₹{alert.overSpent.toLocaleString()}
            </span>
          </div>
        </div>
      ))}

    </div>
  </div>
)}


        {/* Savings Potential */}
        <div className={`rounded-xl p-6 ${
          analysis.savings.potentialMonthlySavings > 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-green-50 border border-green-200'
        }`}>
          <p className="text-lg font-medium text-gray-900">{analysis.savings.message}</p>
          {analysis.savings.potentialMonthlySavings > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              That's ₹{analysis.savings.potentialYearlySavings.toLocaleString()} per year!
            </p>
          )}
        </div>
      </div>
    );
  };

  const CreditResponseDisplay = ({ data }) => {
    if (!data || !data.success) return null;
    const { creditScore, scoreBreakdown, improvements, benefits, aiModel } = data;
    
    return (
      <div className="space-y-6">
        {/* Header with Score */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">💳</span>
                <h3 className="text-xl font-bold">Your FlexScore</h3>
              </div>
              <p className="text-blue-100">Powered by {aiModel.name}</p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-bold">{creditScore.flexScore}</p>
              <p className={`text-lg font-semibold px-3 py-1 rounded-full inline-block mt-2 ${
                creditScore.tier === 'Excellent' ? 'bg-emerald-400' :
                creditScore.tier === 'Good' ? 'bg-blue-400' :
                creditScore.tier === 'Fair' ? 'bg-amber-400' :
                'bg-orange-400'
              }`}>
                {creditScore.tier}
              </p>
            </div>
          </div>
        </div>

       {/* Score Description */}
<div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
  <p className="text-blue-300">{creditScore.tierDescription}</p>

  <p className="text-sm text-blue-400 mt-2">
    Potential Score:{" "}
    <span className="font-bold text-blue-300">{creditScore.potentialScore}</span>{" "}
    (with improvements)
  </p>
</div>


        {/* Score Breakdown */}
      <div className="bg-[#14121C] rounded-xl border border-white/10 p-6">
  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
    📊 Score Breakdown
  </h4>

  <div className="space-y-4">
    {scoreBreakdown.map((component, index) => (
      <div key={index}>
        {/* Label Row */}
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-300 capitalize">
            {component.component}
          </span>
          <span className="text-gray-400">
            {component.score}/{component.maxScore} ({component.percentage})
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              parseInt(component.percentage) >= 80
                ? "bg-emerald-400"
                : parseInt(component.percentage) >= 60
                ? "bg-blue-400"
                : parseInt(component.percentage) >= 40
                ? "bg-amber-400"
                : "bg-red-500"
            }`}
            style={{ width: component.percentage }}
          ></div>
        </div>
      </div>
    ))}
  </div>
</div>


        {/* Improvements */}
        {improvements && improvements.length > 0 && (
  <div className="bg-[#14121C] rounded-xl border border-white/10 p-6">
    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
      🎯 How to Improve Your Score
    </h4>

    <div className="space-y-3">
      {improvements.map((improvement, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border-l-4 ${
            improvement.priority === "critical"
              ? "bg-red-500/10 border-red-500"
              : improvement.priority === "high"
              ? "bg-amber-500/10 border-amber-500"
              : "bg-blue-500/10 border-blue-500"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-white">{improvement.area}</p>
              <p className="text-sm text-gray-300 mt-1">{improvement.action}</p>
            </div>

            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded text-sm font-medium">
              +{improvement.potentialGain} pts
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


        {/* Benefits */}
        <div className="bg-[#14121C] rounded-xl border border-white/10 p-6">
  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
    🎁 Unlocked Benefits
  </h4>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {benefits.unlocked.map((benefit, index) => (
      <div
        key={index}
        className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30"
      >
        <span className="text-xl">✅</span>

        <div>
          <p className="font-medium text-emerald-300">{benefit.name}</p>
          <p className="text-sm text-emerald-400">{benefit.description}</p>
        </div>
      </div>
    ))}
  </div>

  {/* Locked Benefits */}
  {benefits.locked && benefits.locked.length > 0 && (
    <>
      <h5 className="font-medium text-gray-300 mt-6 mb-3">🔒 Unlock Next:</h5>

      <div className="space-y-2">
        {benefits.locked.map((benefit, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 
                       bg-gray-800 rounded-lg border border-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🔒</span>

              <div>
                <p className="font-medium text-gray-200">{benefit.name}</p>
                <p className="text-sm text-gray-400">{benefit.description}</p>
              </div>
            </div>

            <span className="text-sm text-gray-300 bg-gray-700 px-2 py-1 rounded">
              {benefit.pointsNeeded} pts to unlock
            </span>
          </div>
        ))}
      </div>
    </>
  )}
</div>

      </div>
    );
  };

  const GrowthResponseDisplay = ({ data }) => {
    if (!data || !data.success) return null;
    const { currentAnalysis, platformRecommendations, skillRecommendations, optimizations, growthProjection, immediateActions, aiModel } = data;
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📈</span>
            <h3 className="text-xl font-bold">Growth & Optimization Report</h3>
          </div>
          <p className="text-violet-100">Powered by {aiModel.name}</p>
        </div>

        {/* Current Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            📊 Current Situation
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-violet-600">₹{currentAnalysis.monthlyEarnings.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Monthly Earnings</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">₹{currentAnalysis.hourlyRate}</p>
              <p className="text-sm text-gray-600">Hourly Rate</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{currentAnalysis.weeklyHours} hrs</p>
              <p className="text-sm text-gray-600">Weekly Hours</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className={`text-2xl font-bold ${
                currentAnalysis.efficiency === 'High' ? 'text-emerald-600' :
                currentAnalysis.efficiency === 'Medium' ? 'text-amber-600' :
                'text-red-600'
              }`}>
                {currentAnalysis.efficiency}
              </p>
              <p className="text-sm text-gray-600">Efficiency</p>
            </div>
          </div>
        </div>

        {/* Growth Projection */}
        <div className="bg-[#14121C] rounded-xl border border-white/10 p-6">
  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
    🚀 Projected Growth
  </h4>

  <div className="grid grid-cols-4 gap-4">

    {/* NOW */}
    <div className="text-center">
      <p className="text-sm text-gray-400 mb-1">Now</p>
      <p className="text-xl font-bold text-white">
        ₹{growthProjection.current.toLocaleString()}
      </p>
    </div>

    {/* 3 Months */}
    <div className="text-center">
      <p className="text-sm text-gray-400 mb-1">3 Months</p>
      <p className="text-xl font-bold text-blue-300">
        ₹{growthProjection.threeMonths.toLocaleString()}
      </p>
    </div>

    {/* 6 Months */}
    <div className="text-center">
      <p className="text-sm text-gray-400 mb-1">6 Months</p>
      <p className="text-xl font-bold text-violet-300">
        ₹{growthProjection.sixMonths.toLocaleString()}
      </p>
    </div>

    {/* 1 Year */}
    <div className="text-center">
      <p className="text-sm text-gray-400 mb-1">1 Year</p>
      <p className="text-xl font-bold text-emerald-300">
        ₹{growthProjection.oneYear.toLocaleString()}
      </p>
    </div>

  </div>
</div>


        {/* Immediate Actions */}
        <div className="bg-[#14121C] rounded-xl border border-white/10 p-6">
  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
    ⚡ Do This Now
  </h4>

  <div className="space-y-3">
    {immediateActions.map((action, index) => (
      <div
        key={index}
        className="flex items-center gap-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg"
      >
        <span className="bg-amber-500 text-black font-extrabold w-8 h-8 rounded-full flex items-center justify-center">
          {action.priority}
        </span>

        <div className="flex-1">
          <p className="font-medium text-white">{action.action}</p>
          <p className="text-sm text-gray-300">
            Time: {action.timeRequired} • Impact: {action.impact}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>


        {/* Platform Recommendations */}
       {platformRecommendations && platformRecommendations.length > 0 && (
  <div className="bg-[#14121C] rounded-xl border border-white/10 p-6">
    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
      📱 Recommended Platforms
    </h4>

    <div className="space-y-3">
      {platformRecommendations.slice(0, 3).map((platform, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border ${
            platform.hasRequiredSkills
              ? "bg-emerald-500/10 border-emerald-500/30"
              : "bg-gray-800 border-white/10"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white">{platform.platform}</p>

                {platform.hasRequiredSkills && (
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded">
                    Ready to Join!
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-300 mt-1">{platform.recommendation}</p>
              <p className="text-xs text-gray-400 mt-1">
                Peak Hours: {platform.peakHours}
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold text-emerald-300">
                ₹{platform.potentialMonthlyEarning.toLocaleString()}/mo
              </p>
              <p className="text-sm text-emerald-400">
                +{platform.earningIncrease}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


        {/* Skill Recommendations */}
      {skillRecommendations && skillRecommendations.length > 0 && (
  <div className="bg-[#14121C] rounded-xl border border-white/10 p-6">
    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
      🎓 Skills to Learn
    </h4>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {skillRecommendations.slice(0, 4).map((skill, index) => (
        <div
          key={index}
          className="p-4 bg-gray-800 border border-white/10 rounded-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-white">{skill.skill}</p>
              <p className="text-sm text-gray-300">
                Learn in {skill.learningTime}
              </p>

              {/* DEMAND BADGE */}
              <span
                className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                  skill.demand === "very high"
                    ? "bg-red-500/20 text-red-300"
                    : skill.demand === "high"
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-gray-500/20 text-gray-300"
                }`}
              >
                {skill.demand.toUpperCase()} DEMAND
              </span>
            </div>

            <div className="text-right">
              <p className="font-bold text-emerald-300">+{skill.salaryBoost}</p>
              <p className="text-sm text-emerald-400">
                ₹{skill.potentialExtraEarning.toLocaleString()}/mo
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


      </div>
    );
  };

  // Render appropriate response display based on agent type
  const renderResponseDisplay = () => {
    if (!apiResponse) return null;
    
    if (apiResponse.error) {
      return (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 text-red-700">
            <span className="text-2xl">❌</span>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{apiResponse.error}</p>
              {apiResponse.details && <p className="text-xs mt-1">{apiResponse.details}</p>}
            </div>
          </div>
        </div>
      );
    }

    switch (apiResponse.agentType) {
      case 'income':
        return <IncomeResponseDisplay data={apiResponse} />;
      case 'defense':
        return <SpendingResponseDisplay data={apiResponse} />;
      case 'credit':
        return <CreditResponseDisplay data={apiResponse} />;
      case 'growth':
        return <GrowthResponseDisplay data={apiResponse} />;
      default:
        return (
          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        );
    }
  };

  // Modal Component
  const AgentModal = ({ agent, onClose }) => {
    if (!agent) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div 
          ref={modalRef}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Modal Header */}
          <div className={`bg-gradient-to-r ${agentThemes[agent].gradient} p-6 rounded-t-2xl sticky top-0 z-10`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{agentThemes[agent].icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{agentThemes[agent].name} Agent</h2>
                  <p className="text-white/80 text-sm">Configure and run analysis</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white text-3xl font-bold hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-all"
              >
                ×
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {agent === 'income' && (
              <IncomeAgentForm 
                formData={incomeFormData} 
                setFormData={setIncomeFormData}
                onSubmit={callIncomeAPI}
                loading={apiLoading}
              />
            )}
            {agent === 'defense' && (
              <SpendingAgentForm 
                formData={spendingFormData} 
                setFormData={setSpendingFormData}
                onSubmit={callSpendingAPI}
                loading={apiLoading}
              />
            )}
            {agent === 'credit' && (
              <CreditAgentForm 
                formData={creditFormData} 
                setFormData={setCreditFormData}
                onSubmit={callCreditAPI}
                loading={apiLoading}
              />
            )}
            {agent === 'growth' && (
              <GrowthAgentForm 
                formData={growthFormData} 
                setFormData={setGrowthFormData}
                onSubmit={callGrowthAPI}
                loading={apiLoading}
              />
            )}

            {/* API Response Display */}
            {apiResponse && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">📊 Analysis Results</h3>
                  <button 
                    onClick={() => setApiResponse(null)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Clear Results
                  </button>
                </div>
                {renderResponseDisplay()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Income Agent Form Component
  const IncomeAgentForm = ({ formData, setFormData, onSubmit, loading }) => {
    const [newEarning, setNewEarning] = useState({ date: '', amount: '' });

    const addEarning = () => {
      if (newEarning.date && newEarning.amount) {
        setFormData(prev => ({
          ...prev,
          dailyEarnings: [...prev.dailyEarnings, { 
            date: newEarning.date, 
            amount: parseInt(newEarning.amount) 
          }]
        }));
        setNewEarning({ date: '', amount: '' });
      }
    };

    const removeEarning = (index) => {
      setFormData(prev => ({
        ...prev,
        dailyEarnings: prev.dailyEarnings.filter((_, i) => i !== index)
      }));
    };

 return (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Platform
      </label>

      <select
        value={formData.platform}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, platform: e.target.value }))
        }
        className="
          w-full p-3 rounded-xl 
          bg-gray-800 text-white
          border border-gray-600
          focus:ring-2 focus:ring-emerald-500 focus:border-transparent
          appearance-none
        "
        style={{
          // Force dropdown text to stay visible on most browsers
          colorScheme: "dark",
        }}
      >
        <option className="bg-gray-900 text-white" value="Swiggy">
          Swiggy
        </option>
        <option className="bg-gray-900 text-white" value="Zomato">
          Zomato
        </option>
        <option className="bg-gray-900 text-white" value="Uber">
          Uber
        </option>
        <option className="bg-gray-900 text-white" value="Ola">
          Ola
        </option>
        <option className="bg-gray-900 text-white" value="Rapido">
          Rapido
        </option>
        <option className="bg-gray-900 text-white" value="Dunzo">
          Dunzo
        </option>
      </select>
    </div>

    {/* Rest of your code unchanged */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Daily Earnings
      </label>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {formData.dailyEarnings.map((earning, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-gray-900 p-3 rounded-lg"
          >
            <span className="text-sm text-gray-300">{earning.date}</span>
            <span className="font-medium text-white">₹{earning.amount}</span>
            <button
              onClick={() => removeEarning(index)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <input
          type="date"
          value={newEarning.date}
          onChange={(e) =>
            setNewEarning((prev) => ({ ...prev, date: e.target.value }))
          }
          className="flex-1 p-2 border border-gray-700 bg-gray-800 text-white rounded-lg"
        />

        <input
          type="number"
          placeholder="Amount"
          value={newEarning.amount}
          onChange={(e) =>
            setNewEarning((prev) => ({ ...prev, amount: e.target.value }))
          }
          className="flex-1 p-2 border border-gray-700 bg-gray-800 text-white rounded-lg"
        />

        <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
          Add
        </button>
      </div>
    </div>

    <button
      onClick={onSubmit}
      disabled={loading}
      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Analyzing...
        </>
      ) : (
        <>🚀 Run Income Forecast</>
      )}
    </button>
  </div>
);

  };

  // Spending Agent Form Component
  const SpendingAgentForm = ({ formData, setFormData, onSubmit, loading }) => {
    const [newTransaction, setNewTransaction] = useState({ 
      description: '', 
      amount: '', 
      date: '', 
      merchant: '' 
    });

    const addTransaction = () => {
      if (newTransaction.description && newTransaction.amount) {
        setFormData(prev => ({
          ...prev,
          transactions: [...prev.transactions, { 
            ...newTransaction, 
            amount: parseInt(newTransaction.amount) 
          }]
        }));
        setNewTransaction({ description: '', amount: '', date: '', merchant: '' });
      }
    };

    const removeTransaction = (index) => {
      setFormData(prev => ({
        ...prev,
        transactions: prev.transactions.filter((_, i) => i !== index)
      }));
    };

    return (
  <div className="space-y-6">

    {/* Monthly Income */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Monthly Income (₹)
      </label>
      <input
        type="number"
        value={formData.monthlyIncome}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            monthlyIncome: parseInt(e.target.value),
          }))
        }
        className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-xl 
                   focus:ring-2 focus:ring-red-500 focus:border-transparent"
      />
    </div>

    {/* Recent Transactions */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Recent Transactions
      </label>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {formData.transactions.map((tx, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-gray-900 border border-white/10 p-3 rounded-lg"
          >
            <div className="flex-1">
              <span className="text-sm font-medium text-white">{tx.description}</span>
              <span className="text-sm text-gray-400 ml-2">({tx.merchant})</span>
            </div>

            <span className="font-medium text-red-400">-₹{tx.amount}</span>

            <button
              onClick={() => removeTransaction(index)}
              className="text-red-400 hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Add new transaction */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <input
          type="text"
          placeholder="Description"
          value={newTransaction.description}
          onChange={(e) =>
            setNewTransaction((prev) => ({ ...prev, description: e.target.value }))
          }
          className="p-2 border border-gray-700 bg-gray-800 text-white rounded-lg"
        />

        <input
          type="text"
          placeholder="Merchant"
          value={newTransaction.merchant}
          onChange={(e) =>
            setNewTransaction((prev) => ({ ...prev, merchant: e.target.value }))
          }
          className="p-2 border border-gray-700 bg-gray-800 text-white rounded-lg"
        />

        <input
          type="date"
          value={newTransaction.date}
          onChange={(e) =>
            setNewTransaction((prev) => ({ ...prev, date: e.target.value }))
          }
          className="p-2 border border-gray-700 bg-gray-800 text-white rounded-lg"
        />

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction((prev) => ({ ...prev, amount: e.target.value }))
            }
            className="flex-1 p-2 border border-gray-700 bg-gray-800 text-white rounded-lg"
          />

          <button
            onClick={addTransaction}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Add
          </button>
        </div>
      </div>
    </div>

    {/* Submit Button */}
    <button
      onClick={onSubmit}
      disabled={loading}
      className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white 
                 rounded-xl font-medium hover:from-red-600 hover:to-red-700 
                 disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Analyzing...
        </>
      ) : (
        <>🛡️ Analyze Spending</>
      )}
    </button>
  </div>
);

  };

  // Credit Agent Form Component
  const CreditAgentForm = ({ formData, setFormData, onSubmit, loading }) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Completion Rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.taskCompletionRate}
              onChange={(e) => setFormData(prev => ({ ...prev, taskCompletionRate: parseInt(e.target.value) }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Average Rating (out of 5)</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.averageRating}
              onChange={(e) => setFormData(prev => ({ ...prev, averageRating: parseFloat(e.target.value) }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Tasks Completed</label>
            <input
              type="number"
              value={formData.totalTasksCompleted}
              onChange={(e) => setFormData(prev => ({ ...prev, totalTasksCompleted: parseInt(e.target.value) }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Age (months)</label>
            <input
              type="number"
              value={formData.accountAge}
              onChange={(e) => setFormData(prev => ({ ...prev, accountAge: parseInt(e.target.value) }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">On-Time Payment Rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.onTimePayments.rate}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                onTimePayments: { ...prev.onTimePayments, rate: parseInt(e.target.value) }
              }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Income Consistency (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.incomeConsistency}
              onChange={(e) => setFormData(prev => ({ ...prev, incomeConsistency: parseInt(e.target.value) }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Savings Rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.savingsRate}
              onChange={(e) => setFormData(prev => ({ ...prev, savingsRate: parseInt(e.target.value) }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Calculating...
            </>
          ) : (
            <>💳 Calculate Credit Score</>
          )}
        </button>
      </div>
    );
  };

  // Growth Agent Form Component
  const GrowthAgentForm = ({ formData, setFormData, onSubmit, loading }) => {
    const availableSkills = [
      'driving', 'bike riding', 'customer service', 'navigation', 'basic english',
      'smartphone repair', 'electrical work', 'plumbing', 'ac repair', 'cooking',
      'photography', 'social media', 'sales', 'data entry'
    ];

    const availablePlatforms = [
      'Swiggy', 'Zomato', 'Uber', 'Ola', 'Rapido', 'Dunzo', 
      'Urban Company', 'PhonePe', 'Meesho', 'Amazon Flex'
    ];

    const addSkill = (skill) => {
      if (!formData.currentSkills.includes(skill)) {
        setFormData(prev => ({
          ...prev,
          currentSkills: [...prev.currentSkills, skill]
        }));
      }
    };

    const removeSkill = (skill) => {
      setFormData(prev => ({
        ...prev,
        currentSkills: prev.currentSkills.filter(s => s !== skill)
      }));
    };

    const togglePlatform = (platform) => {
      if (formData.currentPlatforms.includes(platform)) {
        setFormData(prev => ({
          ...prev,
          currentPlatforms: prev.currentPlatforms.filter(p => p !== platform)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          currentPlatforms: [...prev.currentPlatforms, platform]
        }));
      }
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Earnings (₹)</label>
            <input
              type="number"
              value={formData.monthlyEarnings}
              onChange={(e) => setFormData(prev => ({ ...prev, monthlyEarnings: parseInt(e.target.value) }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Working Hours</label>
            <input
              type="number"
              value={formData.workingHoursPerWeek}
              onChange={(e) => setFormData(prev => ({ ...prev, workingHoursPerWeek: parseInt(e.target.value) }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Skills</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.currentSkills.map((skill) => (
              <span 
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm"
              >
                {skill}
                <button onClick={() => removeSkill(skill)} className="text-violet-500 hover:text-violet-700 ml-1">×</button>
              </span>
            ))}
          </div>
          <select
            value=""
            onChange={(e) => { addSkill(e.target.value); e.target.value = ''; }}
            className="w-full p-2 border border-gray-200 rounded-lg"
          >
            <option value="">+ Add a skill</option>
            {availableSkills.filter(s => !formData.currentSkills.includes(s)).map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Platforms</label>
          <div className="flex flex-wrap gap-2">
            {availablePlatforms.map((platform) => (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  formData.currentPlatforms.includes(platform)
                    ? 'bg-violet-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl font-medium hover:from-violet-600 hover:to-violet-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : (
            <>📈 Get Growth Recommendations</>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onToggleSidebar={toggleSidebar} />
      
      <div className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
          <div className="min-h-screen">
            <div className="p-4 md:p-6 lg:p-8 space-y-8">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-900">
                      🤖 AI Agents Dashboard
                    </h1>
                    {realTimeUpdates && (
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-emerald-600">LIVE</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Powered by FlexiGPT-v2.1 • {aiStats.accuracy}% Accuracy • Last scan: {formatTime(aiStats.lastUpdate)}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                    className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 border ${
                      realTimeUpdates 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {realTimeUpdates ? '🟢 Live Updates' : '⚫ Updates Off'}
                  </button>
                  <button
                    onClick={() => fetchAgentActions()}
                    className="px-4 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm"
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {/* AI Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Data Points', value: aiStats.totalAnalyzed.toLocaleString(), desc: 'Analyzed', color: 'blue' },
                  { label: 'Accuracy', value: `${aiStats.accuracy}%`, desc: 'ML Confidence', color: 'emerald' },
                  { label: 'Active Agents', value: aiStats.activeSessions, desc: 'Monitoring', color: 'amber' },
                  { label: 'Critical Alerts', value: actions.filter(a => a.severity === 'critical').length, desc: 'Need Attention', color: 'red' }
                ].map((stat, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="space-y-2">
                      <p className={`text-sm font-medium text-${stat.color}-600`}>{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Agent Filter Tabs with Configure Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(agentThemes).map(([agent, theme]) => {
                  const count = actions.filter(a => a.agentType === agent).length;
                  const criticalCount = actions.filter(a => a.agentType === agent && a.severity === 'critical').length;
                  
                  return (
                    <div
                      key={agent}
                      className={`bg-white p-6 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                        filter === agent ? 'border-gray-300 shadow-md ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-200'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div 
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${theme.badge} cursor-pointer`}
                            onClick={() => setFilter(filter === agent ? 'all' : agent)}
                          >
                            <span>{theme.icon}</span>
                            {theme.name} Agent
                          </div>
                          <button
                            onClick={() => {
                              setActiveModal(agent);
                              setApiResponse(null);
                            }}
                            className={`px-3 py-1.5 bg-gradient-to-r ${theme.gradient} text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity`}
                          >
                            Configure
                          </button>
                        </div>
                        
                        <div className="flex items-end justify-between">
                          <div className="space-y-1">
                            <p className="text-2xl font-bold text-gray-900">{count}</p>
                            <p className="text-sm text-gray-600">Active Actions</p>
                          </div>
                          {criticalCount > 0 && (
                            <div className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-xs font-semibold border border-red-200">
                              {criticalCount} Critical
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">🚀 Quick Agent Analysis</h3>
                    <p className="text-gray-300 text-sm">Run any agent with your custom data</p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {Object.entries(agentThemes).map(([agent, theme]) => (
                      <button
                        key={agent}
                        onClick={() => {
                          setActiveModal(agent);
                          setApiResponse(null);
                        }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
                      >
                        <span>{theme.icon}</span>
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions List */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="px-8 py-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-gray-900">🎯 AI Agent Actions</h2>
                      {filter !== 'all' && (
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${agentThemes[filter]?.badge}`}>
                          {agentThemes[filter]?.name.toUpperCase()} ONLY
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {filteredActions.length} actions • Real-time analysis
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  {loading ? (
                    <div className="text-center py-16">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500 mx-auto mb-6"></div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">🤖 AI Analyzing Your Data</h3>
                      <p className="text-gray-600">Processing financial patterns & opportunities...</p>
                    </div>
                  ) : filteredActions.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-xl">
                      <div className="text-6xl mb-6">🤖</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Actions Found</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        {filter !== 'all' ? `No ${agentThemes[filter]?.name} agent actions at the moment.` : 'Our AI agents are analyzing your data. Check back soon!'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredActions.map((action) => (
                        <div
                          key={action._id}
                          className={`bg-white rounded-2xl border-2 shadow-sm hover:shadow-md transition-all duration-200 ${severityThemes[action.severity]?.border} ${severityThemes[action.severity]?.bg}`}
                        >
                          <div className="p-8">
                            <div className="flex items-start justify-between mb-6">
                              <div className="flex items-start gap-4">
                                <div className="text-3xl">{getActionIcon(action)}</div>
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${agentThemes[action.agentType]?.badge}`}>
                                      {action.agentType.toUpperCase()}
                                    </span>
                                    {action.confidence && (
                                      <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">
                                        {Math.round(action.confidence * 100)}% Confidence
                                      </span>
                                    )}
                                    {action.urgent && (
                                      <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold border border-red-200 animate-pulse">
                                        🔥 URGENT
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                    {action.title}
                                  </h3>
                                </div>
                              </div>
                              
                              <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${statusThemes[action.status]}`}>
                                {action.status.charAt(0).toUpperCase() + action.status.slice(1)}
                              </span>
                            </div>
                            
                            <div className="mb-8">
                              <p className="text-gray-700 text-base leading-relaxed">
                                {action.description}
                              </p>
                            </div>
                            
                            {action.impact && (
                              <div className="mb-8">
                                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  📊 PROJECTED IMPACT
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {action.impact.financial > 0 && (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                                      <div className="text-3xl font-bold text-emerald-700 mb-2">
                                        ₹{action.impact.financial.toLocaleString()}
                                      </div>
                                      <div className="text-sm font-medium text-emerald-600">
                                        Financial Impact
                                      </div>
                                    </div>
                                  )}
                                  {action.impact.score && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                                      <div className={`text-3xl font-bold mb-2 ${action.impact.score > 0 ? 'text-blue-700' : 'text-red-700'}`}>
                                        {action.impact.score > 0 ? '+' : ''}{action.impact.score}
                                      </div>
                                      <div className="text-sm font-medium text-blue-600">
                                        FlexScore Points
                                      </div>
                                    </div>
                                  )}
                                  {action.impact.timeframe && (
                                    <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 text-center">
                                      <div className="text-xl font-bold text-violet-700 mb-2">
                                        {action.impact.timeframe}
                                      </div>
                                      <div className="text-sm font-medium text-violet-600">
                                        Expected Timeline
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {action.aiInsights && (
                              <div className="mb-8">
                                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  🧠 AI INSIGHTS
                                </h4>
                                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-indigo-900">Model:</span>
                                        <span className="text-sm font-semibold text-indigo-700">{action.aiInsights.model}</span>
                                      </div>
                                      {action.aiInsights.accuracy && (
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm font-medium text-indigo-900">Accuracy:</span>
                                          <span className="text-sm font-semibold text-indigo-700">{action.aiInsights.accuracy}</span>
                                        </div>
                                      )}
                                      {action.aiInsights.dataPoints && (
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm font-medium text-indigo-900">Data Points:</span>
                                          <span className="text-sm font-semibold text-indigo-700">{action.aiInsights.dataPoints.toLocaleString()}</span>
                                        </div>
                                      )}
                                    </div>
                                  {action.aiInsights.recommendation && (
  <div className="md:col-span-1">
    <div className="space-y-2">
     <span className="text-sm font-medium text-black">Recommendation:</span>
<p className="text-sm text-black bg-gray-700 p-3 rounded-lg border border-gray-600 shadow-sm">
        {action.aiInsights.recommendation}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                              <span className="text-sm text-gray-500 font-medium">
                                Generated: {formatDate(action.createdAt)} at {formatTime(action.createdAt)}
                              </span>
                              {action.realTime && (
                                <span className="text-sm text-blue-600 font-semibold flex items-center gap-1">
                                  ⚡ Real-time Alert
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <Footer />
        </div>
      </div>

      {/* Agent Modal */}
      {activeModal && (
        <AgentModal 
          agent={activeModal} 
          onClose={() => {
            setActiveModal(null);
            setApiResponse(null);
          }} 
        />
      )}
    </div>
  );
}