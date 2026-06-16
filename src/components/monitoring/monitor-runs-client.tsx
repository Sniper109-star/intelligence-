"use client";

import { StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MonitorRunsClient() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <StatCard title="Live Events" value="202" change="+12%" changeType="positive" />
        <StatCard title="Alerts Today" value="18" change="-3%" changeType="positive" />
        <StatCard title="Smart Money Signals" value="7" />
      </div>
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="relative inline-flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
            </span>
            <span className="text-sm font-medium text-foreground">Live feed active</span>
          </div>
          <Badge variant="success">Streaming</Badge>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-md border border-border bg-surface-hover px-3 py-2.5">
            <div className="flex items-center gap-3">
              <Badge variant="warning">Transfer</Badge>
              <div>
                <div className="text-sm font-medium text-foreground">Large Transfer Identified</div>
                <div className="text-xs text-foreground-muted">500 SOL moved by 7xKx... within the last few seconds.</div>
              </div>
            </div>
            <span className="text-xs text-foreground-muted shrink-0">Just now</span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-md border border-border bg-surface-hover px-3 py-2.5">
            <div className="flex items-center gap-3">
              <Badge variant="success">Buy</Badge>
              <div>
                <div className="text-sm font-medium text-foreground">Smart Money Buy Detected</div>
                <div className="text-xs text-foreground-muted">Token SOL/USDC purchased by a tracked smart money wallet.</div>
              </div>
            </div>
            <span className="text-xs text-foreground-muted shrink-0">2 min ago</span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-md border border-border bg-surface-hover px-3 py-2.5">
            <div className="flex items-center gap-3">
              <Badge variant="danger">Sell</Badge>
              <div>
                <div className="text-sm font-medium text-foreground">Creator Exit Detected</div>
                <div className="text-xs text-foreground-muted">Known creator wallet liquidated 80% of holdings.</div>
              </div>
            </div>
            <span className="text-xs text-foreground-muted shrink-0">14 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
