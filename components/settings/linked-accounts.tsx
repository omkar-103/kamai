// components/settings/linked-accounts.tsx
"use client";

import { useState } from "react";
import StatusBadge from "../status-badge";
import { Link as LinkIcon, Unlink, CreditCard, ShoppingBag } from "lucide-react";

interface LinkedAccount {
  id: string;
  platform: string;
  status: "active" | "idle";
  connectedAt: string;
  icon: React.ComponentType<any>;
}

export default function LinkedAccounts() {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([
    {
      id: "1",
      platform: "Swiggy",
      status: "active",
      connectedAt: "2024-01-15",
      icon: ShoppingBag,
    },
    {
      id: "2",
      platform: "Zomato",
      status: "active",
      connectedAt: "2024-01-20",
      icon: ShoppingBag,
    },
    {
      id: "3",
      platform: "Paytm",
      status: "active",
      connectedAt: "2024-02-01",
      icon: CreditCard,
    },
    {
      id: "4",
      platform: "PhonePe",
      status: "idle",
      connectedAt: "2023-12-10",
      icon: CreditCard,
    },
  ]);

  const handleUnlink = (accountId: string) => {
    // In a real app, this would call an API
    setAccounts(accounts.filter((acc) => acc.id !== accountId));
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      Swiggy: "from-orange-500 to-orange-600",
      Zomato: "from-red-500 to-red-600",
      Paytm: "from-blue-500 to-blue-600",
      PhonePe: "from-purple-500 to-purple-600",
    };
    return colors[platform] || "from-gray-500 to-gray-600";
  };

  return (
    <div className="space-y-4">
      {accounts.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full 
            bg-white/[0.02] border border-white/[0.04] mb-4">
            <LinkIcon size={24} className="text-[var(--text-secondary)]" />
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            No linked accounts yet
          </div>
        </div>
      ) : (
        accounts.map((account) => (
          <div
            key={account.id}
            className="glass-card p-4 md:p-5 rounded-xl border border-white/[0.04] 
              hover:border-white/[0.08] transition-all duration-200 interactive"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Platform Info */}
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getPlatformColor(
                    account.platform
                  )} flex items-center justify-center shadow-lg`}
                >
                  <account.icon size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      {account.platform}
                    </h3>
                    <StatusBadge status={account.status} />
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Connected on {new Date(account.connectedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* Unlink Button */}
              <button
                onClick={() => handleUnlink(account.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                  border border-red-500/20 text-red-400 text-xs font-medium
                  hover:bg-red-500/10 hover:border-red-500/40
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                  focus:ring-offset-[var(--color-bg)]
                  transition-all duration-200"
                aria-label={`Unlink ${account.platform} account`}
              >
                <Unlink size={14} />
                <span className="hidden sm:inline">Unlink</span>
              </button>
            </div>
          </div>
        ))
      )}

      {/* Add Account Button */}
      <button
        className="w-full py-4 rounded-xl border-2 border-dashed border-white/[0.08]
          text-[var(--text-secondary)] text-sm font-medium
          hover:border-[var(--color-accent)]/30 hover:text-[var(--color-accent)] hover:bg-white/[0.02]
          focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 
          focus:ring-offset-[var(--color-bg)]
          transition-all duration-200
          flex items-center justify-center gap-2"
      >
        <LinkIcon size={16} />
        Link New Account
      </button>
    </div>
  );
}
