"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { useState, useMemo } from "react";

export function PortfolioSnapshotsPageClient() {
  const snapshots = useQuery(
    api.portfolioSnapshots.getPortfolioSnapshots,
    { walletAddress: "latest", limit: 100 }
  ) ?? [];
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return snapshots;
    const q = search.trim().toLowerCase();
    return snapshots.filter((s) => s.walletAddress.toLowerCase().includes(q));
  }, [snapshots, search]);

  const stats = useMemo(() => {
    const totalValue = snapshots.reduce((s, snap) => s + snap.totalValue, 0);
    const avgValue = snapshots.length ? totalValue / snapshots.length : 0;
    return {
      total: snapshots.length,
      totalValue,
      avgValue,
    };
  }, [snapshots]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3">
        <StatCard title="Snapshots" value={stats.total} />
        <StatCard title="Total Value" value={stats.totalValue.toLocaleString()} />
        <StatCard title="Avg Value" value={stats.avgValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Portfolio Snapshots</h3>
            <p className="text-xs text-foreground-muted">Historical portfolio value snapshots per wallet</p>
          </div>
          <SearchInput
            onSearch={(val) => setSearch(val)}
            placeholder="Search wallet..."
          />
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-hover text-xs uppercase text-foreground-muted">
              <tr>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Wallet</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Value</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">Tokens</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden md:table-cell">NFT Value</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Cash</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => (
                <tr key={s._id} className="hover:bg-surface-hover">
                  <td className="px-3 sm:px-4 py-3 font-mono text-xs text-foreground">{s.walletAddress.slice(0, 10)}...</td>
                  <td className="px-3 sm:px-4 py-3 text-foreground font-medium">${s.totalValue.toLocaleString()}</td>
                  <td className="px-3 sm:px-4 py-3 text-xs text-foreground-muted hidden sm:table-cell">
                    {s.tokenAllocations ? JSON.stringify(s.tokenAllocations).slice(0, 30) + "..." : "—"}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-foreground hidden md:table-cell">${s.nftValue.toLocaleString()}</td>
                  <td className="px-3 sm:px-4 py-3 text-foreground">${s.cashBalance.toLocaleString()}</td>
                  <td className="px-3 sm:px-4 py-3 text-xs text-foreground-muted">{new Date(s.snapshotAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-foreground-muted">No snapshots found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
