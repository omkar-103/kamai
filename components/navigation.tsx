// components/navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Activity,
  Layers,
  Users,
  User,
  Settings,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  Icon: React.ComponentType<any>;
};

export default function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() || "/";

  // Primary navigation items for both desktop and mobile
  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/", Icon: Home },
    { label: "Analytics", href: "/analytics", Icon: Activity },
    { label: "Vault", href: "/vault", Icon: Layers },
    { label: "Agents", href: "/agents", Icon: Users },
    { label: "Profile", href: "/profile", Icon: User },
    { label: "Settings", href: "/settings", Icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation (hidden on mobile) */}
      <nav className="hidden md:flex h-full flex-col justify-start">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-bg)] text-white font-bold">
            K
          </div>
          <div>
            <div className="text-sm font-semibold">Kamai</div>
            <div className="text-xs text-[var(--text-secondary)]">Dashboard</div>
          </div>
        </div>

        <ul className="space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => onNavigate?.()}
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/3 transition-colors duration-150 ${
                    active ? "nav-active" : "bg-transparent"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <div
                    className={`p-2 rounded-md inline-flex items-center justify-center ${
                      active ? "bg-[var(--color-accent)]/10" : "bg-white/2"
                    }`}
                  >
                    <item.Icon
                      size={18}
                      className={active ? "text-[var(--color-accent)]" : "text-[var(--text-secondary)]"}
                    />
                  </div>
                  <span className={`text-sm ${active ? "text-[var(--text-primary)] font-semibold" : "text-[var(--text-secondary)]"}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Footer quick links */}
        <div className="mt-auto pt-6 text-[var(--text-secondary)] text-xs">
          <div className="mb-2">Help & Feedback</div>
          <div>Kamai v1.0</div>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar (shown only on mobile) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/[0.08]
          backdrop-blur-xl shadow-2xl"
        aria-label="Mobile navigation"
      >
        <ul className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  onClick={() => onNavigate?.()}
                  className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg
                    transition-all duration-200 group relative
                    ${active ? "" : "hover:bg-white/[0.03]"}`}
                  aria-current={active ? "page" : undefined}
                  aria-label={item.label}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[var(--color-accent)] rounded-full" />
                  )}
                  
                  {/* Icon */}
                  <div
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-[var(--color-accent)]/15 scale-110"
                        : "bg-transparent group-hover:bg-white/[0.05]"
                    }`}
                  >
                    <item.Icon
                      size={20}
                      className={active ? "text-[var(--color-accent)]" : "text-[var(--text-secondary)]"}
                      strokeWidth={active ? 2.5 : 2}
                    />
                  </div>
                  
                  {/* Label */}
                  <span
                    className={`text-[10px] font-medium transition-colors duration-200 ${
                      active ? "text-[var(--color-accent)]" : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
