"use client";

import { StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RiskPageClient() {
  const severityColor: Record<string, "danger" | "warning" | "success" | "muted" | "info"> = {
    critical: "danger",
    high: "warning",
    medium: "info",
    low: "success",
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Critical Risks" value="4" change="+1" changeType="negative" />
        <StatCard title="High Risks" value="21" change="-2%" changeType="positive" />
        <StatCard title="Avg Risk Score" value="38" change="-5" changeType="positive" />
        <StatCard title="Active Alerts" value="13" />
      </div>
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Risk Events Feed</h3>
        </div>
        <div className="divide-y divide-border">
          {[
            { type: "rug-pull", wallet: "7xKx...", severity: "critical", description: "Developer sold 100% of holdings." },
            { type: "insider-trade", wallet: "9aBz...", severity: "high", description: "Possible insider activity on new token with 300% price increase." },
            { type: "draining", wallet: "3mQw...", severity: "critical", description: "Rapid outbound transfers from a known draining wallet." },
            { type: "concentration", wallet: "5nPv...", severity: "high", description: "Top wallet holds 72% of circulating supply." },
          ].map((r, i) => (
            <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <Badge variant={severityColor[r.severity]}>{r.severity.toUpperCase()}</Badge>
                <div>
                  <div className="text-sm font-medium text-foreground">{r.type.replace("-", " ")}</div>
                  <div className="text-xs text-foreground-muted">
                    {r.wallet} — {r.description}
                  </div>
                </div>
              </div>
              <span className="text-xs text-foreground-muted shrink-0">2h ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
