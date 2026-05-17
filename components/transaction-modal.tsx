/**
 * components/transaction-modal.tsx
 * 
 * Displays detailed transaction information in a modal.
 * Shows all transaction details with formatted amounts and timestamps.
 */

"use client";

import { Transaction } from "@/lib/api";
import Modal from "./modal";
import { motion } from "framer-motion";
import { Flag } from "lucide-react";
import { useState } from "react";

interface TransactionModalProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}

export default function TransactionModal({
  transaction,
  open,
  onClose,
}: TransactionModalProps) {
  const [flagged, setFlagged] = useState(false);

  if (!transaction) return null;

  const isIncome = transaction.amount > 0;
  const displayDate = new Date(transaction.date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        setFlagged(false);
      }}
      title="Transaction Details"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {/* Amount Display */}
        <div className="text-center py-4">
          <p
            className={`text-4xl font-bold ${
              isIncome ? "text-[#48bb78]" : "text-[#f56565]"
            }`}
          >
            {isIncome ? "+" : "-"}₹{Math.abs(transaction.amount).toLocaleString()}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            {isIncome ? "Income" : "Expense"}
          </p>
        </div>

        <div className="border-t border-white/10 pt-4">
          {/* Transaction ID */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
              ID
            </span>
            <span className="text-sm font-mono text-[var(--text-primary)]">
              #{transaction.id}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
              Date
            </span>
            <div className="text-right">
              <p className="text-sm text-[var(--text-primary)]">{displayDate}</p>
              <p className="text-xs text-[var(--text-secondary)]">{transaction.date}</p>
            </div>
          </div>

          {/* Description */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
              Description
            </span>
            <p className="text-sm text-[var(--text-primary)] text-right">
              {transaction.description}
            </p>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
              Category
            </span>
            <span className="text-xs bg-white/10 text-[var(--text-secondary)] px-3 py-1 rounded-full">
              {transaction.category}
            </span>
          </div>

          {/* AI Action */}
          <div className="flex items-start justify-between">
            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
              AI Action
            </span>
            <p className="text-sm text-[var(--color-accent)] font-medium text-right max-w-xs">
              {transaction.ai_action}
            </p>
          </div>
        </div>

        {/* Flag Error Toggle */}
        <div className="border-t border-white/10 pt-4">
          <button
            onClick={() => setFlagged(!flagged)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${ flagged
              ? "bg-[#f56565]/20 text-[#f56565] ring-1 ring-[#f56565]/30"
              : "bg-white/6 text-[var(--text-secondary)] hover:bg-white/10"
            }`}
            aria-pressed={flagged}
          >
            <Flag size={16} />
            <span className="text-sm font-medium">
              {flagged ? "Flagged as Error" : "Flag as Error"}
            </span>
          </button>
          {flagged && (
            <p className="text-xs text-[#f56565] mt-2 text-center">
              ✓ This transaction has been flagged for review
            </p>
          )}
        </div>

        {/* Additional Info */}
        <div className="glass-panel p-3 text-xs space-y-1">
          <p className="text-[var(--text-secondary)]">
            This transaction was {isIncome ? "received" : "deducted"} on{" "}
            <span className="text-[var(--text-primary)] font-medium">
              {transaction.date}
            </span>
          </p>
          <p className="text-[var(--text-secondary)]">
            AI has {transaction.ai_action.toLowerCase()}.
          </p>
        </div>
      </motion.div>
    </Modal>
  );
}
