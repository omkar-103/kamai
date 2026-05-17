/**
 * components/analytics-filterbar.tsx
 * 
 * Filter bar for analytics page with date range selection.
 * Provides quick access to 7D/30D/90D ranges and refresh functionality.
 * Accessible with proper ARIA labels and keyboard navigation.
 */

"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";

type DateRange = "7d" | "30d" | "90d";

interface AnalyticsFilterBarProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function AnalyticsFilterBar({
  selectedRange,
  onRangeChange,
  onRefresh,
  isLoading = false,
}: AnalyticsFilterBarProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const rangeOptions: { value: DateRange; label: string; description: string }[] = [
    { value: "7d", label: "7 Days", description: "Last 7 days" },
    { value: "30d", label: "30 Days", description: "Last 30 days" },
    { value: "90d", label: "90 Days", description: "Last 90 days" },
  ];

  const getDateRangeLabel = (): string => {
    const today = new Date();
    const endDate = today.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });

    let startDate: Date;
    switch (selectedRange) {
      case "7d":
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
    }

    const startDateStr = startDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });

    return `${startDateStr} - ${endDate}`;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  return (
    <div className="glass-card p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Range buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
            Period:
          </span>
          <div className="flex gap-2">
            {rangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onRangeChange(option.value)}
                aria-pressed={selectedRange === option.value}
                aria-label={`Filter by ${option.description}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  selectedRange === option.value
                    ? "bg-gradient-to-r from-[var(--color-accent)] to-[#1fd6c8] text-black ring-2 ring-[var(--color-accent)]/30"
                    : "bg-white/6 text-[var(--text-secondary)] hover:bg-white/10"
                } focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]`}
                disabled={isLoading}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Date range display */}
        <div className="text-xs text-[var(--text-secondary)] px-3 py-1.5 rounded-lg bg-white/3">
          {getDateRangeLabel()}
        </div>

        {/* Right: Refresh button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          aria-label="Refresh analytics data"
          title="Refresh data"
          className={`p-2 rounded-lg bg-white/6 hover:bg-white/10 text-[var(--text-secondary)] transition-all duration-200 ${
            isRefreshing ? "animate-spin" : ""
          } focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]`}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Info text */}
      <p className="text-xs text-[var(--text-secondary)] mt-3">
        💡 Showing analytics for the selected period. All metrics update in real-time.
      </p>
    </div>
  );
}
