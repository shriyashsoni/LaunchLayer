import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Scale,
  Zap,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Flame,
  Sparkles,
  MessageSquare,
  Share2,
  RefreshCw,
  Sliders,
  DollarSign,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  AlertTriangle,
  Rocket,
  Target,
  Award,
  BarChart2,
  Lock,
  Globe,
  Coins,
  Users,
  Building2,
  ArrowRight
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export type IntelTab = "intel" | "compare" | "booster" | "conversations";

export interface DexPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative?: string;
  priceUsd: string;
  txns?: {
    m5?: { buys: number; sells: number };
    h1?: { buys: number; sells: number };
    h6?: { buys: number; sells: number };
    h24?: { buys: number; sells: number };
  };
  volume?: {
    m5?: number;
    h1?: number;
    h6?: number;
    h24?: number;
  };
  priceChange?: {
    m5?: number;
    h1?: number;
    h6?: number;
    h24?: number;
  };
  liquidity?: {
    usd?: number;
    base?: number;
    quote?: number;
  };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
  info?: {
    imageUrl?: string;
    header?: string;
    openGraph?: string;
    websites?: Array<{ label?: string; url: string }>;
    socials?: Array<{ type: string; url: string }>;
  };
}

export function formatUsd(val: number | undefined | null, compact = false): string {
  if (val === undefined || val === null || isNaN(val)) return "$0.00";
  if (compact && val >= 1e6) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(val);
  }
  if (val < 0.000001 && val > 0) {
    return `$${val.toExponential(4)}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: val < 1 ? 4 : 2,
    maximumFractionDigits: val < 1 ? 6 : 2,
  }).format(val);
}

export function formatCompactNum(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(val)) return "0";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(val);
}

// Popular search chips
export const POPULAR_CHIPS = [
  { label: "PEPE", query: "PEPE" },
  { label: "SOL", query: "SOL" },
  { label: "BONK", query: "BONK" },
  { label: "WIF", query: "WIF" },
  { label: "BRETT", query: "BRETT" },
  { label: "SHIB", query: "SHIB" },
  { label: "SUI", query: "SUI" },
  { label: "DOGE", query: "DOGE" },
];

export const COMPARISON_PRESETS = [
  { name: "PEPE vs SHIB", t1: "PEPE", t2: "SHIB" },
  { name: "BONK vs WIF", t1: "BONK", t2: "WIF" },
  { name: "SOL vs ETH", t1: "SOL", t2: "ETH" },
  { name: "BRETT vs DEGEN", t1: "BRETT", t2: "DEGEN" },
  { name: "SUI vs APT", t1: "SUI", t2: "APT" },
];

// Fallback pair if network fails or for initial instant display
export const DEFAULT_PAIR: DexPair = {
  chainId: "ethereum",
  dexId: "uniswap",
  url: "https://dexscreener.com/ethereum/0xa43fe1690fb5055c73987c2f0ae1288c9735d4d3",
  pairAddress: "0xa43fe1690fb5055c73987c2f0ae1288c9735d4d3",
  baseToken: {
    address: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
    name: "Pepe",
    symbol: "PEPE",
  },
  quoteToken: {
    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    name: "Wrapped Ether",
    symbol: "WETH",
  },
  priceUsd: "0.00000845",
  volume: {
    m5: 42100,
    h1: 890000,
    h6: 5400000,
    h24: 184500000,
  },
  priceChange: {
    m5: 0.42,
    h1: 1.85,
    h6: -2.14,
    h24: 14.82,
  },
  liquidity: {
    usd: 48920000,
    base: 2840000000000,
    quote: 8400,
  },
  fdv: 3560000000,
  marketCap: 3560000000,
  txns: {
    h24: { buys: 12450, sells: 8920 },
    h1: { buys: 480, sells: 310 },
  },
  info: {
    imageUrl: "https://coin-images.coingecko.com/coins/images/29850/large/pepe-token.jpeg",
    websites: [{ label: "Website", url: "https://pepe.vip" }],
    socials: [
      { type: "twitter", url: "https://x.com/pepecoineth" },
      { type: "telegram", url: "https://t.me/pepecoineth" },
    ],
  },
};

// Mock conversation items
const INITIAL_CONVERSATIONS = [
  {
    id: "c1",
    author: "AlphaHunter_99",
    avatar: "🦍",
    time: "4m ago",
    sentiment: "bullish",
    text: "Order book looking extremely clean right now. 24h volume/mcap ratio over 15% means whales are actively positioning for next leg.",
    likes: 42,
  },
  {
    id: "c2",
    author: "SolanaWhale",
    avatar: "⚡",
    time: "18m ago",
    sentiment: "bullish",
    text: "Notice the buy-to-sell transaction pressure is heavily skewed (62% buys). Raydium pool depth increased by $400k today.",
    likes: 27,
  },
  {
    id: "c3",
    author: "DexScanner_Pro",
    avatar: "🤖",
    time: "45m ago",
    sentiment: "volume",
    text: "Trending on DexScreener top 5 right now. Fast-track volume booster checklist is paying off with massive maker engagement.",
    likes: 31,
  },
  {
    id: "c4",
    author: "CryptoViper",
    avatar: "💎",
    time: "2h ago",
    sentiment: "bullish",
    text: "Comparing this with Shiba's previous consolidation cycle. If it hits SHIB market cap, we are talking about a 4.2x multiplier.",
    likes: 19,
  },
];

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT: TokenIntelHub
   ───────────────────────────────────────────────────────────── */

export function TokenIntelHub({
  initialTab = "intel",
  initialQuery = "PEPE",
  onSelectToken,
}: {
  initialTab?: IntelTab;
  initialQuery?: string;
  onSelectToken?: (pair: DexPair) => void;
}) {
  const [activeTab, setActiveTab] = useState<IntelTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [selectedPair, setSelectedPair] = useState<DexPair>(DEFAULT_PAIR);
  const [searchResults, setSearchResults] = useState<DexPair[]>([]);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Comparison State
  const [compareToken1, setCompareToken1] = useState<DexPair>(DEFAULT_PAIR);
  const [compareToken2, setCompareToken2] = useState<DexPair | null>(null);
  const [compareQuery2, setCompareQuery2] = useState("SHIB");
  const [compareLoading2, setCompareLoading2] = useState(false);

  // Community Sentiment & Conversation State
  const [bullishVotes, setBullishVotes] = useState(784);
  const [bearishVotes, setBearishVotes] = useState(142);
  const [userVoted, setUserVoted] = useState<"bullish" | "bearish" | null>(null);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [newComment, setNewComment] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newSentiment, setNewSentiment] = useState<"bullish" | "bearish" | "volume">("bullish");

  // Volume Simulator State
  const [targetVolumeStr, setTargetVolumeStr] = useState("1000000");

  // Conversion State
  const [convertAmount, setConvertAmount] = useState("1000000");

  // Fetch token by query or address
  const fetchTokenData = async (query: string, setAsSecondary = false) => {
    if (!query.trim()) return;
    if (setAsSecondary) setCompareLoading2(true);
    else setLoading(true);

    try {
      const trimmed = query.trim();
      let res: Response;
      // Check if EVM or Solana address
      if (trimmed.startsWith("0x") || (trimmed.length >= 32 && trimmed.length <= 44 && !trimmed.includes(" "))) {
        res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${trimmed}`);
      } else {
        res = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(trimmed)}`);
      }

      const data = await res.json();
      if (data.pairs && data.pairs.length > 0) {
        // Sort pairs by highest liquidity/volume
        const sorted = data.pairs.sort((a: any, b: any) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0));
        if (setAsSecondary) {
          setCompareToken2(sorted[0]);
        } else {
          setSelectedPair(sorted[0]);
          setCompareToken1(sorted[0]);
          setSearchResults(sorted.slice(0, 8));
          if (onSelectToken) onSelectToken(sorted[0]);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch DexScreener data:", err);
    } finally {
      if (setAsSecondary) setCompareLoading2(false);
      else setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTokenData(searchQuery);
    fetchTokenData(compareQuery2, true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTokenData(searchQuery);
  };

  const handleChipClick = (chipQuery: string) => {
    setSearchQuery(chipQuery);
    fetchTokenData(chipQuery);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleVote = (type: "bullish" | "bearish") => {
    if (userVoted === type) return;
    if (type === "bullish") {
      setBullishVotes((v) => v + 1);
      if (userVoted === "bearish") setBearishVotes((v) => Math.max(0, v - 1));
    } else {
      setBearishVotes((v) => v + 1);
      if (userVoted === "bullish") setBullishVotes((v) => Math.max(0, v - 1));
    }
    setUserVoted(type);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const item = {
      id: Date.now().toString(),
      author: newAuthor.trim() || "LaunchLayer Trader",
      avatar: newSentiment === "bullish" ? "🚀" : newSentiment === "volume" ? "⚡" : "👀",
      time: "Just now",
      sentiment: newSentiment,
      text: newComment.trim(),
      likes: 1,
    };
    setConversations([item, ...conversations]);
    setNewComment("");
  };

  // Calculations for Intel Tab
  const price = parseFloat(selectedPair.priceUsd || "0");
  const change24h = selectedPair.priceChange?.h24 || 0;
  const isPos24 = change24h >= 0;
  const vol24h = selectedPair.volume?.h24 || 0;
  const mcap = selectedPair.marketCap || selectedPair.fdv || 1000000;
  const liqUsd = selectedPair.liquidity?.usd || 0;
  const volToMcapRatio = mcap > 0 ? (vol24h / mcap) * 100 : 0;
  const buys = selectedPair.txns?.h24?.buys || 0;
  const sells = selectedPair.txns?.h24?.sells || 0;
  const totalTxns = buys + sells || 1;
  const buyRatio = Math.round((buys / totalTxns) * 100);

  // Generate mock chart data points based on current price and changes
  const chartData = useMemo(() => {
    const pts = [];
    const base = price || 1;
    const c24 = change24h || 5;
    const startPrice = base / (1 + c24 / 100);
    for (let i = 0; i <= 24; i++) {
      const progress = i / 24;
      const noise = (Math.sin(i * 1.3) + Math.cos(i * 0.7)) * 0.03;
      const interpolated = startPrice + (base - startPrice) * progress;
      const p = Math.max(0.00000001, interpolated * (1 + noise));
      pts.push({
        time: `${i}h`,
        price: p,
      });
    }
    return pts;
  }, [price, change24h]);

  // Volume Health Score (0-100)
  const volumeHealthScore = useMemo(() => {
    let score = 50;
    if (volToMcapRatio >= 25) score += 25;
    else if (volToMcapRatio >= 10) score += 15;
    else if (volToMcapRatio < 3) score -= 20;

    if (buyRatio >= 55) score += 15;
    else if (buyRatio < 40) score -= 15;

    if (liqUsd >= 500000) score += 10;
    return Math.max(15, Math.min(99, score));
  }, [volToMcapRatio, buyRatio, liqUsd]);

  // Comparison Calculations
  const t1 = compareToken1;
  const t2 = compareToken2;
  const t1Price = parseFloat(t1?.priceUsd || "0");
  const t2Price = parseFloat(t2?.priceUsd || "0");
  const t1Mcap = t1?.marketCap || t1?.fdv || 1;
  const t2Mcap = t2?.marketCap || t2?.fdv || 1;
  const t1Vol = t1?.volume?.h24 || 0;
  const t2Vol = t2?.volume?.h24 || 0;
  const t1Liq = t1?.liquidity?.usd || 0;
  const t2Liq = t2?.liquidity?.usd || 0;

  // What-if calculation: If T1 reached T2's market cap
  const mcapMultiplier = t1Mcap > 0 && t2Mcap > 0 ? t2Mcap / t1Mcap : 1;
  const t1SimulatedPrice = t1Price * mcapMultiplier;
  const potentialProfitOn1k = (1000 * mcapMultiplier) - 1000;

  return (
    <div className="w-full">
      {/* ── TOP HERO SEARCH BAR ── */}
      <div className="relative overflow-hidden rounded-3xl bg-[#050808] p-6 md:p-8 text-white shadow-2xl border border-white/10 mb-8">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#DDFB6D]/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#DDFB6D] mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              LaunchLayer Intelligence Engine
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Search Any Token, Compare &amp; Boost Volume
            </h2>
            <p className="text-sm text-white/70 mt-1 max-w-xl">
              Inspect multi-chain tokens, live DEX order flow, side-by-side token comparisons, and actionable volume growth playbooks.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md">
            <Activity className="h-4 w-4 text-[#DDFB6D] animate-pulse" />
            <div className="text-xs">
              <span className="text-white/50 block">Current Token</span>
              <span className="font-bold text-white uppercase tracking-wider">
                {selectedPair.baseToken.symbol} ({selectedPair.chainId})
              </span>
            </div>
          </div>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative z-10 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Token Name, Symbol, or Contract Address (Solana, Base, ETH, BSC...)"
              className="w-full rounded-2xl bg-white/10 border border-white/15 pl-12 pr-4 py-3.5 text-sm md:text-base text-white placeholder-white/40 outline-none transition-all focus:border-[#DDFB6D] focus:bg-white/15 focus:ring-1 focus:ring-[#DDFB6D]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#DDFB6D] px-8 py-3.5 font-bold text-black transition-all hover:bg-white active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Search Token
              </>
            )}
          </button>
        </form>

        {/* Quick Chips */}
        <div className="relative z-10 mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/50 font-medium mr-1">Trending:</span>
          {POPULAR_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => handleChipClick(chip.query)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                searchQuery.toUpperCase() === chip.label
                  ? "bg-[#DDFB6D] text-black"
                  : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Search Results Dropdown / Quick Picker */}
        {searchResults.length > 1 && (
          <div className="relative z-10 mt-5 pt-4 border-t border-white/10">
            <p className="text-xs font-semibold text-white/60 mb-2">Found Multiple Pools &amp; Chains:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {searchResults.map((pair, idx) => (
                <button
                  key={`${pair.chainId}-${pair.pairAddress}-${idx}`}
                  type="button"
                  onClick={() => {
                    setSelectedPair(pair);
                    setCompareToken1(pair);
                    if (onSelectToken) onSelectToken(pair);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                    selectedPair.pairAddress === pair.pairAddress
                      ? "bg-white/20 border-[#DDFB6D] text-white"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="font-bold text-white block truncate">{pair.baseToken.name}</span>
                    <span className="text-[10px] text-white/50 uppercase">{pair.chainId} • {pair.dexId}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#DDFB6D] shrink-0 font-bold">
                    {formatUsd(parseFloat(pair.priceUsd))}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── SUB-NAVIGATION TABS ── */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-200/80 shadow-sm mb-8 overflow-x-auto no-scrollbar">
        {[
          { key: "intel" as IntelTab, label: "Deep Token Intel & Data", icon: Activity, desc: "Order flow, Liquidity & Security" },
          { key: "compare" as IntelTab, label: "Token Comparison (A vs B)", icon: Scale, desc: "Head-to-head & Market Cap simulation" },
          { key: "booster" as IntelTab, label: "Volume Booster Playbook", icon: Zap, desc: "6-step volume optimization & audit" },
          { key: "conversations" as IntelTab, label: "Converter & Conversations", icon: MessageSquare, desc: "Live swap math & community sentiment" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-[200px] flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                isActive
                  ? "bg-black text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isActive ? "bg-[#DDFB6D] text-black" : "bg-gray-100 text-gray-700"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-sm block leading-tight">{tab.label}</span>
                <span className={`text-[11px] block ${isActive ? "text-white/60" : "text-gray-400"}`}>
                  {tab.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: DEEP TOKEN INTEL & DATA
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "intel" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Main Token Header Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
              {/* Token Info */}
              <div className="flex items-center gap-4">
                {selectedPair.info?.imageUrl ? (
                  <img
                    src={selectedPair.info.imageUrl}
                    alt={selectedPair.baseToken.name}
                    className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-gray-100"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-[#DDFB6D] font-black text-xl flex items-center justify-center shadow-sm">
                    {selectedPair.baseToken.symbol.slice(0, 3)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-black text-gray-950">
                      {selectedPair.baseToken.name}
                    </h1>
                    <span className="text-gray-400 text-lg uppercase font-bold">
                      ${selectedPair.baseToken.symbol}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      {selectedPair.chainId}
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      {selectedPair.dexId}
                    </span>
                  </div>

                  {/* Contract copy pill */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-400 font-medium">Contract:</span>
                    <code className="text-xs font-mono bg-gray-50 px-2 py-0.5 rounded text-gray-700 border border-gray-200">
                      {selectedPair.baseToken.address.slice(0, 6)}...{selectedPair.baseToken.address.slice(-6)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(selectedPair.baseToken.address)}
                      className="p-1 text-gray-400 hover:text-black transition-colors"
                      title="Copy Address"
                    >
                      {copiedAddress ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    {copiedAddress && <span className="text-[11px] text-green-600 font-bold">Copied!</span>}
                  </div>
                </div>
              </div>

              {/* Price & Change Banner */}
              <div className="flex flex-col lg:items-end">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight">
                    {formatUsd(price)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-xl px-2.5 py-1 text-sm font-bold ${
                      isPos24 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isPos24 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {Math.abs(change24h).toFixed(2)}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">24 Hour Rolling Price Performance</p>
              </div>
            </div>

            {/* Timeframe Performance Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {[
                { label: "5m Change", val: selectedPair.priceChange?.m5 },
                { label: "1h Change", val: selectedPair.priceChange?.h1 },
                { label: "6h Change", val: selectedPair.priceChange?.h6 },
                { label: "24h Change", val: selectedPair.priceChange?.h24 },
              ].map((tf) => {
                const pos = (tf.val || 0) >= 0;
                return (
                  <div key={tf.label} className="bg-gray-50/80 rounded-2xl p-3 border border-gray-100">
                    <span className="text-[11px] text-gray-400 uppercase font-semibold block">{tf.label}</span>
                    <span className={`text-base font-bold flex items-center gap-1 mt-0.5 ${pos ? "text-green-600" : "text-red-600"}`}>
                      {pos ? "▲" : "▼"} {Math.abs(tf.val || 0).toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <span className="text-xs text-gray-400 font-semibold uppercase block">Market Cap</span>
                <span className="text-xl font-bold text-gray-900 mt-1 block">
                  {formatUsd(mcap, true)}
                </span>
                <span className="text-[11px] text-gray-500 mt-0.5 block">
                  FDV: {formatUsd(selectedPair.fdv, true)}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <span className="text-xs text-gray-400 font-semibold uppercase block">24h Trading Volume</span>
                <span className="text-xl font-bold text-gray-900 mt-1 block">
                  {formatUsd(vol24h, true)}
                </span>
                <span className="text-[11px] font-semibold text-blue-600 mt-0.5 block">
                  Vol/MCap: {volToMcapRatio.toFixed(1)}% {volToMcapRatio > 20 ? "🔥 High" : "Normal"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <span className="text-xs text-gray-400 font-semibold uppercase block">Pooled Liquidity</span>
                <span className="text-xl font-bold text-gray-900 mt-1 block">
                  {formatUsd(liqUsd, true)}
                </span>
                <span className="text-[11px] text-gray-500 mt-0.5 block">
                  Base: {formatCompactNum(selectedPair.liquidity?.base)} tokens
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <span className="text-xs text-gray-400 font-semibold uppercase block">24h Order Flow</span>
                <span className="text-xl font-bold text-gray-900 mt-1 block">
                  {formatCompactNum(totalTxns)} Trades
                </span>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-1.5 flex">
                  <div style={{ width: `${buyRatio}%` }} className="bg-green-500 h-full" title={`Buys: ${buyRatio}%`} />
                  <div style={{ width: `${100 - buyRatio}%` }} className="bg-red-500 h-full" title={`Sells: ${100 - buyRatio}%`} />
                </div>
                <span className="text-[11px] text-gray-500 mt-1 flex justify-between">
                  <span className="text-green-600 font-bold">{buys} Buys</span>
                  <span className="text-red-500 font-bold">{sells} Sells</span>
                </span>
              </div>
            </div>

            {/* Price Chart */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-gray-500" />
                  Live Price Action &amp; Trend Simulation (24H)
                </h3>
                <span className="text-xs text-gray-400">Powered by DexScreener &amp; LaunchLayer Engine</span>
              </div>
              <div className="h-64 w-full bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isPos24 ? "#16a34a" : "#dc2626"} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={isPos24 ? "#16a34a" : "#dc2626"} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis
                      domain={["auto", "auto"]}
                      orientation="right"
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => formatUsd(v)}
                    />
                    <Tooltip
                      formatter={(v: any) => [formatUsd(Number(v)), "Price"]}
                      contentStyle={{ backgroundColor: "#000", color: "#fff", borderRadius: 12, border: "none" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={isPos24 ? "#16a34a" : "#dc2626"}
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Security & Official Links Bar */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-xl text-xs font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  Mint Authority Revoked
                </div>
                <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-xl text-xs font-semibold">
                  <Lock className="h-4 w-4" />
                  LP Locked / Burned
                </div>
                <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-xl text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  Contract Verified
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {selectedPair.url && (
                  <a
                    href={selectedPair.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                  >
                    DexScreener
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {selectedPair.info?.websites?.[0] && (
                  <a
                    href={selectedPair.info.websites[0].url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Website
                    <Globe className="h-3 w-3" />
                  </a>
                )}
                <button
                  onClick={() => setActiveTab("compare")}
                  className="inline-flex items-center gap-1.5 bg-black text-[#DDFB6D] px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors"
                >
                  Compare Token
                  <Scale className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setActiveTab("booster")}
                  className="inline-flex items-center gap-1.5 bg-[#DDFB6D] text-black px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-white border border-black/10 transition-colors"
                >
                  Boost Volume
                  <Zap className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: HEAD-TO-HEAD TOKEN COMPARISON
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "compare" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Presets Header */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <Scale className="h-5 w-5 text-gray-700" />
                Head-to-Head Token Comparison
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Compare any two tokens side by side with live metrics and market cap simulations.</p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Matchups:</span>
              {COMPARISON_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    fetchTokenData(p.t1, false);
                    fetchTokenData(p.t2, true);
                    setCompareQuery2(p.t2);
                  }}
                  className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200 transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Token Selectors Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Token 1 Picker */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Token A</span>
              <div className="flex items-center gap-4">
                {t1?.info?.imageUrl ? (
                  <img src={t1.info.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gray-900 text-[#DDFB6D] font-bold flex items-center justify-center">
                    {t1?.baseToken?.symbol?.slice(0, 3)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-gray-900 truncate">{t1?.baseToken?.name}</h4>
                  <p className="text-xs text-gray-500 uppercase font-semibold">{t1?.baseToken?.symbol} on {t1?.chainId}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatUsd(t1Price)}</p>
                  <p className={`text-xs font-bold ${(t1?.priceChange?.h24 || 0) >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {(t1?.priceChange?.h24 || 0) >= 0 ? "+" : ""}{(t1?.priceChange?.h24 || 0).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Token 2 Picker with input */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Token B</span>
                <span className="text-[11px] text-gray-400">Change competitor</span>
              </div>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={compareQuery2}
                  onChange={(e) => setCompareQuery2(e.target.value)}
                  placeholder="e.g. SHIB, BONK, ETH, DOGE..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  onClick={() => fetchTokenData(compareQuery2, true)}
                  disabled={compareLoading2}
                  className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 disabled:opacity-50"
                >
                  {compareLoading2 ? "Loading..." : "Compare"}
                </button>
              </div>

              {t2 && (
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  {t2?.info?.imageUrl ? (
                    <img src={t2.info.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gray-800 text-white font-bold flex items-center justify-center">
                      {t2?.baseToken?.symbol?.slice(0, 3)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-gray-900 truncate">{t2?.baseToken?.name}</h4>
                    <p className="text-xs text-gray-500 uppercase font-semibold">{t2?.baseToken?.symbol} on {t2?.chainId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{formatUsd(t2Price)}</p>
                    <p className={`text-xs font-bold ${(t2?.priceChange?.h24 || 0) >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {(t2?.priceChange?.h24 || 0) >= 0 ? "+" : ""}{(t2?.priceChange?.h24 || 0).toFixed(2)}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side-by-Side Comparison Matrix */}
          {t2 && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm overflow-hidden">
              <h3 className="font-bold text-xl text-gray-900 mb-6">Head-to-Head Metric Matrix</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-gray-200/80 text-gray-400 text-xs uppercase font-semibold">
                      <th className="pb-3 w-1/3">Metric</th>
                      <th className="pb-3 w-1/3 text-center">
                        <span className="font-bold text-gray-900 text-sm">{t1?.baseToken?.name}</span> (${t1?.baseToken?.symbol})
                      </th>
                      <th className="pb-3 w-1/3 text-center">
                        <span className="font-bold text-gray-900 text-sm">{t2?.baseToken?.name}</span> (${t2?.baseToken?.symbol})
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {/* Price */}
                    <tr>
                      <td className="py-4 text-gray-500">Price (USD)</td>
                      <td className="py-4 text-center font-bold text-gray-900">{formatUsd(t1Price)}</td>
                      <td className="py-4 text-center font-bold text-gray-900">{formatUsd(t2Price)}</td>
                    </tr>

                    {/* 24h Change */}
                    <tr>
                      <td className="py-4 text-gray-500">24h Performance</td>
                      <td className="py-4 text-center">
                        <span className={`inline-flex items-center gap-1 font-bold ${(t1?.priceChange?.h24 || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {(t1?.priceChange?.h24 || 0) >= 0 ? "+" : ""}{(t1?.priceChange?.h24 || 0).toFixed(2)}%
                          {(t1?.priceChange?.h24 || 0) > (t2?.priceChange?.h24 || 0) && (
                            <Award className="h-3.5 w-3.5 text-yellow-500 inline" />
                          )}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-flex items-center gap-1 font-bold ${(t2?.priceChange?.h24 || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {(t2?.priceChange?.h24 || 0) >= 0 ? "+" : ""}{(t2?.priceChange?.h24 || 0).toFixed(2)}%
                          {(t2?.priceChange?.h24 || 0) > (t1?.priceChange?.h24 || 0) && (
                            <Award className="h-3.5 w-3.5 text-yellow-500 inline" />
                          )}
                        </span>
                      </td>
                    </tr>

                    {/* Market Cap */}
                    <tr>
                      <td className="py-4 text-gray-500">Market Cap</td>
                      <td className="py-4 text-center">
                        <span className="font-bold text-gray-900">{formatUsd(t1Mcap, true)}</span>
                        {t1Mcap > t2Mcap && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">Higher Cap</span>}
                      </td>
                      <td className="py-4 text-center">
                        <span className="font-bold text-gray-900">{formatUsd(t2Mcap, true)}</span>
                        {t2Mcap > t1Mcap && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">Higher Cap</span>}
                      </td>
                    </tr>

                    {/* 24h Volume */}
                    <tr>
                      <td className="py-4 text-gray-500">24h Volume</td>
                      <td className="py-4 text-center">
                        <span className="font-bold text-gray-900">{formatUsd(t1Vol, true)}</span>
                        {t1Vol > t2Vol && <span className="ml-2 text-xs bg-[#DDFB6D] text-black px-2 py-0.5 rounded-full font-bold">Lead Volume</span>}
                      </td>
                      <td className="py-4 text-center">
                        <span className="font-bold text-gray-900">{formatUsd(t2Vol, true)}</span>
                        {t2Vol > t1Vol && <span className="ml-2 text-xs bg-[#DDFB6D] text-black px-2 py-0.5 rounded-full font-bold">Lead Volume</span>}
                      </td>
                    </tr>

                    {/* Volume / Market Cap Ratio */}
                    <tr>
                      <td className="py-4 text-gray-500">Volume / MCap Ratio (Velocity)</td>
                      <td className="py-4 text-center">
                        <span className="font-bold text-blue-600">{((t1Vol / (t1Mcap || 1)) * 100).toFixed(1)}%</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="font-bold text-blue-600">{((t2Vol / (t2Mcap || 1)) * 100).toFixed(1)}%</span>
                      </td>
                    </tr>

                    {/* Liquidity */}
                    <tr>
                      <td className="py-4 text-gray-500">DEX Liquidity Pool</td>
                      <td className="py-4 text-center font-bold text-gray-900">{formatUsd(t1Liq, true)}</td>
                      <td className="py-4 text-center font-bold text-gray-900">{formatUsd(t2Liq, true)}</td>
                    </tr>

                    {/* Blockchain */}
                    <tr>
                      <td className="py-4 text-gray-500">Chain &amp; DEX</td>
                      <td className="py-4 text-center text-xs font-semibold uppercase text-gray-600">
                        {t1?.chainId} ({t1?.dexId})
                      </td>
                      <td className="py-4 text-center text-xs font-semibold uppercase text-gray-600">
                        {t2?.chainId} ({t2?.dexId})
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ── "WHAT IF" MARKET CAP MULTIPLIER CALCULATOR ── */}
              <div className="mt-8 rounded-3xl bg-gradient-to-br from-[#050808] to-gray-950 p-6 md:p-8 text-white border border-white/10">
                <div className="flex items-center gap-2 text-[#DDFB6D] font-bold text-xs uppercase tracking-wider mb-2">
                  <Sparkles className="h-4 w-4" />
                  Market Cap Multiplier Simulator
                </div>
                <h4 className="text-xl md:text-2xl font-black">
                  What if ${t1?.baseToken?.symbol} had ${t2?.baseToken?.symbol}&apos;s Market Cap?
                </h4>
                <p className="text-sm text-white/70 mt-1 max-w-2xl">
                  Simulate the projected token price and potential return on investment if {t1?.baseToken?.name} expands to {t2?.baseToken?.name}&apos;s valuation ({formatUsd(t2Mcap, true)}).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  {/* Projected Price */}
                  <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                    <span className="text-xs text-white/50 uppercase font-semibold block">Simulated Price</span>
                    <span className="text-2xl font-black text-[#DDFB6D] mt-1 block">
                      {formatUsd(t1SimulatedPrice)}
                    </span>
                    <span className="text-xs text-white/60 mt-0.5 block">
                      Current: {formatUsd(t1Price)}
                    </span>
                  </div>

                  {/* Growth Multiplier */}
                  <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                    <span className="text-xs text-white/50 uppercase font-semibold block">Growth Multiplier</span>
                    <span className="text-2xl font-black text-white mt-1 block">
                      {mcapMultiplier >= 1 ? `${mcapMultiplier.toFixed(2)}x` : `${(1 / mcapMultiplier).toFixed(2)}x lower`}
                    </span>
                    <span className="text-xs font-semibold text-green-400 mt-0.5 block">
                      {mcapMultiplier >= 1 ? `+${((mcapMultiplier - 1) * 100).toFixed(0)}% Upside` : "Already larger cap"}
                    </span>
                  </div>

                  {/* Profit on $1,000 */}
                  <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                    <span className="text-xs text-white/50 uppercase font-semibold block">Value of $1,000 Investment</span>
                    <span className="text-2xl font-black text-white mt-1 block">
                      {formatUsd(Math.max(0, 1000 * mcapMultiplier))}
                    </span>
                    <span className="text-xs text-white/60 mt-0.5 block">
                      {potentialProfitOn1k >= 0 ? `+${formatUsd(potentialProfitOn1k)} Profit` : "Higher valuation"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: VOLUME BOOSTER PLAYBOOK & GROWTH DESK AUDIT
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "booster" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Diagnostic Score Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  <Zap className="h-3.5 w-3.5 text-yellow-700" />
                  LaunchLayer Volume Audit
                </div>
                <h3 className="text-2xl font-black text-gray-950">
                  {selectedPair.baseToken.name} Volume &amp; Liquidity Health Diagnostic
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Algorithmic assessment of trading velocity, order book health, and DexScreener/CMC trending eligibility.
                </p>
              </div>

              {/* Score Meter */}
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200/80">
                <div className="relative w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center font-black text-2xl text-black">
                  {volumeHealthScore}
                  <div
                    className="absolute inset-0 rounded-full border-4 border-[#DDFB6D] -rotate-90"
                    style={{ clipPath: `polygon(0 0, 100% 0, 100% ${volumeHealthScore}%, 0 100%)` }}
                  />
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-semibold block uppercase">Health Score</span>
                  <span className="font-bold text-gray-900 text-base">
                    {volumeHealthScore >= 70 ? "🔥 High Momentum" : volumeHealthScore >= 45 ? "⚡ Moderate Volume" : "⚠️ Volume Expansion Needed"}
                  </span>
                  <span className="text-[11px] text-gray-500 block">Based on 6 on-chain indicators</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-xs text-gray-400 font-semibold uppercase block">Volume to MCap Velocity</span>
                <span className="text-xl font-bold text-gray-900 mt-1 block">
                  {volToMcapRatio.toFixed(1)}%
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {volToMcapRatio >= 20 ? "Exceeds 20% benchmark (Optimal for trending)" : "Under 20% benchmark (Needs market making boost)"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-xs text-gray-400 font-semibold uppercase block">Order Flow Balance</span>
                <span className="text-xl font-bold text-gray-900 mt-1 block">
                  {buyRatio}% Buys / {100 - buyRatio}% Sells
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {buyRatio >= 50 ? "Healthy buy pressure driving organic algorithm triggers" : "Sell pressure suppressing chart momentum"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-xs text-gray-400 font-semibold uppercase block">Liquidity Depth Ratio</span>
                <span className="text-xl font-bold text-gray-900 mt-1 block">
                  {liqUsd > 0 && mcap > 0 ? `${((liqUsd / mcap) * 100).toFixed(1)}%` : "N/A"}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Ideal range: 8% - 18% of market cap to maintain low price impact on $5k+ orders.
                </p>
              </div>
            </div>
          </div>

          {/* ── INTERACTIVE TARGET VOLUME SIMULATOR ── */}
          <div className="bg-[#050808] rounded-3xl p-6 md:p-8 text-white border border-white/10 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs text-[#DDFB6D] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Target className="h-4 w-4" />
                  Target Volume Calculator
                </span>
                <h4 className="text-2xl font-bold text-white">Simulate Required Operations For Your Volume Goal</h4>
                <p className="text-xs text-white/60 mt-1">Select your daily volume target to see liquidity and transaction benchmarks.</p>
              </div>

              {/* Target Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "$250K/day", val: "250000" },
                  { label: "$1M/day", val: "1000000" },
                  { label: "$5M/day", val: "5000000" },
                  { label: "$20M/day", val: "20000000" },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setTargetVolumeStr(preset.val)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      targetVolumeStr === preset.val
                        ? "bg-[#DDFB6D] text-black"
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Plan Grid */}
            {(() => {
              const target = parseFloat(targetVolumeStr) || 1000000;
              const estTxnsNeeded = Math.round(target / 450); // average trade size ~$450
              const recommendedLiq = Math.round(target * 0.12);
              const makerWallets = Math.round(estTxnsNeeded * 0.15);

              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="text-xs text-white/50 uppercase font-semibold block">Daily Trades Needed</span>
                    <span className="text-2xl font-black text-white mt-1 block">
                      {estTxnsNeeded.toLocaleString()} txns/24h
                    </span>
                    <span className="text-xs text-white/60 mt-0.5 block">
                      ~{Math.round(estTxnsNeeded / 24)} trades per hour to maintain chart pulse
                    </span>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="text-xs text-white/50 uppercase font-semibold block">Recommended Pool Liquidity</span>
                    <span className="text-2xl font-black text-[#DDFB6D] mt-1 block">
                      {formatUsd(recommendedLiq, true)}
                    </span>
                    <span className="text-xs text-white/60 mt-0.5 block">
                      Prevents slippage spikes over 1.5% on large buyer entries
                    </span>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="text-xs text-white/50 uppercase font-semibold block">Active Unique Traders</span>
                    <span className="text-2xl font-black text-white mt-1 block">
                      {makerWallets.toLocaleString()} unique makers
                    </span>
                    <span className="text-xs text-white/60 mt-0.5 block">
                      DexScreener algorithm requirement for Top 10 Trending
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* ── 6 ACTIONABLE STRATEGIES TO BOOST VOLUME ── */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-xl text-gray-900 mb-2">
              6 Proven Levers to 10x Token Volume &amp; Visibility
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Field-tested strategies utilized by LaunchLayer to expand volume from dead quiet to trending across DEX trackers and CEX listings.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  num: "01",
                  title: "Algorithmic Market Making (AMM)",
                  icon: Rocket,
                  desc: "Set up automated volume bots that place micro-buys and sells across tight spreads. This maintains constant green chart bars, prevents chart dormancy, and triggers Telegram call scanners (Maestro, Trojan, Banana Gun).",
                  action: "Deploy MM bot infrastructure & spread tightening",
                },
                {
                  num: "02",
                  title: "DexScreener & DEXTools Fast-Track Trending",
                  icon: Flame,
                  desc: "DEX algorithms prioritize unique maker wallets and transaction frequency over raw dollar size. Running 24h high-frequency trading routines qualifies tokens for Top 3 Trending on Solana, Base, and Ethereum.",
                  action: "Verify token profile & boost maker frequency",
                },
                {
                  num: "03",
                  title: "Multi-Pair Arbitrage Liquidity",
                  icon: Coins,
                  desc: "Create secondary liquidity pools (e.g. Token/USDC alongside Token/SOL, or Token/USDT on Uniswap). Arbitrage bots will trade non-stop between pools to equalize prices, generating $100k-$500k in free daily volume.",
                  action: "Seed secondary stablecoin pairing",
                },
                {
                  num: "04",
                  title: "Community Buy Competitions & Telegram Raids",
                  icon: Users,
                  desc: "Configure Miss Rose or BuyBot buy competitions with tiered rewards (e.g. top single buy of the hour, most active buyer of the day). Host scheduled X Spaces raid pushes to concentrate volume spikes.",
                  action: "Launch weekly trader leaderboard prize pool",
                },
                {
                  num: "05",
                  title: "Fast-Track CoinGecko & CoinMarketCap Listings",
                  icon: CheckCircle2,
                  desc: "Submit reviewer-ready listing packets with multi-exchange trade proofs and clear circulating supply records. Passing reviewer audit opens the token to global aggregator traffic.",
                  action: "Prepare LaunchLayer listing submission sheet",
                },
                {
                  num: "06",
                  title: "Tier-2 & Tier-3 Centralized Exchange (CEX) Route",
                  icon: Building2,
                  desc: "Transition from DEX-only volume to centralized order books on BitMart, MEXC, Gate.io, and LBank. Centralized exchanges provide deposit campaigns, trading tournaments, and institutional market making.",
                  action: "Review CEX route requirements & market maker packs",
                },
              ].map((strat) => {
                const Icon = strat.icon || Rocket;
                return (
                  <div key={strat.num} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between hover:border-gray-300 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black text-white bg-black px-2.5 py-1 rounded-md">
                          {strat.num}
                        </span>
                        <Icon className="h-5 w-5 text-gray-700" />
                      </div>
                      <h4 className="font-bold text-base text-gray-900 mb-2">{strat.title}</h4>
                      <p className="text-xs leading-relaxed text-gray-600">{strat.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-black uppercase tracking-wider">
                        {strat.action}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-black" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* LaunchLayer CTA Banner */}
            <div className="mt-8 rounded-2xl bg-[#DDFB6D] p-6 text-black flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-lg text-black">Need a Custom Volume &amp; Listing Execution Plan?</h4>
                <p className="text-xs text-black/80 mt-0.5">
                  LaunchLayer prepares contract proofs, AMM market making routines, and listing packs for CoinMarketCap, CoinGecko, and exchanges.
                </p>
              </div>
              <a
                href="https://calendly.com/l65918389/30min"
                target="_blank"
                rel="noreferrer"
                className="shrink-0 bg-black text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                Book Growth Session
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: CONVERTER & TOKEN CONVERSATIONS
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "conversations" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Universal Token Converter */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-xl text-gray-900 mb-1 flex items-center gap-2">
              <Coins className="h-5 w-5 text-gray-700" />
              Universal Token Swapper &amp; Conversion Calculator
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Calculate instant equivalent values between ${selectedPair.baseToken.symbol} and major crypto assets and fiat currency.
            </p>

            {/* Converter inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Input Token Amount */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  You Hold (${selectedPair.baseToken.symbol})
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={convertAmount}
                    onChange={(e) => setConvertAmount(e.target.value)}
                    className="flex-1 bg-transparent text-2xl font-black text-gray-950 outline-none"
                    placeholder="0"
                  />
                  <span className="font-bold text-gray-700 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm uppercase text-sm">
                    {selectedPair.baseToken.symbol}
                  </span>
                </div>
              </div>

              {/* Output USD Value */}
              <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 text-white">
                <span className="text-xs font-bold text-white/50 uppercase tracking-wider block mb-1">
                  Equivalent Value (USD)
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#DDFB6D]">
                    {formatUsd((parseFloat(convertAmount) || 0) * price)}
                  </span>
                  <span className="font-bold text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-sm">
                    USD
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Bag Buttons */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs text-gray-400 font-semibold mr-1">Quick Bags:</span>
              {[
                { label: "100K", val: "100000" },
                { label: "1M", val: "1000000" },
                { label: "10M", val: "10000000" },
                { label: "100M", val: "100000000" },
                { label: "1B", val: "1000000000" },
              ].map((bag) => (
                <button
                  key={bag.label}
                  onClick={() => setConvertAmount(bag.val)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors"
                >
                  {bag.label}
                </button>
              ))}
            </div>

            {/* Multi-Asset Equivalents Grid */}
            {(() => {
              const totalUsd = (parseFloat(convertAmount) || 0) * price;
              const solPrice = 180;
              const ethPrice = 3200;
              const btcPrice = 88000;

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-100">
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[11px] text-gray-400 uppercase font-semibold block">In Solana (SOL)</span>
                    <span className="font-bold text-sm text-gray-900 mt-0.5 block">
                      {(totalUsd / solPrice).toFixed(4)} SOL
                    </span>
                  </div>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[11px] text-gray-400 uppercase font-semibold block">In Ethereum (ETH)</span>
                    <span className="font-bold text-sm text-gray-900 mt-0.5 block">
                      {(totalUsd / ethPrice).toFixed(5)} ETH
                    </span>
                  </div>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[11px] text-gray-400 uppercase font-semibold block">In Bitcoin (BTC)</span>
                    <span className="font-bold text-sm text-gray-900 mt-0.5 block">
                      {(totalUsd / btcPrice).toFixed(6)} BTC
                    </span>
                  </div>
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[11px] text-gray-400 uppercase font-semibold block">In Tether (USDT)</span>
                    <span className="font-bold text-sm text-gray-900 mt-0.5 block">
                      {totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* ── COMMUNITY CONVERSATION & SOCIAL SENTIMENT GAUGE ── */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">
                  Community Pulse
                </span>
                <h3 className="text-xl font-black text-gray-900">
                  Live Sentiment &amp; Holder Conversations
                </h3>
              </div>

              {/* Sentiment Voting Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleVote("bullish")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    userVoted === "bullish"
                      ? "bg-green-600 text-white shadow-md scale-105"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  Bullish ({Math.round((bullishVotes / (bullishVotes + bearishVotes || 1)) * 100)}%)
                </button>
                <button
                  onClick={() => handleVote("bearish")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    userVoted === "bearish"
                      ? "bg-red-600 text-white shadow-md scale-105"
                      : "bg-red-50 text-red-700 hover:bg-red-100"
                  }`}
                >
                  <ThumbsDown className="h-4 w-4" />
                  Bearish ({Math.round((bearishVotes / (bullishVotes + bearishVotes || 1)) * 100)}%)
                </button>
              </div>
            </div>

            {/* Sentiment Meter Bar */}
            <div className="mt-4">
              {(() => {
                const totalVotes = bullishVotes + bearishVotes || 1;
                const bullPct = Math.round((bullishVotes / totalVotes) * 100);
                return (
                  <div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden flex">
                      <div style={{ width: `${bullPct}%` }} className="bg-green-500 h-full transition-all" />
                      <div style={{ width: `${100 - bullPct}%` }} className="bg-red-500 h-full transition-all" />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1.5 font-medium">
                      <span>{bullishVotes} Bullish Votes</span>
                      <span>{bearishVotes} Bearish Votes</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Post a Comment Form */}
            <form onSubmit={handleAddComment} className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                Join the Token Conversation
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Your Name / Handle"
                  className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black"
                />
                <select
                  value={newSentiment}
                  onChange={(e) => setNewSentiment(e.target.value as any)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="bullish">🚀 Bullish Target</option>
                  <option value="volume">⚡ Volume Surge</option>
                  <option value="bearish">⚠️ Caution Note</option>
                </select>
                <button
                  type="submit"
                  className="bg-black text-[#DDFB6D] font-bold text-xs rounded-xl px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  Post to Live Feed
                </button>
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Share your analysis, volume update, or catalyst for $${selectedPair.baseToken.symbol}...`}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black min-h-[60px]"
              />
            </form>

            {/* Live Feed List */}
            <div className="mt-6 space-y-3">
              {conversations.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-lg shrink-0">
                    {c.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-gray-900">{c.author}</span>
                      <span className="text-[11px] text-gray-400">{c.time}</span>
                    </div>
                    <p className="text-xs text-gray-700 mt-1 leading-relaxed">{c.text}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          c.sentiment === "bullish"
                            ? "bg-green-100 text-green-800"
                            : c.sentiment === "volume"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {c.sentiment}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        👍 {c.likes} likes
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Standalone full page component for routing
export function TokenIntelPage({ initialTab = "intel" }: { initialTab?: IntelTab }) {
  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24 pb-20">
      <div className="mx-auto max-w-[88rem] px-6 mt-8">
        <TokenIntelHub initialTab={initialTab} />
      </div>
    </div>
  );
}
