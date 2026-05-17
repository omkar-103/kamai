'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function VaultPage() {
  const [vaultData, setVaultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [amount, setAmount] = useState('');
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchVaultData();
  }, [isAuthenticated]);

  const fetchVaultData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/vault', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setVaultData(data.data);
        }
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching vault data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async (type) => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/vault', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          reason: `Manual ${type}`,
          triggeredBy: 'user'
        })
      });

      if (res.ok) {
        fetchVaultData();
        setAmount('');
        setShowWithdraw(false);
        setShowDeposit(false);
        alert(`${type} successful!`);
      } else {
        const error = await res.json();
        alert(error.error || 'Transaction failed');
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      alert('Transaction failed');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Income Smoothing Vault™</h1>

      {/* Vault Balance Card */}
      <div className="glass-card p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <p className="text-sm opacity-90 mb-2">Current Balance</p>
        <p className="text-5xl font-bold mb-6">
          ₹{(vaultData?.currentBalance || 0).toLocaleString()}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm opacity-90">Total Savings</p>
            <p className="text-2xl font-semibold">
              ₹{(vaultData?.totalSavings || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm opacity-90">Transactions</p>
            <p className="text-2xl font-semibold">
              {vaultData?.transactions?.length || 0}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowDeposit(true)}
            className="flex-1 px-4 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            + Deposit
          </button>
          <button
            onClick={() => setShowWithdraw(true)}
            className="flex-1 px-4 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition backdrop-blur"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Deposit to Vault</h2>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 border-2 rounded-lg mb-4 text-lg focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleTransaction('deposit')}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm Deposit
              </button>
              <button
                onClick={() => {
                  setShowDeposit(false);
                  setAmount('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Withdraw from Vault</h2>
            <p className="text-sm text-gray-600 mb-4">
              Available: ₹{(vaultData?.currentBalance || 0).toLocaleString()}
            </p>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 border-2 rounded-lg mb-4 text-lg focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleTransaction('withdrawal')}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Withdrawal
              </button>
              <button
                onClick={() => {
                  setShowWithdraw(false);
                  setAmount('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6">
          <p className="text-sm text-gray-600">Total Deposits</p>
          <p className="text-3xl font-bold text-green-600">
            ₹{(vaultData?.statistics?.totalDeposits || 0).toLocaleString()}
          </p>
        </div>
        
        <div className="glass-card p-6">
          <p className="text-sm text-gray-600">Total Withdrawals</p>
          <p className="text-3xl font-bold text-red-600">
            ₹{(vaultData?.statistics?.totalWithdrawals || 0).toLocaleString()}
          </p>
        </div>
        
        <div className="glass-card p-6">
          <p className="text-sm text-gray-600">Net Savings</p>
          <p className="text-3xl font-bold text-blue-600">
            ₹{((vaultData?.statistics?.totalDeposits || 0) - 
               (vaultData?.statistics?.totalWithdrawals || 0)).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        
        {!vaultData?.transactions || vaultData.transactions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {vaultData.transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold capitalize">
                    {(transaction.type || '').replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-600">{transaction.reason || 'No reason'}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    (transaction.type || '').includes('deposit')
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {(transaction.type || '').includes('deposit') ? '+' : '-'}
                    ₹{(transaction.amount || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Balance: ₹{(transaction.balanceAfter || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}