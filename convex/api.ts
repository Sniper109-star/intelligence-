import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertWallet = mutation({
  args: {
    address: v.string(),
    balance: v.number(),
    tokenCount: v.number(),
    nftCount: v.number(),
    transactionCount: v.number(),
    totalReceived: v.number(),
    totalSent: v.number(),
    firstSeen: v.number(),
    lastActive: v.number(),
    walletType: v.optional(v.string()),
    isCreator: v.boolean(),
    isFunded: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("wallets")
      .withIndex("by_address", (q) => q.eq("address", args.address))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("wallets", {
        ...args,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

export const getWallet = query({
  args: { address: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("wallets")
      .withIndex("by_address", (q) => q.eq("address", args.address))
      .first();
  },
});

export const upsertWalletScore = mutation({
  args: {
    walletAddress: v.string(),
    trustScore: v.number(),
    activityScore: v.number(),
    smartMoneyScore: v.number(),
    riskScore: v.number(),
    overallScore: v.number(),
    riskLevel: v.string(),
    analysis: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("walletScores")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });
      return existing._id;
    }
    return await ctx.db.insert("walletScores", {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

export const getWalletScore = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("walletScores")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress))
      .first();
  },
});

export const getWalletTransactions = query({
  args: { walletAddress: v.string(), limit: v.number() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("transactions")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress))
      .order("desc")
      .take(args.limit || 50);
    return results;
  },
});

export const upsertTransaction = mutation({
  args: {
    walletAddress: v.string(),
    signature: v.string(),
    slot: v.number(),
    blockTime: v.number(),
    type: v.string(),
    source: v.string(),
    destination: v.optional(v.string()),
    amount: v.number(),
    fee: v.number(),
    tokenMint: v.optional(v.string()),
    tokenAmount: v.optional(v.number()),
    tokenSymbol: v.optional(v.string()),
    instructionType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("transactions")
      .withIndex("by_signature", (q) => q.eq("signature", args.signature))
      .first();

    if (existing) return existing._id;
    return await ctx.db.insert("transactions", { ...args });
  },
});

export const upsertCreatorWallet = mutation({
  args: {
    address: v.string(),
    totalTokensLaunched: v.number(),
    successfulLaunches: v.number(),
    failedLaunches: v.number(),
    totalVolume: v.number(),
    reputationScore: v.number(),
    isRugPuller: v.boolean(),
    firstTokenAt: v.optional(v.number()),
    lastTokenAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("creatorWallets")
      .withIndex("by_address", (q) => q.eq("address", args.address))
      .first();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert("creatorWallets", { ...args, createdAt: now, updatedAt: now });
  },
});

export const getCreatorWallet = query({
  args: { address: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("creatorWallets")
      .withIndex("by_address", (q) => q.eq("address", args.address))
      .first();
  },
});

export const upsertRiskEvent = mutation({
  args: {
    walletAddress: v.string(),
    eventType: v.string(),
    severity: v.string(),
    description: v.string(),
    relatedWallets: v.array(v.string()),
    relatedTokens: v.array(v.string()),
    evidence: v.optional(v.any()),
    isResolved: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("riskEvents", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getRiskEvents = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("riskEvents")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress))
      .order("desc")
      .take(50);
  },
});

export const saveAlert = mutation({
  args: {
    walletAddress: v.string(),
    userId: v.optional(v.string()),
    alertType: v.string(),
    condition: v.any(),
    isActive: v.boolean(),
    channels: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("walletAlerts", {
      ...args,
      lastTriggered: undefined,
      triggerCount: 0,
      createdAt: Date.now(),
    });
  },
});

export const trackWallet = mutation({
  args: {
    walletAddress: v.string(),
    userId: v.optional(v.string()),
    label: v.optional(v.string()),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("trackedWallets")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, isActive: true });
      return existing._id;
    }
    return await ctx.db.insert("trackedWallets", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const addSmartMoneyWallet = mutation({
  args: {
    address: v.string(),
    winRate: v.number(),
    totalProfit: v.number(),
    totalTrades: v.number(),
    avgProfitPerTrade: v.number(),
    earlyTokenDiscoveries: v.number(),
    topHoldings: v.array(v.string()),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("smartMoneyWallets")
      .withIndex("by_address", (q) => q.eq("address", args.address))
      .first();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert("smartMoneyWallets", { ...args, createdAt: now, updatedAt: now });
  },
});

export const getSmartMoneyWallets = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const wallets = await ctx.db
      .query("smartMoneyWallets")
      .withIndex("by_winrate", (q) => q)
      .order("desc")
      .take(args.limit || 20);
    return wallets;
  },
});

export const savePortfolioSnapshot = mutation({
  args: {
    walletAddress: v.string(),
    totalValue: v.number(),
    tokenAllocations: v.any(),
    nftValue: v.number(),
    cashBalance: v.number(),
    snapshotAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("portfolioSnapshots", args);
  },
});
