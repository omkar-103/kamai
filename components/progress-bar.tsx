// components/progress-bar.tsx
"use client";

interface ProgressBarProps {
  value: number; // 0-100
  height?: string;
  label?: string;
  striped?: boolean;
}

export default function ProgressBar({
  value,
  height = "h-2",
  label,
  striped = false,
}: ProgressBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  
  const containerClassName = `${height} w-full glass-panel rounded-full overflow-hidden border border-white/10`;
  const fillClassName = `h-full transition-all duration-500 ease-out ${striped ? "bg-striped" : ""}`;
  
  const fillStyle = {
    width: `${clampedValue}%`,
    background: "linear-gradient(90deg, #0fd3c1, #48bb78)",
    backgroundSize: striped ? "20px 20px" : "auto",
    backgroundImage: striped
      ? "repeating-linear-gradient(45deg, #0fd3c1, #0fd3c1 10px, #48bb78 10px, #48bb78 20px)"
      : undefined,
    animation: striped ? "stripe-animation 2s linear infinite" : "none",
  } as React.CSSProperties;

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-secondary)]">{label}</span>
          <span className="text-xs font-semibold text-[var(--color-accent)]">
            {clampedValue}%
          </span>
        </div>
      )}

      {/* Progress bar container */}
      <div className={containerClassName}>
        {/* Progress fill */}
        <div className={fillClassName} style={fillStyle} />
      </div>

      {/* CSS for striped animation */}
      <style>{`
        @keyframes stripe-animation {
          0% { background-position: 0 0; }
          100% { background-position: 40px 0; }
        }
      `}</style>
    </div>
  );
}
