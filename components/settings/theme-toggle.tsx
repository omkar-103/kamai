// components/settings/theme-toggle.tsx
"use client";

import { useState, useEffect } from "react";
import Toggle from "../toggle";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  theme?: "dark" | "light";
  setTheme?: (theme: "dark" | "light") => void;
}

export default function ThemeToggle({ theme: propTheme, setTheme: propSetTheme }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [glassIntensity, setGlassIntensity] = useState(10);

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    const savedIntensity = localStorage.getItem("glassIntensity");
    
    if (savedTheme) setTheme(savedTheme);
    if (savedIntensity) setGlassIntensity(parseInt(savedIntensity));
  }, []);

  const handleThemeChange = (isDark: boolean) => {
    const newTheme = isDark ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (propSetTheme) propSetTheme(newTheme);
    
    // Apply theme class to document
    if (newTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setGlassIntensity(value);
    localStorage.setItem("glassIntensity", value.toString());
    
    // Update CSS variable
    document.documentElement.style.setProperty("--glass-blur", `${value}px`);
  };

  const currentTheme = propTheme || theme;
  const isDark = currentTheme === "dark";

  return (
    <div className="space-y-6">
      {/* Theme Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isDark ? (
            <Moon size={20} className="text-[var(--color-accent)]" />
          ) : (
            <Sun size={20} className="text-[var(--color-accent)]" />
          )}
          <div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              Theme Mode
            </div>
            <div className="text-xs text-[var(--text-secondary)]">
              {isDark ? "Dark Mode" : "Light Mode"}
            </div>
          </div>
        </div>
        <Toggle
          checked={isDark}
          onChange={handleThemeChange}
          label=""
        />
      </div>

      {/* Glass Intensity Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="glass-intensity"
            id="glass-intensity-label"
            className="text-sm font-semibold text-[var(--text-primary)]"
          >
            Glassmorphism Intensity
          </label>
          <span className="text-xs text-[var(--text-secondary)]">
            {glassIntensity}px
          </span>
        </div>
        <input
          type="range"
          id="glass-intensity"
          min="5"
          max="40"
          step="1"
          value={glassIntensity}
          onChange={handleIntensityChange}
          aria-labelledby="glass-intensity-label"
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 
            focus:ring-offset-[var(--color-bg)] transition-all duration-200
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
            [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-[var(--color-accent)] 
            [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-[var(--color-accent)]/30
            [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-accent)]
            [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg 
            [&::-moz-range-thumb]:shadow-[var(--color-accent)]/30
            [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-200
            [&::-moz-range-thumb]:hover:scale-110"
        />
        <div className="text-xs text-[var(--text-secondary)]">
          Adjust the blur intensity of glassmorphic UI elements
        </div>
      </div>
    </div>
  );
}
