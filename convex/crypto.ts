import { v } from "convex/values";
import { query, mutation, internalQuery } from "./_generated/server";

// ── Public Queries ─────────────────────────────────────────────

/** List coins sorted by market cap rank, paginated */
export const listCoins = query({
  args: {
    page: v.optional(v.number()),
    perPage: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const page = args.page ?? 1;
    const perPage = args.perPage ?? 100;

    const markets = await ctx.db
      .query("coinMarkets")
      .withIndex("by_rank")
      .collect();

    const sorted = markets.sort((a, b) => a.marketCapRank - b.marketCapRank);
    const start = (page - 1) * perPage;
    const paged = sorted.slice(start, start + perPage);

    // Attach coin metadata
    const results = await Promise.all(
      paged.map(async (m) => {
        const coin = await ctx.db
          .query("coins")
          .withIndex("by_coinId", (q) => q.eq("coinId", m.coinId))
          .first();
        return { ...m, coin };
      })
    );

    return {
      items: results,
      total: markets.length,
      page,
      perPage,
    };
  },
});

/** Get full coin details */
export const getCoin = query({
  args: { coinId: v.string() },
  handler: async (ctx, args) => {
    const coin = await ctx.db
      .query("coins")
      .withIndex("by_coinId", (q) => q.eq("coinId", args.coinId))
      .first();
    if (!coin) return null;

    const market = await ctx.db
      .query("coinMarkets")
      .withIndex("by_coinId", (q) => q.eq("coinId", args.coinId))
      .first();

    const tickersList = await ctx.db
      .query("tickers")
      .withIndex("by_coinId", (q) => q.eq("coinId", args.coinId))
      .collect();

    return { ...coin, market, tickers: tickersList.slice(0, 50) };
  },
});

/** Get coin price history for chart */
export const getCoinChart = query({
  args: {
    coinId: v.string(),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days ?? 7;
    const since = Date.now() - days * 24 * 60 * 60 * 1000;

    const history = await ctx.db
      .query("priceHistory")
      .withIndex("by_coin_ts", (q) =>
        q.eq("coinId", args.coinId).gte("ts", since)
      )
      .collect();

    return history;
  },
});

/** Global market stats */
export const getGlobalStats = query({
  args: {},
  handler: async (ctx) => {
    const stats = await ctx.db.query("globalStats").collect();
    // Return the latest stats
    if (stats.length === 0) {
      return {
        totalMarketCap: 0,
        totalVolume: 0,
        btcDominance: 0,
        ethDominance: 0,
        activeCoins: 0,
        markets: 0,
        updatedAt: Date.now(),
      };
    }
    return stats.sort((a, b) => b.updatedAt - a.updatedAt)[0];
  },
});

/** Search coins by name */
export const searchCoins = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query || args.query.length < 1) return [];

    const results = await ctx.db
      .query("coins")
      .withSearchIndex("search_coins", (q) => q.search("name", args.query))
      .take(20);

    // Attach market data
    return Promise.all(
      results.map(async (coin) => {
        const market = await ctx.db
          .query("coinMarkets")
          .withIndex("by_coinId", (q) => q.eq("coinId", coin.coinId))
          .first();
        return { ...coin, market };
      })
    );
  },
});

/** Trending coins (top movers by 24h change) */
export const getTrending = query({
  args: {},
  handler: async (ctx) => {
    const markets = await ctx.db.query("coinMarkets").collect();
    const sorted = markets
      .filter((m) => m.change24h !== undefined && m.change24h !== null)
      .sort((a, b) => Math.abs(b.change24h ?? 0) - Math.abs(a.change24h ?? 0))
      .slice(0, 15);

    return Promise.all(
      sorted.map(async (m) => {
        const coin = await ctx.db
          .query("coins")
          .withIndex("by_coinId", (q) => q.eq("coinId", m.coinId))
          .first();
        return { ...m, coin };
      })
    );
  },
});

/** Top gainers and losers */
export const getGainersLosers = query({
  args: {},
  handler: async (ctx) => {
    const markets = await ctx.db.query("coinMarkets").collect();
    const valid = markets.filter(
      (m) => m.change24h !== undefined && m.change24h !== null
    );

    const gainers = [...valid]
      .sort((a, b) => (b.change24h ?? 0) - (a.change24h ?? 0))
      .slice(0, 10);

    const losers = [...valid]
      .sort((a, b) => (a.change24h ?? 0) - (b.change24h ?? 0))
      .slice(0, 10);

    const attachCoin = async (m: typeof markets[0]) => {
      const coin = await ctx.db
        .query("coins")
        .withIndex("by_coinId", (q) => q.eq("coinId", m.coinId))
        .first();
      return { ...m, coin };
    };

    return {
      gainers: await Promise.all(gainers.map(attachCoin)),
      losers: await Promise.all(losers.map(attachCoin)),
    };
  },
});

/** List exchanges sorted by trust rank */
export const listExchanges = query({
  args: {},
  handler: async (ctx) => {
    const exchanges = await ctx.db
      .query("cryptoExchanges")
      .withIndex("by_trustRank")
      .collect();
    return exchanges
      .sort((a, b) => (a.trustRank ?? 999) - (b.trustRank ?? 999))
      .slice(0, 100);
  },
});

/** List categories */
export const listCategories = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("cryptoCategories").collect();
    return categories.sort(
      (a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0)
    );
  },
});

// ── Internal query for ingestion worker ────────────────────────

export const getCoinByIdInternal = internalQuery({
  args: { coinId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("coins")
      .withIndex("by_coinId", (q) => q.eq("coinId", args.coinId))
      .first();
  },
});

export const getCoinMarketInternal = internalQuery({
  args: { coinId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("coinMarkets")
      .withIndex("by_coinId", (q) => q.eq("coinId", args.coinId))
      .first();
  },
});


export const validateApiKey = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query('apiKeys').withIndex('by_key', q => q.eq('key', args.key)).first();
  }
});
