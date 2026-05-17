// components/vault-chart.tsx
"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
);

type DataPoint = { date: string; inflow: number; outflow: number };

export default function VaultChart({ data }: { data: DataPoint[] }) {
  const labels = data.map((d) => d.date);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Inflow",
        data: data.map((d) => d.inflow),
        fill: true,
        backgroundColor: "rgba(15,211,193,0.12)",
        borderColor: "#0fd3c1",
        tension: 0.3,
        pointRadius: 2,
        pointBackgroundColor: "#0fd3c1",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 1,
      },
      {
        label: "Outflow",
        data: data.map((d) => d.outflow),
        fill: true,
        backgroundColor: "rgba(245,101,101,0.08)",
        borderColor: "#f56565",
        tension: 0.3,
        pointRadius: 2,
        pointBackgroundColor: "#f56565",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "rgba(255,255,255,0.8)" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "rgba(255,255,255,0.8)" },
        grid: { color: "rgba(255,255,255,0.03)" },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "rgba(255,255,255,0.85)",
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        mode: "index" as const,
        backgroundColor: "rgba(15, 10, 18, 0.9)",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        titleColor: "rgba(255,255,255,0.95)",
        bodyColor: "rgba(255,255,255,0.8)",
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className="h-56 w-full">
      <Line data={chartData} options={options as any} />
    </div>
  );
}
