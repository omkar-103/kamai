/**
 * components/charts/income-forecast.tsx
 * 
 * Line chart comparing actual income vs predicted income over time.
 * Uses Recharts for visualization with custom tooltips and styling.
 * Responsive and accessible with proper legends and labels.
 */

"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";

export interface IncomeForecastData {
  date: string;
  actual_income?: number;
  predicted_income?: number;
}

interface IncomeForecastChartProps {
  data: IncomeForecastData[];
}

/**
 * Custom tooltip for income chart
 */
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 rounded-lg border border-white/10">
        <p className="text-xs text-[var(--text-secondary)] mb-1">
          {payload[0]?.payload?.date}
        </p>
        {payload.map((entry: any, idx: number) => (
          <p key={idx} style={{ color: entry.color }} className="text-xs font-medium">
            {entry.name}: ₹{entry.value?.toLocaleString() || 0}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function IncomeForecastChart({ data }: IncomeForecastChartProps) {
  // Ensure data is valid
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }
    return data.map((item) => ({
      date: item.date || "",
      actual_income: item.actual_income ?? 0,
      predicted_income: item.predicted_income ?? 0,
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-[var(--text-secondary)]">
        <p className="text-sm">No income data available</p>
      </div>
    );
  }

  // Format Y-axis labels as currency
  const formatCurrency = (value: number) => `₹${(value / 1000).toFixed(0)}k`;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Income vs Forecast
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Actual earnings vs predicted income
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0fd3c1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0fd3c1" stopOpacity={0} />
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

          <Legend
            verticalAlign="top"
            height={36}
            iconType="line"
            wrapperStyle={{
              paddingBottom: "10px",
              fontSize: "12px",
              color: "var(--text-secondary)",
            }}
          />

          {/* Predicted income - with area fill */}
          <Area
            type="monotone"
            dataKey="predicted_income"
            stroke="#0fd3c1"
            strokeWidth={2}
            strokeDasharray="4 4"
            fill="url(#colorPredicted)"
            dot={{ fill: "#0fd3c1", r: 3 }}
            activeDot={{ r: 5 }}
            isAnimationActive
            name="Predicted Income"
            aria-describedby="predicted-income-desc"
          />

          {/* Actual income - solid line */}
          <Line
            type="monotone"
            dataKey="actual_income"
            stroke="#ffffff"
            strokeWidth={2}
            dot={{ fill: "#ffffff", r: 3 }}
            activeDot={{ r: 5 }}
            isAnimationActive
            name="Actual Income"
            aria-describedby="actual-income-desc"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Accessibility descriptions */}
      <div className="hidden">
        <p id="predicted-income-desc">
          Dashed teal line showing predicted income for the selected period
        </p>
        <p id="actual-income-desc">
          Solid white line showing actual earned income for the selected period
        </p>
      </div>
    </div>
  );
}
