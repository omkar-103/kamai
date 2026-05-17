'use client';

import { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  TrendingUp, TrendingDown, IndianRupee, RefreshCw, 
  Download, Filter, Calendar, MoreVertical
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('30');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Set demo user if no user data
      setUser({
        name: 'Rahul Kumar',
        email: 'rahul@demo.com',
        vaultBalance: 245000,
        creditScore: 750,
        monthlyIncome: 68000,
        totalSavings: 245000,
        isDemo: true
      });
    }
    
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Simulated API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo data
      const demoAnalytics = {
        summary: {
          totalIncome: 68000,
          totalExpenses: 38500,
          netSavings: 29500,
          savingsRate: 43.4,
          vaultBalance: 245000,
          flexScore: 85,
          avgDailyIncome: 2267,
          avgDailyExpense: 1283
        },
        incomeBySource: {
          'Swiggy': 28500,
          'Zomato': 22000,
          'Uber': 17500
        },
        expensesByCategory: {
          'essential': 15000,
          'discretionary': 12000,
          'investment': 8000,
          'emergency': 3500
        },
        dailyTrends: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
          income: Math.floor(Math.random() * 3000) + 1500,
          expenses: Math.floor(Math.random() * 2000) + 800,
          net: 0
        })).map(d => ({ ...d, net: d.income - d.expenses }))
      };
      
      setAnalytics(demoAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
    setTimeout(() => setRefreshing(false), 2000);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-[#080715] text-white flex flex-col">
        <Navbar user={user} onToggleSidebar={toggleSidebar} />
        
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
          
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1BD4CA] mx-auto"></div>
              <p className="mt-4 text-white/60">Loading analytics...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const { summary, incomeBySource, expensesByCategory, dailyTrends } = analytics;

  // Chart Data
  const incomeExpenseTrendData = {
    labels: dailyTrends.map(d => new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Income',
        data: dailyTrends.map(d => d.income),
        borderColor: '#1BD4CA',
        backgroundColor: 'rgba(27, 212, 202, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: dailyTrends.map(d => d.expenses),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const incomeBySourceData = {
    labels: Object.keys(incomeBySource),
    datasets: [{
      label: 'Income by Source',
      data: Object.values(incomeBySource),
      backgroundColor: [
        'rgba(27, 212, 202, 0.8)',
        'rgba(123, 107, 255, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(236, 72, 153, 0.8)'
      ],
      borderColor: [
        '#1BD4CA',
        '#7B6BFF',
        '#fb923c',
        '#a855f7',
        '#ec4899'
      ],
      borderWidth: 2
    }]
  };

  const expensesByCategoryData = {
    labels: Object.keys(expensesByCategory).map(cat => 
      cat.charAt(0).toUpperCase() + cat.slice(1)
    ),
    datasets: [{
      label: 'Expenses by Category',
      data: Object.values(expensesByCategory),
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)'
      ],
      borderColor: [
        '#ef4444',
        '#fb923c',
        '#22c55e',
        '#3b82f6'
      ],
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(8, 7, 21, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        },
        beginAtZero: true
      }
    }
  };

  // Stats Card Component
  const StatsCard = ({ title, value, subValue, trend, icon: Icon, color }) => {
    const isPositive = trend === 'up';
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;
    
    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
        <div className="relative bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all">
          <div className="flex items-start justify-between mb-4">
            <p className="text-white/60 text-sm font-medium">{title}</p>
            {Icon && <Icon className={`w-5 h-5 ${color}`} />}
          </div>
          <p className={`text-3xl font-bold ${color}`}>
            ₹{value.toLocaleString()}
          </p>
          <p className="text-xs text-white/40 mt-2">{subValue}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#080715] text-white flex flex-col">
      {/* Fixed Navbar */}
      <Navbar user={user} onToggleSidebar={toggleSidebar} />
      
      {/* Main Layout Container - Flex row for sidebar and content */}
      <div className="flex flex-1 relative">
        {/* Sidebar - Fixed position on desktop */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
        
        {/* Main Content Area - Flex-1 to take remaining space */}
<main className={`flex-1 transition-all duration-500 ${sidebarOpen ? 'lg:ml-72' : 'ml-0'} pt-16`}>          {/* Background Effects */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#1BD4CA] opacity-5 blur-[150px]"></div>
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#7B6BFF] opacity-5 blur-[150px]"></div>
          </div>

          {/* Scrollable Content Container */}
          <div className="relative z-10 min-h-full">
            {/* Analytics Content */}
<div className="p-4 md:p-6 lg:p-8 space-y-8 pt-20">              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-2">
                    Analytics Dashboard
                  </h1>
                  <p className="text-white/60">Track your financial performance and trends</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#1BD4CA]/50 transition-colors"
                  >
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                  </select>
                  
                  <button 
                    onClick={handleRefresh}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                  >
                    <RefreshCw className={`w-5 h-5 text-white/60 group-hover:text-white ${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                  
                  <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                    <Download className="w-5 h-5 text-white/60 group-hover:text-white" />
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Income"
                  value={summary.totalIncome}
                  subValue={`Avg: ₹${summary.avgDailyIncome.toLocaleString()}/day`}
                  trend="up"
                  icon={TrendingUp}
                  color="text-green-400"
                />
                <StatsCard
                  title="Total Expenses"
                  value={summary.totalExpenses}
                  subValue={`Avg: ₹${summary.avgDailyExpense.toLocaleString()}/day`}
                  trend="down"
                  icon={TrendingDown}
                  color="text-red-400"
                />
                <StatsCard
                  title="Net Savings"
                  value={summary.netSavings}
                  subValue={`Rate: ${summary.savingsRate}%`}
                  trend={summary.netSavings >= 0 ? "up" : "down"}
                  color={summary.netSavings >= 0 ? "text-[#1BD4CA]" : "text-red-400"}
                />
                <StatsCard
                  title="Vault Balance"
                  value={summary.vaultBalance}
                  subValue={`FlexScore: ${summary.flexScore}`}
                  trend="up"
                  icon={IndianRupee}
                  color="text-[#7B6BFF]"
                />
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Income vs Expenses Trend */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">Income vs Expenses Trend</h2>
                      <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-white/40" />
                      </button>
                    </div>
                    <Line data={incomeExpenseTrendData} options={chartOptions} />
                  </div>
                </div>

                {/* Income by Source */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">Income by Source</h2>
                      <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-white/40" />
                      </button>
                    </div>
                    <Pie data={incomeBySourceData} options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          ...chartOptions.plugins.legend,
                          position: 'right'
                        }
                      }
                    }} />
                  </div>
                </div>

                {/* Expenses by Category */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">Expenses by Category</h2>
                      <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-white/40" />
                      </button>
                    </div>
                    <Bar data={expensesByCategoryData} options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: { display: false }
                      }
                    }} />
                  </div>
                </div>

                {/* Daily Net Flow */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">Daily Net Flow</h2>
                      <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-white/40" />
                      </button>
                    </div>
                    <Bar 
                      data={{
                        labels: dailyTrends.slice(-14).map(d => 
                          new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
                        ),
                        datasets: [{
                          label: 'Net (Income - Expenses)',
                          data: dailyTrends.slice(-14).map(d => d.net),
                          backgroundColor: dailyTrends.slice(-14).map(d => 
                            d.net >= 0 ? 'rgba(27, 212, 202, 0.8)' : 'rgba(239, 68, 68, 0.8)'
                          ),
                          borderColor: dailyTrends.slice(-14).map(d => 
                            d.net >= 0 ? '#1BD4CA' : '#ef4444'
                          ),
                          borderWidth: 2
                        }]
                      }}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: { display: false }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Income Sources Breakdown */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all">
                    <h2 className="text-xl font-bold text-white mb-6">Income Sources Breakdown</h2>
                    <div className="space-y-4">
                      {Object.entries(incomeBySource).map(([source, amount]) => {
                        const percentage = (amount / summary.totalIncome) * 100;
                        return (
                          <div key={source}>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-white/80">{source}</span>
                              <span className="text-sm font-semibold text-white">₹{amount.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-white/40 mt-1">{percentage.toFixed(1)}% of total</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Expense Categories Breakdown */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all">
                    <h2 className="text-xl font-bold text-white mb-6">Expense Categories Breakdown</h2>
                    <div className="space-y-4">
                      {Object.entries(expensesByCategory).map(([category, amount]) => {
                        const percentage = (amount / summary.totalExpenses) * 100;
                        const colors = {
                          essential: 'from-red-500 to-pink-500',
                          discretionary: 'from-orange-500 to-yellow-500',
                          investment: 'from-green-500 to-emerald-500',
                          emergency: 'from-blue-500 to-cyan-500'
                        };
                        return (
                          <div key={category}>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-white/80 capitalize">{category}</span>
                              <span className="text-sm font-semibold text-white">₹{amount.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div
                                className={`bg-gradient-to-r ${colors[category]} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-white/40 mt-1">{percentage.toFixed(1)}% of total</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}