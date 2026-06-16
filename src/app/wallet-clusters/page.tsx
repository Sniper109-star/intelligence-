"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export function WalletClustersPageClient() {
  const clusters = useQuery(api.walletClusters.listWalletClusters, undefined) ?? [];
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const types = useMemo(() => {
    const t = new Set(clusters.map((c) => c.clusterType));
    return Array.from(t);
  }, [clusters]);

  const filtered = useMemo(() => {
    let result = clusters;
    if (typeFilter !== "all") {
      result = result.filter((c) => c.clusterType === typeFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [clusters, typeFilter, search]);

  const stats = useMemo(() => {
    const totalMembers = clusters.reduce((s, c) => s + c.members.length, 0);
    const avgSize = clusters.length ? totalMembers / clusters.length : 0;
    return {
      total: clusters.length,
      totalMembers,
      avgSize,
      threatCount: clusters.filter((c) => c.threatLevel && c.threatLevel !== "low").length,
    };
  }, [clusters]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Clusters" value={stats.total} />
        <StatCard title="Total Members" value={stats.totalMembers} />
        <StatCard title="Avg Size" value={stats.avgSize.toFixed(1)} />
        <StatCard title="Threat Level" value={stats.threatCount} changeType={stats.threatCount > 0 ? "negative" : "positive"} />
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Wallet Clusters</h3>
            <p className="text-xs text-foreground-muted">Groups of related wallets identified by clustering algorithms</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <SearchInput
              onSearch={(val) => setSearch(val)}
              placeholder="Search cluster name..."
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

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div key={c._id} className="rounded-lg border border-border bg-surface p-4 hover:border-primary/50 transition-colors">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground truncate pr-2">{c.name}</h4>
                {c.threatLevel && c.threatLevel !== "low" ? (
                  <Badge variant={c.threatLevel === "critical" ? "danger" : "warning"}>{c.threatLevel}</Badge>
                ) : (
                  <Badge variant="success">Safe</Badge>
                )}
              </div>
              <p className="text-xs text-foreground-muted mb-3 line-clamp-2">{c.description || "No description provided"}</p>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  <Badge variant="info">{c.clusterType}</Badge>
                </div>
                <span className="text-xs text-foreground-muted">{c.members.length} members</span>
              </div>
              <div className="mt-2 max-h-24 overflow-y-auto scrollbar-thin">
                <div className="space-y-1">
                  {c.members.slice(0, 5).map((m, i) => (
                    <div key={i} className="font-mono text-[10px] text-foreground-muted truncate">{m}</div>
                  ))}
                  {c.members.length > 5 && (
                    <div className="text-[10px] text-primary">+{c.members.length - 5} more</div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-lg border border-border bg-surface p-8 text-center">
              <p className="text-xs text-foreground-muted">No clusters found matching your filters.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
