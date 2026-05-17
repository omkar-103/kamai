// components/chat-box.tsx
"use client";

import { useState } from "react";

export default function ChatBox() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <div className="fixed right-6 bottom-6 z-50">
        <button
          onClick={() => setOpen((s) => !s)}
          className="w-14 h-14 rounded-full shadow-lg bg-[var(--color-accent)] text-black flex items-center justify-center interactive"
          aria-label="Open assistant"
        >
          🤖
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div className="fixed right-6 bottom-24 z-50 w-80 glass-card shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">Kamai AI Assistant</div>
            <button onClick={() => setOpen(false)} className="text-[var(--text-secondary)]">✕</button>
          </div>

          <div className="h-44 overflow-auto text-sm text-[var(--text-secondary)]">
            <div className="mb-2"><strong>Agent:</strong> Hi! I see your vault balance is low this week. Want me to suggest actions?</div>
            <div className="mb-2"><strong>You:</strong> Show forecast</div>
            <div className="mb-2"><strong>Agent:</strong> Forecast shows a dip on Wed — consider working extra 4 hours on Tue.</div>
          </div>

          <div className="mt-3 flex gap-2">
            <input className="flex-1 bg-transparent border border-white/6 rounded-full px-3 py-1 text-sm" placeholder="Ask something..." />
            <button className="btn-accent text-xs">Send</button>
          </div>
        </div>
      )}
    </>
  );
}
