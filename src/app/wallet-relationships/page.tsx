"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

const RELATIONSHIP_COLORS: Record<string, string> = {
  funder: "bg-success",
  follower: "bg-primary",
  insider: "bg-warning",
  mixer: "bg-danger",
  creator: "bg-accent",
  default: "bg-muted",
};

export function WalletRelationshipsPageClient() {
  const relationships = useQuery(api.walletRelationships.listWalletRelationships, { limit: 200 }) ?? [];
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const types = useMemo(() => {
    const t = new Set(relationships.map((r) => r.relationshipType));
    return Array.from(t);
  }, [relationships]);

  const filtered = useMemo(() => {
    let result = relationships;
    if (typeFilter !== "all") {
      result = result.filter((r) => r.relationshipType === typeFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.sourceWallet.toLowerCase().includes(q) ||
          r.targetWallet.toLowerCase().includes(q) ||
          r.relationshipType.toLowerCase().includes(q)
      );
    }
    return result;
  }, [relationships, typeFilter, search]);

  const stats = useMemo(() => {
    const uniqueWallets = new Set([
      ...relationships.map((r) => r.sourceWallet),
      ...relationships.map((r) => r.targetWallet),
    ]).size;
    const totalVol = relationships.reduce((s, r) => s + r.totalVolume, 0);
    return {
      total: relationships.length,
      uniqueWallets,
      totalVol,
      avgStrength: relationships.length ? relationships.reduce((s, r) => s + r.strength, 0) / relationships.length : 0,
    };
  }, [relationships]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Relationships" value={stats.total} />
        <StatCard title="Unique Wallets" value={stats.uniqueWallets} />
        <StatCard title="Total Volume" value={`$${(stats.totalVol / 1e6).toFixed(1)}M`} />
        <StatCard title="Avg Strength" value={stats.avgStrength.toFixed(2)} />
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Wallet Relationships</h3>
            <p className="text-xs text-foreground-muted">Relationships and connections between wallets</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <SearchInput
              onSearch={(val) => setSearch(val)}
              placeholder="Search wallet or type..."
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
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Source</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Type</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">Strength</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden md:table-cell">Txns</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden lg:table-cell">Volume</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r, i) => (
                <tr key={i} className="hover:bg-surface-hover">
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full shrink-0", RELATIONSHIP_COLORS[r.relationshipType] || RELATIONSHIP_COLORS.default)} />
                      <span className="font-mono text-[10px] sm:text-xs text-foreground">{r.sourceWallet.slice(0, 8)}...</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <Badge variant="default">{r.relationshipType}</Badge>
                  </td>
                  <td className="px-3 sm:px-4 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-12 rounded-full bg-border">
                        <div
                          className="h-1 rounded-full bg-primary"
                          style={{ width: `${Math.min(r.strength * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-foreground-muted">{r.strength.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-foreground hidden md:table-cell">{r.transactionCount.toLocaleString()}</td>
                  <td className="px-3 sm:px-4 py-3 text-foreground hidden lg:table-cell">${r.totalVolume.toLocaleString()}</td>
                  <td className="px-3 sm:px-4 py-3 hidden sm:table-cell">
                    <span className="font-mono text-[10px] sm:text-xs text-foreground-muted">{r.targetWallet.slice(0, 8)}...</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-foreground-muted">No relationships found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
