// components/vault-transactions.tsx
"use client";

type Tx = {
  id: string;
  date: string;
  type: "deposit" | "release" | "withdraw";
  amount: number;
  note?: string;
};

export default function VaultTransactions({ txs }: { txs: Tx[] }) {
  const getTypeStyles = (type: "deposit" | "release" | "withdraw") => {
    switch (type) {
      case "deposit":
        return "bg-[rgba(72,187,120,0.12)] text-[#48bb78]";
      case "release":
        return "bg-[rgba(15,211,193,0.08)] text-[var(--color-accent)]";
      case "withdraw":
        return "bg-[rgba(245,101,101,0.08)] text-[#f56565]";
      default:
        return "bg-white/6 text-[var(--text-secondary)]";
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[var(--text-secondary)] text-xs">
            <tr className="border-b border-white/4">
              <th className="py-3 text-left font-medium">Date</th>
              <th className="py-3 text-left font-medium">Type</th>
              <th className="py-3 text-right font-medium">Amount</th>
              <th className="py-3 text-left font-medium">Note</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((t, idx) => (
              <tr
                key={t.id}
                className={`border-b border-white/2 hover:bg-white/2 transition-colors ${
                  idx === txs.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="py-3 text-[var(--text-primary)]">{t.date}</td>
                <td className="py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeStyles(
                      t.type
                    )}`}
                  >
                    {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                  </span>
                </td>
                <td className="py-3 text-right font-medium text-[var(--text-primary)]">
                  ₹{t.amount.toLocaleString()}
                </td>
                <td className="py-3 text-[var(--text-secondary)]">
                  {t.note ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
