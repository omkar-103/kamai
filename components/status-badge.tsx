// components/status-badge.tsx
interface StatusBadgeProps {
  status: "active" | "idle" | "warning" | "error";
  label?: string;
}

const statusConfig = {
  active: {
    bg: "bg-[var(--color-accent)]",
    text: "text-[var(--color-accent)]",
    pulse: true,
    dotClasses: "pulse-accent",
  },
  idle: {
    bg: "bg-white/6",
    text: "text-[var(--text-secondary)]",
    pulse: false,
    dotClasses: "bg-white/6",
  },
  warning: {
    bg: "bg-[#ed8936]/10",
    text: "text-[#ed8936]",
    pulse: false,
    dotClasses: "bg-[#ed8936]",
  },
  error: {
    bg: "bg-[#f56565]/10",
    text: "text-[#f56565]",
    pulse: false,
    dotClasses: "bg-[#f56565]",
  },
};

export default function StatusBadge({
  status,
  label,
}: StatusBadgeProps) {
  const config = statusConfig[status];

  const statusLabels = {
    active: "Active",
    idle: "Idle",
    warning: "Warning",
    error: "Error",
  };

  const displayLabel = label || statusLabels[status];

  const badgeClassName = `inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text} transition-all duration-200`;
  const dotClassName = `inline-block w-2 h-2 rounded-full ${config.dotClasses}`;

  return (
    <div
      className={badgeClassName}
      role="status"
      aria-live="polite"
    >
      {/* Status dot */}
      {config.pulse ? (
        <span className={config.dotClasses} aria-hidden="true" />
      ) : (
        <span className={dotClassName} aria-hidden="true" />
      )}

      {/* Label */}
      <span>{displayLabel}</span>
    </div>
  );
}
