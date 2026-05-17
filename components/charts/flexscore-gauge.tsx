/**
 * components/charts/flexscore-gauge.tsx
 * 
 * Radial gauge showing FlexScore credit rating (0-1000 scale).
 * Displays score with color-coded status and accessible text labels.
 */

"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface FlexScoreGaugeProps {
  value: number; // 0-1000, normalized to 0-100 for visualization
}

export default function FlexScoreGauge({ value }: FlexScoreGaugeProps) {
  // Normalize score (assume 0-1000 scale, convert to percentage)
  const normalizedScore = Math.min(Math.max(Math.round((value / 1000) * 100), 0), 100);

  // Determine status and color based on score
  const getScoreStatus = (score: number): { label: string; color: string; description: string } => {
    if (score >= 750) return { label: "Excellent", color: "#48bb78", description: "Outstanding credit profile" };
    if (score >= 650) return { label: "Good", color: "#0fd3c1", description: "Healthy credit standing" };
    if (score >= 550) return { label: "Fair", color: "#ed8936", description: "Building credit history" };
    return { label: "Poor", color: "#f56565", description: "Needs improvement" };
  };

  const status = getScoreStatus(normalizedScore);

  // Create gauge data
  const gaugeData = useMemo(() => {
    return [
      { name: "score", value: normalizedScore },
      { name: "remaining", value: 100 - normalizedScore },
    ];
  }, [normalizedScore]);

  // Format score display (denormalize back to 0-1000)
  const displayScore = Math.round((normalizedScore / 100) * 1000);

  return (
    <div className="w-full space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">FlexScore</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Your credit health rating
        </p>
      </div>

      {/* Main gauge */}
      <div className="flex flex-col items-center justify-center py-4">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value"
              isAnimationActive
              aria-describedby="flexscore-desc"
            >
              <Cell fill={status.color} />
              <Cell fill="rgba(255,255,255,0.1)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Score text in center */}
        <div className="relative -mt-24 text-center z-10">
          <p className="text-4xl font-bold" style={{ color: status.color }}>
            {displayScore}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {normalizedScore}% Score
          </p>
        </div>
      </div>

      {/* Status badge */}
      <div className="glass-panel">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
              Status
            </p>
            <p className="text-sm font-semibold mt-1" style={{ color: status.color }}>
              {status.label}
            </p>
          </div>
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: status.color }}
            aria-hidden="true"
          />
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-2">
          {status.description}
        </p>
      </div>

      {/* Score breakdown reference */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/3">
          <span className="text-[var(--text-secondary)]">Excellent (750+)</span>
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#48bb78" }} />
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/3">
          <span className="text-[var(--text-secondary)]">Good (650-749)</span>
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#0fd3c1" }} />
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/3">
          <span className="text-[var(--text-secondary)]">Fair (550-649)</span>
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ed8936" }} />
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/3">
          <span className="text-[var(--text-secondary)]">Poor (&lt;550)</span>
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#f56565" }} />
        </div>
      </div>

      {/* Accessibility descriptions */}
      <div className="hidden">
        <p id="flexscore-desc">
          Radial gauge showing FlexScore credit rating. Current score is {displayScore} out of 1000, 
          which corresponds to {status.label} credit status.
        </p>
      </div>
    </div>
  );
}
