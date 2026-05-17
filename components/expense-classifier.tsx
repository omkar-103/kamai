// components/expense-classifier.tsx
"use client";

import { useEffect, useState } from "react";
import ExpensePieChart, { ExpenseCategory } from "./charts/expense-pie";

export default function ExpenseClassifier() {
  const [data, setData] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch("/api/expenses");
        if (!res.ok) throw new Error("Failed to fetch expense data");
        const apiData = await res.json();
        setData(apiData);
      } catch (err) {
        console.error("Error loading expense data:", err);
        setError("Failed to load expense data");
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
      <ExpensePieChart data={data} />
    </div>
  );
}
