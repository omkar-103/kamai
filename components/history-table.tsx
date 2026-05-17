/**
 * components/history-table.tsx
 * 
 * Displays transaction history in a responsive table format.
 * Shows date, description, amount (color-coded), and AI action.
 * On click, emits transaction for modal display.
 */

"use client";

import { Transaction } from "@/lib/api";
import { motion } from "framer-motion";

interface HistoryTableProps {
  data: Transaction[];
  onRowClick: (tx: Transaction) => void;
}

export default function HistoryTable({ data, onRowClick }: HistoryTableProps) {
  if (data.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-[var(--text-secondary)]">No transactions found</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Desktop Table */}
      <motion.div
        className="hidden md:block overflow-x-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left font-semibold text-[var(--text-primary)]">
                Date
              </th>
              <th className="px-6 py-4 text-left font-semibold text-[var(--text-primary)]">
                Description
              </th>
              <th className="px-6 py-4 text-right font-semibold text-[var(--text-primary)]">
                Amount
              </th>
              <th className="px-6 py-4 text-left font-semibold text-[var(--text-primary)]">
                AI Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((tx, idx) => (
              <motion.tr
                key={tx.id}
                variants={rowVariants}
                className="border-b border-white/5 hover:bg-white/3 cursor-pointer transition-colors interactive"
                onClick={() => onRowClick(tx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onRowClick(tx);
                  }
                }}
                aria-label={`Transaction: ${tx.description} - ${tx.amount}`}
              >
                <td className="px-6 py-4 text-[var(--text-secondary)]">
                  {new Date(tx.date).toLocaleDateString("en-IN")}
                </td>
                <td className="px-6 py-4 text-[var(--text-primary)]">
                  {tx.description}
                </td>
                <td
                  className={`px-6 py-4 text-right font-semibold ${
                    tx.amount > 0 ? "text-[#48bb78]" : "text-[#f56565]"
                  }`}
                >
                  {tx.amount > 0 ? "+" : ""}₹{Math.abs(tx.amount).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-[var(--text-secondary)] text-xs">
                  {tx.ai_action}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Mobile Cards */}
      <motion.div
        className="md:hidden space-y-3 p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {data.map((tx) => (
          <motion.div
            key={tx.id}
            variants={rowVariants}
            onClick={() => onRowClick(tx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onRowClick(tx);
              }
            }}
            className="glass-panel p-4 cursor-pointer hover:bg-white/5 transition-colors interactive"
            aria-label={`Transaction: ${tx.description} - ${tx.amount}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {tx.description}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {new Date(tx.date).toLocaleDateString("en-IN")}
                </p>
              </div>
              <p
                className={`text-sm font-semibold ${
                  tx.amount > 0 ? "text-[#48bb78]" : "text-[#f56565]"
                }`}
              >
                {tx.amount > 0 ? "+" : ""}₹{Math.abs(tx.amount).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-white/10 text-[var(--text-secondary)] px-2 py-1 rounded">
                {tx.category}
              </span>
              <span className="text-xs text-[var(--color-accent)]">{tx.ai_action}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
