'use client';

import { useEffect, useState } from 'react';

interface VaultData {
  current_balance: number;
  total_savings: number;
  interest_earned: number;
  transactions: Array<{
    _id: string;
    type: string;
    amount: number;
    createdAt: string;
    reason?: string;
  }>;
}

interface VaultSectionProps {
  userData?: any;
  onUpdate?: () => void;
}

export default function VaultSection({ userData, onUpdate }: VaultSectionProps) {
  const [data, setData] = useState<VaultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionType, setTransactionType] = useState('deposit');

  useEffect(() => {
    loadVaultData();
  }, [userData]);

  const loadVaultData = async () => {
    try {
      const response = await fetch(`/api/vault?userId=${userData?._id || '674d9a1e5f8c2a001234abcd'}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error loading vault data:', error);
      // Set default data on error
      setData({
        current_balance: 25000,
        total_savings: 125000,
        interest_earned: 850,
        transactions: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionAmount || isNaN(Number(transactionAmount))) return;

    try {
      const response = await fetch('/api/vault', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?._id || '674d9a1e5f8c2a001234abcd',
          type: transactionType,
          amount: Number(transactionAmount),
          reason: `Manual ${transactionType}`
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        await loadVaultData();
        setTransactionAmount('');
        setShowTransactionForm(false);
        onUpdate?.();
      } else {
        alert(result.error || 'Transaction failed');
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      alert('Transaction failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-gray-600">Smart Vault</h3>
        <button
          onClick={() => setShowTransactionForm(!showTransactionForm)}
          className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
        >
          {showTransactionForm ? 'Cancel' : 'Add Transaction'}
        </button>
      </div>

      {showTransactionForm && (
        <form onSubmit={handleTransaction} className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex gap-2 mb-2">
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="text-xs border rounded px-2 py-1"
            >
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdraw</option>
            </select>
            <input
              type="number"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
              placeholder="Amount"
              className="text-xs border rounded px-2 py-1 flex-1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-xs bg-blue-500 text-white py-1 rounded hover:bg-blue-600 transition-colors"
          >
            {transactionType === 'deposit' ? 'Deposit' : 'Withdraw'}
          </button>
        </form>
      )}

      <div className="text-center">
        <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
          ₹{(data?.current_balance || 0).toLocaleString()}
        </div>
        <div className="text-xs text-[var(--text-secondary)] mb-3">
          Total Savings: ₹{(data?.total_savings || 0).toLocaleString()}
        </div>
        <div className="text-xs text-[var(--text-secondary)] mt-2">
          Interest Earned: ₹{(data?.interest_earned || 0).toLocaleString()}
        </div>
      </div>

      {data?.transactions && data.transactions.length > 0 && (
        <div className="mt-4">
          <div className="text-xs text-gray-500 mb-2">Recent Transactions</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {data.transactions.slice(0, 3).map((transaction) => (
              <div key={transaction._id} className="flex justify-between text-xs">
                <span className={transaction.type?.includes('deposit') ? 'text-green-600' : 'text-red-600'}>
                  {transaction.type?.includes('deposit') ? '+' : '-'}₹{transaction.amount?.toLocaleString()}
                </span>
                <span className="text-gray-400">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}