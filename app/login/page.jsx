'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import SignupModal from '@/components/SignupModal';
import { 
  Mail, Lock, Shield, Sparkles, ChevronRight, 
  Gem, Zap, Globe, ArrowRight, CheckCircle,
  AlertCircle, User, Smartphone, Key, ShieldCheck,
  Fingerprint, LockKeyhole, UserCheck, Rocket
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSeedButton, setShowSeedButton] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error);
      setShowSeedButton(true);
    }
    
    setLoading(false);
  };

  const seedUsers = async () => {
    try {
      const response = await fetch('/api/auth/seed-users', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        alert('Demo users created! You can now login with:\nrahul@demo.com\npriya@demo.com\namit@demo.com\n\nPassword for all: password123');
        setShowSeedButton(false);
      }
    } catch (error) {
      console.error('Error seeding users:', error);
    }
  };

  const demoAccounts = [
    { role: 'Delivery', email: 'rahul@demo.com', icon: '🚴', color: 'from-blue-500 to-cyan-500' },
    { role: 'Food', email: 'priya@demo.com', icon: '🍔', color: 'from-orange-500 to-red-500' },
    { role: 'Ride', email: 'amit@demo.com', icon: '🚗', color: 'from-purple-500 to-pink-500' }
  ];

  const handleDemoClick = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <>
      <div className="min-h-screen bg-[#0A0B0F] relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Primary Gradient Orbs */}
          <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-[#00E5FF] opacity-20 blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-[#7B61FF] opacity-20 blur-[150px] animate-pulse"></div>
          
          {/* Secondary Accents */}
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] opacity-10 blur-[120px]"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        {/* Main Container */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Left Side - Login Card */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-[440px]">
                  <div className="relative">
                    {/* Card Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#00E5FF] via-[#7B61FF] to-[#00E5FF] rounded-3xl opacity-20 blur-2xl animate-gradient"></div>
                    
                    {/* Main Login Card */}
                    <div className="relative bg-[#12131A]/90 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 lg:p-10 shadow-2xl">
                      
                      {/* Logo Section */}
                      <div className="text-center mb-8">
                        <div className="inline-flex relative mb-6">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] blur-xl opacity-60"></div>
                          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-[#7B61FF] p-[2px]">
                            <div className="w-full h-full bg-[#0A0B0F] rounded-2xl flex items-center justify-center">
                              <Gem className="w-10 h-10 text-white" />
                            </div>
                          </div>
                        </div>
                        
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                          Welcome Back
                        </h1>
                        <p className="text-white/50 text-sm">Sign in to Kamai Dashboard</p>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email Input */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                            Email Address
                          </label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#00E5FF] transition-colors" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:bg-white/10 focus:border-[#00E5FF]/50 focus:shadow-[0_0_20px_rgba(0,229,255,0.15)] focus:outline-none transition-all"
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                            Password
                          </label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#00E5FF] transition-colors" />
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:bg-white/10 focus:border-[#00E5FF]/50 focus:shadow-[0_0_20px_rgba(0,229,255,0.15)] focus:outline-none transition-all"
                              placeholder="Enter your password"
                              required
                            />
                          </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between py-2">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 bg-white/10 border-white/20 rounded checked:bg-[#00E5FF] checked:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/50 focus:ring-offset-0 focus:outline-none" />
                            <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">Remember me</span>
                          </label>
                          <button type="button" className="text-sm text-[#00E5FF] hover:text-[#7B61FF] transition-colors font-medium">
                            Forgot password?
                          </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                              <p className="text-sm text-red-300">{error}</p>
                            </div>
                          </div>
                        )}

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={loading}
                          className="relative w-full group"
                        >
                          <div className="absolute -inset-1 bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] rounded-xl opacity-70 group-hover:opacity-100 blur transition-all duration-200"></div>
                          <div className="relative py-4 px-6 bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] rounded-xl font-semibold text-white transition-all duration-200">
                            {loading ? (
                              <div className="flex items-center justify-center gap-3">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Verifying Identity...</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2">
                                <span>Sign In Securely</span>
                                <ArrowRight className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        </button>
                      </form>

                      {/* Divider */}
                      <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="px-4 bg-[#12131A] text-white/40">OR</span>
                        </div>
                      </div>

                      {/* Sign Up Button */}
                      <button
                        onClick={() => setShowSignup(true)}
                        className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 hover:border-[#00E5FF]/30 transition-all duration-200 group"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Sparkles className="w-5 h-5 text-[#00E5FF] group-hover:rotate-12 transition-transform" />
                          Create Free Account
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Info Cards */}
              <div className="flex flex-col gap-6 lg:pl-8">
                
                {/* 2-Step Verification Card */}
                <div className="relative group">
                  {/* Card Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 rounded-3xl opacity-30 blur-xl group-hover:opacity-40 transition-opacity"></div>
                  
                  <div className="relative bg-gradient-to-br from-[#1A1B23]/90 to-[#12131A]/90 backdrop-blur-xl rounded-3xl border border-yellow-500/20 p-6 shadow-2xl">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-50"></div>
                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                          <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                          2-Step Verification Active
                          <span className="px-2 py-0.5 text-[10px] bg-yellow-500/20 text-yellow-400 rounded-full font-bold animate-pulse">
                            ENHANCED
                          </span>
                        </h3>
                        <p className="text-sm text-white/60 leading-relaxed mb-4">
                          Your account has enhanced security enabled. You're required to sign in again to verify your identity and protect your financial data.
                        </p>
                        
                        {/* Security Features */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                            <Fingerprint className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs text-white/70">Biometric Ready</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                            <LockKeyhole className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs text-white/70">256-bit Encryption</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Demo Accounts Card */}
                <div className="relative group">
                  {/* Card Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 rounded-3xl opacity-30 blur-xl group-hover:opacity-40 transition-opacity"></div>
                  
                  <div className="relative bg-gradient-to-br from-[#1A1B23]/90 to-[#12131A]/90 backdrop-blur-xl rounded-3xl border border-green-500/20 p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-green-500 blur-xl opacity-50"></div>
                          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                            <Rocket className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Try Demo</h3>
                          <p className="text-xs text-white/50">Quick access accounts</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 text-xs bg-green-500/20 text-green-400 rounded-full font-bold">
                        INSTANT
                      </span>
                    </div>

                    {/* Demo Account Buttons */}
                    <div className="space-y-2 mb-4">
                      {demoAccounts.map((account, i) => (
                        <button
                          key={i}
                          onClick={() => handleDemoClick(account.email)}
                          className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/30 rounded-xl transition-all duration-200 group/item"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{account.icon}</span>
                              <div className="text-left">
                                <p className="text-sm font-semibold text-white">{account.role}</p>
                                <p className="text-xs text-white/40">{account.email}</p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/30 group-hover/item:text-green-400 group-hover/item:translate-x-1 transition-all" />
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Password Info */}
                    <div className="p-3 bg-black/30 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-white/40" />
                          <span className="text-xs text-white/60">Password:</span>
                        </div>
                        <code className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg font-mono">
                          password123
                        </code>
                      </div>
                    </div>

                    {showSeedButton && (
                      <button
                        onClick={seedUsers}
                        className="w-full mt-3 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Initialize Demo Users
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Security Badges */}
                <div className="flex items-center justify-center gap-4 px-6">
                  <div className="flex items-center gap-2 text-white/40">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs">Bank-Grade Security</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/40">
                    <Globe className="w-4 h-4" />
                    <span className="text-xs">India Region</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      <SignupModal 
        isOpen={showSignup} 
        onClose={() => setShowSignup(false)}
        onSuccess={() => {
          setShowSignup(false);
        }}
      />

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
        .animate-gradient {
          animation: gradient 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}