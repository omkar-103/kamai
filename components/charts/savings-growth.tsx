/**
 * components/charts/savings-growth.tsx
 * 
 * Area chart showing savings growth over time.
 * Smooth curve animation with gradient fill and responsive sizing.
 */

"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface SavingsDataPoint {
  date: string;
  savings: number;
}

interface SavingsGrowthChartProps {
  data: SavingsDataPoint[];
}

/**
 * Custom tooltip for savings chart
 */
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 rounded-lg border border-white/10">
        <p className="text-xs text-[var(--text-secondary)] mb-1">
          {payload[0]?.payload?.date}
        </p>
        <p className="text-xs font-medium text-[#48bb78]">
          Savings: ₹{payload[0]?.value?.toLocaleString() || 0}
        </p>
      </div>
    );
  }
  return null;
}

export default function SavingsGrowthChart({ data }: SavingsGrowthChartProps) {
  // Ensure data is valid
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }
    return data.map((item) => ({
      date: item.date || "",
      savings: item.savings ?? 0,
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-[var(--text-secondary)]">
        <p className="text-sm">No savings data available</p>
      </div>
    );
  }

  // Calculate growth percentage
  const startSavings = chartData[0]?.savings || 0;
  const endSavings = chartData[chartData.length - 1]?.savings || 0;
  const growthPercent = startSavings > 0 
    ? (((endSavings - startSavings) / startSavings) * 100).toFixed(1)
    : 0;

  // Format Y-axis labels as currency
  const formatCurrency = (value: number) => `₹${(value / 1000).toFixed(0)}k`;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Savings Growth
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Cumulative savings over time
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-secondary)]">Growth</p>
          <p className="text-sm font-semibold text-[#48bb78]">
            +{growthPercent}%
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#48bb78" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#48bb78" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />

          <XAxis
            dataKey="date"
            stroke="var(--text-secondary)"
            style={{ fontSize: "12px" }}
            tick={{ fill: "var(--text-secondary)" }}
          />

          <YAxis
            stroke="var(--text-secondary)"
            style={{ fontSize: "12px" }}
            tickFormatter={formatCurrency}
            tick={{ fill: "var(--text-secondary)" }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="savings"
            stroke="#48bb78"
            strokeWidth={2}
            fill="url(#colorSavings)"
            dot={{ fill: "#48bb78", r: 3 }}
            activeDot={{ r: 5 }}
            isAnimationActive
            name="Savings"
            aria-describedby="savings-growth-desc"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* KPI Card */}
      <div className="grid grid-cols-2 gap-2">
        <div className="glass-panel">
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
            Current
          </p>
          <p className="text-lg font-bold text-[#48bb78] mt-1">
            ₹{endSavings.toLocaleString()}
          </p>
        </div>
        <div className="glass-panel">
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
            Increase
          </p>
          <p className="text-lg font-bold text-[var(--color-accent)] mt-1">
            ₹{(endSavings - startSavings).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Accessibility description */}
      <div className="hidden">
        <p id="savings-growth-desc">
          Area chart showing cumulative savings growth over time with smooth curve animation.
        </p>
      </div>
    </div>
  );
}
