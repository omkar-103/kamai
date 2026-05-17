// components/credit-score-card.tsx
export default function CreditScoreCard() {
  return (
    <div className="flex items-center gap-4">
      <div className="w-28 h-28 flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent">
        {/* Simple circular gauge */}
        <div className="text-center">
          <div className="text-2xl font-bold">682</div>
          <div className="text-xs text-[var(--text-secondary)]">FlexScore</div>
        </div>
      </div>

      <div className="flex-1">
        <div className="text-sm font-semibold">Credit Passport Strength</div>
        <div className="text-xs text-[var(--text-secondary)] mt-1">Consistency: 78% • On-time rate: 92%</div>
        <div className="mt-3">
          <div className="w-full bg-white/6 h-2 rounded-full overflow-hidden">
            <div className="h-2 rounded-full" style={{ width: "78%", background: "linear-gradient(90deg,#0fd3c1,#48bb78)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
