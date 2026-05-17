'use client';
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Shield, TrendingUp, Users, Star, Menu, X, 
  CheckCircle, BarChart3, Zap, Target, Wallet, PieChart, 
  Code, Terminal, ChevronRight, Play, Lock, Globe
} from 'lucide-react';

// --- DESIGN SYSTEM CONSTANTS (From PDFs) ---
// Background: #080715 -> #0B0F19
// Accent Gradient: #1BD4CA -> #7B6BFF
// Text Muted: #BEBEC2
// Border: rgba(255,255,255,0.04)

// --- COMPONENTS ---

// 1. Auth Modal (Dark Mode Adapted)
const AuthModal = ({ isOpen, onClose, mode, onSwitchMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="relative bg-[#0B0F19] border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute top-4 right-4 z-10">
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(123,107,255,0.3)]">
              <span className="text-2xl font-bold text-white">F</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {mode === 'login' ? 'Welcome Back' : 'Join the Revolution'}
            </h2>
            <p className="text-[#BEBEC2] mt-2">
              {mode === 'login' 
                ? 'Access your financial command center' 
                : 'Start automating your gig finances today'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#BEBEC2] uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl bg-[#080715] border border-white/5 text-white focus:border-[#7B6BFF] focus:ring-1 focus:ring-[#7B6BFF] outline-none transition-all placeholder:text-gray-700"
                  placeholder="John Doe"
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-semibold text-[#BEBEC2] uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 rounded-xl bg-[#080715] border border-white/5 text-white focus:border-[#7B6BFF] focus:ring-1 focus:ring-[#7B6BFF] outline-none transition-all placeholder:text-gray-700"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#BEBEC2] uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 rounded-xl bg-[#080715] border border-white/5 text-white focus:border-[#7B6BFF] focus:ring-1 focus:ring-[#7B6BFF] outline-none transition-all placeholder:text-gray-700"
                placeholder="••••••••"
              />
            </div>

            <button className="w-full bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(27,212,202,0.2)] hover:shadow-[0_0_30px_rgba(123,107,255,0.4)] hover:scale-[1.02] transition-all active:scale-[0.98]">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#BEBEC2] text-sm">
              {mode === 'login' ? "New to Kamai? " : "Already a member? "}
              <button 
                onClick={() => onSwitchMode(mode === 'login' ? 'signup' : 'login')}
                className="text-[#1BD4CA] font-semibold hover:text-[#7B6BFF] transition-colors"
              >
                {mode === 'login' ? 'Start Free' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
        
        {/* Gradient Bottom Border */}
        <div className="h-1 w-full bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF]"></div>
      </div>
    </div>
  );
};

// 2. Neon Code Panel (From PDF Part 4)
const CodePanel = () => (
  <div className="relative rounded-2xl bg-[#0B0F19] border border-white/5 p-6 font-mono text-sm overflow-hidden shadow-[0_18px_40px_rgba(0,0,0,0.55)] group hover:border-white/10 transition-colors">
    {/* Inner Shadow/Glow */}
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(27,212,202,0.05),transparent_40%)] pointer-events-none"></div>
    
    <div className="flex gap-2 mb-4 border-b border-white/5 pb-4">
      <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
      <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
      <div className="ml-auto text-[#BEBEC2] text-xs">live_earnings.json</div>
    </div>
    
    <div className="space-y-1 text-[#BEBEC2] leading-relaxed">
      <div><span className="text-[#7B6BFF]">{"{"}</span></div>
      <div className="pl-4">
        <span className="text-[#1BD4CA]">"daily_income"</span>: <span className="text-[#FFD86C]">"₹2,450.00"</span>,
      </div>
      <div className="pl-4">
        <span className="text-[#1BD4CA]">"platform_breakdown"</span>: <span className="text-[#7B6BFF]">{"{"}</span>
      </div>
      <div className="pl-8">
        <span className="text-[#1BD4CA]">"swiggy"</span>: <span className="text-[#C6C6FF]">1200</span>,
      </div>
      <div className="pl-8">
        <span className="text-[#1BD4CA]">"zomato"</span>: <span className="text-[#C6C6FF]">850</span>,
      </div>
      <div className="pl-8">
        <span className="text-[#1BD4CA]">"uber"</span>: <span className="text-[#C6C6FF]">400</span>
      </div>
      <div className="pl-4"><span className="text-[#7B6BFF]">{"}"}</span>,</div>
      <div className="pl-4">
        <span className="text-[#1BD4CA]">"tax_saved"</span>: <span className="text-[#27C93F] font-bold">"₹450.00"</span>
      </div>
      <div><span className="text-[#7B6BFF]">{"}"}</span></div>
    </div>
  </div>
);

// --- MAIN PAGE ---

export default function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#080715] text-white selection:bg-[#1BD4CA] selection:text-black font-sans overflow-x-hidden">
      
      {/* --- HEADER (PDF Part 2) --- */}
      <header 
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-[#080715]/80 backdrop-blur-md border-b border-white/5 py-3' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] flex items-center justify-center shadow-[0_0_15px_rgba(27,212,202,0.4)] group-hover:shadow-[0_0_25px_rgba(123,107,255,0.6)] transition-all">
                <span className="font-bold text-white text-lg">F</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#1BD4CA] transition-colors">Kamai</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-10">
              {['Features', 'Integrations', 'Pricing', 'Docs'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="text-sm font-medium text-[#BEBEC2] hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => openAuthModal('login')}
                className="text-sm font-semibold text-white hover:text-[#1BD4CA] transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={() => openAuthModal('signup')}
                className="bg-white/10 hover:bg-white/20 border border-white/5 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all backdrop-blur-sm"
              >
                Start Free
              </button>
            </div>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#0B0F19] border-b border-white/5 shadow-2xl md:hidden p-4 flex flex-col gap-2">
            {['Features', 'Integrations', 'Pricing', 'Docs'].map((item) => (
              <a 
                key={item}
                href="#"
                className="p-3 text-[#BEBEC2] hover:bg-white/5 rounded-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <button 
              onClick={() => openAuthModal('signup')}
              className="w-full mt-2 p-3 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white rounded-lg font-bold"
            >
              Get Started
            </button>
          </div>
        )}
      </header>

      {/* --- HERO SECTION (PDF Part 2) --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients/Glows (Part 1 & 5) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#1BD4CA] opacity-[0.08] rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-[#7B6BFF] opacity-[0.06] rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Pill Label */}
          <div className="inline-flex items-center gap-2 bg-[#0A0B12] border border-white/10 rounded-full px-4 py-1.5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-2 h-2 rounded-full bg-[#1BD4CA] shadow-[0_0_8px_#1BD4CA]"></div>
            <span className="text-xs font-semibold text-[#BEBEC2] uppercase tracking-widest">Financial AI for Gig Workers</span>
          </div>

          {/* H1 Headline (72px Spec) */}
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.05]">
            Automate your <br />
            <span className="bg-gradient-to-r from-[#1BD4CA] via-[#7B6BFF] to-[#1BD4CA] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Gig Income & Taxes
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#BEBEC2] mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop guessing. Kamai connects your gig apps, tracks every rupee in real-time, and auto-saves for taxes.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <button 
              onClick={() => openAuthModal('signup')}
              className="group relative px-8 py-4 bg-white text-black text-lg font-bold rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(27,212,202,0.5)] transition-all"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start for Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button 
              onClick={() => openAuthModal('login')}
              className="px-8 py-4 bg-transparent border border-white/10 text-white text-lg font-semibold rounded-xl hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" /> Watch Demo
            </button>
          </div>

          {/* Stats Row (PDF Part 2) */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-12 border-t border-white/5 pt-12 max-w-4xl mx-auto">
             {[
               { val: "₹2.5Cr+", label: "Managed" },
               { val: "50k+", label: "Users" },
               { val: "15+", label: "Platforms" }
             ].map((stat, i) => (
               <div key={i} className="flex flex-col items-center px-4">
                 <div className="text-3xl font-bold text-white mb-1">{stat.val}</div>
                 <div className="text-xs font-semibold text-[#575861] uppercase tracking-wider">{stat.label}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- FEATURE GRID (PDF Part 3 & 4) --- */}
      <section className="py-24 relative bg-[#0B0F19]/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to scale</h2>
            <p className="text-[#BEBEC2] max-w-2xl mx-auto">Full-stack financial management for the modern independent worker.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="md:col-span-2 group relative rounded-3xl bg-[#080715] border border-white/5 p-8 overflow-hidden hover:border-white/10 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1BD4CA]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center h-full">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-[#1BD4CA]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#1BD4CA]/20">
                    <Zap className="w-6 h-6 text-[#1BD4CA]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Real-time Income Sync</h3>
                  <p className="text-[#BEBEC2] mb-6 leading-relaxed">
                    Connect Zomato, Swiggy, Uber, and your bank accounts via secure APIs. We aggregate your earnings instantly into one dashboard.
                  </p>
                  <ul className="space-y-2 text-sm text-[#BEBEC2]">
                     <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#1BD4CA]" /> Bank-grade security (256-bit)</li>
                     <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#1BD4CA]" /> Instant payout notifications</li>
                  </ul>
                </div>
                <div className="w-full md:w-[320px]">
                   <CodePanel /> {/* Reusing code panel component here */}
                </div>
              </div>
            </div>

            {/* Card 2 Vertical */}
            <div className="group relative rounded-3xl bg-[#080715] border border-white/5 p-8 overflow-hidden hover:border-white/10 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-b from-[#7B6BFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-12 h-12 bg-[#7B6BFF]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#7B6BFF]/20">
                <Target className="w-6 h-6 text-[#7B6BFF]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Goal-Based Savings</h3>
              <p className="text-[#BEBEC2] mb-8 leading-relaxed">
                Set a goal (e.g., "New Bike"). We automatically divert 5% of daily earnings into a secure vault.
              </p>
              
              {/* Visual Element */}
              <div className="bg-[#0B0F19] rounded-xl p-4 border border-white/5">
                <div className="flex justify-between text-xs text-[#BEBEC2] mb-2">
                  <span>Bike Fund</span>
                  <span className="text-[#1BD4CA]">72%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[72%] bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF]"></div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative rounded-3xl bg-[#080715] border border-white/5 p-8 overflow-hidden hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/20">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Audit-Proof Taxes</h3>
              <p className="text-[#BEBEC2]">
                We categorize every expense. Download a perfectly formatted tax report for your CA in one click.
              </p>
            </div>

            {/* Card 4 */}
            <div className="md:col-span-2 group relative rounded-3xl bg-[#080715] border border-white/5 p-8 overflow-hidden hover:border-white/10 transition-colors flex flex-col md:flex-row items-center gap-8">
               <div className="flex-1">
                 <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 border border-pink-500/20">
                    <Globe className="w-6 h-6 text-pink-500" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">Community Insights</h3>
                 <p className="text-[#BEBEC2]">
                   See where other delivery partners are earning the most in your city right now. Heatmaps for high-demand zones.
                 </p>
               </div>
               {/* Decorative Map Grid */}
               <div className="w-full md:w-1/2 h-40 bg-[#0B0F19] rounded-xl border border-white/5 relative overflow-hidden opacity-80">
                  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-[#1BD4CA] rounded-full blur-[40px] opacity-30"></div>
                  <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-[#7B6BFF] rounded-full blur-[40px] opacity-30"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- INTEGRATIONS (PDF Part 5 & 6) --- */}
      <section id="integrations" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div>
               <div className="inline-block text-[#1BD4CA] font-mono text-sm mb-4">02 — ECOSYSTEM</div>
               <h2 className="text-4xl font-bold text-white mb-6">Connects with everything you use.</h2>
               <p className="text-[#BEBEC2] text-lg mb-8">
                 No manual data entry. Kamai pulls data directly from your gig platforms via official APIs and secure bank connections.
               </p>
               
               <div className="grid grid-cols-2 gap-4">
                 {['Swiggy Partner', 'Zomato Delivery', 'Uber Driver', 'Ola', 'Shadowfax', 'Dunzo'].map((app) => (
                   <div key={app} className="flex items-center gap-3 p-3 rounded-xl bg-[#0B0F19] border border-white/5">
                     <div className="w-2 h-2 rounded-full bg-[#27C93F] shadow-[0_0_5px_#27C93F]"></div>
                     <span className="text-sm font-medium text-white">{app}</span>
                   </div>
                 ))}
               </div>
             </div>

             <div className="relative">
                {/* Abstract Visual for Integrations */}
                <div className="relative z-10 bg-[#0B0F19] border border-white/5 rounded-3xl p-8 shadow-2xl">
                   <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] p-[1px]">
                           <div className="w-full h-full bg-[#0B0F19] rounded-full flex items-center justify-center">
                              <span className="font-bold text-white">F</span>
                           </div>
                        </div>
                        <div>
                          <div className="text-white font-bold">Kamai Core</div>
                          <div className="text-xs text-[#27C93F] flex items-center gap-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-[#27C93F]"></div> Online
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-[#BEBEC2] font-mono">v2.4.0</div>
                   </div>
                   
                   <div className="space-y-4">
                      {[1,2,3].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#080715] border border-white/5">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-xs text-white/50">API</div>
                              <div className="h-2 w-24 bg-white/10 rounded"></div>
                           </div>
                           <div className="text-xs text-[#1BD4CA] font-mono">Connected</div>
                        </div>
                      ))}
                   </div>
                </div>
                
                {/* Glow behind */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] blur-[80px] opacity-20 -z-10"></div>
             </div>
           </div>
        </div>
      </section>

      {/* --- CTA SECTION (PDF Part 7) --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0B0F19]"></div>
        <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
           <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to maximize your earnings?</h2>
           <p className="text-[#BEBEC2] text-lg mb-10">
             Join 50,000+ gig workers who are saving an average of ₹4,500 per month with Kamai.
           </p>
           
           <div className="flex justify-center">
             <button 
               onClick={() => openAuthModal('signup')}
               className="bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white font-bold px-10 py-4 rounded-xl shadow-[0_0_30px_rgba(27,212,202,0.3)] hover:shadow-[0_0_50px_rgba(123,107,255,0.5)] hover:scale-105 transition-all"
             >
               Get Started Now
             </button>
           </div>
        </div>
      </section>

      {/* --- FOOTER (PDF Part 7 - Detailed Grid) --- */}
      <footer className="bg-[#080715] pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Gradient Divider Bar (Part 7.1.1) */}
          <div className="w-[260px] h-[6px] rounded-full bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] mb-12"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
             <div>
               <div className="text-[#9EA0A6] text-xs font-bold uppercase tracking-[2px] mb-6">Product</div>
               <ul className="space-y-4">
                 {['Features', 'Integrations', 'Pricing', 'Changelog'].map(item => (
                   <li key={item}><a href="#" className="text-[#BEBEC2] hover:text-white transition-colors">{item}</a></li>
                 ))}
               </ul>
             </div>
             
             <div>
               <div className="text-[#9EA0A6] text-xs font-bold uppercase tracking-[2px] mb-6">Resources</div>
               <ul className="space-y-4">
                 {['Documentation', 'API Reference', 'Community', 'Help Center'].map(item => (
                   <li key={item}><a href="#" className="text-[#BEBEC2] hover:text-white transition-colors">{item}</a></li>
                 ))}
               </ul>
             </div>
             
             <div>
               <div className="text-[#9EA0A6] text-xs font-bold uppercase tracking-[2px] mb-6">Company</div>
               <ul className="space-y-4">
                 {['About', 'Careers', 'Blog', 'Contact'].map(item => (
                   <li key={item}><a href="#" className="text-[#BEBEC2] hover:text-white transition-colors">{item}</a></li>
                 ))}
               </ul>
             </div>
             
             <div>
               <div className="text-[#9EA0A6] text-xs font-bold uppercase tracking-[2px] mb-6">Legal</div>
               <ul className="space-y-4">
                 {['Privacy Policy', 'Terms of Service', 'Security'].map(item => (
                   <li key={item}><a href="#" className="text-[#BEBEC2] hover:text-white transition-colors">{item}</a></li>
                 ))}
               </ul>
             </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] flex items-center justify-center">
                   <span className="text-white font-bold text-xs">F</span>
                </div>
                <span className="text-[#BEBEC2] text-sm">© 2024 Kamai Inc.</span>
             </div>
             <div className="flex gap-6">
                {/* Social Icons Placeholder */}
                <div className="w-5 h-5 bg-[#BEBEC2] opacity-50 hover:opacity-100 transition-opacity rounded-sm cursor-pointer"></div>
                <div className="w-5 h-5 bg-[#BEBEC2] opacity-50 hover:opacity-100 transition-opacity rounded-sm cursor-pointer"></div>
                <div className="w-5 h-5 bg-[#BEBEC2] opacity-50 hover:opacity-100 transition-opacity rounded-sm cursor-pointer"></div>
             </div>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        mode={authMode} 
        onSwitchMode={setAuthMode} 
      />
    </div>
  );
}