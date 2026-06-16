"use client";

import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { Card, StatCard, ScoreRing } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

const riskColor = (level: string) => {
  switch (level) {
    case "critical":
    case "high":
      return "#ef4444";
    case "medium":
      return "#f59e0b";
    case "low":
      return "#10b981";
    default:
      return "#6366f1";
  }
};

type WalletScoreRow = {
  _id: string;
  walletAddress: string;
  trustScore: number;
  activityScore: number;
  smartMoneyScore: number;
  riskScore: number;
  overallScore: number;
  riskLevel: string;
  analysis?: string;
};

export function WalletScoresPageClient() {
  const scores = useQuery(api.walletScores.listWalletScores, { limit: 100 }) ?? [];
  const [search, setSearch] = useState("");

  const typed = scores as WalletScoreRow[];

  const filtered = useMemo(() => {
    if (!search.trim()) return typed;
    const q = search.trim().toLowerCase();
    return typed.filter((s) => s.walletAddress.toLowerCase().includes(q));
  }, [typed, search]);

  const stats = useMemo(() => {
    const avgOverall = typed.length
      ? typed.reduce((s, x) => s + x.overallScore, 0) / typed.length
      : 0;
    const avgRisk = typed.length
      ? typed.reduce((s, x) => s + x.riskScore, 0) / typed.length
      : 0;
    const highRisk = typed.filter((s) => s.riskScore > 70 || s.riskLevel === "critical" || s.riskLevel === "high").length;
    return {
      total: typed.length,
      avgOverall,
      avgRisk,
      highRisk,
    };
  }, [typed]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Scored Wallets" value={stats.total} />
        <StatCard title="Avg Score" value={stats.avgOverall.toFixed(0)} />
        <StatCard title="Avg Risk" value={stats.avgRisk.toFixed(0)} changeType={stats.avgRisk > 50 ? "negative" : "positive"} />
        <StatCard title="High Risk" value={stats.highRisk} changeType={stats.highRisk > 0 ? "negative" : "positive"} />
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Wallet Scores</h3>
            <p className="text-xs text-foreground-muted">Computed trust, activity, smart money, and risk scores per wallet</p>
          </div>
          <SearchInput
            onSearch={(val) => setSearch(val)}
            placeholder="Search wallet address..."
          />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((s) => (
            <div key={s._id} className="rounded-lg border border-border bg-surface p-4 hover:border-primary/50 transition-colors">
              <div className="mb-3 flex flex-col items-center gap-2">
                <ScoreRing
                  value={s.overallScore}
                  size={100}
                  color={riskColor(s.riskLevel)}
                  label={s.riskLevel}
                />
              </div>
              <div className="space-y-2">
                <div className="font-mono text-xs text-foreground truncate">{s.walletAddress}</div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-[10px] text-foreground-muted">Trust</div>
                    <div className="text-xs font-bold text-foreground">{s.trustScore}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-foreground-muted">Activity</div>
                    <div className="text-xs font-bold text-foreground">{s.activityScore}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-foreground-muted">SM</div>
                    <div className="text-xs font-bold text-foreground">{s.smartMoneyScore}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-foreground-muted">Risk</div>
                    <div className={cn("text-xs font-bold", s.riskScore > 70 ? "text-danger" : s.riskScore > 40 ? "text-warning" : "text-success")}>{s.riskScore}</div>
                  </div>
                </div>
                {s.analysis && <p className="text-[10px] text-foreground-muted line-clamp-2 border-t border-border pt-2 mt-2">{s.analysis}</p>}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-lg border border-border bg-surface p-8 text-center">
              <p className="text-xs text-foreground-muted">No wallet scores found.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
