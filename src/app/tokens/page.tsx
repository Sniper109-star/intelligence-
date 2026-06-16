"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { useState, useMemo } from "react";

export function TokensPageClient() {
  const tokens = useQuery(api.tokens.listTokens, { limit: 100 }) ?? [];
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return tokens;
    const q = search.trim().toLowerCase();
    return tokens.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.symbol.toLowerCase().includes(q) ||
        t.mint.toLowerCase().includes(q)
    );
  }, [tokens, search]);

  const stats = useMemo(() => {
    const withCreators = tokens.filter((t) => t.creatorWallet).length;
    const totalSupply = tokens.reduce((sum, t) => sum + t.supply, 0);
    return {
      total: tokens.length,
      withCreators,
      totalSupply,
    };
  }, [tokens]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Tokens" value={stats.total} />
        <StatCard title="With Creators" value={stats.withCreators} changeType="positive" />
        <StatCard title="Total Supply" value={stats.totalSupply.toLocaleString()} />
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Tokens Database</h3>
            <p className="text-xs text-foreground-muted">All indexed SPL tokens with metadata</p>
          </div>
          <SearchInput
            onSearch={(val) => setSearch(val)}
            placeholder="Search name, symbol, mint..."
          />
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-hover text-xs uppercase text-foreground-muted">
              <tr>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Name</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">Symbol</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Mint</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden md:table-cell">Supply</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((t) => (
                <tr key={t._id} className="hover:bg-surface-hover">
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-2">
                      {t.logoUri ? (
                        <img src={t.logoUri} alt={t.symbol} className="h-5 w-5 rounded-full" />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">{t.symbol[0]}</div>
                      )}
                      <span className="text-xs font-medium text-foreground">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 hidden sm:table-cell">
                    <Badge variant="info">{t.symbol}</Badge>
                  </td>
                  <td className="px-3 sm:px-4 py-3 font-mono text-xs text-foreground">{t.mint.slice(0, 8)}...{t.mint.slice(-4)}</td>
                  <td className="px-3 sm:px-4 py-3 text-foreground hidden md:table-cell">{t.supply.toLocaleString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-xs text-foreground-muted">No tokens found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
