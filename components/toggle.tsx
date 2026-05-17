// components/toggle.tsx
"use client";

import { useId } from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: "sm" | "md";
}

export default function Toggle({
  checked,
  onChange,
  label,
  size = "md",
}: ToggleProps) {
  const id = useId();

  const sizeClasses = {
    sm: {
      container: "w-10 h-5",
      circle: "w-4 h-4",
      translate: "translate-x-5",
    },
    md: {
      container: "w-12 h-6",
      circle: "w-5 h-5",
      translate: "translate-x-6",
    },
  };

  const currentSize = sizeClasses[size];

  const buttonClassName = `${currentSize.container} rounded-full transition-all duration-200 ${
    checked
      ? "bg-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/20"
      : "bg-white/10 border border-white/20"
  } focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]`;

  const circleClassName = `${currentSize.circle} bg-white rounded-full shadow-md transition-transform duration-200 ${
    checked ? currentSize.translate : "translate-x-0.5"
  }`;

  return (
    <div className="flex items-center gap-3">
      {/* Toggle Switch */}
      <button
        id={id}
        onClick={() => onChange(!checked)}
        className={buttonClassName}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        {/* Circle indicator */}
        <div className={circleClassName} />
      </button>

      {/* Label */}
      {label && (
        <label htmlFor={id} className="text-sm text-[var(--text-primary)] cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
}
