"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { useState, useMemo } from "react";

export function RiskEventsPageClient() {
  const events = useQuery(api.riskEvents.listRiskEvents, { limit: 100 }) ?? [];
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let result = events;
    if (severityFilter !== "all") {
      result = result.filter((e) => e.severity === severityFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (e) =>
          e.walletAddress.toLowerCase().includes(q) ||
          e.eventType.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [events, severityFilter, search]);

  const stats = useMemo(() => {
    const critical = events.filter((e) => e.severity === "critical").length;
    const unresolved = events.filter((e) => !e.isResolved).length;
    return {
      total: events.length,
      critical,
      unresolved,
      resolved: events.filter((e) => e.isResolved).length,
    };
  }, [events]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Events" value={stats.total} />
        <StatCard title="Critical" value={stats.critical} changeType="negative" />
        <StatCard title="Unresolved" value={stats.unresolved} />
        <StatCard title="Resolved" value={stats.resolved} changeType="positive" />
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Risk Events Feed</h3>
            <p className="text-xs text-foreground-muted">All detected risk events across tracked wallets</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <SearchInput
              onSearch={(val) => setSearch(val)}
              placeholder="Search events..."
            />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="rounded-lg border border-border bg-surface px-3 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((e) => (
            <div key={e._id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-md border border-border bg-surface-hover px-3 py-2.5">
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    e.severity === "critical"
                      ? "danger"
                      : e.severity === "high"
                        ? "warning"
                        : e.severity === "medium"
                          ? "info"
                          : "success"
                  }
                >
                  {e.severity}
                </Badge>
                <div>
                  <div className="text-sm font-medium text-foreground">{e.eventType.replace("-", " ")}</div>
                  <div className="text-xs text-foreground-muted">
                    {e.walletAddress.slice(0, 10)}... — {e.description}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {e.isResolved ? (
                  <Badge variant="success">Resolved</Badge>
                ) : (
                  <Badge variant="danger">Active</Badge>
                )}
                <span className="text-xs text-foreground-muted">{new Date(e.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-md border border-border bg-surface p-6 text-center">
              <p className="text-xs text-foreground-muted">No risk events found.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
