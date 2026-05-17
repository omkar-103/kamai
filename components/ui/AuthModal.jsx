// components/ui/AuthModal.jsx
'use client';
import { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Phone, ChevronLeft, ChevronRight, Check, Eye, EyeOff } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, mode: externalMode = 'login' }) {
  const [mode, setMode] = useState(externalMode); // 'login' or 'signup'
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Login form data
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Signup form data
  const [signupData, setSignupData] = useState({
    // Step 1: Basic Info
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Step 2: Work Details
    workPlatform: [],
    vehicleType: '',
    workingHours: '',
    city: '',
    workExperience: '',

    // Step 3: Financial Info
    monthlyIncome: '',
    currentSavings: '',
    savingGoal: '',
    financialPriority: '',
    bankAccount: false,

    // Step 4: KYC
    dateOfBirth: '',
    panCard: '',
    aadharNumber: ''
  });

  const totalSteps = 4;

  // Sync external mode and reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(externalMode);
      setStep(1);
      setErrors({});
      if (externalMode === 'login') {
        setLoginData({ email: '', password: '', rememberMe: false });
      }
    }
  }, [isOpen, externalMode]);

  // Handle login form changes
  const handleLoginChange = (field, value) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle signup form changes
  const handleSignupChange = (field, value) => {
    setSignupData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate login form
  const validateLogin = () => {
    const newErrors = {};
    
    if (!loginData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!loginData.password) newErrors.password = 'Password is required';
    else if (loginData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper to get validation errors without setting state
  const getSignupErrors = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!signupData.name) newErrors.name = 'Name is required';
      if (!signupData.email) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!signupData.phone) newErrors.phone = 'Phone is required';
      if (!signupData.password) newErrors.password = 'Password is required';
      else if (signupData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (signupData.password !== signupData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (currentStep === 2) {
      if (signupData.workPlatform.length === 0) newErrors.workPlatform = 'Select at least one platform';
      if (!signupData.workingHours) newErrors.workingHours = 'Select working hours';
      if (!signupData.city) newErrors.city = 'City is required';
    }

    if (currentStep === 3) {
      if (!signupData.monthlyIncome) newErrors.monthlyIncome = 'Monthly income is required';
      if (!signupData.savingGoal) newErrors.savingGoal = 'Saving goal is required';
    }

    if (currentStep === 4) {
      if (!signupData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!signupData.panCard) newErrors.panCard = 'PAN card is required';
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(signupData.panCard)) {
        newErrors.panCard = 'Invalid PAN format (e.g., ABCDE1234F)';
      }
    }

    return newErrors;
  };

  // Validate signup steps and set state (called on submit)
  const validateSignupStep = (currentStep) => {
    const newErrors = getSignupErrors(currentStep);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if step is valid without setting state (called during render)
  const isStepValid = (currentStep) => {
    return Object.keys(getSignupErrors(currentStep)).length === 0;
  };

  // Handle login submission
  const handleLogin = async () => {
    if (!validateLogin()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage or context
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        // Close modal and redirect
        onClose();
        window.location.href = '/dashboard';
      } else {
        setErrors({ general: data.error || 'Login failed' });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle signup submission (same as before but adapted)
  const handleSignup = async () => {
    if (!validateSignupStep(4)) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });

      const data = await response.json();

      if (data.success) {
        // Auto-login after successful signup
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: signupData.email,
            password: signupData.password
          })
        });

        const loginData = await loginResponse.json();
        
        if (loginData.success) {
          localStorage.setItem('user', JSON.stringify(loginData.user));
          localStorage.setItem('token', loginData.token);
          onClose();
          window.location.href = '/dashboard';
        }
      } else {
        setErrors({ general: data.error || 'Signup failed' });
      }
    } catch (error) {
      setErrors({ general: 'Account creation failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (validateSignupStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0B0F19] border border-white/10 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative p-6 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">K</span>
            </div>
            
            {mode === 'login' ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-white/60">Sign in to your Kamai account</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">Join Kamai</h2>
                <p className="text-white/60">Step {step} of {totalSteps}: Let's get started!</p>
              </>
            )}
          </div>

          {/* Progress bar for signup */}
          {mode === 'signup' && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                {[1, 2, 3, 4].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      stepNum <= step
                        ? 'bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {stepNum < step ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                ))}
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          {mode === 'login' ? (
            // Login Form
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => handleLoginChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#1BD4CA] focus:border-[#1BD4CA] ${
                      errors.email ? 'border-red-500' : 'border-white/10'
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => handleLoginChange('password', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#1BD4CA] focus:border-[#1BD4CA] ${
                      errors.password ? 'border-red-500' : 'border-white/10'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-white/40 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={loginData.rememberMe}
                    onChange={(e) => handleLoginChange('rememberMe', e.target.checked)}
                    className="w-4 h-4 text-[#1BD4CA] border-white/20 rounded focus:ring-[#1BD4CA]"
                  />
                  <span className="ml-2 text-sm text-white/60">Remember me</span>
                </label>
                <button className="text-sm text-[#1BD4CA] hover:text-[#1BD4CA]">
                  Forgot password?
                </button>
              </div>
            </div>
          ) : (
            // Signup Forms (keeping all the signup steps from previous implementation)
            <div className="space-y-4">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        value={signupData.name}
                        onChange={(e) => handleSignupChange('name', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#1BD4CA] focus:border-[#1BD4CA] ${
                          errors.name ? 'border-red-500' : 'border-white/10'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-white/40" />
                      <input
                        type="email"
                        value={signupData.email}
                        onChange={(e) => handleSignupChange('email', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#1BD4CA] focus:border-[#1BD4CA] ${
                          errors.email ? 'border-red-500' : 'border-white/10'
                        }`}
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-white/40" />
                      <input
                        type="tel"
                        value={signupData.phone}
                        onChange={(e) => handleSignupChange('phone', e.target.value.replace(/\D/g, ''))}
                        className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#1BD4CA] focus:border-[#1BD4CA] ${
                          errors.phone ? 'border-red-500' : 'border-white/10'
                        }`}
                        placeholder="9876543210"
                        maxLength={10}
                      />
                    </div>
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-white/40" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signupData.password}
                        onChange={(e) => handleSignupChange('password', e.target.value)}
                        className={`w-full pl-10 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#1BD4CA] focus:border-[#1BD4CA] ${
                          errors.password ? 'border-red-500' : 'border-white/10'
                        }`}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-white/40 hover:text-white/60"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-white/40" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signupData.confirmPassword}
                        onChange={(e) => handleSignupChange('confirmPassword', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#1BD4CA] focus:border-[#1BD4CA] ${
                          errors.confirmPassword ? 'border-red-500' : 'border-white/10'
                        }`}
                        placeholder="Confirm your password"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Work Platforms *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Swiggy', 'Zomato', 'Uber', 'Ola', 'Zepto', 'Blinkit', 'Amazon Flex', 'Other'].map(platform => (
                        <label key={platform} className="flex items-center p-2 bg-white/5 border rounded-xl text-white placeholder-white/40 cursor-pointer hover:bg-white/5">
                          <input
                            type="checkbox"
                            checked={signupData.workPlatform.includes(platform)}
                            onChange={(e) => {
                              const newPlatforms = e.target.checked 
                                ? [...signupData.workPlatform, platform]
                                : signupData.workPlatform.filter(p => p !== platform);
                              handleSignupChange('workPlatform', newPlatforms);
                            }}
                            className="w-4 h-4 text-[#1BD4CA] border-white/20 rounded focus:ring-[#1BD4CA]"
                          />
                          <span className="ml-2 text-sm text-white/80">{platform}</span>
                        </label>
                      ))}
                    </div>
                    {errors.workPlatform && <p className="text-red-400 text-xs mt-1">{errors.workPlatform}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Vehicle Type</label>
                    <select
                      value={signupData.vehicleType}
                      onChange={(e) => handleSignupChange('vehicleType', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#1BD4CA] focus:border-[#1BD4CA] border-white/10"
                    >
                      <option className="bg-[#0B0F19] text-white" value="">Select vehicle type</option>
                      <option className="bg-[#0B0F19] text-white" value="2-wheeler">2-Wheeler (Bike/Scooter)</option>
                      <option className="bg-[#0B0F19] text-white" value="3-wheeler">3-Wheeler (Auto)</option>
                      <option className="bg-[#0B0F19] text-white" value="4-wheeler">4-Wheeler (Car)</option>
                      <option className="bg-[#0B0F19] text-white" value="none">No Vehicle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Working Hours *</label>
                    <select
                      value={signupData.workingHours}
                      onChange={(e) => handleSignupChange('workingHours', e.target.value)}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#1BD4CA] focus:border-[#1BD4CA] ${errors.workingHours ? 'border-red-500' : 'border-white/10'}`}
                    >
                      <option className="bg-[#0B0F19] text-white" value="">Select working hours</option>
                      <option className="bg-[#0B0F19] text-white" value="part-time">Part Time (&lt; 4 hours/day)</option>
                      <option className="bg-[#0B0F19] text-white" value="full-time">Full Time (4-8 hours/day)</option>
                      <option className="bg-[#0B0F19] text-white" value="over-time">Over Time (&gt; 8 hours/day)</option>
                    </select>
                    {errors.workingHours && <p className="text-red-400 text-xs mt-1">{errors.workingHours}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">City *</label>
                    <input
                      type="text"
                      value={signupData.city}
                      onChange={(e) => handleSignupChange('city', e.target.value)}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#1BD4CA] focus:border-[#1BD4CA] ${errors.city ? 'border-red-500' : 'border-white/10'}`}
                      placeholder="e.g. Mumbai"
                    />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Estimated Monthly Income *</label>
                    <select
                      value={signupData.monthlyIncome}
                      onChange={(e) => handleSignupChange('monthlyIncome', e.target.value)}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#1BD4CA] focus:border-[#1BD4CA] ${errors.monthlyIncome ? 'border-red-500' : 'border-white/10'}`}
                    >
                      <option className="bg-[#0B0F19] text-white" value="">Select monthly income</option>
                      <option className="bg-[#0B0F19] text-white" value="10000-20000">₹10,000 - ₹20,000</option>
                      <option className="bg-[#0B0F19] text-white" value="20000-30000">₹20,000 - ₹30,000</option>
                      <option className="bg-[#0B0F19] text-white" value="30000-40000">₹30,000 - ₹40,000</option>
                      <option className="bg-[#0B0F19] text-white" value="40000-50000">₹40,000 - ₹50,000</option>
                      <option className="bg-[#0B0F19] text-white" value="50000+">₹50,000+</option>
                    </select>
                    {errors.monthlyIncome && <p className="text-red-400 text-xs mt-1">{errors.monthlyIncome}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Current Savings</label>
                    <select
                      value={signupData.currentSavings}
                      onChange={(e) => handleSignupChange('currentSavings', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#1BD4CA] focus:border-[#1BD4CA] border-white/10"
                    >
                      <option className="bg-[#0B0F19] text-white" value="">Select current savings</option>
                      <option className="bg-[#0B0F19] text-white" value="0-5000">₹0 - ₹5,000</option>
                      <option className="bg-[#0B0F19] text-white" value="5000-15000">₹5,000 - ₹15,000</option>
                      <option className="bg-[#0B0F19] text-white" value="15000-50000">₹15,000 - ₹50,000</option>
                      <option className="bg-[#0B0F19] text-white" value="50000+">₹50,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Primary Saving Goal *</label>
                    <input
                      type="text"
                      value={signupData.savingGoal}
                      onChange={(e) => handleSignupChange('savingGoal', e.target.value)}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#1BD4CA] focus:border-[#1BD4CA] ${errors.savingGoal ? 'border-red-500' : 'border-white/10'}`}
                      placeholder="e.g. Buy a new bike, Emergency fund"
                    />
                    {errors.savingGoal && <p className="text-red-400 text-xs mt-1">{errors.savingGoal}</p>}
                  </div>

                  <label className="flex items-center p-3 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={signupData.bankAccount}
                      onChange={(e) => handleSignupChange('bankAccount', e.target.checked)}
                      className="w-4 h-4 text-[#1BD4CA] border-white/20 rounded focus:ring-[#1BD4CA]"
                    />
                    <span className="ml-3 text-sm text-white/90">I have an active bank account for receiving payments</span>
                  </label>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      value={signupData.dateOfBirth}
                      onChange={(e) => handleSignupChange('dateOfBirth', e.target.value)}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#1BD4CA] focus:border-[#1BD4CA] ${errors.dateOfBirth ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {errors.dateOfBirth && <p className="text-red-400 text-xs mt-1">{errors.dateOfBirth}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">PAN Card Number *</label>
                    <input
                      type="text"
                      value={signupData.panCard}
                      onChange={(e) => handleSignupChange('panCard', e.target.value.toUpperCase())}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#1BD4CA] focus:border-[#1BD4CA] uppercase ${errors.panCard ? 'border-red-500' : 'border-white/10'}`}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                    />
                    {errors.panCard && <p className="text-red-400 text-xs mt-1">{errors.panCard}</p>}
                    <p className="text-xs text-white/50 mt-1">Required for accurate tax calculation and savings</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Aadhar Number (Optional)</label>
                    <input
                      type="text"
                      value={signupData.aadharNumber}
                      onChange={(e) => handleSignupChange('aadharNumber', e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#1BD4CA] focus:border-[#1BD4CA] border-white/10"
                      placeholder="1234 5678 9012"
                      maxLength={12}
                    />
                  </div>

                  <div className="bg-[#1BD4CA]/10 border border-[#1BD4CA]/20 rounded-xl p-4 mt-6">
                    <p className="text-sm text-[#1BD4CA] flex items-start gap-2">
                      <Lock className="w-5 h-5 flex-shrink-0" />
                      Your data is encrypted and securely stored. We use bank-level security to protect your financial information.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          {mode === 'login' ? (
            <div className="space-y-4">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white font-semibold rounded-xl hover:from-[#1BD4CA]/80 hover:to-[#7B6BFF]/80 disabled:opacity-50 transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>

              <p className="text-center text-sm text-white/60">
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-[#1BD4CA] hover:text-[#1BD4CA] font-semibold"
                >
                  Sign up
                </button>
              </p>
            </div>
          ) : (
            // Signup navigation (same as before)
            <div className="flex items-center justify-between gap-4">
              {step > 1 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white/90"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              )}
              
              <div className="flex-1"></div>

              {step < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid(step)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white font-semibold rounded-xl hover:from-[#1BD4CA]/80 hover:to-[#7B6BFF]/80 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSignup}
                  disabled={!isStepValid(step) || loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] text-white font-semibold rounded-xl hover:from-[#1BD4CA]/80 hover:to-[#7B6BFF]/80 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Create Account
                    </>
                  )}
                </button>
              )}

              {step === 1 && (
                <p className="text-center text-sm text-white/60 mt-4 w-full">
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-[#1BD4CA] hover:text-[#1BD4CA] font-semibold"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}