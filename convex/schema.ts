import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ── Existing LaunchLayer tables ──────────────────────────────
  contentItems: defineTable({
    type: v.union(v.literal("blog"), v.literal("event"), v.literal("listing"), v.literal("partner"), v.literal("token"), v.literal("work")),
    title: v.string(),
    summary: v.string(),
    tag: v.optional(v.string()),
    meta: v.optional(v.string()),
    body: v.optional(v.string()),
    href: v.optional(v.string()),
    coverImageStorageId: v.optional(v.id("_storage")),
    coverImageName: v.optional(v.string()),
    documentStorageId: v.optional(v.id("_storage")),
    documentName: v.optional(v.string()),
    documentType: v.optional(v.string()),
    contentFormat: v.optional(v.string()),
    authorEmail: v.optional(v.string()),
    impressions: v.optional(v.number()),
    clicks: v.optional(v.number()),
    leads: v.optional(v.number()),
    published: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_published", ["published"]),

  bookings: defineTable({
    projectName: v.string(),
    contact: v.string(),
    chainStatus: v.string(),
    mainGoal: v.string(),
    message: v.string(),
    source: v.string(),
    status: v.union(v.literal("new"), v.literal("contacted"), v.literal("archived")),
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  // ── CryptoBoard: Coins ───────────────────────────────────────
  coins: defineTable({
    coinId: v.string(),           // "bitcoin"
    symbol: v.string(),           // "btc"
    name: v.string(),             // "Bitcoin"
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    links: v.optional(v.any()),   // { website, twitter, github, explorers }
    platforms: v.optional(v.any()), // { ethereum: "0x...", solana: "..." }
    genesisDate: v.optional(v.string()),
    hashingAlgo: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_coinId", ["coinId"])
    .index("by_symbol", ["symbol"])
    .index("by_name", ["name"])
    .searchIndex("search_coins", { searchField: "name", filterFields: ["symbol", "isActive"] }),

  // ── CryptoBoard: Live Market Data ────────────────────────────
  coinMarkets: defineTable({
    coinId: v.string(),
    priceUsd: v.number(),
    marketCap: v.number(),
    fdv: v.optional(v.number()),
    volume24h: v.number(),
    circulatingSupply: v.optional(v.number()),
    totalSupply: v.optional(v.number()),
    maxSupply: v.optional(v.number()),
    change1h: v.optional(v.number()),
    change24h: v.optional(v.number()),
    change7d: v.optional(v.number()),
    change30d: v.optional(v.number()),
    ath: v.optional(v.number()),
    athDate: v.optional(v.string()),
    atl: v.optional(v.number()),
    atlDate: v.optional(v.string()),
    marketCapRank: v.number(),
    sparkline7d: v.optional(v.array(v.number())),
    updatedAt: v.number(),
  })
    .index("by_coinId", ["coinId"])
    .index("by_rank", ["marketCapRank"]),

  // ── CryptoBoard: Price History (for charts) ──────────────────
  priceHistory: defineTable({
    coinId: v.string(),
    ts: v.number(),             // unix timestamp in ms
    priceUsd: v.number(),
    marketCap: v.optional(v.number()),
    volume24h: v.optional(v.number()),
  })
    .index("by_coin_ts", ["coinId", "ts"]),

  // ── CryptoBoard: Exchanges ───────────────────────────────────
  cryptoExchanges: defineTable({
    exchangeId: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    country: v.optional(v.string()),
    yearEstablished: v.optional(v.number()),
    url: v.optional(v.string()),
    trustScore: v.optional(v.number()),
    trustRank: v.optional(v.number()),
    volume24hBtc: v.optional(v.number()),
    isDex: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_exchangeId", ["exchangeId"])
    .index("by_trustRank", ["trustRank"]),

  // ── CryptoBoard: Tickers (coin × exchange × pair) ───────────
  tickers: defineTable({
    coinId: v.string(),
    exchangeId: v.string(),
    base: v.string(),
    target: v.string(),
    last: v.number(),
    volume: v.optional(v.number()),
    convertedVolumeUsd: v.optional(v.number()),
    spreadPct: v.optional(v.number()),
    trustScore: v.optional(v.string()),
    lastTradedAt: v.optional(v.number()),
  })
    .index("by_coinId", ["coinId"])
    .index("by_exchangeId", ["exchangeId"]),

  // ── CryptoBoard: Categories ──────────────────────────────────
  cryptoCategories: defineTable({
    categoryId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    marketCap: v.optional(v.number()),
    volume24h: v.optional(v.number()),
    change24h: v.optional(v.number()),
    topCoins: v.optional(v.array(v.string())),
    updatedAt: v.number(),
  })
    .index("by_categoryId", ["categoryId"]),

  // ── CryptoBoard: Global Stats ────────────────────────────────
  globalStats: defineTable({
    totalMarketCap: v.number(),
    totalVolume: v.number(),
    btcDominance: v.number(),
    ethDominance: v.number(),
    activeCoins: v.number(),
    markets: v.number(),
    updatedAt: v.number(),
  }),

  // ── CryptoBoard: Users ───────────────────────────────────────
  cryptoUsers: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    walletAddress: v.optional(v.string()),
    displayName: v.optional(v.string()),
    currency: v.string(),          // "usd"
    role: v.string(),              // "user" | "admin"
    createdAt: v.number(),
  })
    .index("by_email", ["email"]),

  // ── CryptoBoard: Watchlists ──────────────────────────────────
  watchlists: defineTable({
    userId: v.id("cryptoUsers"),
    name: v.string(),
    coinIds: v.array(v.string()),  // ["bitcoin", "ethereum"]
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"]),

  // ── CryptoBoard: Portfolios ──────────────────────────────────
  portfolios: defineTable({
    userId: v.id("cryptoUsers"),
    name: v.string(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"]),

  portfolioTransactions: defineTable({
    portfolioId: v.id("portfolios"),
    coinId: v.string(),
    type: v.union(v.literal("buy"), v.literal("sell"), v.literal("transfer_in"), v.literal("transfer_out")),
    quantity: v.number(),
    priceUsd: v.number(),
    fee: v.optional(v.number()),
    ts: v.number(),
    note: v.optional(v.string()),
  })
    .index("by_portfolioId", ["portfolioId"]),

  // ── CryptoBoard: Price Alerts ────────────────────────────────
  priceAlerts: defineTable({
    userId: v.id("cryptoUsers"),
    coinId: v.string(),
    condition: v.union(v.literal("above"), v.literal("below"), v.literal("pct_up"), v.literal("pct_down")),
    value: v.number(),
    active: v.boolean(),
    triggeredAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_coinId", ["coinId"]),

  // ── CryptoBoard: Developer API Keys ──────────────────────────
  apiKeys: defineTable({
    userId: v.id('cryptoUsers'),
    key: v.string(), // The hashed or raw key
    tier: v.union(v.literal('free'), v.literal('pro')),
    rateLimitRemaining: v.number(),
    lastResetTs: v.number(),
    createdAt: v.number(),
    isActive: v.boolean(),
  })
    .index('by_userId', ['userId'])
    .index('by_key', ['key']),
});
