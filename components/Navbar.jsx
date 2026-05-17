// components/Navbar.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, BarChart3, Brain, Clock, User, Settings, 
  Bell, ChevronDown, Menu, X, PiggyBank, Target,
  TrendingUp, DollarSign, LogOut, Shield, Activity,
  Sparkles, Gem, Star, IndianRupee, Wallet, CreditCard,
  Award, ArrowUpRight, ArrowDownRight, Zap, Globe,
  MessageSquare
} from 'lucide-react';
import AIChatModal from './AIChatModal';

export default function Navbar({ user, onToggleSidebar }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const router = useRouter();

  // Detect platform for keyboard shortcut display
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
      if (!e.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Keyboard shortcut for AI
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setAiChatOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  const openAIChat = () => {
    setAiChatOpen(true);
    setShowMobileMenu(false);
  };

  const notifications = [
    { id: 1, type: 'success', icon: TrendingUp, title: 'Earnings Update', desc: '₹2,450 credited from Swiggy', time: '2m ago', unread: true },
    { id: 2, type: 'info', icon: Brain, title: 'Tax Tip', desc: 'Save ₹500 more this month', time: '1h ago', unread: true },
    { id: 3, type: 'warning', icon: Shield, title: 'Document Required', desc: 'Upload PAN for verification', time: '3h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const quickStats = [
    { label: 'Today', value: `₹${(user?.todayEarnings || 2450).toLocaleString()}`, change: '+12%', positive: true },
    { label: 'This Week', value: `₹${(user?.weeklyEarnings || 18500).toLocaleString()}`, change: '+8%', positive: true },
    { label: 'Credit Score', value: user?.creditScore || 750, change: '+5', positive: true }
  ];

  const menuItems = [
    { icon: User, label: 'Profile', href: '/profile', color: 'text-white/70' },
    { icon: CreditCard, label: 'Billing & Plans', href: '/billing', color: 'text-white/70' },
    { icon: Settings, label: 'Settings', href: '/settings', color: 'text-white/70' },
    { icon: Globe, label: 'Language', href: '#', color: 'text-white/70' },
  ];

  // Keyboard shortcut text based on platform
  const shortcutKey = isMac ? '⌘' : 'Ctrl';

  return (
    <>
      <nav className={`fixed top-0 w-full z-40 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#080715]/90 backdrop-blur-2xl shadow-2xl shadow-black/20' 
          : 'bg-[#080715]/80 backdrop-blur-xl'
      } border-b border-white/10`}>
        
        {/* Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1BD4CA] to-transparent opacity-50"></div>
        
        {/* Main Navbar */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Sidebar Toggle - Desktop */}
              <button
                onClick={onToggleSidebar}
                className="hidden lg:flex p-2 hover:bg-white/5 rounded-xl transition-all group"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5 text-white/60 group-hover:text-white" />
              </button>



              {/* Quick Stats - Desktop Only */}
              <div className="hidden xl:flex items-center gap-6 ml-8 pl-8 border-l border-white/10">
                {quickStats.map((stat, i) => (
                  <div key={i} className="group cursor-pointer">
                    <p className="text-xs text-white/40 mb-1">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{stat.value}</p>
                      <span className={`flex items-center text-xs font-medium ${
                        stat.positive ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              
              {/* AI Assistant Button - Desktop */}
              <button 
                onClick={openAIChat}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1BD4CA]/10 to-[#7B6BFF]/10 border border-[#1BD4CA]/20 hover:border-[#1BD4CA]/40 hover:from-[#1BD4CA]/20 hover:to-[#7B6BFF]/20 transition-all group"
              >
                <div className="relative">
                  <Brain className="w-4 h-4 text-[#1BD4CA] group-hover:scale-110 transition-transform" />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                <span className="text-sm font-medium text-white/80 group-hover:text-white">Ask AI</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] bg-white/10 text-white/50 rounded font-mono">
                  {shortcutKey}+K
                </kbd>
              </button>

              {/* Vault Balance */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                <Wallet className="w-4 h-4 text-[#1BD4CA]" />
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Vault</p>
                  <p className="text-sm font-bold text-white -mt-0.5">
                    ₹{(user?.vaultBalance || 245000)?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Demo Badge */}
              {user?.isDemo && (
                <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400">
                  <Zap className="w-3 h-3" />
                  Demo Mode
                </span>
              )}

              {/* Notifications */}
              <div className="relative notification-dropdown">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotifications(!showNotifications);
                    setShowDropdown(false);
                  }}
                  className="relative p-2.5 hover:bg-white/5 rounded-xl transition-all group"
                >
                  <Bell className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  {unreadCount > 0 && (
                    <>
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
                    </>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#0B0F19]/95 backdrop-blur-2xl rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden z-50">
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">Notifications</h3>
                        <span className="text-xs px-2 py-1 bg-[#1BD4CA]/20 text-[#1BD4CA] rounded-full">
                          {unreadCount} new
                        </span>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => {
                        const Icon = notif.icon;
                        return (
                          <div key={notif.id} className={`p-4 hover:bg-white/5 transition-all cursor-pointer border-b border-white/5 ${notif.unread ? 'bg-white/[0.02]' : ''}`}>
                            <div className="flex gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                notif.type === 'success' ? 'bg-green-500/20 text-green-400' :
                                notif.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-[#1BD4CA]/20 text-[#1BD4CA]'
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-white">{notif.title}</p>
                                  {notif.unread && <div className="w-1.5 h-1.5 bg-[#1BD4CA] rounded-full" />}
                                </div>
                                <p className="text-xs text-white/60 mt-0.5">{notif.desc}</p>
                                <p className="text-xs text-white/40 mt-1">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-3 border-t border-white/10">
                      <button className="w-full py-2 text-[#1BD4CA] text-sm font-medium hover:bg-[#1BD4CA]/10 rounded-xl transition-all">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative user-dropdown">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(!showDropdown);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-3 p-2 pr-3 rounded-xl hover:bg-white/5 transition-all"
                >
                  <div className="relative">
                    <div className="h-9 w-9 bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] rounded-xl p-[1px]">
                      <div className="w-full h-full bg-[#080715] rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user?.name?.charAt(0) || 'R'}
                        </span>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#080715]"></div>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white">{user?.name || 'Rahul Kumar'}</p>
                    <p className="text-xs text-white/40">Premium Member</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/40 hidden md:block transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-[#0B0F19]/95 backdrop-blur-2xl rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden z-50">
                    {/* User Info */}
                    <div className="p-4 bg-gradient-to-br from-[#1BD4CA]/10 to-[#7B6BFF]/10 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] rounded-xl p-[1px]">
                          <div className="w-full h-full bg-[#080715] rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {user?.name?.charAt(0) || 'R'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user?.name || 'Rahul Kumar'}</p>
                          <p className="text-sm text-white/60">{user?.email || 'rahul@demo.com'}</p>
                        </div>
                      </div>
                      
                      {/* Quick Stats in Dropdown */}
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="p-2 bg-black/30 rounded-xl">
                          <div className="flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-[#1BD4CA]" />
                            <div>
                              <p className="text-xs text-white/40">Vault</p>
                              <p className="text-sm font-bold text-white">₹{(user?.vaultBalance || 245000)?.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-2 bg-black/30 rounded-xl">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-green-400" />
                            <div>
                              <p className="text-xs text-white/40">Score</p>
                              <p className="text-sm font-bold text-white">{user?.creditScore || 750}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="p-2">
                      {menuItems.map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={i}
                            onClick={() => router.push(item.href)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-white/5 rounded-xl transition-all group"
                          >
                            <Icon className={`w-4 h-4 ${item.color} group-hover:text-white`} />
                            <span className="text-white/70 group-hover:text-white">{item.label}</span>
                          </button>
                        );
                      })}
                      
                      <div className="my-2 border-t border-white/10"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>

                    {/* Pro Tip */}
                    <div className="p-3 border-t border-white/10 bg-[#1BD4CA]/5">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-[#1BD4CA] mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-white">Pro Tip</p>
                          <p className="text-xs text-white/60 mt-0.5">
                            Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px]">{shortcutKey}+K</kbd> to open AI assistant
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-all"
              >
                {showMobileMenu ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden py-4 border-t border-white/10">
              {/* Mobile Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {quickStats.map((stat, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-xl">
                    <p className="text-xs text-white/40 mb-1">{stat.label}</p>
                    <p className="text-sm font-bold text-white">{stat.value}</p>
                    <span className={`text-xs ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="flex gap-3">
                <button 
                  onClick={openAIChat}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] rounded-xl font-medium text-white"
                >
                  <Brain className="w-5 h-5" />
                  Ask AI Assistant
                </button>
                <button 
                  onClick={onToggleSidebar}
                  className="px-4 py-3 bg-white/10 rounded-xl text-white"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Gradient Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#7B6BFF] to-transparent opacity-30"></div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>

      {/* AI Chat Modal */}
      <AIChatModal 
        isOpen={aiChatOpen} 
        onClose={() => setAiChatOpen(false)} 
      />
    </>
  );
}