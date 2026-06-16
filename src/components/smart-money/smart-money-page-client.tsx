"use client";

import { StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SmartMoneyWallet {
  address: string;
  winRate: number;
  totalProfit: number;
  totalTrades: number;
  category: string;
}

const avgWinColor = (value: number): "success" | "info" | "warning" =>
  value >= 80 ? "success" : value >= 60 ? "info" : "warning";

export function SmartMoneyPageClient({ wallets }: { wallets: SmartMoneyWallet[] }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Tracked Wallets" value="92" change="+4" changeType="positive" />
        <StatCard title="Avg Win Rate" value="68%" />
        <StatCard title="Portfolio Following" value="$2.4M" />
      </div>
      <div className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Leaderboard</h3>
          <span className="text-xs text-foreground-muted">Updated 3 min ago</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-hover text-xs uppercase text-foreground-muted">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Wallet</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Win Rate</th>
                <th className="px-4 py-3">Total Profit</th>
                <th className="px-4 py-3">Trades</th>
                <th className="px-4 py-3">Avg Trade (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {wallets.map((w, idx) => (
                <tr key={idx} className="hover:bg-surface-hover">
                  <td className="px-4 py-3 font-medium text-foreground">{w.category ? `${w.category}${idx + 1}` : `#${idx + 1}`}</td>
                  <td className="px-4 py-3 font-mono text-foreground">{w.address}</td>
                  <td className="px-4 py-3">
                    <Badge variant="info">{w.category}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={avgWinColor(w.winRate)}>{w.winRate.toFixed(1)}%</Badge>
                  </td>
                  <td className="px-4 py-3 text-foreground">${w.totalProfit.toLocaleString()}</td>
                  <td className="px-4 py-3 text-foreground">{w.totalTrades}</td>
                  <td className="px-4 py-3 text-foreground">{(w.totalProfit / Math.max(w.totalTrades, 1)).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
