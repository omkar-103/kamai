/**
 * components/charts/expense-pie.tsx
 * 
 * Pie chart showing expense breakdown by category.
 * Includes custom legend with percentages and accessible color indicators.
 * Responsive with hover tooltips.
 */

"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

export interface ExpenseCategory {
  category: string;
  amount: number;
}

interface ExpensePieChartProps {
  data: ExpenseCategory[];
}

// Color palette for expense categories
const COLORS = [
  "#0fd3c1", // Teal (accent)
  "#48bb78", // Green (success)
  "#ed8936", // Orange (warning)
  "#f56565", // Red (error)
  "#9f7aea", // Purple
];

/**
 * Custom tooltip for pie chart
 */
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const { category, amount, value } = payload[0].payload;
    const total = payload[0].payload.total;
    const percent = total > 0 ? ((amount / total) * 100).toFixed(1) : "0";

    return (
      <div className="glass-card p-3 rounded-lg border border-white/10">
        <p className="text-xs font-medium" style={{ color: payload[0].fill }}>
          {category}
        </p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          ₹{amount?.toLocaleString() || 0}
        </p>
        <p className="text-xs text-[var(--text-secondary)]">{percent}% of total</p>
      </div>
    );
  }
  return null;
}

/**
 * Custom legend component with percentages
 */
function CustomLegend(props: any) {
  const { payload } = props;

  return (
    <div className="mt-4 space-y-2">
      {payload.map((entry: any, index: number) => {
        const { category, amount, total } = entry.payload;
        const percent = total > 0 ? ((amount / total) * 100).toFixed(1) : "0";

        return (
          <div key={`legend-${index}`} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
                aria-hidden="true"
              />
              <span className="text-[var(--text-secondary)]">{category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-primary)] font-medium">
                ₹{amount?.toLocaleString() || 0}
              </span>
              <span className="text-[var(--text-secondary)] w-12 text-right">
                {percent}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ExpensePieChart({ data }: ExpensePieChartProps) {
  // Calculate total and prepare data with metadata
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);

    return data.map((item, idx) => ({
      ...item,
      value: item.amount,
      name: item.category,
      total,
    }));
  }, [data]);

  const totalExpense = useMemo(
    () => chartData.reduce((sum, item) => sum + (item.amount || 0), 0),
    [chartData]
  );

  if (chartData.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-[var(--text-secondary)]">
        <p className="text-sm">No expense data available</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Expense Breakdown</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">By category</p>
      </div>

      {/* KPI cards */}
      <div className="space-y-2">
        <div className="glass-panel">
          <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
            Total Expenses
          </div>
          <div className="text-lg font-bold text-[var(--text-primary)] mt-1">
            ₹{totalExpense.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Pie chart */}
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="amount"
            isAnimationActive
            aria-describedby="expense-pie-desc"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Custom legend */}
      <CustomLegend
        payload={chartData.map((item, idx) => ({
          payload: item,
          color: COLORS[idx % COLORS.length],
        }))}
      />

      {/* Accessibility description */}
      <div className="hidden">
        <p id="expense-pie-desc">
          Donut chart showing expense breakdown by category. Each segment represents a spending category with its proportion of total expenses.
        </p>
      </div>
    </div>
  );
}
