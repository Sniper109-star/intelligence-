"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { useState, useMemo } from "react";

export function TrackedWalletsPageClient() {
  const wallets = useQuery(api.trackedWallets.listTrackedWallets, undefined) ?? [];
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return wallets;
    const q = search.trim().toLowerCase();
    return wallets.filter(
      (w) =>
        w.walletAddress.toLowerCase().includes(q) ||
        w.label?.toLowerCase().includes(q) ||
        w.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [wallets, search]);

  const stats = useMemo(() => {
    const tagged = wallets.filter((w) => w.tags.length > 0).length;
    return {
      total: wallets.length,
      tagged,
      untagged: wallets.filter((w) => w.tags.length === 0).length,
    };
  }, [wallets]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3">
        <StatCard title="Tracked Wallets" value={stats.total} />
        <StatCard title="Tagged" value={stats.tagged} changeType="positive" />
        <StatCard title="Untagged" value={stats.untagged} />
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Tracked Wallets</h3>
            <p className="text-xs text-foreground-muted">Wallets you are actively monitoring</p>
          </div>
          <SearchInput
            onSearch={(val) => setSearch(val)}
            placeholder="Search tracked wallet..."
          />
        </div>

        <div className="space-y-2">
          {filtered.map((w) => (
            <div key={w._id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-md border border-border bg-surface-hover px-3 py-2.5">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-success" />
                <div>
                  <div className="font-mono text-xs text-foreground">{w.walletAddress}</div>
                  {w.label && (
                    <div className="text-[10px] text-foreground-muted">{w.label}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {w.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {w.tags.slice(0, 2).map((t) => (
                      <Badge key={t} variant="muted">{t}</Badge>
                    ))}
                    {w.tags.length > 2 && (
                      <span className="text-[10px] text-foreground-muted">+{w.tags.length - 2}</span>
                    )}
                  </div>
                )}
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-md border border-border bg-surface p-6 text-center">
              <p className="text-xs text-foreground-muted">No tracked wallets found.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
