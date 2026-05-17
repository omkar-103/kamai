// components/settings/consent-switches.tsx
"use client";

import { useState, useEffect } from "react";
import Toggle from "../toggle";
import { Shield, Bot, Mail } from "lucide-react";

interface ConsentState {
  analytics: boolean;
  aiTraining: boolean;
  marketing: boolean;
}

export default function ConsentSwitches() {
  const [consents, setConsents] = useState<ConsentState>({
    analytics: true,
    aiTraining: false,
    marketing: false,
  });

  useEffect(() => {
    // Load saved consent preferences
    const savedConsents = localStorage.getItem("consents");
    if (savedConsents) {
      setConsents(JSON.parse(savedConsents));
    }
  }, []);

  const handleConsentChange = (key: keyof ConsentState, value: boolean) => {
    const newConsents = { ...consents, [key]: value };
    setConsents(newConsents);
    localStorage.setItem("consents", JSON.stringify(newConsents));
  };

  const consentOptions = [
    {
      key: "analytics" as keyof ConsentState,
      icon: Shield,
      title: "Analytics Consent",
      description: "Allow anonymous usage data for performance improvement",
      checked: consents.analytics,
    },
    {
      key: "aiTraining" as keyof ConsentState,
      icon: Bot,
      title: "AI Training Consent",
      description: "Use your anonymized data to improve AI models and recommendations",
      checked: consents.aiTraining,
    },
    {
      key: "marketing" as keyof ConsentState,
      icon: Mail,
      title: "Marketing Updates",
      description: "Receive product updates, tips, and promotional offers via email",
      checked: consents.marketing,
    },
  ];

  return (
    <div className="space-y-4">
      {consentOptions.map((option) => (
        <div
          key={option.key}
          className="flex items-start justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] 
            hover:bg-white/[0.03] hover:border-white/[0.06] transition-all duration-200"
        >
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center">
              <option.icon size={18} className="text-[var(--color-accent)]" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                {option.title}
              </div>
              <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {option.description}
              </div>
            </div>
          </div>
          <div className="ml-4">
            <Toggle
              checked={option.checked}
              onChange={(value) => handleConsentChange(option.key, value)}
              label=""
            />
          </div>
        </div>
      ))}
    </div>
  );
}
