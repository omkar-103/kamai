// components/settings/notification-preferences.tsx
"use client";

import { useState, useEffect } from "react";
import Toggle from "../toggle";
import { Mail, Bell, MessageSquare, ChevronDown } from "lucide-react";

interface NotificationState {
  email: boolean;
  inApp: boolean;
  sms: boolean;
  frequency: "instant" | "daily" | "weekly";
}

export default function NotificationPreferences() {
  const [notifications, setNotifications] = useState<NotificationState>({
    email: true,
    inApp: true,
    sms: false,
    frequency: "instant",
  });

  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Load saved notification preferences
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = () => {
      if (showDropdown) setShowDropdown(false);
    };
    
    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showDropdown]);

  const handleNotificationChange = (key: keyof Omit<NotificationState, "frequency">, value: boolean) => {
    const newNotifications = { ...notifications, [key]: value };
    setNotifications(newNotifications);
    localStorage.setItem("notifications", JSON.stringify(newNotifications));
  };

  const handleFrequencyChange = (frequency: NotificationState["frequency"]) => {
    const newNotifications = { ...notifications, frequency };
    setNotifications(newNotifications);
    localStorage.setItem("notifications", JSON.stringify(newNotifications));
    setShowDropdown(false);
  };

  const notificationChannels = [
    {
      key: "email" as keyof Omit<NotificationState, "frequency">,
      icon: Mail,
      title: "Email Notifications",
      description: "Receive alerts and updates via email",
      checked: notifications.email,
    },
    {
      key: "inApp" as keyof Omit<NotificationState, "frequency">,
      icon: Bell,
      title: "In-App Notifications",
      description: "Show notifications within the application",
      checked: notifications.inApp,
    },
    {
      key: "sms" as keyof Omit<NotificationState, "frequency">,
      icon: MessageSquare,
      title: "SMS Notifications",
      description: "Receive important alerts via text message",
      checked: notifications.sms,
    },
  ];

  const frequencyOptions = [
    { value: "instant" as const, label: "Instant", description: "Receive notifications immediately" },
    { value: "daily" as const, label: "Daily Digest", description: "Once per day summary" },
    { value: "weekly" as const, label: "Weekly Summary", description: "Once per week recap" },
  ];

  const currentFrequency = frequencyOptions.find((f) => f.value === notifications.frequency);

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <div className="space-y-4">
        {notificationChannels.map((channel) => (
          <div
            key={channel.key}
            className="flex items-start justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] 
              hover:bg-white/[0.03] hover:border-white/[0.06] transition-all duration-200"
          >
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center">
                <channel.icon size={18} className="text-[var(--color-accent)]" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                  {channel.title}
                </div>
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {channel.description}
                </div>
              </div>
            </div>
            <div className="ml-4">
              <Toggle
                checked={channel.checked}
                onChange={(value) => handleNotificationChange(channel.key, value)}
                label=""
              />
            </div>
          </div>
        ))}
      </div>

      {/* Frequency Dropdown */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[var(--text-primary)]">
          Notification Frequency
        </label>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className="w-full flex items-center justify-between p-4 rounded-xl 
              bg-white/[0.02] border border-white/[0.04] 
              hover:bg-white/[0.03] hover:border-white/[0.06] 
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 
              focus:ring-offset-[var(--color-bg)]"
            aria-haspopup="listbox"
            aria-expanded={showDropdown}
          >
            <div className="text-left">
              <div className="text-sm font-medium text-[var(--text-primary)]">
                {currentFrequency?.label}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                {currentFrequency?.description}
              </div>
            </div>
            <ChevronDown
              size={18}
              className={`text-[var(--text-secondary)] transition-transform duration-200 ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showDropdown && (
            <div
              className="absolute z-10 w-full mt-2 glass-card border border-white/[0.08] rounded-xl overflow-hidden"
              role="listbox"
            >
              {frequencyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFrequencyChange(option.value)}
                  className={`w-full text-left p-4 transition-all duration-150
                    hover:bg-white/[0.05] ${
                      notifications.frequency === option.value
                        ? "bg-[var(--color-accent)]/10 border-l-2 border-[var(--color-accent)]"
                        : ""
                    }`}
                  role="option"
                  aria-selected={notifications.frequency === option.value}
                >
                  <div className="text-sm font-medium text-[var(--text-primary)]">
                    {option.label}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
