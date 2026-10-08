import React, { useMemo, useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Activity, TrendingUp, Search, Star } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function formatCurrency(value: number, style: "currency" | "compact" = "currency") {
  if (value === undefined || value === null) return "$0.00";
  if (style === "compact" && value >= 1e6) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
}

function formatPercent(value: number) {
  if (value === undefined || value === null) return "0.00%";
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}

function PercentBadge({ value }: { value?: number }) {
  if (value === undefined || value === null) return <span>-</span>;
  const isPos = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium ${isPos ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
      {isPos ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

function SparklineSvg({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length === 0) return <div className="h-8 w-24 bg-gray-100 rounded" />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 -5 100 110" className="h-8 w-24 overflow-visible" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GlobalStatsBar() {
  const stats = useQuery(api.crypto.getGlobalStats);
  if (!stats) return <div className="h-10 bg-[#050808]" />;

  return (
    <div className="bg-[#050808] border-b border-white/10 py-2 px-6 overflow-hidden text-xs text-white/70 font-medium">
      <div className="mx-auto max-w-[88rem] flex items-center justify-between">
        <div className="flex gap-6 whitespace-nowrap overflow-x-auto no-scrollbar">
          <span>Coins: <span className="text-white">{stats.activeCoins.toLocaleString()}</span></span>
          <span>Exchanges: <span className="text-white">{stats.markets.toLocaleString()}</span></span>
          <span>Market Cap: <span className="text-[#DDFB6D]">{formatCurrency(stats.totalMarketCap, "compact")}</span></span>
          <span>24h Vol: <span className="text-white">{formatCurrency(stats.totalVolume, "compact")}</span></span>
          <span>Dominance: <span className="text-white">BTC {stats.btcDominance.toFixed(1)}% ETH {stats.ethDominance.toFixed(1)}%</span></span>
        </div>
      </div>
    </div>
  );
}


export function MarketHighlights({ stats, coins }: { stats: any, coins: any[] }) {
  if (!stats || !coins || coins.length === 0) return null;
  
  const gainers = [...coins].sort((a, b) => (b.change24h || 0) - (a.change24h || 0)).slice(0, 3);
  const trending = [...coins].slice(0, 3); // Mock trending

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Global Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalMarketCap, "compact")}</p>
              <p className="text-xs text-gray-500 mt-1">Market Cap</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalVolume, "compact")}</p>
              <p className="text-xs text-gray-500 mt-1">24h Trading Volume</p>
            </div>
          </div>
        </div>
        <div className="h-16 flex items-end">
          {/* Simple decorative chart */}
          <svg viewBox="0 0 100 30" className="w-full h-full preserveAspectRatio-none" stroke="#ff4d4f" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="0,15 10,25 20,10 30,28 40,5 50,15 60,5 70,20 80,10 90,25 100,20" />
          </svg>
        </div>
      </div>

      {/* Trending Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold flex items-center gap-2"><span role="img" aria-label="fire">🔥</span> Trending {'>'}</h3>
        </div>
        <div className="flex flex-col gap-3">
          {trending.map(c => (
            <div key={'t'+c.coinId} className="flex justify-between items-center cursor-pointer hover:bg-gray-50" onClick={() => window.location.hash = `#coin/${c.coinId}`}>
              <div className="flex items-center gap-2">
                {c.coin?.imageUrl ? <img src={c.coin.imageUrl} className="w-5 h-5 rounded-full" /> : <div className="w-5 h-5 rounded-full bg-gray-200" />}
                <span className="font-semibold text-sm">{c.coin?.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium mr-2">{formatCurrency(c.priceUsd)}</span>
                <span className={`text-xs font-bold ${c.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {c.change24h >= 0 ? '▲' : '▼'} {Math.abs(c.change24h || 0).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Gainers Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold flex items-center gap-2"><span role="img" aria-label="rocket">🚀</span> Top Gainers {'>'}</h3>
        </div>
        <div className="flex flex-col gap-3">
          {gainers.map(c => (
            <div key={'g'+c.coinId} className="flex justify-between items-center cursor-pointer hover:bg-gray-50" onClick={() => window.location.hash = `#coin/${c.coinId}`}>
              <div className="flex items-center gap-2">
                {c.coin?.imageUrl ? <img src={c.coin.imageUrl} className="w-5 h-5 rounded-full" /> : <div className="w-5 h-5 rounded-full bg-gray-200" />}
                <span className="font-semibold text-sm">{c.coin?.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium mr-2">{formatCurrency(c.priceUsd)}</span>
                <span className={`text-xs font-bold ${c.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {c.change24h >= 0 ? '▲' : '▼'} {Math.abs(c.change24h || 0).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GlobalTokenSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${query}`);
      const data = await res.json();
      if (data.pairs && data.pairs.length > 0) {
        setResults(data.pairs);
      } else {
        setResults([]);
      }
    } catch (e) {
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <div className="flex-1">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400" />
            Global Token Search
          </h3>
          <p className="text-gray-500 text-sm mt-1">Search any token by name, symbol, or contract address across all blockchains.</p>
        </div>
        <form onSubmit={handleSearch} className="w-full md:w-[450px] flex gap-2">
          <input 
            type="text" 
            placeholder="Search Token (e.g. PEPE, Bitcoin, 0x...)" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50">
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>
      
      {results !== null && results.length === 0 && (
        <p className="mt-4 text-gray-500 text-sm text-center py-4 bg-gray-50 rounded-xl">No tokens found. Try a different name or contract address.</p>
      )}
      
      {results && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.slice(0, 9).map((pair, idx) => (
            <div 
              key={`${pair.chainId}-${pair.pairAddress}-${idx}`} 
              onClick={() => window.location.hash = `#coin/search:${pair.chainId}:${pair.pairAddress}`}
              className="border border-gray-100 rounded-xl p-4 hover:border-gray-300 transition-colors bg-gray-50/50 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {pair.info?.imageUrl ? (
                    <img src={pair.info.imageUrl} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-400">
                      {pair.baseToken.symbol.slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight">{pair.baseToken.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">{pair.baseToken.symbol} / {pair.quoteToken.symbol}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600 uppercase">
                    {pair.chainId}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1">{pair.dexId}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-y-2 mt-3 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold">Price</p>
                  <p className="font-bold text-sm">{formatCurrency(parseFloat(pair.priceUsd))}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold">24h Change</p>
                  <div className="mt-0.5"><PercentBadge value={pair.priceChange?.h24} /></div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold">Liquidity</p>
                  <p className="font-semibold text-sm text-gray-700">{formatCurrency(pair.liquidity?.usd, "compact")}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold">FDV</p>
                  <p className="font-semibold text-sm text-gray-700">{formatCurrency(pair.fdv, "compact")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MarketPage({ setPage }: { setPage: (p: any) => void }) {
  const [pageIndex, setPageIndex] = useState(1);
  const marketsData = useQuery(api.crypto.listCoins, { page: pageIndex, perPage: 50 });
  const stats = useQuery(api.crypto.getGlobalStats);

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24 pb-20">
      <GlobalStatsBar />
      <div className="mx-auto max-w-[88rem] px-6 mt-8">
        <h1 className="text-4xl font-semibold tracking-tight text-black mb-2">Cryptocurrency Prices by Market Cap</h1>
        <p className="text-gray-500 mb-8">The global cryptocurrency market cap is tracked here live.</p>

        <GlobalTokenSearch />

        <MarketHighlights stats={stats} coins={marketsData?.items || []} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-semibold">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">#</th>
                  <th className="px-6 py-4">Coin</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-right">1h</th>
                  <th className="px-6 py-4 text-right">24h</th>
                  <th className="px-6 py-4 text-right">7d</th>
                  <th className="px-6 py-4 text-right">24h Volume</th>
                  <th className="px-6 py-4 text-right">Market Cap</th>
                  <th className="px-6 py-4 text-right">Last 7 Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {!marketsData ? (
                  <tr><td colSpan={9} className="px-6 py-12 text-center text-gray-400">Loading market data...</td></tr>
                ) : marketsData.items.length === 0 ? (
                  <tr><td colSpan={9} className="px-6 py-12 text-center text-gray-400">No coins found. Is ingestion running?</td></tr>
                ) : (
                  marketsData.items.map((m: any) => (
                    <tr key={m.coinId} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => {
                      window.location.hash = `#coin/${m.coinId}`;
                    }}>
                      <td className="px-6 py-4 text-center text-gray-400">{m.marketCapRank}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {m.coin?.imageUrl ? (
                            <img src={m.coin.imageUrl} alt={m.coin.name} className="w-6 h-6 rounded-full" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200" />
                          )}
                          <div>
                            <span className="font-semibold text-gray-900">{m.coin?.name}</span>
                            <span className="ml-2 text-gray-400 uppercase text-xs">{m.coin?.symbol}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(m.priceUsd)}</td>
                      <td className="px-6 py-4 text-right"><PercentBadge value={m.change1h} /></td>
                      <td className="px-6 py-4 text-right"><PercentBadge value={m.change24h} /></td>
                      <td className="px-6 py-4 text-right"><PercentBadge value={m.change7d} /></td>
                      <td className="px-6 py-4 text-right text-gray-600">{formatCurrency(m.volume24h)}</td>
                      <td className="px-6 py-4 text-right text-gray-900 font-medium">{formatCurrency(m.marketCap)}</td>
                      <td className="px-6 py-4 text-right">
                        {m.sparkline7d && (
                          <SparklineSvg 
                            data={m.sparkline7d} 
                            color={m.change7d && m.change7d >= 0 ? "#16a34a" : "#dc2626"} 
                          />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {marketsData && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">Showing {marketsData.items.length} of {marketsData.total} coins</span>
              <div className="flex gap-2">
                <button 
                  disabled={pageIndex === 1}
                  onClick={() => setPageIndex(p => p - 1)}
                  className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors disabled:opacity-50"
                >
                  Previous
                </button>
                <button 
                  disabled={marketsData.items.length < 50}
                  onClick={() => setPageIndex(p => p + 1)}
                  className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



function DexCoinDetailPage({ chainId, pairAddress }: { chainId: string, pairAddress: string }) {
  const [data, setData] = useState<any>(null);
  
  useEffect(() => {
    fetch(`https://api.dexscreener.com/latest/dex/pairs/${chainId}/${pairAddress}`)
      .then(res => res.json())
      .then(res => {
        if (res.pairs && res.pairs.length > 0) setData(res.pairs[0]);
      });
  }, [chainId, pairAddress]);

  if (!data) return (
    <div className="min-h-screen bg-[#F5F5F5] pt-32 flex justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );

  const price = parseFloat(data.priceUsd || "0");
  const change24h = data.priceChange?.h24 || 0;
  const isPositive = change24h >= 0;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24 pb-20">
      <GlobalStatsBar />
      <div className="mx-auto max-w-[88rem] px-6 mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => window.location.hash = "#market"} className="hover:text-black">Cryptocurrencies</button>
          <span>›</span>
          <span className="text-gray-900 font-medium">{data.baseToken.name} Price</span>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-4">
              {data.info?.imageUrl ? <img src={data.info.imageUrl} className="w-10 h-10 rounded-full" /> : <div className="w-10 h-10 bg-gray-200 rounded-full" />}
              <h1 className="text-2xl font-bold">{data.baseToken.name}</h1>
              <span className="text-gray-400 text-lg uppercase font-medium">{data.baseToken.symbol}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold uppercase">{data.chainId}</span>
            </div>
            <div className="flex items-end gap-4 mb-2">
              <span className="text-4xl font-bold tracking-tight">{formatCurrency(price)}</span>
              <span className={`text-lg font-bold px-2 py-0.5 rounded-md ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isPositive ? '▲' : '▼'} {Math.abs(change24h).toFixed(1)}%
              </span>
            </div>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div><p className="text-sm text-gray-500">Liquidity</p><p className="font-bold text-lg">{formatCurrency(data.liquidity?.usd)}</p></div>
              <div><p className="text-sm text-gray-500">FDV</p><p className="font-bold text-lg">{formatCurrency(data.fdv)}</p></div>
              <div><p className="text-sm text-gray-500">24h Volume</p><p className="font-bold text-lg">{formatCurrency(data.volume?.h24)}</p></div>
              <div><p className="text-sm text-gray-500">Dex</p><p className="font-bold text-lg capitalize">{data.dexId}</p></div>
            </div>
            
            <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
               <h3 className="font-bold text-xl mb-4">About {data.baseToken.name}</h3>
               <p className="text-gray-600 leading-relaxed">
                 {data.baseToken.name} ({data.baseToken.symbol}) is a token operating on the {data.chainId} blockchain. It is traded on {data.dexId}. 
                 The token currently has a liquidity of {formatCurrency(data.liquidity?.usd)} and a fully diluted valuation of {formatCurrency(data.fdv)}.
               </p>
               <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Contract Address</p>
                  <code className="text-sm font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200">{data.baseToken.address}</code>
               </div>
            </div>
          </div>
          
          <div className="w-full lg:w-[400px]">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">Converter</h3>
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                <span className="font-bold text-gray-900">{data.baseToken.symbol}</span>
                <span className="font-bold text-xl">1</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="font-bold text-gray-900">USD</span>
                <span className="font-bold text-xl">{formatCurrency(price)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CoinDetailPage({ coinId }: { coinId: string }) {
  if (coinId.startsWith("search:")) {
    const parts = coinId.split(":");
    return <DexCoinDetailPage chainId={parts[1]} pairAddress={parts[2]} />;
  }

  const data = useQuery(api.crypto.getCoin, { coinId });
  const chartDataRaw = useQuery(api.crypto.getCoinChart, { coinId, days: 7 });
  const [activeTab, setActiveTab] = useState("overview");
  const [chartRange, setChartRange] = useState("7D");
  const [convertAmount, setConvertAmount] = useState("1");
  
  if (!data) return (
    <div className="min-h-screen bg-[#F5F5F5] pt-32 flex justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="h-6 w-32 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );

  const m = data.market;
  const price = m?.priceUsd || 0;
  const change24h = m?.change24h || 0;
  const isPositive = change24h >= 0;

  const chartData = (chartDataRaw || []).map(d => ({
    time: new Date(d.ts).toLocaleDateString() + ' ' + new Date(d.ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    price: d.priceUsd,
  }));

  const tabs = ["Overview", "Markets", "Historical Data", "News", "Similar Coins"];
  const chartRanges = ["24H", "7D", "1M", "3M", "YTD", "1Y", "Max"];

  // Percentage change rows
  const changeRows = [
    { label: "1h", value: m?.change1h },
    { label: "24h", value: m?.change24h },
    { label: "7d", value: m?.change7d },
    { label: "30d", value: m?.change30d },
  ];

  const convertedUsd = parseFloat(convertAmount || "0") * price;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24 pb-20">
      <GlobalStatsBar />
      <div className="mx-auto max-w-[88rem] px-6 mt-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => window.location.hash = "#market"} className="hover:text-black">Cryptocurrencies</button>
          <span>›</span>
          <span className="text-gray-900 font-medium">{data.name} Price</span>
        </div>

        {/* Header Row */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT COLUMN */}
          <div className="flex-1 min-w-0">

            {/* Token Header */}
            <div className="flex items-center gap-4 mb-4">
              {data.imageUrl && <img src={data.imageUrl} alt={data.name} className="w-10 h-10 rounded-full" />}
              <h1 className="text-2xl font-bold">{data.name}</h1>
              <span className="text-gray-400 text-lg uppercase font-medium">{data.symbol}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold">Rank #{m?.marketCapRank}</span>
            </div>

            {/* Price + Change */}
            <div className="flex items-end gap-4 mb-2">
              <span className="text-4xl font-bold tracking-tight">{formatCurrency(price)}</span>
              <span className={`text-lg font-bold px-2 py-0.5 rounded-md ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isPositive ? '▲' : '▼'} {Math.abs(change24h).toFixed(1)}%
                <span className="text-xs font-medium ml-1">(24h)</span>
              </span>
            </div>

            {/* BTC Price */}
            <div className="text-sm text-gray-500 mb-6">
              {price > 0 ? (price / (data.name === "Bitcoin" ? 1 : price)).toFixed(8) : "0"} BTC
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase().replace(/ /g, '-'))}
                  className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.toLowerCase().replace(/ /g, '-')
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Price</h2>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  {chartRanges.map(r => (
                    <button
                      key={r}
                      onClick={() => setChartRange(r)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        chartRange === r ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[350px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="time" 
                        tick={{fontSize: 11, fill: '#999'}} 
                        tickFormatter={(val) => val.split(' ')[0]} 
                        minTickGap={50}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        domain={['auto', 'auto']} 
                        tick={{fontSize: 11, fill: '#999'}} 
                        tickFormatter={(val) => '$' + val.toLocaleString()}
                        axisLine={false}
                        tickLine={false}
                        orientation="right"
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)' }}
                        labelStyle={{ color: '#888', marginBottom: '4px', fontSize: 12 }}
                        itemStyle={{ color: '#000', fontWeight: 'bold' }}
                        formatter={(value: any) => [formatCurrency(value), 'Price']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke={isPositive ? "#16a34a" : "#dc2626"} 
                        strokeWidth={2} 
                        dot={false} 
                        activeDot={{ r: 5, strokeWidth: 0 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Collecting price data... Check back in a few minutes.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Percentage Change Table */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex gap-8 overflow-x-auto">
                {changeRows.map(cr => (
                  <div key={cr.label} className="text-center min-w-[60px]">
                    <p className="text-xs text-gray-500 mb-1">{cr.label}</p>
                    <p className={`text-sm font-bold ${(cr.value || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {cr.value !== undefined ? `${cr.value >= 0 ? '+' : ''}${cr.value.toFixed(1)}%` : '-'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* About Section */}
            {data.description && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <h2 className="text-lg font-bold mb-4">About {data.name} ({data.symbol?.toUpperCase()})</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{data.description}</p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — Sidebar */}
          <div className="w-full lg:w-[380px] flex-shrink-0 flex flex-col gap-6">

            {/* Converter Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">{data.symbol?.toUpperCase()} Converter</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <span className="text-sm font-bold uppercase w-12">{data.symbol}</span>
                  <input
                    type="number"
                    value={convertAmount}
                    onChange={e => setConvertAmount(e.target.value)}
                    className="flex-1 bg-transparent text-right text-lg font-semibold outline-none"
                    min="0"
                    step="any"
                  />
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <span className="text-sm font-bold w-12">USD</span>
                  <div className="flex-1 text-right text-lg font-semibold text-gray-600">
                    {formatCurrency(convertedUsd)}
                  </div>
                </div>
              </div>
            </div>

            {/* Market Stats Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Market Stats</h3>
              <div className="flex flex-col gap-4">
                {[
                  { label: "Market Cap", value: formatCurrency(m?.marketCap || 0, "compact") },
                  { label: "Fully Diluted Valuation", value: m?.fdv ? formatCurrency(m.fdv, "compact") : "-" },
                  { label: "24h Trading Volume", value: formatCurrency(m?.volume24h || 0, "compact") },
                  { label: "Circulating Supply", value: m?.circulatingSupply ? m.circulatingSupply.toLocaleString() + ` ${data.symbol?.toUpperCase()}` : "-" },
                  { label: "Total Supply", value: m?.totalSupply ? m.totalSupply.toLocaleString() + ` ${data.symbol?.toUpperCase()}` : "-" },
                  { label: "Max Supply", value: m?.maxSupply ? m.maxSupply.toLocaleString() + ` ${data.symbol?.toUpperCase()}` : "∞" },
                ].map(stat => (
                  <div key={stat.label} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-500">{stat.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Historical Price Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">{data.symbol?.toUpperCase()} Historical Price</h3>
              <div className="flex flex-col gap-4">
                {/* 24h Range */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>24h Range</span>
                  </div>
                  <div className="h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full mb-1.5" />
                  <div className="flex justify-between text-xs font-medium text-gray-700">
                    <span>{formatCurrency(price * 0.97)}</span>
                    <span>{formatCurrency(price * 1.03)}</span>
                  </div>
                </div>

                {/* 7d Range */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>7d Range</span>
                  </div>
                  <div className="h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full mb-1.5" />
                  <div className="flex justify-between text-xs font-medium text-gray-700">
                    <span>{formatCurrency(price * 0.93)}</span>
                    <span>{formatCurrency(price * 1.07)}</span>
                  </div>
                </div>

                {/* ATH */}
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">All-Time High</p>
                    <p className="text-sm font-semibold">{m?.ath ? formatCurrency(m.ath) : '-'}</p>
                    {m?.athDate && <p className="text-xs text-gray-400">{m.athDate}</p>}
                  </div>
                  {m?.ath && (
                    <span className={`text-xs font-bold ${price < m.ath ? 'text-red-500' : 'text-green-500'}`}>
                      {((price / m.ath - 1) * 100).toFixed(1)}%
                    </span>
                  )}
                </div>

                {/* ATL */}
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">All-Time Low</p>
                    <p className="text-sm font-semibold">{m?.atl ? formatCurrency(m.atl) : '-'}</p>
                    {m?.atlDate && <p className="text-xs text-gray-400">{m.atlDate}</p>}
                  </div>
                  {m?.atl && (
                    <span className="text-xs font-bold text-green-500">
                      +{((price / m.atl - 1) * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Community Sentiment */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">How do you feel about {data.symbol?.toUpperCase()} today?</h3>
              <div className="flex gap-3">
                <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 font-bold py-3 rounded-xl transition-colors text-sm">
                  👍 Bullish
                </button>
                <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold py-3 rounded-xl transition-colors text-sm">
                  👎 Bearish
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                The community is {isPositive ? 'bullish' : 'bearish'} about {data.name} today.
              </p>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Info</h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Genesis Date</span>
                  <span className="text-sm font-medium">{data.genesisDate || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Hashing Algorithm</span>
                  <span className="text-sm font-medium">{data.hashingAlgo || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">API ID</span>
                  <span className="text-sm font-mono bg-gray-50 px-2 py-0.5 rounded">{data.coinId}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export function ExchangesPage() {
  const exchanges = useQuery(api.crypto.listExchanges);

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24 pb-20">
      <GlobalStatsBar />
      <div className="mx-auto max-w-[88rem] px-6 mt-8">
        <h1 className="text-4xl font-semibold tracking-tight text-black mb-2">Top Cryptocurrency Exchanges</h1>
        <p className="text-gray-500 mb-8">Ranked by trust score, trading volume, and liquidity.</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-semibold">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">#</th>
                  <th className="px-6 py-4">Exchange</th>
                  <th className="px-6 py-4 text-center">Trust Score</th>
                  <th className="px-6 py-4 text-right">24h Volume (BTC)</th>
                  <th className="px-6 py-4 text-center">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {!exchanges ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading exchanges...</td></tr>
                ) : exchanges.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No exchanges found.</td></tr>
                ) : (
                  exchanges.map((ex: any) => (
                    <tr key={ex.exchangeId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-center text-gray-400">{ex.trustRank}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {ex.imageUrl ? (
                            <img src={ex.imageUrl} alt={ex.name} className="w-6 h-6 rounded-full" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200" />
                          )}
                          <span className="font-semibold text-gray-900">{ex.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-green-100 text-green-800 rounded-lg px-2 py-1 font-bold w-10">
                          {ex.trustScore}/10
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">
                        {ex.volume24hBtc ? ex.volume24hBtc.toLocaleString(undefined, {maximumFractionDigits: 0}) + ' BTC' : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 text-gray-600 uppercase tracking-wide">
                          {ex.isDex ? 'DEX' : 'CEX'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategoriesPage() {
  const categories = useQuery(api.crypto.listCategories);

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24 pb-20">
      <GlobalStatsBar />
      <div className="mx-auto max-w-[88rem] px-6 mt-8">
        <h1 className="text-4xl font-semibold tracking-tight text-black mb-2">Cryptocurrency Categories</h1>
        <p className="text-gray-500 mb-8">Top crypto categories by market capitalization.</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">24h Change</th>
                  <th className="px-6 py-4 text-right">Market Cap</th>
                  <th className="px-6 py-4 text-right">24h Volume</th>
                  <th className="px-6 py-4 text-right">Top Coins</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {!categories ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading categories...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No categories found.</td></tr>
                ) : (
                  categories.map((cat: any) => (
                    <tr key={cat.categoryId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">{cat.name}</td>
                      <td className="px-6 py-4 text-right">
                        <PercentBadge value={cat.change24h} />
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">
                        {formatCurrency(cat.marketCap || 0)}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600">
                        {formatCurrency(cat.volume24h || 0)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-[-8px]">
                          {cat.topCoins?.map((img: string, i: number) => (
                            <img key={i} src={img} className="w-6 h-6 rounded-full border-2 border-white -ml-2 first:ml-0" />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


export function WatchlistPage({ setPage }: { setPage: (p: any) => void }) {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("cryptoUserId"));
  const login = useMutation(api.cryptoAuth.loginOrRegister);
  
  const watchlist = useQuery(api.cryptoAuth.getWatchlist, { userId: userId as any }) as any;
  const toggle = useMutation(api.cryptoAuth.toggleWatchlist);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const id = await login({ email });
    setUserId(id);
    localStorage.setItem("cryptoUserId", id);
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] pt-32 pb-20 flex justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm w-full max-w-md border border-gray-100">
          <h1 className="text-2xl font-bold mb-4">Login to Watchlist</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="p-3 border rounded-xl"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button type="submit" className="bg-black text-white p-3 rounded-xl font-medium">Continue</button>
          </form>
        </div>
      </div>
    );
  }

  const apiKeys = useQuery(api.cryptoAuth.getMyApiKeys, { userId: userId as any });
  const generateApiKey = useMutation(api.cryptoAuth.generateApiKey);

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24 pb-20">
      <GlobalStatsBar />
      <div className="mx-auto max-w-[88rem] px-6 mt-8">
        
        <div className="bg-[#050808] rounded-3xl p-8 mb-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-[#ddfb6d] mb-2">Developer API Access</h2>
            <p className="text-white/70 max-w-lg">
              Build your own apps using the LaunchLayer Market Data API. 
              Get live prices, market caps, and historical data for free.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-w-[250px]">
            {!apiKeys ? <p>Loading keys...</p> : apiKeys.length > 0 ? (
              <div className="bg-white/10 p-3 rounded-lg border border-white/20">
                <p className="text-xs text-white/50 mb-1 uppercase font-bold tracking-wider">Your API Key</p>
                <code className="text-sm font-mono">{apiKeys[0].key}</code>
              </div>
            ) : (
              <button 
                onClick={() => generateApiKey({ userId: userId as any, tier: 'free' })}
                className="bg-[#ddfb6d] text-black px-6 py-3 rounded-xl font-semibold hover:bg-white transition-colors"
              >
                Generate Free API Key
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-black mb-2">My Watchlist</h1>
            <p className="text-gray-500">Track your favorite coins.</p>
          </div>
          <button 
            onClick={() => { localStorage.removeItem("cryptoUserId"); setUserId(null); }}
            className="text-sm text-gray-500 hover:text-black font-semibold"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-semibold">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">#</th>
                  <th className="px-6 py-4">Coin</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-right">24h</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {!watchlist ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading watchlist...</td></tr>
                ) : !watchlist.coins || watchlist.coins.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Your watchlist is empty. Go to Market to add coins!</td></tr>
                ) : (
                  watchlist.coins.map((c: any) => (
                    <tr key={c.coinId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-center text-gray-400">{c.market?.marketCapRank}</td>
                      <td className="px-6 py-4 cursor-pointer" onClick={() => window.location.hash = `#coin/${c.coinId}`}>
                        <div className="flex items-center gap-3">
                          {c.imageUrl ? (
                            <img src={c.imageUrl} alt={c.name} className="w-6 h-6 rounded-full" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200" />
                          )}
                          <span className="font-semibold text-gray-900">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(c.market?.priceUsd || 0)}</td>
                      <td className="px-6 py-4 text-right"><PercentBadge value={c.market?.change24h} /></td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => toggle({ userId: userId as any, coinId: c.coinId })} className="text-red-500 text-xs font-semibold hover:underline">Remove</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
