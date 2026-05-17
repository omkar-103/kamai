// app/test-components/page.tsx
"use client";

import { useState } from "react";
import Modal from "../../components/modal";
import Dropdown from "../../components/dropdown";
import Toggle from "../../components/toggle";
import ProgressBar from "../../components/progress-bar";
import StatusBadge from "../../components/status-badge";

export default function TestComponentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    id: string | number;
    label: string;
  }>({ id: "7d", label: "7 Days" });

  const rangeOptions = [
    { id: "7d", label: "7 Days" },
    { id: "30d", label: "30 Days" },
    { id: "90d", label: "90 Days" },
    { id: "1y", label: "1 Year" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="p-6 space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">UI Component Sandbox</h1>
          <p className="text-[var(--text-secondary)]">
            Test and verify all interactive components
          </p>
        </div>

        {/* Modal Section */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Modal</h2>
          <div className="glass-card">
            <button
              className="btn-accent interactive"
              onClick={() => setModalOpen(true)}
            >
              Open Modal
            </button>
          </div>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Welcome to Modal"
          >
            <div className="space-y-3">
              <p>
                This is a fully functional modal with ESC key support and
                backdrop click-to-close functionality.
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Press ESC or click the X button to close.
              </p>
              <button
                className="btn-accent text-xs interactive"
                onClick={() => setModalOpen(false)}
              >
                Close Modal
              </button>
            </div>
          </Modal>
        </section>

        {/* Dropdown Section */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Dropdown</h2>
          <div className="glass-card">
            <Dropdown
              label="Date Range"
              options={rangeOptions}
              value={selectedRange}
              onChange={setSelectedRange}
            />
            <p className="mt-3 text-xs text-[var(--text-secondary)]">
              Selected: {selectedRange.label}
            </p>
          </div>
        </section>

        {/* Toggle Section */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Toggle Switches</h2>
          <div className="glass-card space-y-4">
            <div>
              <Toggle
                checked={autoSave}
                onChange={setAutoSave}
                label="Auto-Save Vault"
              />
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                Auto-save is {autoSave ? "enabled" : "disabled"}
              </p>
            </div>

            <div className="border-t border-white/10 pt-4">
              <Toggle
                checked={darkMode}
                onChange={setDarkMode}
                label="Dark Mode"
                size="md"
              />
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                Dark mode is {darkMode ? "on" : "off"}
              </p>
            </div>

            <div className="border-t border-white/10 pt-4">
              <Toggle
                checked={true}
                onChange={() => {}}
                label="Small Toggle"
                size="sm"
              />
            </div>
          </div>
        </section>

        {/* Progress Bar Section */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Progress Bars</h2>
          <div className="glass-card space-y-6">
            <ProgressBar value={25} label="Vault Sequestered" />
            <ProgressBar value={45} label="Credit Strength" />
            <ProgressBar value={78} label="Monthly Savings Goal" />
            <ProgressBar value={100} label="Income Forecast" />
            <div className="border-t border-white/10 pt-6">
              <ProgressBar
                value={55}
                label="Striped Progress"
                striped={true}
              />
            </div>
          </div>
        </section>

        {/* Status Badge Section */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Status Badges</h2>
          <div className="glass-card space-y-3">
            <div className="flex flex-wrap gap-3">
              <StatusBadge status="active" />
              <StatusBadge status="idle" />
              <StatusBadge status="warning" />
              <StatusBadge status="error" />
            </div>

            <div className="border-t border-white/10 pt-4">
              <h3 className="text-sm font-medium mb-3">Custom Labels</h3>
              <div className="flex flex-wrap gap-3">
                <StatusBadge status="active" label="Processing" />
                <StatusBadge status="idle" label="Standby" />
                <StatusBadge status="warning" label="Low Balance" />
                <StatusBadge status="error" label="Failed" />
              </div>
            </div>
          </div>
        </section>

        {/* Component Features Summary */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Features Implemented</h2>
          <div className="glass-card">
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent)] mt-0.5">✓</span>
                <span>
                  <strong>Modal:</strong> Backdrop blur, ESC key handling, focus
                  management, smooth animations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent)] mt-0.5">✓</span>
                <span>
                  <strong>Dropdown:</strong> Auto-close on outside click, arrow
                  rotation, active state highlighting
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent)] mt-0.5">✓</span>
                <span>
                  <strong>Toggle:</strong> Smooth transitions, shadow effects,
                  multiple sizes, ARIA attributes
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent)] mt-0.5">✓</span>
                <span>
                  <strong>Progress Bar:</strong> Teal-green gradient, animated
                  transitions, optional striped pattern
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent)] mt-0.5">✓</span>
                <span>
                  <strong>Status Badge:</strong> Color-coded statuses, pulse
                  animation for active, custom labels
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent)] mt-0.5">✓</span>
                <span>
                  <strong>Accessibility:</strong> ARIA roles, keyboard
                  navigation, focus states, live regions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent)] mt-0.5">✓</span>
                <span>
                  <strong>Styling:</strong> Glassmorphism design, Tailwind
                  utilities, dark theme, smooth transitions
                </span>
              </li>
            </ul>
          </div>
        </section>

        <div className="text-xs text-[var(--text-secondary)] pb-4">
          All components follow the design system defined in globals.css with
          consistent spacing, transitions, and color schemes.
        </div>
      </div>
    </div>
  );
}
