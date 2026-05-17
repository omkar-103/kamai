// components/dropdown.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownOption {
  id: string | number;
  label: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value?: DropdownOption;
  onChange?: (option: DropdownOption) => void;
}

export default function Dropdown({
  label,
  options,
  value = options[0],
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSelect = (option: DropdownOption) => {
    onChange?.(option);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full max-w-xs">
      {/* Label */}
      <label className="block text-xs text-[var(--text-secondary)] mb-2">
        {label}
      </label>

      {/* Trigger Button */}
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full glass-panel flex items-center justify-between px-3 py-2 border border-white/10 rounded-lg interactive focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-sm text-[var(--text-primary)]">
          {value?.label || "Select..."}
        </span>
        <ChevronDown
          size={16}
          className={`text-[var(--text-secondary)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <ul
          className="absolute top-full left-0 right-0 mt-2 glass-card border border-white/10 shadow-lg z-50 overflow-hidden transform transition-all duration-200 animate-in fade-in slide-in-from-top-1"
          role="listbox"
        >
          {options.map((option) => (
            <li key={option.id}>
              <button
                onClick={() => handleSelect(option)}
                className={value?.id === option.id ? "w-full text-left px-3 py-2 text-sm transition-colors duration-150 bg-[var(--color-accent)]/10 text-[var(--color-accent)]" : "w-full text-left px-3 py-2 text-sm transition-colors duration-150 text-[var(--text-secondary)] hover:bg-white/5"}
                role="option"
                aria-selected={value?.id === option.id}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
