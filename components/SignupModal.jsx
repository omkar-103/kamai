// components/SignupModal.jsx
'use client';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function SignupModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Work Details
    workPlatform: [],
    vehicleType: '',
    workingHours: '',
    city: '',
    workExperience: '',
    
    // Financial Info
    monthlyIncome: '',
    currentSavings: '',
    bankAccount: true,
    
    // Goals & Preferences
    savingGoal: '',
    financialPriority: '',
    riskTolerance: '',
    
    // KYC
    panCard: '',
    aadharNumber: '',
    dateOfBirth: '',
  });

  const totalSteps = 4;

  const workPlatforms = [
    { id: 'swiggy', name: 'Swiggy', icon: '🍕', color: 'bg-orange-500' },
    { id: 'zomato', name: 'Zomato', icon: '🍽️', color: 'bg-red-500' },
    { id: 'uber', name: 'Uber', icon: '🚗', color: 'bg-black' },
    { id: 'ola', name: 'Ola', icon: '🚖', color: 'bg-green-500' },
    { id: 'dunzo', name: 'Dunzo', icon: '📦', color: 'bg-blue-500' },
    { id: 'blinkit', name: 'Blinkit', icon: '⚡', color: 'bg-yellow-500' },
    { id: 'amazon', name: 'Amazon Flex', icon: '📦', color: 'bg-orange-600' },
    { id: 'other', name: 'Other', icon: '➕', color: 'bg-gray-500' }
  ];

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlatformToggle = (platformId) => {
    setFormData(prev => ({
      ...prev,
      workPlatform: prev.workPlatform.includes(platformId)
        ? prev.workPlatform.filter(id => id !== platformId)
        : [...prev.workPlatform, platformId]
    }));
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.name && formData.email && formData.phone && 
               formData.password && formData.password === formData.confirmPassword;
      case 2:
        return formData.workPlatform.length > 0 && formData.vehicleType && 
               formData.city && formData.workingHours;
      case 3:
        return formData.monthlyIncome && formData.currentSavings;
      case 4:
        return formData.panCard && formData.dateOfBirth;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(step) && step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        onSuccess();
        // Show success message
        alert('Account created successfully! You can now login.');
      } else {
        alert(result.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Join Kamai</h2>
              <p className="text-sm text-gray-600">Step {step} of {totalSteps}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className={`flex-1 h-2 rounded-full ${
                    i <= step ? 'bg-indigo-600' : 'bg-gray-200'
                  } transition-colors duration-300`}
                ></div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 overflow-y-auto max-h-96">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <p className="text-sm text-gray-600">Let's get to know you better</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Create a strong password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Confirm your password"
                    required
                  />
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">Passwords don't match</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Work Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💼</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Work Information</h3>
                  <p className="text-sm text-gray-600">Tell us about your gig work</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-3">
                    Which platforms do you work with? * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {workPlatforms.map((platform) => (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => handlePlatformToggle(platform.id)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          formData.workPlatform.includes(platform.id)
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <span className="text-lg mb-1 block">{platform.icon}</span>
                          <span className="text-xs font-medium">{platform.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Vehicle Type *</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select your vehicle</option>
                    <option value="bike">🏍️ Motorcycle/Scooter</option>
                    <option value="bicycle">🚲 Bicycle</option>
                    <option value="car">🚗 Car</option>
                    <option value="auto">🛺 Auto Rickshaw</option>
                    <option value="walking">🚶‍♂️ Walking/On Foot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select your city</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Daily Working Hours *</label>
                  <select
                    value={formData.workingHours}
                    onChange={(e) => handleInputChange('workingHours', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">How many hours do you work daily?</option>
                    <option value="2-4">2-4 hours (Part-time)</option>
                    <option value="4-6">4-6 hours (Regular)</option>
                    <option value="6-8">6-8 hours (Full-time)</option>
                    <option value="8+">8+ hours (Extended)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Work Experience</label>
                  <select
                    value={formData.workExperience}
                    onChange={(e) => handleInputChange('workExperience', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">How long have you been working in gig economy?</option>
                    <option value="new">Just started (0-6 months)</option>
                    <option value="experienced">6 months - 2 years</option>
                    <option value="veteran">2+ years</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Financial Information */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Financial Details</h3>
                  <p className="text-sm text-gray-600">Help us understand your finances better</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Monthly Income *</label>
                  <select
                    value={formData.monthlyIncome}
                    onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select your average monthly income</option>
                    <option value="10000-20000">₹10,000 - ₹20,000</option>
                    <option value="20000-30000">₹20,000 - ₹30,000</option>
                    <option value="30000-40000">₹30,000 - ₹40,000</option>
                    <option value="40000-50000">₹40,000 - ₹50,000</option>
                    <option value="50000+">₹50,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Current Savings *</label>
                  <select
                    value={formData.currentSavings}
                    onChange={(e) => handleInputChange('currentSavings', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">How much do you have saved currently?</option>
                    <option value="0-5000">₹0 - ₹5,000</option>
                    <option value="5000-15000">₹5,000 - ₹15,000</option>
                    <option value="15000-50000">₹15,000 - ₹50,000</option>
                    <option value="50000+">₹50,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Saving Goal</label>
                  <select
                    value={formData.savingGoal}
                    onChange={(e) => handleInputChange('savingGoal', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">What's your primary savings goal?</option>
                    <option value="emergency">Build Emergency Fund</option>
                    <option value="vehicle">Buy/Upgrade Vehicle</option>
                    <option value="home">Save for Home</option>
                    <option value="family">Family Security</option>
                    <option value="retirement">Retirement Planning</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Financial Priority</label>
                  <select
                    value={formData.financialPriority}
                    onChange={(e) => handleInputChange('financialPriority', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">What's most important to you?</option>
                    <option value="safety">Keep money safe</option>
                    <option value="growth">Grow my money</option>
                    <option value="access">Easy access to money</option>
                    <option value="balance">Balance of all</option>
                  </select>
                </div>

               // Continuing the SignupModal component from where it stopped...

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="bankAccount"
                      checked={formData.bankAccount}
                      onChange={(e) => handleInputChange('bankAccount', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="bankAccount" className="text-sm text-gray-700">
                      I have a bank account and UPI setup
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: KYC & Verification */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Verification Details</h3>
                  <p className="text-sm text-gray-600">We need these to secure your account</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">PAN Card Number *</label>
                  <input
                    type="text"
                    value={formData.panCard}
                    onChange={(e) => handleInputChange('panCard', e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Required for tax compliance and verification</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Aadhaar Number (Optional)</label>
                  <input
                    type="text"
                    value={formData.aadharNumber}
                    onChange={(e) => handleInputChange('aadharNumber', e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="1234 5678 9012"
                    maxLength={12}
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional but helps in faster verification</p>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-green-800 mb-1">Almost Done!</h4>
                      <p className="text-xs text-green-700">
                        Your information is encrypted and secure. We follow RBI guidelines for financial data protection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex items-center justify-between gap-4">
              {step > 1 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              )}
              
              <div className="flex-1"></div>

              {step < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={!validateStep(step)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!validateStep(step) || loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
            </div>

            {step === 1 && (
              <p className="text-xs text-gray-500 text-center mt-4">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}