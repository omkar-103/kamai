/**
 * components/platform-links.tsx
 * 
 * Displays connected platform logos in a responsive grid.
 */

"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Wallet, MapPin } from "lucide-react";

interface PlatformLinksProps {
  platforms: string[];
}

// Map platform names to icons
const platformIcons: Record<string, React.ReactNode> = {
  Swiggy: (
    <ShoppingCart size={32} className="text-[var(--text-primary)]" />
  ),
  Zomato: (
    <ShoppingCart size={32} className="text-[var(--text-primary)]" />
  ),
  Paytm: (
    <Wallet size={32} className="text-[var(--text-primary)]" />
  ),
};

const platformColors: Record<string, string> = {
  Swiggy: "from-[#f37335] to-[#ee5a4a]",
  Zomato: "from-[#ef4f5f] to-[#e63946]",
  Paytm: "from-[#00bcd4] to-[#0097a7]",
};

export default function PlatformLinks({ platforms }: PlatformLinksProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Linked Platforms
      </h3>

      {platforms.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)]">
          No platforms linked yet
        </p>
      ) : (
        <motion.div
          className="grid grid-cols-3 md:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {platforms.map((platform) => (
            <motion.div
              key={platform}
              variants={itemVariants}
              className="group"
            >
              <div
                className={`bg-gradient-to-br ${
                  platformColors[platform] || "from-white/10 to-white/5"
                } rounded-xl p-6 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg`}
                title={platform}
              >
                {platformIcons[platform] || (
                  <span className="text-4xl font-bold text-[var(--text-primary)]">
                    {platform.charAt(0)}
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-2 text-center truncate group-hover:text-[var(--text-primary)] transition-colors">
                {platform}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
