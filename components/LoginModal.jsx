// components/LoginModal.jsx
'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginModal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSeedButton, setShowSeedButton] = useState(false);
  
  const { login, showLoginModal, setShowLoginModal, setShowSignupModal } = useAuth();

  if (!showLoginModal) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error);
      setShowSeedButton(true);
    }
    
    setLoading(false);
  };

  const seedUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/seed-users', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        alert('Demo users created! You can now login with:\nrahul@demo.com\npriya@demo.com\namit@demo.com\n\nPassword for all: password123');
        setShowSeedButton(false);
      }
    } catch (error) {
      console.error('Error seeding users:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Close button */}
          <button
            onClick={() => setShowLoginModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your Kamai account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-3">Don't have an account?</p>
            <button
              onClick={switchToSignup}
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Create Free Account
            </button>
          </div>

          {/* Demo Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-2 text-center">
              🎮 Try Demo Accounts
            </h3>
            <div className="text-xs text-gray-600 space-y-1 text-center">
              <div><span className="font-medium">Delivery:</span> rahul@demo.com</div>
              <div><span className="font-medium">Food:</span> priya@demo.com</div>
              <div><span className="font-medium">Ride:</span> amit@demo.com</div>
              <div className="text-gray-500 mt-2">Pass: <code className="bg-gray-200 px-1 rounded">password123</code></div>
            </div>
            
            {showSeedButton && (
              <button
                onClick={seedUsers}
                disabled={loading}
                className="w-full mt-3 py-2 px-4 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                Create Demo Users
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}