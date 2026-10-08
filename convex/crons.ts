import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Fetch live market data (prices, market cap, volume, change) every 5 minutes
crons.interval(
  "ingest-coin-markets",
  { minutes: 5 },
  internal.cryptoIngestion.ingestCoinMarkets,
);

// Fetch categories every hour
crons.interval(
  "ingest-categories",
  { minutes: 60 },
  internal.cryptoIngestion.ingestCategories,
);

// Fetch exchanges every hour
crons.interval(
  "ingest-exchanges",
  { minutes: 60 },
  internal.cryptoIngestion.ingestExchanges,
);

export default crons;
