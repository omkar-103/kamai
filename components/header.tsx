// components/header.tsx
"use client";

import { Menu, Bell } from "lucide-react";

export default function Header({ onMenuToggle }: { onMenuToggle?: () => void }) {
  return (
    <header className="flex items-center justify-between py-4 px-6 border-b border-white/2">
      {/* Left: Mobile menu + Title */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={() => onMenuToggle?.()}
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-md bg-white/3 interactive"
        >
          <Menu size={18} />
        </button>

        <div>
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <div className="text-xs text-[var(--text-secondary)]">Welcome back — here's your financial snapshot</div>
        </div>
      </div>

      {/* Right: Search (hide on small), notifications, status, avatar */}
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <input
            placeholder="Search transactions, agents..."
            className="bg-transparent border border-white/6 rounded-full px-3 py-1 text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>

        <div className="flex items-center gap-3">
          <button aria-label="Notifications" className="p-2 rounded-md bg-white/3 interactive">
            <Bell size={18} />
          </button>

          {/* Status badge */}
          <div className="status-badge">
            <span className="pulse-accent" aria-hidden />
            <span className="text-[var(--text-secondary)]">Agents Active</span>
          </div>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-sm font-semibold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
