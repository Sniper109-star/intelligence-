"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { useState, useMemo } from "react";

export function CreatorWalletsPageClient() {
  const creators = useQuery(api.creatorWallets.listCreatorWallets, { limit: 100 }) ?? [];
  const [search, setSearch] = useState("");
  const [rugFilter, setRugFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let result = creators;
    if (rugFilter === "rug") {
      result = result.filter((c) => c.isRugPuller);
    } else if (rugFilter === "legit") {
      result = result.filter((c) => !c.isRugPuller);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((c) => c.address.toLowerCase().includes(q));
    }
    return result;
  }, [creators, rugFilter, search]);

  const stats = useMemo(() => {
    const rugPullers = creators.filter((c) => c.isRugPuller).length;
    const avgRep = creators.length
      ? creators.reduce((s, c) => s + c.reputationScore, 0) / creators.length
      : 0;
    const totalLaunches = creators.reduce((s, c) => s + c.totalTokensLaunched, 0);
    const successRate = totalLaunches
      ? (creators.reduce((s, c) => s + c.successfulLaunches, 0) / totalLaunches) * 100
      : 0;
    return {
      total: creators.length,
      rugPullers,
      avgRep,
      successRate,
    };
  }, [creators]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Creators" value={stats.total} />
        <StatCard title="Rug Pullers" value={stats.rugPullers} changeType="negative" />
        <StatCard title="Avg Reputation" value={stats.avgRep.toFixed(0)} />
        <StatCard title="Success Rate" value={`${stats.successRate.toFixed(0)}%`} changeType="positive" />
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Creator Wallets</h3>
            <p className="text-xs text-foreground-muted">Token creators with launch history and reputation</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <SearchInput
              onSearch={(val) => setSearch(val)}
              placeholder="Search address..."
            />
            <select
              value={rugFilter}
              onChange={(e) => setRugFilter(e.target.value)}
              className="rounded-lg border border-border bg-surface px-3 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All</option>
              <option value="rug">Rug Pullers</option>
              <option value="legit">Legitimate</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-hover text-xs uppercase text-foreground-muted">
              <tr>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Address</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Reputation</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">Launches</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden md:table-cell">Success/Fail</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden lg:table-cell">Volume</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c._id} className="hover:bg-surface-hover">
                  <td className="px-3 sm:px-4 py-3 font-mono text-xs text-foreground">{c.address.slice(0, 10)}...</td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-border">
                        <div
                          className={cn(
                            "h-1.5 rounded-full",
                            c.reputationScore > 70 ? "bg-success" : c.reputationScore > 40 ? "bg-warning" : "bg-danger"
                          )}
                          style={{ width: `${c.reputationScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground">{c.reputationScore}/100</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-foreground hidden sm:table-cell">{c.totalTokensLaunched}</td>
                  <td className="px-3 sm:px-4 py-3 text-xs hidden md:table-cell">
                    <span className="text-success">{c.successfulLaunches}</span>
                    <span className="text-foreground-muted"> / </span>
                    <span className="text-danger">{c.failedLaunches}</span>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-foreground text-xs hidden lg:table-cell">${c.totalVolume.toLocaleString()}</td>
                  <td className="px-3 sm:px-4 py-3">
                    {c.isRugPuller ? (
                      <Badge variant="danger">Rug Puller</Badge>
                    ) : (
                      <Badge variant="success">Verified</Badge>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-foreground-muted">No creators found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
