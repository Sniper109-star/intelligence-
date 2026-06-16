"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

const TXN_TYPES = [
  "transfer",
  "swap",
  "stake",
  "nft_mint",
  "token_transfer",
  "system",
];

export function TransactionsPageClient() {
  const recent = useQuery(api.transactions.listRecentTransactions, { limit: 100 }) ?? [];
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let result = recent;
    if (typeFilter !== "all") {
      result = result.filter((t) => t.type === typeFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.signature.toLowerCase().includes(q) ||
          t.walletAddress.toLowerCase().includes(q) ||
          t.tokenSymbol?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [recent, typeFilter, search]);

  const stats = useMemo(() => {
    const totalAmount = recent.reduce((sum, t) => sum + t.amount, 0);
    const uniqueWallets = new Set(recent.map((t) => t.walletAddress)).size;
    return {
      total: recent.length,
      totalAmount,
      uniqueWallets,
      avgTxn: recent.length ? totalAmount / recent.length : 0,
    };
  }, [recent]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Transactions" value={stats.total} />
        <StatCard title="Total Amount" value={`${(stats.totalAmount / 1e9).toFixed(1)} SOL`} />
        <StatCard title="Unique Wallets" value={stats.uniqueWallets} />
        <StatCard title="Avg Txn Size" value={`${(stats.avgTxn / 1e9).toFixed(2)} SOL`} />
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Recent Transactions</h3>
            <p className="text-xs text-foreground-muted">All indexed transactions in the database</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <SearchInput
              onSearch={(val) => setSearch(val)}
              placeholder="Search signature or wallet..."
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-border bg-surface px-3 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Types</option>
              {TXN_TYPES.map((t) => (
                <option key={t} value={t}>{t.replace("_", " ")}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-hover text-xs uppercase text-foreground-muted">
              <tr>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Type</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Signature</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden lg:table-cell">Wallet</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Amount</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap hidden md:table-cell">Fee</th>
                <th className="px-3 sm:px-4 py-3 whitespace-nowrap">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((t) => (
                <tr key={t._id} className="hover:bg-surface-hover">
                  <td className="px-3 sm:px-4 py-3">
                    <Badge variant={t.type === "swap" ? "info" : t.type === "stake" ? "success" : "default"}>{t.type}</Badge>
                  </td>
                  <td className="px-3 sm:px-4 py-3 font-mono text-xs text-foreground">{t.signature.slice(0, 8)}...{t.signature.slice(-6)}</td>
                  <td className="px-3 sm:px-4 py-3 font-mono text-xs text-foreground-muted hidden lg:table-cell">{t.walletAddress.slice(0, 8)}...</td>
                  <td className="px-3 sm:px-4 py-3 text-foreground">{(t.amount / 1e9).toFixed(4)} SOL</td>
                  <td className="px-3 sm:px-4 py-3 text-xs text-foreground-muted hidden md:table-cell">{(t.fee / 1e9).toFixed(6)}</td>
                  <td className="px-3 sm:px-4 py-3 text-xs text-foreground-muted">{new Date(t.blockTime).toLocaleString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-foreground-muted">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
