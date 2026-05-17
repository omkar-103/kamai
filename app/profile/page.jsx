// app/profile/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        // Use demo data if no token
        const demoUser = {
          _id: 'demo123',
          name: 'Rahul Kumar',
          email: 'rahul@demo.com',
          phone: '+91 98765 43210',
          workType: 'delivery',
          flexScore: 750,
          vaultBalance: 245000,
          creditLimit: 50000,
          totalSavings: 125000,
          createdAt: '2024-01-15',
          platforms: [
            { name: 'Swiggy', rating: 4.8, joinedDate: '2024-01-15', deliveries: 1250, earnings: 285000 },
            { name: 'Zomato', rating: 4.7, joinedDate: '2024-02-01', deliveries: 980, earnings: 215000 },
            { name: 'Uber', rating: 4.9, joinedDate: '2024-03-10', rides: 650, earnings: 180000 },
            { name: 'Rapido', rating: 4.6, joinedDate: '2024-04-05', rides: 420, earnings: 95000 }
          ],
          achievements: [
            { title: 'Speed Demon', description: 'Completed 100 deliveries in record time', icon: '🚀', date: '2024-10-15' },
            { title: 'Customer Favorite', description: 'Maintained 4.8+ rating for 3 months', icon: '⭐', date: '2024-09-20' },
            { title: 'Early Bird', description: 'Completed 50 morning deliveries', icon: '🌅', date: '2024-08-10' },
            { title: 'Milestone Hero', description: 'Crossed ₹1 Lakh earnings', icon: '🏆', date: '2024-07-05' }
          ],
          stats: {
            totalDeliveries: 2230,
            totalRides: 1070,
            avgRating: 4.75,
            monthlyEarnings: 65000,
            weeklyHours: 48,
            completionRate: 96.5
          }
        };
        setUser(demoUser);
        setFormData(demoUser);
        setAuthChecked(true);
        setLoading(false);
        return;
      }
      
      setAuthChecked(true);
      await fetchUser();
    };

    checkAuth();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.log('No token during fetch');
        return;
      }

      const res = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.status === 401) {
        localStorage.removeItem('authToken');
        router.push('/login');
        return;
      }
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        setUser(data.data);
        setFormData(data.data);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      // Simulate update for demo
      setUser(formData);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar at top */}
      <Navbar user={user} onToggleSidebar={toggleSidebar} />
      
      {/* Flex container for sidebar and main content */}
      <div className="flex pt-16">
        {/* Sidebar - Fixed position on left */}
        <Sidebar isOpen={sidebarOpen} />
        
        {/* Main Content - Takes remaining space */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
          <div className="min-h-screen">
            {/* Profile Content */}
            <div className="p-4 md:p-6 lg:p-8">
              
              {loading ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="max-w-6xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                      onClick={() => {
                        setError(null);
                        setLoading(true);
                        fetchUser();
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : user ? (
                <div className="max-w-6xl mx-auto space-y-8">
                  
                  {/* Profile Header Card */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
                    
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                            <p className="text-blue-100 mb-2">{user.email}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full capitalize">
                                {user.workType} Worker
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="text-yellow-300">⭐</span>
                                {user.stats?.avgRating || 4.75}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={() => setEditing(!editing)}
                            className="px-6 py-3 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition"
                          >
                            {editing ? 'Cancel' : 'Edit Profile'}
                          </button>
                          <button
                            onClick={handleLogout}
                            className="px-6 py-3 bg-red-500/20 backdrop-blur text-white rounded-xl font-medium hover:bg-red-500/30 transition border border-white/20"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-4xl">💎</span>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">FLEXSCORE</span>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{user.flexScore || 750}</p>
                      <p className="text-sm text-gray-600 mt-1">Credit Score</p>
                      <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" style={{width: `${(user.flexScore / 900) * 100}%`}}></div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-4xl">💰</span>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">VAULT</span>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">₹{(user.vaultBalance || 0).toLocaleString()}</p>
                      <p className="text-sm text-gray-600 mt-1">Total Balance</p>
                      <p className="text-xs text-green-600 mt-3">+12.5% this month</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-4xl">💳</span>
                        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">CREDIT</span>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">₹{(user.creditLimit || 0).toLocaleString()}</p>
                      <p className="text-sm text-gray-600 mt-1">Available Limit</p>
                      <p className="text-xs text-purple-600 mt-3">Pre-approved</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-4xl">🎯</span>
                        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">SAVINGS</span>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">₹{(user.totalSavings || 0).toLocaleString()}</p>
                      <p className="text-sm text-gray-600 mt-1">Total Saved</p>
                      <p className="text-xs text-orange-600 mt-3">Goal: ₹2L</p>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2 inline-flex gap-1">
                    {['overview', 'platforms', 'achievements', 'settings'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 capitalize ${
                          activeTab === tab
                            ? 'bg-gray-900 text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                    {activeTab === 'overview' && !editing ? (
                      <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Full Name</p>
                              <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Email Address</p>
                              <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                              <p className="text-lg font-semibold text-gray-900">{user.phone || 'Not provided'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Member Since</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="bg-gray-50 rounded-xl p-6">
                              <h3 className="font-semibold text-gray-900 mb-4">Performance Stats</h3>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Total Deliveries</span>
                                  <span className="font-semibold">{user.stats?.totalDeliveries || 2230}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Total Rides</span>
                                  <span className="font-semibold">{user.stats?.totalRides || 1070}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Completion Rate</span>
                                  <span className="font-semibold text-green-600">{user.stats?.completionRate || 96.5}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Weekly Hours</span>
                                  <span className="font-semibold">{user.stats?.weeklyHours || 48} hrs</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : activeTab === 'overview' && editing ? (
                      <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
                        <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                              type="text"
                              value={formData.name || ''}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                              type="email"
                              value={formData.email || ''}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                              type="tel"
                              value={formData.phone || ''}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Work Type</label>
                            <select
                              value={formData.workType || 'delivery'}
                              onChange={(e) => setFormData({...formData, workType: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="delivery">Delivery</option>
                              <option value="rideshare">Rideshare</option>
                              <option value="freelancer">Freelancer</option>
                              <option value="microentrepreneur">Micro-Entrepreneur</option>
                            </select>
                          </div>

                          <div className="flex gap-4">
                            <button
                              type="submit"
                              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                            >
                              Save Changes
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditing(false)}
                              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : activeTab === 'platforms' ? (
                      <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Connected Platforms</h2>
                        {user.platforms && user.platforms.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {user.platforms.map((platform, index) => (
                              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                                      {platform.name.charAt(0)}
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-semibold text-gray-900">{platform.name}</h3>
                                      <p className="text-sm text-gray-500">Joined {new Date(platform.joinedDate).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                                    <span className="text-yellow-500">★</span>
                                    <span className="font-semibold text-gray-900">{platform.rating}</span>
                                  </div>
                                </div>
                                
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      {platform.deliveries ? 'Deliveries' : 'Rides'}
                                    </span>
                                    <span className="font-semibold">
                                      {platform.deliveries || platform.rides}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Total Earnings</span>
                                    <span className="font-semibold text-green-600">
                                      ₹{(platform.earnings || 0).toLocaleString()}
                                    </span>
                                  </div>
                                </div>

                                <button className="w-full mt-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                                  View Details
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔗</div>
                            <p className="text-gray-600">No platforms connected yet</p>
                            <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
                              Connect Platform
                            </button>
                          </div>
                        )}
                      </div>
                    ) : activeTab === 'achievements' ? (
                      <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements & Badges</h2>
                        {user.achievements && user.achievements.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {user.achievements.map((achievement, index) => (
                              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                  <div className="text-4xl">{achievement.icon}</div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                                    <p className="text-xs text-gray-500">Earned on {new Date(achievement.date).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="text-6xl mb-4">🏆</div>
                            <p className="text-gray-600">Start completing challenges to earn achievements!</p>
                          </div>
                        )}
                      </div>
                    ) : activeTab === 'settings' ? (
                      <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                        <div className="space-y-6 max-w-2xl">
                          <div className="border-b pb-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
                            <div className="space-y-3">
                              <label className="flex items-center justify-between">
                                <span className="text-gray-700">Email Notifications</span>
                                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
                              </label>
                              <label className="flex items-center justify-between">
                                <span className="text-gray-700">SMS Alerts</span>
                                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
                              </label>
                              <label className="flex items-center justify-between">
                                <span className="text-gray-700">Push Notifications</span>
                                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                              </label>
                            </div>
                          </div>

                          <div className="border-b pb-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Privacy</h3>
                            <div className="space-y-3">
                              <label className="flex items-center justify-between">
                                <span className="text-gray-700">Profile Visibility</span>
                                <select className="px-3 py-2 border border-gray-300 rounded-lg">
                                  <option>Public</option>
                                  <option>Private</option>
                                  <option>Friends Only</option>
                                </select>
                              </label>
                              <label className="flex items-center justify-between">
                                <span className="text-gray-700">Show Earnings</span>
                                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                              </label>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Danger Zone</h3>
                            <button className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition border border-red-200">
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>

                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No user data available</p>
                </div>
              )}
              
            </div>
          </div>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}