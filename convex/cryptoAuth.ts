import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const loginOrRegister = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("cryptoUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    // Create new user
    const newUserId = await ctx.db.insert("cryptoUsers", {
      email: args.email,
      passwordHash: "mock_password", // simple mock auth
      currency: "usd",
      role: "user",
      createdAt: Date.now(),
    });

    return newUserId;
  },
});

export const getWatchlist = query({
  args: { userId: v.optional(v.id("cryptoUsers")) },
  handler: async (ctx, args) => {
    if (!args.userId) return null;
    let watchlist = await ctx.db
      .query("watchlists")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId as any))
      .first();
    
    if (!watchlist) return { coinIds: [], coins: [] };

    // Hydrate coins
    const coins = await Promise.all(
      watchlist.coinIds.map(async (coinId) => {
        const coin = await ctx.db
          .query("coins")
          .withIndex("by_coinId", (q) => q.eq("coinId", coinId))
          .first();
        const market = await ctx.db
          .query("coinMarkets")
          .withIndex("by_coinId", (q) => q.eq("coinId", coinId))
          .first();
        return { ...coin, market };
      })
    );

    return { ...watchlist, coins: coins.filter(c => c.coinId) };
  },
});

export const toggleWatchlist = mutation({
  args: { userId: v.id("cryptoUsers"), coinId: v.string() },
  handler: async (ctx, args) => {
    let watchlist = await ctx.db
      .query("watchlists")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!watchlist) {
      await ctx.db.insert("watchlists", {
        userId: args.userId,
        name: "My Watchlist",
        coinIds: [args.coinId],
        createdAt: Date.now(),
      });
      return true;
    }

    const set = new Set(watchlist.coinIds);
    let added = false;
    if (set.has(args.coinId)) {
      set.delete(args.coinId);
    } else {
      set.add(args.coinId);
      added = true;
    }

    await ctx.db.patch(watchlist._id, { coinIds: Array.from(set) });
    return added;
  },
});


export const generateApiKey = mutation({
  args: { userId: v.id('cryptoUsers'), tier: v.union(v.literal('free'), v.literal('pro')) },
  handler: async (ctx, args) => {
    // Generate a random key
    const key = 'll_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    await ctx.db.insert('apiKeys', {
      userId: args.userId,
      key,
      tier: args.tier,
      rateLimitRemaining: args.tier === 'free' ? 100 : 100000,
      lastResetTs: Date.now(),
      createdAt: Date.now(),
      isActive: true,
    });
    
    return key;
  }
});

export const getMyApiKeys = query({
  args: { userId: v.optional(v.id('cryptoUsers')) },
  handler: async (ctx, args) => {
    if (!args.userId) return [];
    return await ctx.db.query('apiKeys').withIndex('by_userId', q => q.eq('userId', args.userId as any)).collect();
  }
});
