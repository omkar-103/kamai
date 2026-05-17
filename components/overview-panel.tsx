// components/overview-panel.tsx
"use client";

import { useEffect, useState } from "react";

interface AnalyticsOverview {
  total_income: number;
  total_expenses: number;
  net_savings: number;
  savings_rate: number;
  flex_score: number;
}

export default function OverviewPanel() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch("/api/analytics");
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const apiData = await res.json();
        setData(apiData.overview);
      } catch (err) {
        console.error("Error loading analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card h-24 animate-pulse">
            <div className="h-full bg-white/5 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Income",
      value: `₹${data?.total_income.toLocaleString() || 0}`,
      sub: "This month",
      trend: "+12.5%",
    },
    {
      title: "Total Expenses",
      value: `₹${data?.total_expenses.toLocaleString() || 0}`,
      sub: "This month",
      trend: "-8.3%",
    },
    {
      title: "FlexScore",
      value: data?.flex_score.toString() || "0",
      sub: "Financial health",
      trend: "+4.2%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.title} className="glass-card">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-[var(--text-secondary)]">{c.title}</div>
              <div className="mt-2 text-xl font-semibold">{c.value}</div>
              <div className="text-xs mt-1 text-[var(--text-secondary)]">{c.sub}</div>
            </div>
            <div className="text-[var(--color-accent)] text-sm font-bold">
              {c.trend.startsWith("+") || c.trend.startsWith("-") ? (
                <span>
                  {c.trend.startsWith("+") ? "▲" : "▼"} {c.trend}
                </span>
              ) : (
                c.trend
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
