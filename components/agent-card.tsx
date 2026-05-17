// components/agent-card.tsx
"use client";

import { motion } from "framer-motion";
import StatusBadge from "./status-badge";
import { LucideIcon } from "lucide-react";

type AgentStatus = "active" | "idle" | "warning" | "error";

interface AgentCardProps {
  name: string;
  description: string;
  Icon: LucideIcon;
  status: AgentStatus;
  lastAction?: string;
  onClick?: () => void;
}

export default function AgentCard({
  name,
  description,
  Icon,
  status,
  lastAction,
  onClick,
}: AgentCardProps) {
  const isActive = status === "active";

  return (
    <motion.article
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ translateY: -4 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass-card cursor-pointer interactive group"
      role="button"
      tabIndex={onClick ? 0 : -1}
      aria-label={`${name} agent - ${status} - ${lastAction || ""}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon Circle */}
        <motion.div
          className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/3 flex-shrink-0"
          animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={{
            repeat: isActive ? Infinity : 0,
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <Icon
            size={20}
            className={
              isActive
                ? "text-[var(--color-accent)]"
                : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
            }
            aria-hidden="true"
          />
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            {name}
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
            {description}
          </div>
        </div>

        {/* Status & Action */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <StatusBadge status={status} />
          {lastAction && (
            <div className="text-xs text-[var(--text-secondary)] text-right whitespace-nowrap">
              {lastAction}
            </div>
          )}
        </div>
      </div>

      {/* Active state accent line */}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[var(--color-accent)] to-transparent"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ borderRadius: "0 0 1rem 1rem" }}
        />
      )}
    </motion.article>
  );
}
