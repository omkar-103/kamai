/**
 * components/profile-card.tsx
 * 
 * Displays user profile information with avatar and FlexScore.
 */

"use client";

import Image from "next/image";
import StatusBadge from "./status-badge";
import { motion } from "framer-motion";

interface ProfileCardProps {
  name: string;
  avatar: string;
  flexscore: number;
  email: string;
  joined: string;
}

export default function ProfileCard({
  name,
  avatar,
  flexscore,
  email,
  joined,
}: ProfileCardProps) {
  // Determine FlexScore status
  const getScoreStatus = (score: number): "active" | "idle" | "warning" | "error" => {
    if (score >= 700) return "active";
    if (score >= 600) return "idle";
    if (score >= 500) return "warning";
    return "error";
  };

  const memberSince = new Date(joined).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="glass-card p-6"
    >
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-[var(--color-accent)]/30 flex-shrink-0">
            <Image
              src={avatar}
              alt={name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Pulse animation around avatar */}
          <div className="absolute inset-0 rounded-full animate-pulse bg-[var(--color-accent)]/10"></div>
        </motion.div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">{name}</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{email}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            Member since {memberSince}
          </p>

          {/* Status Badge */}
          <div className="mt-3">
            <StatusBadge status={getScoreStatus(flexscore)} label="Active" />
          </div>
        </div>

        {/* FlexScore Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-right"
        >
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide mb-1">
            FlexScore
          </p>
          <p className="text-4xl font-bold text-[var(--color-accent)]">{flexscore}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Credit Health</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
