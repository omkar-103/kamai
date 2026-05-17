// app/history/page.jsx
'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

export default function HistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState('income');

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

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Simulate API call with demo data
      setTimeout(() => {
        const demoTransactions = [
          {
            _id: '1',
            type: 'income',
            source: 'Swiggy',
            amount: 2850,
            category: 'delivery',
            date: new Date('2024-11-24T14:30:00'),
            hours: 4.5,
            trips: 12,
            description: 'Lunch rush deliveries',
            aiClassified: true
          },
          {
            _id: '2',
            type: 'expense',
            merchant: 'HP Petrol Pump',
            amount: 500,
            category: 'fuel',
            date: new Date('2024-11-24T12:00:00'),
            description: 'Fuel refill',
            aiClassified: false
          },
          {
            _id: '3',
            type: 'income',
            source: 'Zomato',
            amount: 1920,
            category: 'delivery',
            date: new Date('2024-11-24T09:00:00'),
            hours: 3,
            trips: 8,
            description: 'Morning deliveries',
            aiClassified: true
          },
          {
            _id: '4',
            type: 'expense',
            merchant: 'Vehicle Service Center',
            amount: 1200,
            category: 'maintenance',
            date: new Date('2024-11-23T16:00:00'),
            description: 'Monthly bike service',
            aiClassified: true
          },
          {
            _id: '5',
            type: 'income',
            source: 'Uber',
            amount: 3200,
            category: 'rideshare',
            date: new Date('2024-11-23T20:00:00'),
            hours: 5,
            trips: 15,
            description: 'Evening rides',
            aiClassified: true
          },
          {
            _id: '6',
            type: 'expense',
            merchant: 'Mobile Recharge',
            amount: 299,
            category: 'utilities',
            date: new Date('2024-11-22T10:00:00'),
            description: 'Monthly mobile plan',
            aiClassified: false
          },
          {
            _id: '7',
            type: 'income',
            source: 'Rapido',
            amount: 1580,
            category: 'rideshare',
            date: new Date('2024-11-22T18:00:00'),
            hours: 2.5,
            trips: 10,
            description: 'Rush hour rides',
            aiClassified: true
          },
          {
            _id: '8',
            type: 'income',
            source: 'Swiggy',
            amount: 4200,
            category: 'delivery',
            date: new Date('2024-11-21T19:00:00'),
            hours: 6,
            trips: 18,
            description: 'Weekend dinner rush',
            aiClassified: true
          }
        ];

        // Apply filter
        let filteredTransactions = [...demoTransactions];
        if (filter !== 'all') {
          filteredTransactions = filteredTransactions.filter(t => t.type === filter);
        }

        setTransactions(filteredTransactions);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const addTransaction = async (type) => {
    setAddType(type);
    setShowAddModal(true);
  };

  const handleAddTransaction = async (formData) => {
    // Simulate adding transaction
    const newTransaction = {
      _id: Date.now().toString(),
      ...formData,
      date: new Date(),
      aiClassified: false
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    setShowAddModal(false);
    alert('Transaction added successfully!');
  };

  // Statistics calculation
  const stats = {
    totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    totalExpense: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    netBalance: 0
  };
  stats.netBalance = stats.totalIncome - stats.totalExpense;

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
            {/* History Content */}
            <div className="p-4 md:p-6 lg:p-8 space-y-8">
              
              {/* Header Section */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    📊 Transaction History
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Track all your income and expenses in one place
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => addTransaction('income')}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-sm flex items-center gap-2"
                  >
                    <span>+</span> Add Income
                  </button>
                  <button
                    onClick={() => addTransaction('expense')}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm flex items-center gap-2"
                  >
                    <span>+</span> Add Expense
                  </button>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      INCOME
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-emerald-600">
                    +₹{stats.totalIncome.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total Earnings</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💸</span>
                    </div>
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                      EXPENSE
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-red-600">
                    -₹{stats.totalExpense.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total Spending</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📈</span>
                    </div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      BALANCE
                    </span>
                  </div>
                  <p className={`text-3xl font-bold ${stats.netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {stats.netBalance >= 0 ? '+' : ''}₹{Math.abs(stats.netBalance).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Net Balance</p>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2 inline-flex gap-1">
                {['all', 'income', 'expense'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                      filter === f
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {f === 'all' ? 'All Transactions' : f.charAt(0).toUpperCase() + f.slice(1)}
                    {filter === f && (
                      <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded">
                        {f === 'all' ? transactions.length : transactions.filter(t => t.type === f).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Transactions List */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="px-8 py-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {transactions.length} {filter !== 'all' && filter} transactions found
                  </p>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {loading ? (
                    <div className="p-12 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading transactions...</p>
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="text-6xl mb-4">📭</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions found</h3>
                      <p className="text-gray-600">Start by adding your first {filter !== 'all' ? filter : 'transaction'}!</p>
                    </div>
                  ) : (
                    transactions.map((transaction) => (
<div key={transaction._id} className="p-6 hover:bg-gray-800 transition-colors duration-150">
                        <div className="flex items-start justify-between gap-4">
                          {/* Left Section */}
                          <div className="flex items-start gap-4 flex-1">
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              transaction.type === 'income' 
                                ? 'bg-emerald-100' 
                                : 'bg-red-100'
                            }`}>
                              <span className="text-xl">
                                {transaction.type === 'income' ? '💰' : '💸'}
                              </span>
                            </div>
                            
                            {/* Details */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-gray-900">
                                  {transaction.type === 'income' ? transaction.source : transaction.merchant}
                                </h3>
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                                  transaction.type === 'income'
                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                    : 'bg-red-100 text-red-700 border border-red-200'
                                }`}>
                                  {transaction.type.toUpperCase()}
                                </span>
                                {transaction.aiClassified && (
                                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                                    🤖 AI Classified
                                  </span>
                                )}
                              </div>
                              
                              {transaction.description && (
                                <p className="text-sm text-gray-600 mb-2">{transaction.description}</p>
                              )}
                              
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  📅 {new Date(transaction.date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  🕐 {new Date(transaction.date).toLocaleTimeString()}
                                </span>
                                {transaction.trips && (
                                  <span className="flex items-center gap-1">
                                    🚗 {transaction.trips} trips
                                  </span>
                                )}
                                {transaction.hours && (
                                  <span className="flex items-center gap-1">
                                    ⏱️ {transaction.hours} hours
                                  </span>
                                )}
                                {transaction.category && (
                                  <span className="capitalize bg-gray-100 px-2 py-0.5 rounded">
                                    {transaction.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Right Section - Amount */}
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${
                              transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                            </p>
                            {transaction.trips && (
                              <p className="text-xs text-gray-500 mt-1">
                                ₹{Math.round(transaction.amount / transaction.trips)}/trip
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">
              Add {addType === 'income' ? 'Income' : 'Expense'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleAddTransaction({
                type: addType,
                amount: parseFloat(formData.get('amount')),
                [addType === 'income' ? 'source' : 'merchant']: formData.get('source'),
                description: formData.get('description'),
                category: formData.get('category'),
                ...(addType === 'income' && {
                  hours: parseFloat(formData.get('hours') || 0),
                  trips: parseInt(formData.get('trips') || 0)
                })
              });
            }}>
              <div className="space-y-4">
                <input
                  name="amount"
                  type="number"
                  placeholder="Amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  name="source"
                  type="text"
                  placeholder={addType === 'income' ? 'Source (e.g., Swiggy)' : 'Merchant'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  name="category"
                  type="text"
                  placeholder="Category"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {addType === 'income' && (
                  <>
                    <input
                      name="hours"
                      type="number"
                      step="0.5"
                      placeholder="Hours worked"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      name="trips"
                      type="number"
                      placeholder="Number of trips"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </>
                )}
                <textarea
                  name="description"
                  placeholder="Description"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                >
                  Add Transaction
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}