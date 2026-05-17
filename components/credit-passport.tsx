/**
 * components/credit-passport.tsx
 * 
 * Displays credit passport with score, risk level, and export button.
 */

"use client";

import { CreditPassport as CreditPassportData } from "@/lib/api";
import ProgressBar from "./progress-bar";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

interface CreditPassportProps extends CreditPassportData {}

export default function CreditPassport({
  id,
  last_updated,
  risk_level,
  credit_score,
  report_url,
}: CreditPassportProps) {
  const getRiskColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case "low":
        return "text-[#48bb78] bg-[#48bb78]/10";
      case "medium":
        return "text-[#ed8936] bg-[#ed8936]/10";
      case "high":
        return "text-[#f56565] bg-[#f56565]/10";
      default:
        return "text-[var(--text-secondary)] bg-white/5";
    }
  };

  const scorePercentage = (credit_score / 1000) * 100;
  const lastUpdateDate = new Date(last_updated).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Credit Passport
      </h3>

      {/* Header Info */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide mb-1">
            Passport ID
          </p>
          <p className="text-sm font-mono text-[var(--text-primary)]">{id}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide mb-1">
            Last Updated
          </p>
          <p className="text-sm text-[var(--text-primary)]">{lastUpdateDate}</p>
        </div>
      </div>

      {/* Credit Score Display */}
      <div className="bg-white/3 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
            Credit Score
          </span>
          <span className="text-2xl font-bold text-[var(--color-accent)]">
            {credit_score}
          </span>
        </div>
        <ProgressBar value={scorePercentage} height="h-2" />
        <p className="text-xs text-[var(--text-secondary)] mt-2">
          {scorePercentage.toFixed(0)}% of maximum
        </p>
      </div>

      {/* Risk Level */}
      <div className="mb-6">
        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide mb-2">
          Risk Level
        </p>
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(risk_level)}`}
        >
          <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
          {risk_level}
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={() => {
          if (report_url) {
            window.open(report_url, "_blank");
          }
        }}
        disabled={!report_url}
        aria-label="Download Credit Passport PDF"
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[var(--color-accent)] to-[#1fd6c8] text-black font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={16} />
        <span>Export PDF Report</span>
      </button>

      {/* Info Text */}
      <p className="text-xs text-[var(--text-secondary)] mt-4 text-center">
        Your credit passport is updated monthly with the latest assessment.
      </p>
    </motion.div>
  );
}
