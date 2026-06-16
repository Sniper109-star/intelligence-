"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export function WalletsPageClient() {
  const wallets = useQuery(api.wallets.listWallets, { limit: 100 }) ?? [];
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const types = useMemo(() => {
    const t = new Set(wallets.map((w) => w.walletType).filter(Boolean));
    return Array.from(t);
  }, [wallets]);

  const filtered = useMemo(() => {
    let result = wallets;
    if (typeFilter !== "all") {
      result = result.filter((w) => w.walletType === typeFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (w) =>
          w.address.toLowerCase().includes(q) ||
          w.walletType?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [wallets, typeFilter, search]);

  const stats = useMemo(() => {
    const funded = wallets.filter((w) => w.isFunded).length;
    const creators = wallets.filter((w) => w.isCreator).length;
    return {
      total: wallets.length,
      funded,
      creators,
      totalTransactions: wallets.reduce((sum, w) => sum + w.transactionCount, 0),
    };
  }, [wallets]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Wallets" value={stats.total} />
        <StatCard title="Funded Wallets" value={stats.funded} change={`${wallets.length ? Math.round((stats.funded / wallets.length) * 100) : 0}%`} />
        <StatCard title="Creators" value={stats.creators} changeType="positive" />
        <StatCard title="Total Txns" value={stats.totalTransactions.toLocaleString()} />
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Wallets Database</h3>
            <p className="text-xs text-foreground-muted">All indexed wallets with balances and metadata</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <SearchInput
              onSearch={(val) => setSearch(val)}
              placeholder="Search address or type..."
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-border bg-surface px-3 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Types</option>
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-hover text-xs uppercase text-foreground-muted">
              <tr>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Address</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">Type</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Balance</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden md:table-cell">Tokens</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden lg:table-cell">NFTs</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Txns</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden md:table-cell">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((w) => (
                <tr key={w._id} className="hover:bg-surface-hover">
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      <span className="font-mono text-xs text-foreground">{w.address.slice(0, 8)}...{w.address.slice(-4)}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 hidden sm:table-cell">
                    {w.walletType ? <Badge variant="info">{w.walletType}</Badge> : <span className="text-xs text-foreground-muted">—</span>}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-foreground font-medium">{w.balance.toLocaleString()} SOL</td>
                  <td className="px-3 sm:px-4 py-3 text-foreground hidden md:table-cell">{w.tokenCount}</td>
                  <td className="px-3 sm:px-4 py-3 text-foreground hidden lg:table-cell">{w.nftCount}</td>
                  <td className="px-3 sm:px-4 py-3 text-foreground">{w.transactionCount.toLocaleString()}</td>
                  <td className="px-3 sm:px-4 py-3 text-xs text-foreground-muted hidden md:table-cell">
                    {new Date(w.lastActive).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-foreground-muted">
                    No wallets found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
