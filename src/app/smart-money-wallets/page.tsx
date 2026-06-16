"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { useState, useMemo } from "react";

export function SmartMoneyWalletsPageClient() {
  const wallets = useQuery(api.smartMoneyWallets.getSmartMoneyWallets, { limit: 100 }) ?? [];
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return wallets;
    const q = search.trim().toLowerCase();
    return wallets.filter(
      (w) =>
        w.address.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q)
    );
  }, [wallets, search]);

  const stats = useMemo(() => {
    const avgWinRate = wallets.length
      ? wallets.reduce((s, w) => s + w.winRate, 0) / wallets.length
      : 0;
    const avgProfit = wallets.length
      ? wallets.reduce((s, w) => s + w.totalProfit, 0) / wallets.length
      : 0;
    return {
      total: wallets.length,
      avgWinRate,
      avgProfit,
      totalTrades: wallets.reduce((s, w) => s + w.totalTrades, 0),
    };
  }, [wallets]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Tracked Wallets" value={stats.total} />
        <StatCard title="Avg Win Rate" value={`${stats.avgWinRate.toFixed(1)}%`} changeType="positive" />
        <StatCard title="Avg Profit" value={`$${stats.avgProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
        <StatCard title="Total Trades" value={stats.totalTrades.toLocaleString()} />
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Smart Money Leaderboard</h3>
            <p className="text-xs text-foreground-muted">High-performing wallet addresses ranked by win rate</p>
          </div>
          <SearchInput
            onSearch={(val) => setSearch(val)}
            placeholder="Search address or category..."
          />
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-hover text-xs uppercase text-foreground-muted">
              <tr>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Rank</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Address</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">Category</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Win Rate</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden md:table-cell">Profit</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden lg:table-cell">Trades</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((w, i) => (
                <tr key={w._id} className="hover:bg-surface-hover">
                  <td className="px-3 sm:px-4 py-3 font-medium text-foreground">#{i + 1}</td>
                  <td className="px-3 sm:px-4 py-3 font-mono text-xs text-foreground">{w.address.slice(0, 10)}...</td>
                  <td className="px-3 sm:px-4 py-3 hidden sm:table-cell">
                    <Badge variant="info">{w.category}</Badge>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-12 rounded-full bg-border">
                        <div
                          className={cn(
                            "h-1 rounded-full",
                            w.winRate >= 80 ? "bg-success" : w.winRate >= 60 ? "bg-primary" : "bg-warning"
                          )}
                          style={{ width: `${Math.min(w.winRate, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-foreground">{w.winRate.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-foreground hidden md:table-cell">${w.totalProfit.toLocaleString()}</td>
                  <td className="px-3 sm:px-4 py-3 text-foreground hidden lg:table-cell">{w.totalTrades.toLocaleString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-foreground-muted">No smart money wallets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
