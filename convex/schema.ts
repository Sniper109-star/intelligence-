import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  wallets: defineTable({
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
  }).index("by_address", ["address"]),

  transactions: defineTable({
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
  }).index("by_wallet", ["walletAddress"])
   .index("by_signature", ["signature"])
   .index("by_block_time", ["blockTime"]),

  tokens: defineTable({
    mint: v.string(),
    name: v.string(),
    symbol: v.string(),
    decimals: v.number(),
    supply: v.number(),
    logoUri: v.optional(v.string()),
    creatorWallet: v.optional(v.string()),
    deployerWallet: v.optional(v.string()),
    firstFunderWallet: v.optional(v.string()),
  }).index("by_mint", ["mint"])
   .index("by_creator", ["creatorWallet"]),

  creatorWallets: defineTable({
    address: v.string(),
    totalTokensLaunched: v.number(),
    successfulLaunches: v.number(),
    failedLaunches: v.number(),
    totalVolume: v.number(),
    reputationScore: v.number(),
    isRugPuller: v.boolean(),
    firstTokenAt: v.optional(v.number()),
    lastTokenAt: v.optional(v.number()),
  }).index("by_address", ["address"]),

  walletRelationships: defineTable({
    sourceWallet: v.string(),
    targetWallet: v.string(),
    relationshipType: v.string(),
    strength: v.number(),
    transactionCount: v.number(),
    totalVolume: v.number(),
    firstInteraction: v.number(),
    lastInteraction: v.number(),
  }).index("by_source", ["sourceWallet"])
   .index("by_target", ["targetWallet"])
   .index("by_pair", ["sourceWallet", "targetWallet"]),

  walletClusters: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    members: v.array(v.string()),
    clusterType: v.string(),
    threatLevel: v.optional(v.string()),
  }).index("by_type", ["clusterType"]),

  smartMoneyWallets: defineTable({
    address: v.string(),
    winRate: v.number(),
    totalProfit: v.number(),
    totalTrades: v.number(),
    avgProfitPerTrade: v.number(),
    earlyTokenDiscoveries: v.number(),
    topHoldings: v.array(v.string()),
    rank: v.optional(v.number()),
    category: v.string(),
  }).index("by_address", ["address"])
   .index("by_rank", ["rank"])
   .index("by_winrate", ["winRate"]),

  walletScores: defineTable({
    walletAddress: v.string(),
    trustScore: v.number(),
    activityScore: v.number(),
    smartMoneyScore: v.number(),
    riskScore: v.number(),
    overallScore: v.number(),
    riskLevel: v.string(),
    analysis: v.optional(v.string()),
  }).index("by_wallet", ["walletAddress"]),

  walletAlerts: defineTable({
    walletAddress: v.string(),
    userId: v.optional(v.string()),
    alertType: v.string(),
    condition: v.any(),
    isActive: v.boolean(),
    channels: v.array(v.string()),
    lastTriggered: v.optional(v.number()),
    triggerCount: v.number(),
  }).index("by_wallet", ["walletAddress"])
   .index("by_user", ["userId"]),

  trackedWallets: defineTable({
    walletAddress: v.string(),
    userId: v.optional(v.string()),
    label: v.optional(v.string()),
    tags: v.array(v.string()),
    isActive: v.boolean(),
  }).index("by_wallet", ["walletAddress"])
   .index("by_user", ["userId"]),

  riskEvents: defineTable({
    walletAddress: v.string(),
    eventType: v.string(),
    severity: v.string(),
    description: v.string(),
    relatedWallets: v.array(v.string()),
    relatedTokens: v.array(v.string()),
    evidence: v.optional(v.any()),
    isResolved: v.boolean(),
  }).index("by_wallet", ["walletAddress"])
   .index("by_severity", ["severity"]),

  tokenCreators: defineTable({
    walletAddress: v.string(),
    tokenMint: v.string(),
    role: v.string(),
  }).index("by_wallet", ["walletAddress"])
   .index("by_token", ["tokenMint"]),

  portfolioSnapshots: defineTable({
    walletAddress: v.string(),
    totalValue: v.number(),
    tokenAllocations: v.any(),
    nftValue: v.number(),
    cashBalance: v.number(),
    snapshotAt: v.number(),
  }).index("by_wallet_time", ["walletAddress", "snapshotAt"]),
});
