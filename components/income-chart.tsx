// components/income-chart.tsx
"use client";

import { useEffect, useState } from "react";
import IncomeForecastChart, { IncomeForecastData } from "./charts/income-forecast";

export default function IncomeChart() {
  const [data, setData] = useState<IncomeForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch("/api/income");
        if (!res.ok) throw new Error("Failed to fetch income data");
        const apiData = await res.json();
        setData(apiData);
      } catch (err) {
        console.error("Error loading income data:", err);
        setError("Failed to load income data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="mt-4 h-80 flex items-center justify-center">
        <div className="text-[var(--text-secondary)] text-sm">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 h-80 flex items-center justify-center">
        <div className="text-[var(--error)] text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <IncomeForecastChart data={data} />
    </div>
  );
}
