// app/dashboard/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { 
  TrendingUp, TrendingDown, IndianRupee, PiggyBank, Target, 
  Car, Home, ShoppingBag, Plus, ArrowRight, Zap, Eye, EyeOff,
  Calendar, Filter, Download, Bell, Brain, Shield, Activity,
  CreditCard, Users, Star, Clock, ChevronRight, Sparkles,
  BarChart3, Wallet, Award, Globe, MessageSquare, Settings,
  ChevronUp, ChevronDown, Gem, Coins, TrendingUpIcon,
  ArrowUpRight, ArrowDownRight, MoreVertical, RefreshCw,
  Database, Cpu, Layers, FileText, Check, X, Info, Menu
} from 'lucide-react';

// Animated Background Component
const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    
    // Initialize particles
    const particleCount = 60;
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1 + 0.5,
        color: Math.random() > 0.5 ? '#1BD4CA' : '#7B6BFF',
        pulse: Math.random() * Math.PI * 2
      });
    }
    
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', setSize);
    
    const animate = () => {
      ctx.fillStyle = 'rgba(8, 7, 21, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.01;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x -= dx * 0.005;
          p.y -= dy * 0.005;
        }
        
        const pulseSize = Math.sin(p.pulse) * 0.2 + 1;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color + '33';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * pulseSize, 0, Math.PI * 2);
        ctx.fill();
        
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p2 = particlesRef.current[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          
          if (dist2 < 80) {
            const opacity = (1 - dist2 / 80) * 0.1;
            ctx.strokeStyle = `rgba(123, 107, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', setSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-40" />;
};

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, change, trend, color, prefix = '₹' }) => {
  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
      <div className="relative bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} p-[1px]`}>
            <div className="w-full h-full bg-[#080715] rounded-2xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-white/40" />
          </button>
        </div>
        
        <div className="space-y-2">
          <p className="text-white/60 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white">
            {prefix}{value}
          </p>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}>
              <TrendIcon className="w-3 h-3" />
              <span className="text-xs font-semibold">{change}</span>
            </div>
            <span className="text-xs text-white/40">vs last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Transaction Item Component
const TransactionItem = ({ transaction }) => {
  const Icon = transaction.icon;
  const isIncome = transaction.type === 'income';
  
  return (
    <div className="group flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all duration-200 cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl ${
          isIncome ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-br from-red-500/20 to-pink-500/20'
        } flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${isIncome ? 'text-green-400' : 'text-red-400'}`} />
        </div>
        <div>
          <p className="text-white font-medium">{transaction.category}</p>
          <p className="text-white/40 text-sm">{transaction.time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold text-lg ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
          {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString()}
        </p>
        <p className="text-white/30 text-xs uppercase tracking-wider">{transaction.type}</p>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showBalance, setShowBalance] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

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
        todayEarnings: 2450,
        weeklyEarnings: 18500,
        isDemo: true
      });
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Demo data
  const userData = {
    vaultBalance: 245000,
    monthlyIncome: 68000,
    monthlyExpenses: 38500,
    creditScore: 750,
    savingsGoal: 500000,
    currentSavings: 245000,
    totalEarnings: 820000,
    taxSaved: 48000
  };

  const recentTransactions = [
    { id: 1, type: 'income', amount: 2850, category: 'Uber Rides', time: '2 hours ago', icon: Car },
    { id: 2, type: 'expense', amount: 420, category: 'Fuel', time: '4 hours ago', icon: Car },
    { id: 3, type: 'income', amount: 1650, category: 'Swiggy Delivery', time: '6 hours ago', icon: ShoppingBag },
    { id: 4, type: 'expense', amount: 200, category: 'Food & Dining', time: '1 day ago', icon: Home },
    { id: 5, type: 'income', amount: 3200, category: 'Zomato Orders', time: '1 day ago', icon: ShoppingBag }
  ];

  const platforms = [
    { name: 'Swiggy', earnings: 28500, orders: 342, rating: 4.8, color: 'from-orange-500 to-red-500' },
    { name: 'Zomato', earnings: 22000, orders: 285, rating: 4.9, color: 'from-red-500 to-pink-500' },
    { name: 'Uber', earnings: 17500, orders: 125, rating: 4.7, color: 'from-gray-600 to-gray-800' },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080715]">
      {/* Fixed Navbar at top */}
      <Navbar user={user} onToggleSidebar={toggleSidebar} />
      
      {/* Flex container for sidebar and main content */}
      <div className="flex pt-16">
        {/* Sidebar - Fixed position on left */}
        <Sidebar isOpen={sidebarOpen} />
        
        {/* Main Content - Takes remaining space */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
          <div className="min-h-screen">
            {/* Animated Background */}
            <AnimatedBackground />
            
            {/* Gradient Overlays */}
            <div className="fixed inset-0 pointer-events-none">
              <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#1BD4CA] opacity-5 blur-[150px]"></div>
              <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#7B6BFF] opacity-5 blur-[150px]"></div>
            </div>

            {/* Dashboard Content */}
            <div className="relative z-10 p-4 md:p-6 lg:p-8 space-y-8">
              
              {/* Header Section */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-2">
                    Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                  </h1>
                  <p className="text-white/60">Here's your financial overview for today</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleRefresh}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                  >
                    <RefreshCw className={`w-5 h-5 text-white/60 group-hover:text-white ${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                  <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white font-semibold hover:scale-[1.02] transition-all flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Quick Action
                  </button>
                </div>
              </div>

              {/* Main Balance Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-[#1BD4CA]/20 via-[#7B6BFF]/20 to-[#1BD4CA]/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#7B6BFF] opacity-10 blur-[100px]"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1BD4CA] opacity-10 blur-[100px]"></div>
                  
                  <div className="relative z-10 grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-white/60 text-sm font-medium uppercase tracking-wider">Total Balance</p>
                        <button
                          onClick={() => setShowBalance(!showBalance)}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          {showBalance ? <EyeOff className="w-4 h-4 text-white/60" /> : <Eye className="w-4 h-4 text-white/60" />}
                        </button>
                      </div>
                      <div className="flex items-baseline gap-3 mb-6">
                        <p className="text-5xl md:text-6xl font-bold text-white">
                          {showBalance ? `₹${userData.vaultBalance.toLocaleString()}` : '₹•••,•••'}
                        </p>
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 rounded-xl">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 font-semibold">+12.5%</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/5 backdrop-blur rounded-xl p-3">
                          <p className="text-white/40 text-xs mb-1">This Month</p>
                          <p className="text-white font-semibold">+₹68,000</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur rounded-xl p-3">
                          <p className="text-white/40 text-xs mb-1">Tax Saved</p>
                          <p className="text-[#1BD4CA] font-semibold">₹4,250</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur rounded-xl p-3">
                          <p className="text-white/40 text-xs mb-1">Active Hours</p>
                          <p className="text-white font-semibold">186 hrs</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur rounded-xl p-3">
                          <p className="text-white/40 text-xs mb-1">Avg Rating</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <p className="text-white font-semibold">4.8</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center">
                      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-white/60 text-sm">Credit Score</span>
                          <Shield className="w-5 h-5 text-[#1BD4CA]" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{userData.creditScore}</div>
                        <div className="text-green-400 text-sm font-medium">Excellent</div>
                        <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-[88%] bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  icon={IndianRupee}
                  title="Monthly Income"
                  value={userData.monthlyIncome.toLocaleString()}
                  change="+18.2%"
                  trend="up"
                  color="from-green-500 to-emerald-500"
                />
                <StatsCard
                  icon={TrendingDown}
                  title="Monthly Expenses"
                  value={userData.monthlyExpenses.toLocaleString()}
                  change="-5.3%"
                  trend="down"
                  color="from-red-500 to-pink-500"
                />
                <StatsCard
                  icon={PiggyBank}
                  title="Total Savings"
                  value={userData.currentSavings.toLocaleString()}
                  change="+22.5%"
                  trend="up"
                  color="from-[#1BD4CA] to-[#7B6BFF]"
                />
                <StatsCard
                  icon={Shield}
                  title="Tax Saved"
                  value={userData.taxSaved.toLocaleString()}
                  change="+₹850"
                  trend="up"
                  color="from-purple-500 to-pink-500"
                />
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Recent Transactions */}
                <div className="lg:col-span-2 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 rounded-3xl transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">Recent Transactions</h3>
                        <p className="text-white/40 text-sm">Your latest financial activities</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                          <Filter className="w-5 h-5 text-white/40" />
                        </button>
                        <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                          <Download className="w-5 h-5 text-white/40" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {recentTransactions.map((transaction) => (
                        <TransactionItem key={transaction.id} transaction={transaction} />
                      ))}
                    </div>
                    
                    <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[#1BD4CA] font-medium transition-all flex items-center justify-center gap-2 group">
                      View All Transactions
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  
                  {/* Savings Goal */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Savings Goal</h3>
                        <Target className="w-5 h-5 text-[#1BD4CA]" />
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/60">Progress</span>
                          <span className="text-white font-medium">49%</span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] rounded-full transition-all duration-1000"
                            style={{ width: '49%' }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                          <p className="text-[#1BD4CA] font-bold text-lg">₹2.45L</p>
                          <p className="text-white/40 text-xs">Saved</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                          <p className="text-[#7B6BFF] font-bold text-lg">₹5L</p>
                          <p className="text-white/40 text-xs">Target</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Platform Performance */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Platform Earnings</h3>
                        <Activity className="w-5 h-5 text-[#7B6BFF]" />
                      </div>
                      
                      <div className="space-y-4">
                        {platforms.map((platform, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white/80 font-medium">{platform.name}</span>
                              <span className="text-white font-bold">₹{platform.earnings.toLocaleString()}</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${platform.color} rounded-full transition-all duration-1000`}
                                style={{ width: `${(platform.earnings / 30000) * 100}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-white/40">{platform.orders} orders</span>
                              <span className="text-yellow-400 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400" />
                                {platform.rating}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights Section */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1BD4CA]/10 via-[#7B6BFF]/10 to-[#1BD4CA]/10 backdrop-blur-xl border border-white/10 p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#7B6BFF] opacity-10 blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1BD4CA] opacity-10 blur-[100px]"></div>
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">AI-Powered Insights</h3>
                      <p className="text-white/60 text-sm">Personalized recommendations by Kamai</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:border-[#1BD4CA]/30 transition-all group">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        </div>
                        <h4 className="text-white font-semibold">Optimize Earnings</h4>
                      </div>
                      <p className="text-white/70 text-sm leading-relaxed">Work 2 more hours during lunch peak (12-2 PM) to earn extra ₹8,500/month</p>
                      <button className="mt-4 text-[#1BD4CA] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Apply Suggestion <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:border-[#7B6BFF]/30 transition-all group">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-purple-400" />
                        </div>
                        <h4 className="text-white font-semibold">Tax Optimization</h4>
                      </div>
                      <p className="text-white/70 text-sm leading-relaxed">Claim ₹2,800 more by uploading 12 pending fuel receipts from last month</p>
                      <button className="mt-4 text-[#7B6BFF] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Upload Receipts <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:border-orange-400/30 transition-all group">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-orange-400" />
                        </div>
                        <h4 className="text-white font-semibold">Hot Zones Alert</h4>
                      </div>
                      <p className="text-white/70 text-sm leading-relaxed">Koramangala showing 35% surge. Switch zone now for higher earnings</p>
                      <button className="mt-4 text-orange-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Heatmap <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-center">
                    <p className="text-white/40 text-xs flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      Powered by Gemini AI • Updates every hour
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Plus, label: 'Add Money', color: 'from-[#1BD4CA] to-[#7B6BFF]' },
                  { icon: CreditCard, label: 'Pay Bills', color: 'from-purple-500 to-pink-500' },
                  { icon: FileText, label: 'Tax Report', color: 'from-green-500 to-emerald-500' },
                  { icon: MessageSquare, label: 'Get Support', color: 'from-orange-500 to-red-500' }
                ].map((action, i) => (
                  <button key={i} className="group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-[#0B0F19] to-[#080715] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} p-[1px] mb-3 group-hover:scale-110 transition-transform`}>
                        <div className="w-full h-full bg-[#080715] rounded-xl flex items-center justify-center">
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <p className="text-white/80 text-sm font-medium">{action.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 5s ease infinite;
        }
      `}</style>
    </div>
  );
}