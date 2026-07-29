import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  CircleDollarSign,
  ClipboardCheck,
  Globe2,
  Handshake,
  LineChart,
  Megaphone,
  Menu,
  Rocket,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { animate, motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type PageKey = "home" | "listings" | "launch" | "growth" | "plans" | "ecosystem" | "partners" | "events" | "blog" | "funding" | "community" | "brand" | "privacy" | "terms" | "admin" | "contact";

type NavItem = {
  label: string;
  page: PageKey;
};

const heroVideo =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4";

const useCaseVideo =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_183428_ab5e672a-f608-4dcb-b319-f3e040f02e2d.mp4";

const imageCard =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85";


const menuGroups = [
  {
    label: "Company",
    summary: "How LaunchLayer operates",
    links: [
      { label: "Ecosystem", page: "ecosystem" as const, desc: "Company network and operating desks" },
      { label: "Community", page: "community" as const, desc: "Holders, creators, moderators, and ambassadors" },
      { label: "Plans", page: "plans" as const, desc: "Agency rooms for each token stage" },
    ],
  },
  {
    label: "Services",
    summary: "Launch and market work",
    links: [
      { label: "Launch System", page: "launch" as const, desc: "Step-by-step token launch execution" },
      { label: "Listings", page: "listings" as const, desc: "CMC, CoinGecko, DEX tools, and exchanges" },
      { label: "Growth Desk", page: "growth" as const, desc: "Campaigns, KOLs, reporting, and momentum" },
    ],
  },
  {
    label: "Network",
    summary: "Partners and events",
    links: [
      { label: "Partners", page: "partners" as const, desc: "Launchpads, media, security, analytics, exchanges" },
      { label: "Events", page: "events" as const, desc: "AMAs, pitch days, spaces, and demo days" },
      { label: "Funding", page: "funding" as const, desc: "Budget, grants, investor decks, and treasury notes" },
    ],
  },
  {
    label: "Resources",
    summary: "Learn and start",
    links: [
      { label: "Blog", page: "blog" as const, desc: "Launch guides, listing articles, and market notes" },
      { label: "Brand Kit", page: "brand" as const, desc: "Download LaunchLayer marks and files" },
      { label: "Privacy", page: "privacy" as const, desc: "How LaunchLayer handles project information" },
      { label: "Terms", page: "terms" as const, desc: "Independent support terms and conditions" },
      { label: "Contact", page: "contact" as const, desc: "Request a launch map" },
    ],
  },
];


const launchNetworkItems = [
  "CoinMarketCap",
  "CoinGecko",
  "DEXTools",
  "DexScreener",
  "GeckoTerminal",
  "Birdeye",
  "Uniswap",
  "PancakeSwap",
  "Raydium",
  "Jupiter",
  "PinkSale",
  "DxSale",
  "GemPad",
  "Unicrypt",
  "Team Finance",
  "MEXC",
  "Gate.io",
  "BitMart",
  "LBank",
  "BingX",
  "KuCoin route prep",
  "Audit partners",
  "KYC partners",
  "Liquidity locks",
  "Market makers",
  "PR networks",
  "KOL desks",
  "Telegram communities",
  "X Spaces",
  "Launch events",
];
const exchangeBrands = [
  { name: "CoinMarketCap", style: { fontFamily: "Georgia, serif", fontWeight: 700, letterSpacing: "-0.02em", fontSize: "15px" } },
  { name: "CoinGecko", style: { fontFamily: "Arial, sans-serif", fontWeight: 900, letterSpacing: "0.08em", fontSize: "13px", textTransform: "uppercase" as const } },
  { name: "DexScreener", style: { fontFamily: "Trebuchet MS, sans-serif", fontWeight: 600, letterSpacing: "0.01em", fontSize: "15px", fontStyle: "italic" } },
  { name: "DEXTools", style: { fontFamily: "Courier New, monospace", fontWeight: 700, letterSpacing: "0.12em", fontSize: "13px", textTransform: "uppercase" as const } },
  { name: "MEXC", style: { fontFamily: "Palatino, Book Antiqua, serif", fontWeight: 400, letterSpacing: "-0.01em", fontSize: "16px" } },
  { name: "Gate.io", style: { fontFamily: "Impact, Arial Narrow, sans-serif", fontWeight: 400, letterSpacing: "0.04em", fontSize: "14px" } },
  { name: "BitMart", style: { fontFamily: "Verdana, sans-serif", fontWeight: 700, letterSpacing: "-0.03em", fontSize: "13px" } },
];

const partnerBrands = [
  { name: "Pinksale", style: { fontFamily: "Times New Roman, serif", fontWeight: 400, letterSpacing: "0.02em", fontSize: "14px" } },
  { name: "KUCOIN", style: { fontFamily: "Arial Black, sans-serif", fontWeight: 900, letterSpacing: "0.08em", fontSize: "16px" } },
  { name: "Birdeye", style: { fontFamily: "Impact, sans-serif", fontWeight: 700, letterSpacing: "0.05em", fontSize: "18px" } },
  { name: "Raydium", style: { fontFamily: "Georgia, serif", fontWeight: 600, letterSpacing: "-0.02em", fontSize: "17px" } },
  { name: "Matter Labs", style: { fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 700, letterSpacing: "-0.01em", fontSize: "15px" } },
  { name: "DEXTOOLS", style: { fontFamily: "Verdana, sans-serif", fontWeight: 700, letterSpacing: "0.06em", fontSize: "14px", textTransform: "uppercase" as const } },
  { name: "NGRAVE", style: { fontFamily: "Courier New, monospace", fontWeight: 700, letterSpacing: "0.18em", fontSize: "14px" } },
  { name: "Polychain", style: { fontFamily: "Palatino, serif", fontWeight: 500, letterSpacing: "0.03em", fontSize: "15px" } },
];

const listingPlatforms = [
  "CoinMarketCap",
  "CoinGecko",
  "DEXTools",
  "DexScreener",
  "GeckoTerminal",
  "Birdeye",
  "Uniswap",
  "PancakeSwap",
  "Raydium",
  "Jupiter",
  "MEXC",
  "Gate.io",
  "BitMart",
  "LBank",
  "BingX",
  "KuCoin route prep",
];

const serviceCards = [
  {
    icon: SearchCheck,
    title: "Listing Readiness",
    copy: "Token metadata, contract links, explorer proof, liquidity evidence, socials, logos, docs, and reviewer-friendly submission sheets.",
  },
  {
    icon: Rocket,
    title: "Launchpad Routing",
    copy: "We map presale, fair launch, DEX launch, meme discovery, Solana boards, EVM trackers, and chain-specific routes.",
  },
  {
    icon: ShieldCheck,
    title: "Trust Stack",
    copy: "Audit, KYC, lock, ownership, tokenomics, team, roadmap, and risk notes organized into a clean public proof kit.",
  },
  {
    icon: Megaphone,
    title: "Market Push",
    copy: "X campaigns, Telegram scripts, community raids, KOL waves, press copy, launch announcements, and post-listing updates.",
  },
];

const launchSteps = [
  "Chain, category, and target-platform strategy",
  "Token profile cleanup and public data room",
  "DEX launch setup with chart and swap visibility",
  "Tracker submission pack for major directories",
  "Meme coin board and community discovery placements",
  "CEX outreach kit with liquidity and market assumptions",
  "Launch week command room with daily tasks",
  "Post-listing analytics, updates, and next route planning",
];

const packages = [
  {
    name: "Meme Ignite",
    label: "For pre-launch teams",
    copy: "Get your token ready to look real from day one.",
    features: ["DEX checklist", "Metadata and logo kit", "Telegram launch scripts", "Meme discovery shortlist"],
  },
  {
    name: "Listing Sprint",
    label: "Most picked",
    copy: "A focused execution room for active tokens chasing visibility.",
    featured: true,
    features: ["CMC and CoinGecko prep", "DEXTools and DexScreener pack", "KOL brief and content calendar", "Exchange outreach deck"],
  },
  {
    name: "Market Expansion",
    label: "For scaling projects",
    copy: "Move from tracker visibility into exchange and partner conversations.",
    features: ["CEX listing coordination", "Liquidity planning", "PR and partner calendar", "Weekly growth reporting"],
  },
];


const ecosystemTracks = [
  [Globe2, "Listing Network", "Token data platforms, DEX trackers, swap interfaces, meme directories, launchpads, and exchange outreach routes."],
  [Users, "Community Network", "Telegram, Discord, X, spaces, ambassador squads, creator pages, raid teams, and moderation systems."],
  [ShieldCheck, "Trust Network", "Audit partners, KYC vendors, liquidity lock references, contract reviewers, compliance notes, and public proof assets."],
  [LineChart, "Market Network", "Market makers, liquidity planners, exchange documents, investor updates, PR calendars, and post-listing reporting."],
];

const partnerPrograms = [
  { name: "Launchpads", detail: "Presale, fair launch, and meme launch routing for EVM, Solana, and emerging chains.", metric: "18 routes" },
  { name: "Exchanges", detail: "Outreach packs for centralized exchange conversations, market maker docs, and liquidity assumptions.", metric: "CEX desk" },
  { name: "Media/KOLs", detail: "Creator briefs, press drops, X spaces, meme pages, Telegram channels, and content launch calendars.", metric: "Growth layer" },
  { name: "Security", detail: "Audit, KYC, lock, ownership, and contract verification references packaged for trust.", metric: "Proof kit" },
  { name: "Analytics", detail: "Charting, holder movement, liquidity visibility, campaign reporting, and post-launch updates.", metric: "Signal room" },
  { name: "Communities", detail: "Regional communities, ambassador programs, moderation support, quests, and launch event audiences.", metric: "Audience ops" },
];

const eventPrograms = [
  { title: "Token Launch Week", date: "7 day sprint", copy: "Daily AMAs, X spaces, meme contests, listing updates, KOL drops, and Telegram support." },
  { title: "Exchange Pitch Day", date: "Private room", copy: "Founder pitch, token economics review, liquidity assumptions, deck cleanup, and partner introductions." },
  { title: "Community Activation Night", date: "Live event", copy: "Moderated spaces, raid boards, creator challenges, ambassador onboarding, and launch announcements." },
  { title: "Ecosystem Demo Day", date: "Monthly", copy: "Projects present to partners, communities, launchpads, media, and investor-facing observers." },
];

const blogPosts = [
  { tag: "Listings", title: "How to prepare a CoinMarketCap and CoinGecko submission pack", read: "6 min read" },
  { tag: "Meme Coins", title: "The first 72 hours after a meme token goes live", read: "8 min read" },
  { tag: "CEX", title: "What exchange teams want before a listing conversation", read: "7 min read" },
  { tag: "Community", title: "Telegram launch scripts that keep buyers informed", read: "5 min read" },
  { tag: "Trust", title: "Audit, KYC, liquidity locks, and public proof pages", read: "6 min read" },
  { tag: "Growth", title: "Turning DEX visibility into long-term token discovery", read: "9 min read" },
];


type BackendContentType = "blog" | "event" | "listing" | "partner" | "token" | "work";

type BackendContentItem = {
  _id?: string;
  type?: BackendContentType;
  title: string;
  summary: string;
  tag?: string;
  meta?: string;
  body?: string;
  href?: string;
  published?: boolean;
  coverImageUrl?: string | null;
  coverImageStorageId?: string;
  coverImageName?: string;
  documentUrl?: string | null;
  documentStorageId?: string;
  documentName?: string;
  documentType?: string;
  contentFormat?: string;
  impressions?: number;
  clicks?: number;
  leads?: number;
};

const backendHttpUrl = (import.meta.env.VITE_CONVEX_HTTP_URL as string | undefined)?.replace(/\/$/, "");

const fallbackBlogItems: BackendContentItem[] = blogPosts.map((post) => ({
  type: "blog",
  title: post.title,
  summary: "A LaunchLayer field note for teams preparing a cleaner route into market visibility.",
  tag: post.tag,
  meta: post.read,
}));

const fallbackEventItems: BackendContentItem[] = eventPrograms.map((event) => ({
  type: "event",
  title: event.title,
  summary: event.copy,
  tag: "Launch event",
  meta: event.date,
}));

const fallbackListingItems: BackendContentItem[] = listingPlatforms.map((platform) => ({
  type: "listing",
  title: platform,
  summary: "Route planning, asset preparation, reviewer links, and follow-up support for this market entry path.",
  tag: "Listing route",
  meta: "Platform prep",
}));

function useBackendContent(type: BackendContentType, fallback: BackendContentItem[]) {
  const [items, setItems] = useState<BackendContentItem[]>(backendHttpUrl ? [] : fallback);

  useEffect(() => {
    if (!backendHttpUrl) return;
    let active = true;

    fetch(`${backendHttpUrl}/content?type=${type}`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Content request failed"))))
      .then((data: { items?: BackendContentItem[] }) => {
        if (active) {
          setItems(data.items ?? []);
        }
      })
      .catch(() => {
        if (active) setItems(fallback);
      });

    return () => {
      active = false;
    };
  }, [fallback, type]);

  return items;
}
const fundingTracks = [
  [CircleDollarSign, "Launch Budget Planning", "Build the spend map for listings, liquidity, market making, creators, PR, and community operations."],
  [Handshake, "Investor Materials", "Narrative, market category, traction, token economics, roadmap, and use-of-funds decks for private conversations."],
  [Target, "Grant Routing", "Ecosystem grant positioning, chain-specific applications, milestone framing, and partner follow-up support."],
  [BarChart3, "Treasury Reporting", "Post-launch reports for spend, growth, listings, community, liquidity, and next capital needs."],
];
const faqs = [
  ["Can you guarantee listings?", "No. We do not promise third-party approvals. We prepare, submit, coordinate, and follow up with the strongest possible materials."],
  ["Do you support meme coin platforms?", "Yes. We cover meme directories, DEX trackers, trending tools, chain communities, Telegram growth, X launch pushes, and creator campaigns."],
  ["What chains do you support?", "Ethereum, BNB Chain, Solana, Base, Polygon, Arbitrum, and other EVM or ecosystem-specific launches where the listing route is practical."],
  ["Can you write the full launch script?", "Yes. We prepare announcements, raid prompts, moderation replies, pitch copy, exchange summaries, and launch-room checklists."],
];


const logoPath = "M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z";

const brandAssets = [
  { name: "Primary Lockup", type: "Full logo", bg: "#F5F5F5", fg: "#000000", accent: "#E8E8E8", mode: "lockup" },
  { name: "Dark Lockup", type: "Exchange deck", bg: "#050808", fg: "#FFFFFF", accent: "#1D2424", mode: "lockup" },
  { name: "Launch Purple", type: "Campaign mark", bg: "#7342E2", fg: "#FFFFFF", accent: "#8F68EA", mode: "badge" },
  { name: "Signal Green", type: "Community mark", bg: "#DDFB6D", fg: "#111111", accent: "#C4E655", mode: "badge" },
  { name: "Mono Mark", type: "Icon only", bg: "#FFFFFF", fg: "#000000", accent: "#EEEEEE", mode: "mark" },
] as const;

function buildLogoSvg(asset: (typeof brandAssets)[number]) {
  const word = `<text x="330" y="154" fill="${asset.fg}" font-family="Inter, Arial, sans-serif" font-size="78" font-weight="800" letter-spacing="-6">LaunchLayer</text>`;
  const sub = `<text x="334" y="208" fill="${asset.fg}" opacity="0.56" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="600" letter-spacing="2">LAUNCH EVERYWHERE</text>`;
  const mark = `<path d="${logoPath}" fill="${asset.fg}" transform="translate(48 48) scale(0.75)"/>`;
  const pattern = Array.from({ length: 9 }, (_, i) => `<path d="${logoPath}" fill="${asset.fg}" opacity="${0.08 + (i % 3) * 0.06}" transform="translate(${40 + (i % 3) * 250} ${30 + Math.floor(i / 3) * 150}) scale(0.34)"/>`).join("");
  if (asset.mode === "mark") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="520" viewBox="0 0 520 520"><rect width="520" height="520" rx="56" fill="${asset.bg}"/><circle cx="260" cy="260" r="184" fill="${asset.accent}" opacity="0.45"/><path d="${logoPath}" fill="${asset.fg}" transform="translate(116 116) scale(1.12)"/></svg>`;
  }

  if (asset.mode === "badge") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520" viewBox="0 0 900 520"><rect width="900" height="520" rx="56" fill="${asset.bg}"/><circle cx="742" cy="120" r="210" fill="${asset.accent}" opacity="0.42"/><path d="${logoPath}" fill="${asset.fg}" transform="translate(70 106) scale(1.18)"/><text x="390" y="232" fill="${asset.fg}" font-family="Inter, Arial, sans-serif" font-size="86" font-weight="850" letter-spacing="-7">LaunchLayer</text><text x="394" y="286" fill="${asset.fg}" opacity="0.62" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="2">LISTING NETWORK / MARKET ENTRY</text></svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="360" viewBox="0 0 1100 360"><rect width="1100" height="360" rx="44" fill="${asset.bg}"/><circle cx="160" cy="180" r="122" fill="${asset.accent}" opacity="0.42"/>${mark}${word}${sub}</svg>`;
}

function downloadTextFile(filename: string, content: string, type = "image/svg+xml") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadPng(filename: string, svg: string) {
  const image = new Image();
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width * 2;
    canvas.height = image.height * 2;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = filename;
    link.click();
  };
  image.src = url;
}
function getInitialPage(): PageKey {
  const hash = window.location.hash.replace("#", "");
  if (["home", "listings", "launch", "growth", "plans", "ecosystem", "partners", "events", "blog", "funding", "community", "brand", "privacy", "terms", "admin", "contact"].includes(hash)) {
    return hash as PageKey;
  }
  return "home";
}

function LogoIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z" />
    </svg>
  );
}

function ArrowButton({ children, onClick, light = false }: { children: React.ReactNode; onClick?: () => void; light?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-3 rounded-full py-2 pl-8 pr-2 text-base font-medium transition-colors duration-200 md:text-lg ${
        light ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-800"
      }`}
    >
      {children}
      <span className={`rounded-full p-2 transition-colors duration-200 ${light ? "bg-black text-white" : "bg-white text-black"}`}>
        <ArrowRight className="h-5 w-5" />
      </span>
    </button>
  );
}

function BrandMarquee({ brands, variant }: { brands: typeof exchangeBrands; variant: "hero" | "backers" }) {
  const className = variant === "hero" ? "marquee-track" : "backers-track";
  const itemClass = variant === "hero" ? "mx-7 text-black/60" : "mx-10 text-black/50";

  return (
    <div className="w-full overflow-hidden">
      <div className={className}>
        {[...brands, ...brands].map((brand, index) => (
          <span key={`${brand.name}-${index}`} className={`shrink-0 whitespace-nowrap ${itemClass}`} style={brand.style}>
            {brand.name}
          </span>
        ))}
      </div>
    </div>
  );
}


function LaunchNetworkStrip() {
  const items = [...launchNetworkItems, ...launchNetworkItems];

  return (
    <section className="bg-[#F5F5F5] px-0 pb-6 pt-6">
      <div className="trusted-band overflow-hidden border-y border-white/10 bg-[#050808] py-8">
        <div className="trusted-band-inner mx-auto flex max-w-[88rem] items-center gap-10 px-6">
          <div className="trusted-label shrink-0 text-xs font-semibold uppercase tracking-[0.32em] text-white/28">
            Trusted by
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="platform-cycle-track">
              {items.map((item, index) => (
                <span key={`${item}-${index}`} className="platform-cycle-item">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function Navbar({ page, setPage }: { page: PageKey; setPage: (page: PageKey) => void }) {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const go = (target: PageKey) => {
    setPage(target);
    setOpen(false);
    setActiveMenu(null);
  };

  const isGroupActive = (links: Array<{ page: PageKey }>) => links.some((link) => link.page === page);

  return (
    <nav className="absolute left-0 right-0 top-0 z-30 px-6 py-5">
      <div className="mx-auto flex max-w-[88rem] items-center justify-between">
        <button onClick={() => go("home")} className="flex items-center gap-3 text-black" aria-label="Open LaunchLayer home">
          <LogoIcon />
          <span className="text-2xl font-medium tracking-tight">LaunchLayer</span>
        </button>

        <div className="relative hidden items-center gap-2 rounded-full bg-white/65 p-2 shadow-[0_18px_55px_rgba(0,0,0,0.06)] backdrop-blur-xl md:flex">
          {menuGroups.map((group) => (
            <div key={group.label} className="relative" onMouseEnter={() => setActiveMenu(group.label)}>
              <button
                onClick={() => setActiveMenu(activeMenu === group.label ? null : group.label)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isGroupActive(group.links) || activeMenu === group.label ? "bg-black text-white" : "text-gray-700 hover:bg-black/5 hover:text-black"
                }`}
              >
                {group.label}
              </button>
            </div>
          ))}

          {activeMenu && (
            <div className="mega-menu absolute left-1/2 top-[calc(100%+12px)] w-[760px] -translate-x-1/2 rounded-3xl bg-white p-4 shadow-[0_30px_100px_rgba(0,0,0,0.16)] ring-1 ring-black/5" onMouseLeave={() => setActiveMenu(null)}>
              {menuGroups.filter((group) => group.label === activeMenu).map((group) => (
                <div key={group.label} className="grid gap-4 md:grid-cols-[0.72fr_1fr]">
                  <div className="rounded-2xl bg-black p-6 text-white">
                    <p className="text-sm text-white/55">{group.label}</p>
                    <h3 className="mt-4 text-3xl font-medium leading-none" style={{ letterSpacing: "-0.04em" }}>{group.summary}</h3>
                    <p className="mt-5 text-sm leading-6 text-white/58">Select a specific desk, network, or resource. Every area opens its own company page.</p>
                  </div>
                  <div className="grid gap-2">
                    {group.links.map((link) => (
                      <button key={link.page} onClick={() => go(link.page)} className="menu-link group flex items-center justify-between gap-4 rounded-2xl p-4 text-left hover:bg-[#F5F5F5]">
                        <span>
                          <span className="block text-lg font-medium text-black">{link.label}</span>
                          <span className="mt-1 block text-sm leading-5 text-black/55">{link.desc}</span>
                        </span>
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black text-white transition-transform group-hover:translate-x-1">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => go("contact")} className="hidden rounded-full bg-black px-7 py-2.5 text-base font-medium text-white transition-colors duration-200 hover:bg-gray-800 md:inline-flex">
          Book Launch
        </button>

        <button className="grid h-11 w-11 place-items-center rounded-full bg-white/70 text-black md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute right-4 top-4 max-h-[calc(100dvh-32px)] w-[min(92vw,390px)] overflow-y-auto rounded-2xl bg-[#F5F5F5] p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div className="flex items-center gap-3">
                <LogoIcon />
                <span className="text-xl font-medium">LaunchLayer</span>
              </div>
              <button className="grid h-10 w-10 place-items-center rounded-full bg-black text-white" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="py-4">
              <button onClick={() => go("home")} className="mb-3 w-full rounded-xl bg-white px-3 py-3 text-left text-lg font-medium">Home</button>
              <div className="grid gap-3">
                {menuGroups.map((group) => (
                  <div key={group.label} className="rounded-2xl bg-white p-3 ring-1 ring-black/5">
                    <div className="px-1 pb-2">
                      <p className="text-sm font-medium text-black">{group.label}</p>
                      <p className="mt-1 text-xs text-black/50">{group.summary}</p>
                    </div>
                    <div className="grid gap-1">
                      {group.links.map((link) => (
                        <button key={link.page} onClick={() => go(link.page)} className="flex items-center justify-between rounded-xl px-3 py-3 text-left hover:bg-[#F5F5F5]">
                          <span>
                            <span className="block text-base font-medium text-black">{link.label}</span>
                            <span className="block text-xs text-black/50">{link.desc}</span>
                          </span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function HeroSection({ setPage }: { setPage: (page: PageKey) => void }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F5F5F5]">
      <section className="flex flex-1 items-end px-6 pb-6 pt-20">
        <div className="hero-card relative h-[calc(100vh-96px)] w-full overflow-hidden rounded-2xl">
          <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" src={heroVideo} />
          <div className="absolute inset-0 bg-white/18" />
          <div className="relative z-10 flex h-full flex-col items-start justify-start p-7 pt-28 sm:p-12 sm:pt-36">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-black backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Token listing agency for serious launches
            </span>
            <h1 className="mb-4 max-w-3xl text-5xl font-medium leading-tight text-black md:text-7xl" style={{ letterSpacing: "-0.04em" }}>
              Your Token
              <br />
              Goes Live
            </h1>
            <p className="mb-8 max-w-md text-base leading-relaxed text-black/70 md:text-lg" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
              A premium launch desk for listings, meme coin platforms, DEX visibility, exchange outreach, and growth systems that make your token easier to find and trust.
            </p>
            <ArrowButton onClick={() => setPage("contact")}>Start launch</ArrowButton>
            <div className="mt-24 w-full max-w-md overflow-hidden">
              <BrandMarquee brands={exchangeBrands} variant="hero" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HomePage({ setPage }: { setPage: (page: PageKey) => void }) {
  return (
    <>
      <HeroSection setPage={setPage} />
      <section className="bg-[#F5F5F5] px-6 py-24">
        <div className="mx-auto max-w-[88rem]">
          <div className="mb-16 grid grid-cols-1 items-start gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-8 text-4xl font-medium leading-tight text-black md:text-5xl" style={{ letterSpacing: "-0.03em" }}>
                Meet the launch desk.
              </h2>
              <div className="flex flex-wrap gap-3"><ArrowButton onClick={() => setPage("ecosystem")}>Explore company</ArrowButton><button onClick={() => setPage("blog")} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-medium text-black shadow-sm">Read articles <ArrowRight className="h-4 w-4" /></button></div>
            </div>
            <p className="text-2xl leading-relaxed text-black/70 md:text-3xl">
              LaunchLayer helps token teams move from contract address to market visibility with listings, campaign assets, trust signals, and a clean route across major token platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="photo-card min-h-80 rounded-2xl bg-cover bg-center p-7 lg:col-span-2" style={{ backgroundImage: `url(${imageCard})` }}>
              <div className="flex min-h-80 flex-col justify-between">
                <h3 className="text-2xl font-medium leading-snug text-black" style={{ letterSpacing: "-0.02em" }}>
                  Visibility that compounds
                </h3>
                <p className="max-w-xs text-base text-black/70">
                  Turn listings, trending moments, tracker pages, and exchange conversations into one coordinated launch flow.
                </p>
              </div>
            </div>
            <div className="metric-card flex min-h-80 flex-col justify-between rounded-2xl bg-[#2B2644] p-7">
              <h3 className="whitespace-pre-line text-2xl font-medium leading-snug text-white">Always listed,{"\n"}always visible.</h3>
              <p className="text-base text-white/60">Prepare clean submissions for DEX trackers, meme boards, and top token data platforms.</p><button onClick={() => setPage("listings")} className="relative z-10 mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black">Open listings <ArrowRight className="h-4 w-4" /></button>
            </div>
            <div className="metric-card flex min-h-80 flex-col justify-between rounded-2xl bg-[#2B2644] p-7">
              <h3 className="whitespace-pre-line text-2xl font-medium leading-snug text-white">Fully{"\n"}coordinated</h3>
              <p className="text-base text-white/60">Skip scattered launch tasks. We organize the playbook, assets, and follow-ups in one room.</p><button onClick={() => setPage("community")} className="relative z-10 mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black">Community desk <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </section><LaunchStatsSection /><UseCasesSection setPage={setPage} />
    </>
  );
}


function AnimatedCounter({ value, suffix = "", prefix = "", decimals = 0 }: { value: number; suffix?: string; prefix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(current) {
        if (ref.current) ref.current.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [decimals, inView, prefix, suffix, value]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

function Typewriter({ text, delay = 0, speed = 0.015, className = "" }: { text: string; delay?: number; speed?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10px" });

  return (
    <motion.span
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: speed, delayChildren: delay } },
      }}
    >
      {text.split("").map((char, index) => (
        <motion.span key={`${char}-${index}`} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

function LaunchStatsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };
  const maskStyle = {
    WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='m53.54,45.42c2.19-3.79,7.67-3.79,9.86,0l4.54,7.87c1.17,2.02,1.17,4.51,0,6.54l-8.15,13.81c-1.68,2.91.42,6.55,3.78,6.55h17.81c3.45,0,5.61-3.74,3.89-6.73l-28.76-49.81c-2.95-5.12-10.34-5.12-13.29,0l-28.46,49.3c-1.86,3.22.46,7.24,4.18,7.24h10.23c2.55,0,4.91-1.36,6.19-3.57l18.18-31.19Z'/%3E%3C/svg%3E")`,
    WebkitMaskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='m53.54,45.42c2.19-3.79,7.67-3.79,9.86,0l4.54,7.87c1.17,2.02,1.17,4.51,0,6.54l-8.15,13.81c-1.68,2.91.42,6.55,3.78,6.55h17.81c3.45,0,5.61-3.74,3.89-6.73l-28.76-49.81c-2.95-5.12-10.34-5.12-13.29,0l-28.46,49.3c-1.86,3.22.46,7.24,4.18,7.24h10.23c2.55,0,4.91-1.36,6.19-3.57l18.18-31.19Z'/%3E%3C/svg%3E")`,
    maskSize: "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
  };
  const stats = [
    { value: 500, suffix: "+", label: "Launch assets prepared" },
    { value: 99.8, decimals: 1, suffix: "%", label: "Submission readiness rate" },
    { value: 40, suffix: "+", label: "Listing routes mapped" },
    { value: 15, suffix: "+", label: "Launch categories supported" },
    { value: 24, suffix: "/7", label: "Launch room coverage" },
  ];

  return (
    <section id="stats" className="stats-section stats-section-light w-full overflow-hidden border-y border-black/10 bg-[#F5F5F5] px-6 py-8 text-black md:px-12 md:py-24 lg:px-[120px]">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="flex flex-col items-stretch gap-16 lg:flex-row lg:gap-[160px]">
          <motion.div className="flex flex-1 flex-col justify-start" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants}>
            <motion.h2 className="mb-6 w-[590px] max-w-full text-[clamp(1.5rem,4vw,3.5rem)] font-medium leading-[1.1] tracking-tight" variants={itemVariants}>
              <Typewriter text="Powering Token Launches" delay={0} speed={0.012} />
              <br />
              <Typewriter text="that " delay={0.25} speed={0.012} />
              <span className="stats-serif italic font-normal">
                <Typewriter text="Maximize Market Reach" delay={0.35} speed={0.012} />
              </span>
            </motion.h2>
            <motion.p className="mb-16 max-w-lg whitespace-normal text-base font-light leading-relaxed text-black/50 md:text-lg" variants={itemVariants}>
              <Typewriter text="LaunchLayer gives token teams the operating system for listings, exchange outreach, community events, partner coordination, funding prep, and post-launch visibility." delay={0.1} speed={0.012} />
            </motion.p>
            <motion.div className="grid grid-cols-2 gap-8 md:grid-cols-[max-content_max-content] md:gap-x-16 lg:gap-x-24" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}>
              {stats.map((stat) => (
                <motion.div key={stat.label} className="flex flex-col" variants={itemVariants}>
                  <div className="stats-serif mb-3 text-4xl tracking-tight md:text-5xl lg:text-[56px]">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-black/50 md:text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <div className="flex shrink-0 items-center justify-center lg:w-1/2 lg:justify-end">
            <motion.div className="aspect-square w-full max-w-[500px] origin-center lg:w-[120%] lg:max-w-none" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1.2 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0, ease: "easeOut" }} style={maskStyle}>
              <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                <source src="https://app-uploads.krea.ai/wan-videos/7f348c17-c3aa-40c9-9d5b-a2bed9a72c2e.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
function UseCasesSection({ setPage }: { setPage: (page: PageKey) => void }) {
  return (
    <section className="bg-[#F5F5F5] px-6 py-24">
      <div className="mx-auto grid max-w-[88rem] grid-cols-1 items-start gap-8 md:grid-cols-2">
        <div className="md:pr-12 md:pt-2">
          <p className="mb-2 text-sm text-black/60">LaunchLayer in Practice</p>
          <h2 className="mb-6 text-5xl font-medium leading-none text-black md:text-6xl" style={{ letterSpacing: "-0.04em" }}>
            Use modes
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-black/60">
            LaunchLayer supports meme coins, DeFi tokens, utility projects, presales, relaunches, exchange campaigns, and ecosystem growth pushes.
          </p>
        </div>
        <div className="relative min-h-[720px] overflow-hidden rounded-3xl">
          <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" src={useCaseVideo} />
          <div className="absolute inset-0 bg-white/18" />
          <div className="relative z-10 p-10 md:p-12">
            <h3 className="mb-5 text-4xl font-medium leading-tight text-black md:text-5xl" style={{ letterSpacing: "-0.03em" }}>
              Market Entry
            </h3>
            <p className="mb-8 max-w-md text-base text-black/70">
              Bring together listing submissions, DEX visibility, community content, and partner outreach so your token launch feels coordinated from the first public click.
            </p>
            <button onClick={() => setPage("listings")} className="group inline-flex items-center gap-3 text-base font-medium text-black">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur transition-colors group-hover:bg-white">
                <ArrowRight className="h-4 w-4 text-black" />
              </span>
              Know more
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PageShell({ title, kicker, children }: { title: string; kicker: string; children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-[#F5F5F5] px-6 pb-24 pt-36">
      <div className="mx-auto max-w-[88rem]">
        <div className="max-w-4xl">
          <p className="mb-3 text-sm font-medium text-black/60">{kicker}</p>
          <h1 className="text-5xl font-medium leading-none text-black md:text-7xl" style={{ letterSpacing: "-0.04em" }}>
            {title}
          </h1>
        </div>
        {children}
      </div>
    </section>
  );
}

function ListingsPage({ setPage }: { setPage: (page: PageKey) => void }) {
  const listings = useBackendContent("listing", fallbackListingItems);

  return (
    <PageShell title="Listing routes for every serious token stage." kicker="Listings">
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {listings.map((item) => (
          <div key={item._id ?? item.title} className="platform-tile flex min-h-40 flex-col justify-between rounded-2xl bg-white p-6 ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-4">
              <Globe2 className="h-5 w-5 text-black/50" />
              <span className="rounded-full bg-[#F5F5F5] px-3 py-1 text-xs font-medium text-black/50">{item.meta ?? item.tag ?? "Route"}</span>
            </div>
            <div>
              <span className="text-xl font-medium text-black">{item.title}</span>
              <p className="mt-3 text-sm leading-6 text-black/55">{item.summary}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16 rounded-2xl bg-black p-8 text-white md:p-12">
        <div className="grid gap-8 md:grid-cols-[1fr_0.85fr] md:items-center">
          <h2 className="text-4xl font-medium leading-tight md:text-5xl" style={{ letterSpacing: "-0.03em" }}>
            We prepare the assets platforms need before they ask twice.
          </h2>
          <div>
            <p className="mb-6 text-white/65">Contract verification, explorer pages, liquidity data, social proofs, descriptions, logos, screenshots, tokenomics, audit links, and launch claims organized into one listing room.</p>
            <ArrowButton light onClick={() => setPage("contact")}>Prepare my pack</ArrowButton>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
function LaunchPage() {
  return (
    <PageShell title="A launch sequence that makes the market take you seriously." kicker="Launch System">
      <div className="mt-14 grid gap-3">
        {launchSteps.map((step, index) => (
          <div key={step} className="launch-row grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-black/5 md:grid-cols-[90px_1fr_220px] md:items-center">
            <span className="text-3xl font-medium text-black/30">{String(index + 1).padStart(2, "0")}</span>
            <p className="text-xl font-medium text-black">{step}</p>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F5F5F5] px-4 py-2 text-sm font-medium text-black/60">
              <ClipboardCheck className="h-4 w-4" />
              Launch task
            </span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function GrowthPage() {
  return (
    <PageShell title="Listings open the door. Growth keeps people walking in." kicker="Growth Desk">
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {serviceCards.map((service) => {
          const Icon = service.icon;
          return (
            <article key={service.title} className="service-tile min-h-80 rounded-2xl bg-white p-7 ring-1 ring-black/5">
              <Icon className="mb-10 h-7 w-7 text-black" />
              <h2 className="text-2xl font-medium leading-tight text-black" style={{ letterSpacing: "-0.02em" }}>
                {service.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-black/60">{service.copy}</p>
            </article>
          );
        })}
      </div>
      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          [Users, "Community ops", "Moderation, raids, ambassador tasks, Telegram growth, and launch week support."],
          [LineChart, "Momentum reporting", "Daily visibility, platform progress, campaign tasks, and next-step dashboards."],
          [Handshake, "Partner outreach", "Warm pitch assets for exchanges, tools, media, and ecosystem partners."],
        ].map(([Icon, title, copy]) => {
          const TypedIcon = Icon as typeof Users;
          return (
            <div key={title as string} className="rounded-2xl bg-[#2B2644] p-7 text-white">
              <TypedIcon className="h-6 w-6" />
              <h3 className="mt-10 text-2xl font-medium">{title as string}</h3>
              <p className="mt-4 text-white/60">{copy as string}</p>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}

function PlansPage({ setPage }: { setPage: (page: PageKey) => void }) {
  return (
    <PageShell title="Choose the room for your next launch move." kicker="Plans">
      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {packages.map((item) => (
          <article key={item.name} className={`plan-tile rounded-2xl p-7 ring-1 ${item.featured ? "bg-black text-white ring-black" : "bg-white text-black ring-black/5"}`}>
            <div className="flex items-center justify-between gap-4">
              <span className={`rounded-full px-4 py-2 text-sm font-medium ${item.featured ? "bg-white text-black" : "bg-[#F5F5F5] text-black/60"}`}>{item.label}</span>
              {item.featured && <TrendingUp className="h-5 w-5" />}
            </div>
            <h2 className="mt-10 text-3xl font-medium">{item.name}</h2>
            <p className={`mt-4 min-h-14 text-base leading-relaxed ${item.featured ? "text-white/65" : "text-black/60"}`}>{item.copy}</p>
            <div className="mt-9 space-y-4">
              {item.features.map((feature) => (
                <p key={feature} className="flex items-center gap-3 text-sm font-medium">
                  <Check className="h-4 w-4" />
                  {feature}
                </p>
              ))}
            </div>
            <div className="mt-10">
              <ArrowButton light={item.featured} onClick={() => setPage("contact")}>Start plan</ArrowButton>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {faqs.map(([q, a]) => (
          <details key={q} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium">
              {q}
            </summary>
            <p className="mt-4 text-black/60">{a}</p>
          </details>
        ))}
      </div>
    </PageShell>
  );
}


function EcosystemPage({ setPage }: { setPage: (page: PageKey) => void }) {
  return (
    <PageShell title="A multi-company ecosystem for tokens that need more than a listing form." kicker="Ecosystem">
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {ecosystemTracks.map(([Icon, title, copy]) => {
          const TypedIcon = Icon as typeof Globe2;
          return (
            <article key={title as string} className="service-tile min-h-80 rounded-2xl bg-white p-7 ring-1 ring-black/5">
              <TypedIcon className="mb-10 h-7 w-7 text-black" />
              <h2 className="text-2xl font-medium leading-tight text-black" style={{ letterSpacing: "-0.02em" }}>{title as string}</h2>
              <p className="mt-4 text-base leading-relaxed text-black/60">{copy as string}</p>
            </article>
          );
        })}
      </div>
      <div className="mt-16 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl bg-black p-8 text-white md:p-12">
          <h2 className="text-4xl font-medium leading-tight md:text-5xl" style={{ letterSpacing: "-0.03em" }}>One operating layer across launch, listings, growth, community, and capital.</h2>
          <p className="mt-6 max-w-2xl text-white/65">LaunchLayer works like a connected company group: strategy desk, listing desk, growth desk, community desk, event desk, and funding desk working from the same launch map.</p>
        </div>
        <div className="metric-card flex min-h-80 flex-col justify-between rounded-2xl bg-[#2B2644] p-7">
          <h3 className="whitespace-pre-line text-3xl font-medium leading-tight text-white">Company stack{"\n"}for token teams.</h3>
          <button onClick={() => setPage("partners")} className="inline-flex w-fit items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-medium text-black">Explore partners <ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
    </PageShell>
  );
}

function PartnersPage({ setPage }: { setPage: (page: PageKey) => void }) {
  return (
    <PageShell title="Partner network for launchpads, exchanges, media, analytics, and trust." kicker="Partners">
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {partnerPrograms.map((partner) => (
          <article key={partner.name} className="platform-tile flex min-h-64 flex-col justify-between rounded-2xl bg-white p-7 ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#F5F5F5] px-4 py-2 text-sm font-medium text-black/60">{partner.metric}</span>
              <Handshake className="h-5 w-5 text-black/45" />
            </div>
            <div>
              <h2 className="text-3xl font-medium text-black" style={{ letterSpacing: "-0.03em" }}>{partner.name}</h2>
              <p className="mt-4 text-base leading-relaxed text-black/60">{partner.detail}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-14 rounded-2xl bg-black p-8 text-white md:p-12">
        <div className="grid gap-8 md:grid-cols-[1fr_0.7fr] md:items-center">
          <h2 className="text-4xl font-medium leading-tight md:text-5xl" style={{ letterSpacing: "-0.03em" }}>Partnerships are routed by project stage, chain, category, and launch budget.</h2>
          <ArrowButton light onClick={() => setPage("contact")}>Become a partner</ArrowButton>
        </div>
      </div>
    </PageShell>
  );
}

function EventsPage({ setPage }: { setPage: (page: PageKey) => void }) {
  const events = useBackendContent("event", fallbackEventItems);

  return (
    <PageShell title="Events that turn launches into moments people can follow." kicker="Events">
      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {events.map((event, index) => (
          <article key={event._id ?? event.title} className="launch-row grid min-h-64 gap-5 rounded-2xl bg-white p-7 ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-medium text-black/25">{String(index + 1).padStart(2, "0")}</span>
              <span className="rounded-full bg-[#F5F5F5] px-4 py-2 text-sm font-medium text-black/60">{event.meta ?? event.tag ?? "Event"}</span>
            </div>
            <div>
              <h2 className="text-3xl font-medium text-black" style={{ letterSpacing: "-0.03em" }}>{event.title}</h2>
              <p className="mt-4 text-base leading-relaxed text-black/60">{event.summary}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-14 rounded-2xl bg-[#2B2644] p-8 text-white md:p-12">
        <h2 className="max-w-4xl text-4xl font-medium leading-tight md:text-5xl" style={{ letterSpacing: "-0.03em" }}>We organize AMAs, spaces, launch rooms, demo days, creator challenges, and community activations.</h2>
        <div className="mt-8"><ArrowButton light onClick={() => setPage("contact")}>Plan an event</ArrowButton></div>
      </div>
    </PageShell>
  );
}
function BlogPage() {
  const posts = useBackendContent("blog", fallbackBlogItems);

  return (
    <PageShell title="Research, launch playbooks, listing guides, and market notes." kicker="Blog">
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post._id ?? post.title} className="plan-tile flex min-h-72 flex-col justify-between rounded-2xl bg-white p-7 ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">{post.tag ?? "Launch note"}</span>
              <span className="text-sm font-medium text-black/45">{post.meta ?? "Read"}</span>
            </div>
            <div>
              <h2 className="text-3xl font-medium leading-tight text-black" style={{ letterSpacing: "-0.03em" }}>{post.title}</h2>
              <p className="mt-4 text-base leading-relaxed text-black/55">{post.summary}</p>
            </div>
            <button className="inline-flex w-fit items-center gap-2 text-sm font-medium text-black">Read article <ArrowRight className="h-4 w-4" /></button>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
function FundingPage({ setPage }: { setPage: (page: PageKey) => void }) {
  return (
    <PageShell title="Funding support for launch budgets, grants, investors, and treasury reporting." kicker="Funding">
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {fundingTracks.map(([Icon, title, copy]) => {
          const TypedIcon = Icon as typeof CircleDollarSign;
          return (
            <article key={title as string} className="service-tile min-h-80 rounded-2xl bg-white p-7 ring-1 ring-black/5">
              <TypedIcon className="mb-10 h-7 w-7 text-black" />
              <h2 className="text-2xl font-medium leading-tight text-black" style={{ letterSpacing: "-0.02em" }}>{title as string}</h2>
              <p className="mt-4 text-base leading-relaxed text-black/60">{copy as string}</p>
            </article>
          );
        })}
      </div>
      <div className="mt-16 grid gap-4 lg:grid-cols-[0.9fr_1fr]">
        <div className="rounded-2xl bg-black p-8 text-white md:p-12">
          <p className="text-white/55">Capital desk</p>
          <h2 className="mt-5 text-5xl font-medium leading-none md:text-7xl" style={{ letterSpacing: "-0.05em" }}>$250k+</h2>
          <p className="mt-5 text-white/65">Typical planning range for teams combining liquidity, exchange outreach, creators, PR, and launch operations.</p>
        </div>
        <div className="rounded-2xl bg-white p-8 ring-1 ring-black/5 md:p-12">
          <h2 className="text-4xl font-medium leading-tight" style={{ letterSpacing: "-0.03em" }}>We do not promise investment. We prepare teams to explain traction, spend, and next milestones clearly.</h2>
          <div className="mt-8"><ArrowButton onClick={() => setPage("contact")}>Build funding map</ArrowButton></div>
        </div>
      </div>
    </PageShell>
  );
}

function CommunityPage({ setPage }: { setPage: (page: PageKey) => void }) {
  return (
    <PageShell title="Community systems for holders, creators, moderators, and ambassadors." kicker="Community">
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {[
          [Users, "Moderator desk", "Rules, responses, scam warnings, pinned messages, support flow, and launch-room escalation."],
          [Megaphone, "Creator missions", "Meme briefs, short-form prompts, launch tasks, raid boards, and content calendars."],
          [BadgeCheck, "Holder updates", "Listing progress, proof links, weekly notes, roadmap movement, and transparent launch reporting."],
        ].map(([Icon, title, copy]) => {
          const TypedIcon = Icon as typeof Users;
          return (
            <article key={title as string} className="service-tile min-h-80 rounded-2xl bg-white p-7 ring-1 ring-black/5">
              <TypedIcon className="mb-10 h-7 w-7 text-black" />
              <h2 className="text-2xl font-medium leading-tight text-black" style={{ letterSpacing: "-0.02em" }}>{title as string}</h2>
              <p className="mt-4 text-base leading-relaxed text-black/60">{copy as string}</p>
            </article>
          );
        })}
      </div>
      <div className="mt-14 rounded-2xl bg-[#2B2644] p-8 text-white md:p-12">
        <h2 className="max-w-4xl text-4xl font-medium leading-tight md:text-5xl" style={{ letterSpacing: "-0.03em" }}>Community is not noise. It is the operating system people use to decide if your token is alive.</h2>
        <div className="mt-8"><ArrowButton light onClick={() => setPage("events")}>Organize community event</ArrowButton></div>
      </div>
    </PageShell>
  );
}

function BrandKitPage() {
  return (
    <PageShell title="Brand kit with logos, marks, lockups, and pattern assets." kicker="Brand Kit">
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          ["Primary", "#000000"],
          ["Surface", "#F5F5F5"],
          ["Launch Purple", "#7342E2"],
          ["Signal Green", "#DDFB6D"],
          ["Deep Ink", "#050808"],
          ["Soft Line", "#D9D9D9"],
        ].map(([name, color]) => (
          <div key={name} className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
            <div className="h-20 rounded-xl ring-1 ring-black/5" style={{ background: color }} />
            <p className="mt-4 text-sm font-medium text-black">{name}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-black/45">{color}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {brandAssets.map((asset) => {
          const svg = buildLogoSvg(asset);
          const fileBase = `launchlayer-${asset.name.toLowerCase().replace(/\s+/g, "-")}`;
          return (
            <article key={asset.name} className="brand-asset-card rounded-3xl bg-white p-4 ring-1 ring-black/5">
              <div className="brand-asset-preview overflow-hidden rounded-2xl bg-[#F5F5F5] ring-1 ring-black/5">
                <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} alt={`${asset.name} preview`} />
              </div>
              <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-medium text-black" style={{ letterSpacing: "-0.03em" }}>{asset.name}</h2>
                  <p className="mt-1 text-sm text-black/55">{asset.type}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => downloadTextFile(`${fileBase}.svg`, svg)} className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white">SVG</button>
                  <button onClick={() => downloadPng(`${fileBase}.png`, svg)} className="rounded-full bg-[#F5F5F5] px-5 py-3 text-sm font-medium text-black ring-1 ring-black/10">PNG</button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-12 rounded-3xl bg-black p-8 text-white md:p-12">
        <h2 className="max-w-4xl text-4xl font-medium leading-tight md:text-5xl" style={{ letterSpacing: "-0.03em" }}>Use the primary black lockup on light surfaces. Use the white lockup on exchange decks, event visuals, and dark launch rooms.</h2>
        <p className="mt-6 max-w-2xl text-white/60">Keep clear space around the mark, avoid stretching the wordmark, and use the pattern tile only as a background texture.</p>
      </div>
    </PageShell>
  );
}

function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const isPrivacy = kind === "privacy";
  const sections = isPrivacy
    ? [
        ["Information we collect", "We may collect project names, contact details, Telegram or email handles, chain information, contract status, launch goals, submitted documents, and messages sent through LaunchLayer forms."],
        ["How we use information", "We use information to prepare launch maps, listing packs, partner routing, community plans, event proposals, funding materials, support responses, and internal service reporting."],
        ["Project materials", "Token documents, decks, logos, screenshots, contract links, launch dates, and campaign notes are used only to provide requested launch support unless you approve public use."],
        ["Sharing with partners", "When needed, we may share relevant project information with listing platforms, launchpads, media partners, auditors, KYC vendors, market makers, event partners, or exchange contacts for requested work."],
        ["Retention and security", "We keep working records for operational continuity and use reasonable safeguards to protect project information. No internet service can guarantee absolute security."],
        ["Your choices", "You can ask us to update, correct, or delete submitted contact details and non-essential project materials by contacting LaunchLayer."],
      ]
    : [
        ["Independent support", "LaunchLayer is an independent launch support company. We prepare strategy, assets, submissions, outreach, events, community systems, and funding materials."],
        ["No approval guarantees", "Third-party approvals from exchanges, listing sites, launchpads, media partners, grant programs, investors, or other platforms are never guaranteed."],
        ["Client responsibilities", "Teams are responsible for accurate token information, legal compliance, contract safety, disclosures, liquidity claims, ownership details, and any regulatory obligations."],
        ["Use of materials", "Deliverables are provided for project launch operations. You should review all copy, claims, tokenomics, and public materials before publishing or submitting them."],
        ["Payments and scope", "Service scope, timelines, fees, revisions, and partner budgets should be confirmed in writing before work begins. Extra requests may require additional budget or schedule changes."],
        ["Limitation", "LaunchLayer is not a law firm, financial advisor, broker, exchange, or investment platform. Information on this site is operational and educational, not legal or financial advice."],
      ];

  return (
    <PageShell title={isPrivacy ? "Privacy Policy" : "Terms of Use"} kicker="Legal">
      <div className="mt-10 grid gap-4 lg:grid-cols-[0.72fr_1fr]">
        <div className="rounded-3xl bg-black p-8 text-white md:p-10">
          <p className="text-sm uppercase tracking-[0.22em] text-white/45">© 2026 LaunchLayer</p>
          <h2 className="mt-6 text-4xl font-medium leading-tight md:text-5xl" style={{ letterSpacing: "-0.04em" }}>
            {isPrivacy ? "How we handle launch information." : "Rules for using LaunchLayer services."}
          </h2>
          <p className="mt-6 text-white/62">
            Independent launch support company. Third-party platform approvals are never guaranteed.
          </p>
        </div>
        <div className="grid gap-3">
          {sections.map(([title, copy]) => (
            <article key={title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
              <h3 className="text-xl font-medium text-black">{title}</h3>
              <p className="mt-3 leading-7 text-black/62">{copy}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="mt-8 rounded-2xl bg-white p-6 text-sm leading-7 text-black/55 ring-1 ring-black/5">
        Last updated: July 30, 2026. For questions, use the contact page and include your project name when relevant.
      </div>
    </PageShell>
  );
}
function ContactPage() {
  const [booking, setBooking] = useState({
    projectName: "",
    contact: "",
    chainStatus: "",
    mainGoal: "",
    message: "",
  });
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const updateBooking = (field: keyof typeof booking, value: string) => {
    setBooking((current) => ({ ...current, [field]: value }));
  };

  const submitBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBookingStatus("loading");

    try {
      if (!backendHttpUrl) throw new Error("Backend URL is not configured");
      const response = await fetch(`${backendHttpUrl}/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      if (!response.ok) throw new Error("Booking request failed");
      setBooking({ projectName: "", contact: "", chainStatus: "", mainGoal: "", message: "" });
      setBookingStatus("success");
    } catch {
      setBookingStatus("error");
    }
  };

  return (
    <PageShell title="Bring your token. We bring the launch machine." kicker="Contact">
      <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div className="rounded-2xl bg-black p-8 text-white md:p-12">
          <h2 className="text-4xl font-medium leading-tight md:text-5xl" style={{ letterSpacing: "-0.03em" }}>
            Your first launch map can be ready fast.
          </h2>
          <p className="mt-6 max-w-xl text-white/65">
            Send the chain, contract status, target platforms, launch date, budget range, and socials. We turn it into a practical listing and growth plan.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {[
              [CircleDollarSign, "Budget route"],
              [Target, "Platform fit"],
              [BarChart3, "Market plan"],
              [BadgeCheck, "Trust kit"],
            ].map(([Icon, label]) => {
              const TypedIcon = Icon as typeof Target;
              return (
                <div key={label as string} className="rounded-2xl bg-white/10 p-5">
                  <TypedIcon className="h-5 w-5" />
                  <p className="mt-8 text-lg font-medium">{label as string}</p>
                </div>
              );
            })}
          </div>
        </div>
        <form className="grid content-start gap-4 rounded-2xl bg-white p-6 ring-1 ring-black/5" onSubmit={submitBooking}>
          <input required value={booking.projectName} onChange={(event) => updateBooking("projectName", event.target.value)} className="h-14 rounded-full bg-[#F5F5F5] px-5 text-base font-medium text-black outline-none" placeholder="Project name" />
          <input required value={booking.contact} onChange={(event) => updateBooking("contact", event.target.value)} className="h-14 rounded-full bg-[#F5F5F5] px-5 text-base font-medium text-black outline-none" placeholder="Telegram or email" />
          <input required value={booking.chainStatus} onChange={(event) => updateBooking("chainStatus", event.target.value)} className="h-14 rounded-full bg-[#F5F5F5] px-5 text-base font-medium text-black outline-none" placeholder="Chain and contract status" />
          <select required className="h-14 rounded-full bg-[#F5F5F5] px-5 text-base font-medium text-black outline-none" value={booking.mainGoal} onChange={(event) => updateBooking("mainGoal", event.target.value)}>
            <option value="" disabled>
              Main goal
            </option>
            <option>DEX launch</option>
            <option>CoinMarketCap / CoinGecko</option>
            <option>Meme platform visibility</option>
            <option>CEX outreach</option>
          </select>
          <textarea required value={booking.message} onChange={(event) => updateBooking("message", event.target.value)} className="min-h-36 rounded-3xl bg-[#F5F5F5] p-5 text-base font-medium text-black outline-none" placeholder="Tell us what you want launched" />
          <button disabled={bookingStatus === "loading"} className="inline-flex items-center justify-center gap-3 rounded-full bg-black px-7 py-4 text-base font-medium text-white transition-colors duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-black/50">
            {bookingStatus === "loading" ? "Sending launch map" : "Request launch map"}
            <ArrowRight className="h-5 w-5" />
          </button>
          {bookingStatus === "success" && <p className="rounded-2xl bg-[#DDFB6D] px-5 py-4 text-sm font-medium text-black">Booking received. LaunchLayer can now review this from the backend.</p>}
          {bookingStatus === "error" && <p className="rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-700">Could not submit right now. Check the backend URL or Convex deployment.</p>}
        </form>
      </div>
    </PageShell>
  );
}
function AdminPage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [login, setLogin] = useState({ email: "sonishriyash@gmail.com", password: "" });
  const [adminToken, setAdminToken] = useState(() => window.sessionStorage.getItem("launchlayer-admin-token") ?? "");
  const [adminEmail, setAdminEmail] = useState(() => window.sessionStorage.getItem("launchlayer-admin-email") ?? "sonishriyash@gmail.com");
  const [loginStatus, setLoginStatus] = useState<"idle" | "loading" | "error">("idle");
  const [postStatus, setPostStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [uploadStatus, setUploadStatus] = useState("");
  const [activeType, setActiveType] = useState<BackendContentType>("blog");
  const [viewMode, setViewMode] = useState<"overview" | "library" | "studio" | "preview">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "live" | "draft">("all");
  const [items, setItems] = useState<BackendContentItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState({
    type: "blog" as BackendContentType,
    title: "",
    summary: "",
    tag: "Listings",
    meta: "6 min read",
    href: "",
    published: true,
    impressions: "0",
    clicks: "0",
    leads: "0",
    coverImageStorageId: "",
    coverImageName: "",
    coverImagePreview: "",
    documentStorageId: "",
    documentName: "",
    documentType: "",
  });

  const modules: Array<{ type: BackendContentType; label: string; desc: string; metric: string }> = [
    { type: "blog", label: "Blog Studio", desc: "Articles, guides, covers, docs", metric: "SEO desk" },
    { type: "event", label: "Events", desc: "AMAs, spaces, demo days", metric: "Calendar" },
    { type: "partner", label: "Partners", desc: "Launchpads, media, CEX routes", metric: "Network" },
    { type: "token", label: "Tokens", desc: "Client tokens and launch rooms", metric: "Pipeline" },
    { type: "listing", label: "Listings", desc: "CMC, CG, DEX tools routes", metric: "Routes" },
    { type: "work", label: "Past Work", desc: "Case studies and proof cards", metric: "Proof" },
  ];

  const activeModule = modules.find((module) => module.type === activeType) ?? modules[0];
  const filteredItems = items.filter((item) => {
    const matchesSearch = `${item.title} ${item.summary} ${item.tag ?? ""} ${item.meta ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || (statusFilter === "live" ? item.published : !item.published);
    return matchesSearch && matchesStatus;
  });
  const totals = {
    items: items.length,
    impressions: items.reduce((sum, item) => sum + Number(item.impressions ?? 0), 0),
    clicks: items.reduce((sum, item) => sum + Number(item.clicks ?? 0), 0),
    leads: items.reduce((sum, item) => sum + Number(item.leads ?? 0), 0),
  };

  const blankDraft = (type: BackendContentType) => ({
    type,
    title: "",
    summary: "",
    tag: type === "blog" ? "Listings" : type === "event" ? "Launch event" : type === "partner" ? "Partner" : type === "token" ? "Token" : type === "work" ? "Case study" : "Listing route",
    meta: type === "blog" ? "6 min read" : type === "event" ? "Upcoming" : "Active",
    href: "",
    published: true,
    impressions: "0",
    clicks: "0",
    leads: "0",
    coverImageStorageId: "",
    coverImageName: "",
    coverImagePreview: "",
    documentStorageId: "",
    documentName: "",
    documentType: "",
  });

  const loadAdminItems = async (type = activeType) => {
    if (!backendHttpUrl || !adminToken) return;
    const response = await fetch(`${backendHttpUrl}/admin/content?type=${type}`, {
      headers: { "x-launchlayer-admin-key": adminToken },
    });
    if (!response.ok) return;
    const data = await response.json();
    setItems(data.items ?? []);
  };

  useEffect(() => {
    if (adminToken) void loadAdminItems(activeType);
  }, [adminToken, activeType]);

  const updateDraft = (field: keyof typeof draft, value: string | boolean) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const switchModule = (type: BackendContentType) => {
    setActiveType(type);
    setSelectedId("");
    setSearchTerm("");
    setStatusFilter("all");
    setDraft(blankDraft(type));
    if (editorRef.current) editorRef.current.innerHTML = "";
  };

  const selectItem = (item: BackendContentItem) => {
    setSelectedId(item._id ?? "");
    setDraft({
      type: item.type ?? activeType,
      title: item.title,
      summary: item.summary,
      tag: item.tag ?? "",
      meta: item.meta ?? "",
      href: item.href ?? "",
      published: Boolean(item.published ?? true),
      impressions: String(item.impressions ?? 0),
      clicks: String(item.clicks ?? 0),
      leads: String(item.leads ?? 0),
      coverImageStorageId: item.coverImageStorageId ?? "",
      coverImageName: item.coverImageName ?? "",
      coverImagePreview: item.coverImageUrl ?? "",
      documentStorageId: item.documentStorageId ?? "",
      documentName: item.documentName ?? "",
      documentType: item.documentType ?? "",
    });
    if (editorRef.current) editorRef.current.innerHTML = item.body ?? "";
  };

  const loginAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginStatus("loading");
    try {
      if (!backendHttpUrl) throw new Error("Backend URL is not configured");
      const response = await fetch(`${backendHttpUrl}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });
      if (!response.ok) throw new Error("Invalid login");
      const data = await response.json();
      window.sessionStorage.setItem("launchlayer-admin-token", data.token);
      window.sessionStorage.setItem("launchlayer-admin-email", data.email);
      setAdminToken(data.token);
      setAdminEmail(data.email);
      setLoginStatus("idle");
    } catch {
      setLoginStatus("error");
    }
  };

  const runCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  };

  const uploadFile = async (file: File, target: "cover" | "document") => {
    if (!backendHttpUrl || !adminToken) return;
    setUploadStatus(`Uploading ${file.name}`);
    const uploadUrlResponse = await fetch(`${backendHttpUrl}/admin/upload-url`, {
      method: "POST",
      headers: { "x-launchlayer-admin-key": adminToken },
    });
    if (!uploadUrlResponse.ok) throw new Error("Could not create upload URL");
    const { uploadUrl } = await uploadUrlResponse.json();
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!uploadResponse.ok) throw new Error("Upload failed");
    const { storageId } = await uploadResponse.json();
    if (target === "cover") {
      updateDraft("coverImageStorageId", storageId);
      updateDraft("coverImageName", file.name);
      updateDraft("coverImagePreview", URL.createObjectURL(file));
    } else {
      updateDraft("documentStorageId", storageId);
      updateDraft("documentName", file.name);
      updateDraft("documentType", file.type || "document");
    }
    setUploadStatus(`${file.name} uploaded`);
  };

  const publishContent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPostStatus("loading");
    try {
      if (!backendHttpUrl || !adminToken) throw new Error("Admin login required");
      const body = editorRef.current?.innerHTML ?? "";
      const response = await fetch(`${backendHttpUrl}/admin/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-launchlayer-admin-key": adminToken },
        body: JSON.stringify({
          id: selectedId || undefined,
          type: draft.type,
          title: draft.title,
          summary: draft.summary,
          tag: draft.tag,
          meta: draft.meta,
          href: draft.href,
          body,
          contentFormat: "rich-html",
          coverImageStorageId: draft.coverImageStorageId || undefined,
          coverImageName: draft.coverImageName || undefined,
          documentStorageId: draft.documentStorageId || undefined,
          documentName: draft.documentName || undefined,
          documentType: draft.documentType || undefined,
          authorEmail: adminEmail,
          impressions: Number(draft.impressions) || 0,
          clicks: Number(draft.clicks) || 0,
          leads: Number(draft.leads) || 0,
          published: draft.published,
        }),
      });
      if (!response.ok) throw new Error("Publish failed");
      setPostStatus("success");
      await loadAdminItems(activeType);
      setSelectedId("");
      setDraft(blankDraft(activeType));
      if (editorRef.current) editorRef.current.innerHTML = "";
    } catch {
      setPostStatus("error");
    }
  };


  const deleteSelected = async () => {
    if (!backendHttpUrl || !adminToken || !selectedId) return;
    await fetch(`${backendHttpUrl}/admin/content/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-launchlayer-admin-key": adminToken },
      body: JSON.stringify({ id: selectedId }),
    });
    setSelectedId("");
    setDraft(blankDraft(activeType));
    if (editorRef.current) editorRef.current.innerHTML = "";
    await loadAdminItems(activeType);
  };

  const clearAllContent = async () => {
    if (!backendHttpUrl || !adminToken) return;
    await fetch(`${backendHttpUrl}/admin/content/clear`, {
      method: "POST",
      headers: { "x-launchlayer-admin-key": adminToken },
    });
    setItems([]);
    setSelectedId("");
    setDraft(blankDraft(activeType));
    if (editorRef.current) editorRef.current.innerHTML = "";
  };
  if (!adminToken) {
    return (
      <PageShell title="Admin portal for LaunchLayer operations." kicker="Admin">
        <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_0.7fr]">
          <div className="rounded-3xl bg-black p-8 text-white md:p-12">
            <p className="text-sm uppercase tracking-[0.24em] text-white/40">Private command room</p>
            <h2 className="mt-8 max-w-2xl text-5xl font-medium leading-none md:text-7xl" style={{ letterSpacing: "-0.05em" }}>Control content, events, tokens, partners, and proof.</h2>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {["Blog CMS", "Event ops", "Token desk"].map((label) => <div key={label} className="rounded-2xl bg-white/10 p-5 text-sm font-medium">{label}</div>)}
            </div>
          </div>
          <form onSubmit={loginAdmin} className="rounded-3xl bg-white p-7 ring-1 ring-black/5">
            <p className="text-sm font-medium text-black/50">Only sonishriyash@gmail.com can access this portal.</p>
            <input value={login.email} onChange={(event) => setLogin((current) => ({ ...current, email: event.target.value }))} className="mt-6 h-14 w-full rounded-full bg-[#F5F5F5] px-5 text-base font-medium text-black outline-none" placeholder="Admin email" />
            <input type="password" value={login.password} onChange={(event) => setLogin((current) => ({ ...current, password: event.target.value }))} className="mt-4 h-14 w-full rounded-full bg-[#F5F5F5] px-5 text-base font-medium text-black outline-none" placeholder="Admin password" />
            <button className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-black px-7 py-4 text-base font-medium text-white">{loginStatus === "loading" ? "Checking access" : "Login"}</button>
            {loginStatus === "error" && <p className="mt-4 rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-700">Wrong admin email or password.</p>}
          </form>
        </div>
      </PageShell>
    );
  }

  return (
    <section className="min-h-screen bg-[#F5F5F5] px-4 pb-20 pt-28 md:px-6">
      <div className="mx-auto max-w-[94rem]">
        <div className="grid gap-5 xl:grid-cols-[18rem_1fr]">
          <aside className="rounded-3xl bg-black p-5 text-white xl:sticky xl:top-28 xl:h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between gap-3">
              <LogoIcon className="h-8 w-8" />
              <button type="button" onClick={() => { window.sessionStorage.removeItem("launchlayer-admin-token"); window.sessionStorage.removeItem("launchlayer-admin-email"); setAdminToken(""); }} className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium">Logout</button>
            </div>
            <h1 className="mt-8 text-3xl font-medium leading-tight" style={{ letterSpacing: "-0.04em" }}>LaunchLayer admin.</h1>
            <p className="mt-3 text-sm leading-6 text-white/50">Manage posts, event rooms, partner ecosystem, listed tokens, and previous work proof.</p>
            <nav className="mt-8 grid gap-2">
              {modules.map((module) => (
                <button key={module.type} type="button" onClick={() => switchModule(module.type)} className={`rounded-2xl p-4 text-left transition ${activeType === module.type ? "bg-white text-black" : "bg-white/8 text-white hover:bg-white/12"}`}>
                  <span className="block text-sm font-semibold">{module.label}</span>
                  <span className={`mt-1 block text-xs ${activeType === module.type ? "text-black/55" : "text-white/45"}`}>{module.desc}</span>
                </button>
              ))}
            </nav>
          </aside>

          <div className="grid gap-5">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-black/5 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-end">
                <div>
                  <p className="text-sm font-medium text-black/45">Logged in as {adminEmail}</p>
                  <h2 className="mt-3 text-5xl font-medium leading-none text-black md:text-7xl" style={{ letterSpacing: "-0.05em" }}>{activeModule.label}</h2>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-black/55">Open the section, list every item, track visibility numbers, edit content, upload covers and documents, then publish to the live LaunchLayer website.</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {(["overview", "library", "studio", "preview"] as const).map((mode) => (
                      <button key={mode} type="button" onClick={() => setViewMode(mode)} className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${viewMode === mode ? "bg-black text-white" : "bg-[#F5F5F5] text-black/60"}`}>{mode}</button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[["Items", totals.items], ["Impressions", totals.impressions], ["Clicks", totals.clicks], ["Leads", totals.leads]].map(([label, value]) => (
                    <div key={label as string} className="rounded-2xl bg-[#F5F5F5] p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35">{label as string}</p>
                      <p className="mt-4 text-3xl font-medium text-black">{Number(value).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
              <section className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-medium text-black">{activeModule.metric} list</h3>
                    <p className="mt-1 text-sm text-black/45">Select any item to edit it.</p>
                  </div>
                  <div className="flex gap-2">
                    {selectedId && <button type="button" onClick={deleteSelected} className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700">Delete</button>}
                    <button type="button" onClick={() => { setSelectedId(""); setDraft(blankDraft(activeType)); if (editorRef.current) editorRef.current.innerHTML = ""; }} className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">New</button>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_9rem]">
                  <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="h-12 rounded-full bg-[#F5F5F5] px-5 text-sm font-medium text-black outline-none" placeholder="Search real records" />
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | "live" | "draft")} className="h-12 rounded-full bg-[#F5F5F5] px-4 text-sm font-medium text-black outline-none">
                    <option value="all">All</option>
                    <option value="live">Live</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="mt-5 grid max-h-[48rem] gap-3 overflow-auto pr-1">
                  {filteredItems.length === 0 && <div className="rounded-2xl bg-[#F5F5F5] p-6 text-sm font-medium text-black/50">No real {activeModule.label.toLowerCase()} records found. Create the first one from the studio.</div>}
                  {filteredItems.map((item) => (
                    <button key={item._id ?? item.title} type="button" onClick={() => selectItem(item)} className={`grid gap-3 rounded-2xl p-4 text-left ring-1 transition ${selectedId === item._id ? "bg-black text-white ring-black" : "bg-[#F5F5F5] text-black ring-black/5 hover:bg-white"}`}>
                      {item.coverImageUrl && <img src={item.coverImageUrl} alt="" className="aspect-[5/2] w-full rounded-xl object-cover" />}
                      <div className="flex items-center justify-between gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${selectedId === item._id ? "bg-white text-black" : "bg-white text-black/60"}`}>{item.published ? "Live" : "Draft"}</span>
                        <span className="text-xs opacity-55">{item.meta ?? item.tag ?? activeModule.metric}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium leading-tight">{item.title}</h4>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 opacity-60">{item.summary}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <span>{Number(item.impressions ?? 0).toLocaleString()} imp</span>
                        <span>{Number(item.clicks ?? 0).toLocaleString()} clicks</span>
                        <span>{Number(item.leads ?? 0).toLocaleString()} leads</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <form onSubmit={publishContent} className="rounded-3xl bg-white p-5 ring-1 ring-black/5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-medium text-black">{selectedId ? "Edit" : "Create"} {activeModule.label}</h3>
                    <p className="mt-1 text-sm text-black/45">Rich content, media bucket, document upload, metrics, publish control.</p>
                  </div>
                  <label className="flex items-center gap-3 rounded-full bg-[#F5F5F5] px-5 py-3 text-sm font-medium text-black">
                    <input type="checkbox" checked={draft.published} onChange={(event) => updateDraft("published", event.target.checked)} />
                    Publish
                  </label>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <input required value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} className="h-14 rounded-full bg-[#F5F5F5] px-5 text-base font-medium text-black outline-none" placeholder={`${activeModule.label} title`} />
                  <input value={draft.href} onChange={(event) => updateDraft("href", event.target.value)} className="h-14 rounded-full bg-[#F5F5F5] px-5 text-base font-medium text-black outline-none" placeholder="External URL / partner link" />
                  <textarea required value={draft.summary} onChange={(event) => updateDraft("summary", event.target.value)} className="min-h-28 rounded-3xl bg-[#F5F5F5] p-5 text-base font-medium text-black outline-none lg:col-span-2" placeholder="Summary / excerpt / event details" />
                  <input value={draft.tag} onChange={(event) => updateDraft("tag", event.target.value)} className="h-14 rounded-full bg-[#F5F5F5] px-5 text-base font-medium text-black outline-none" placeholder="Category, chain, partner type" />
                  <input value={draft.meta} onChange={(event) => updateDraft("meta", event.target.value)} className="h-14 rounded-full bg-[#F5F5F5] px-5 text-base font-medium text-black outline-none" placeholder="Date, read time, stage, status" />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <input value={draft.impressions} onChange={(event) => updateDraft("impressions", event.target.value)} className="h-14 rounded-full bg-[#F5F5F5] px-5 text-base font-medium text-black outline-none" placeholder="Impressions" />
                  <input value={draft.clicks} onChange={(event) => updateDraft("clicks", event.target.value)} className="h-14 rounded-full bg-[#F5F5F5] px-5 text-base font-medium text-black outline-none" placeholder="Clicks" />
                  <input value={draft.leads} onChange={(event) => updateDraft("leads", event.target.value)} className="h-14 rounded-full bg-[#F5F5F5] px-5 text-base font-medium text-black outline-none" placeholder="Leads" />
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <label className="rounded-3xl border border-dashed border-black/15 bg-[#F5F5F5] p-5 text-sm font-medium text-black/60">
                    Cover image, high resolution
                    <input type="file" accept="image/*" className="mt-3 block w-full text-sm" onChange={(event) => event.target.files?.[0] && uploadFile(event.target.files[0], "cover")} />
                  </label>
                  <label className="rounded-3xl border border-dashed border-black/15 bg-[#F5F5F5] p-5 text-sm font-medium text-black/60">
                    Attach Word, Google Docs export, PDF, deck, or notes
                    <input type="file" accept=".doc,.docx,.pdf,.rtf,.txt,.md,.ppt,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="mt-3 block w-full text-sm" onChange={(event) => event.target.files?.[0] && uploadFile(event.target.files[0], "document")} />
                  </label>
                </div>
                {(draft.coverImagePreview || draft.documentName || uploadStatus) && (
                  <div className="mt-4 grid gap-3 lg:grid-cols-[0.85fr_1fr]">
                    {draft.coverImagePreview && <img src={draft.coverImagePreview} alt="Cover preview" className="aspect-video w-full rounded-2xl object-cover" />}
                    <div className="grid content-start gap-3">
                      {draft.documentName && <p className="rounded-2xl bg-[#DDFB6D] px-5 py-4 text-sm font-medium text-black">Attached: {draft.documentName}</p>}
                      {uploadStatus && <p className="rounded-2xl bg-[#F5F5F5] px-5 py-4 text-sm font-medium text-black/55">{uploadStatus}</p>}
                    </div>
                  </div>
                )}

                <div className="mt-5 rounded-3xl bg-[#F5F5F5] p-3">
                  <div className="flex flex-wrap gap-2 border-b border-black/10 p-2 pb-4">
                    <button type="button" onClick={() => runCommand("bold")} className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">B</button>
                    <button type="button" onClick={() => runCommand("italic")} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">I</button>
                    <button type="button" onClick={() => runCommand("underline")} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">U</button>
                    <button type="button" onClick={() => runCommand("formatBlock", "H2")} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">H2</button>
                    <button type="button" onClick={() => runCommand("formatBlock", "H3")} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">H3</button>
                    <button type="button" onClick={() => runCommand("formatBlock", "P")} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">P</button>
                    <button type="button" onClick={() => runCommand("insertUnorderedList")} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">List</button>
                    <button type="button" onClick={() => runCommand("insertOrderedList")} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">1. List</button>
                    <button type="button" onClick={() => runCommand("justifyLeft")} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">Left</button>
                    <button type="button" onClick={() => runCommand("justifyCenter")} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">Center</button>
                    <select onChange={(event) => runCommand("fontName", event.target.value)} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black outline-none" defaultValue="">
                      <option value="" disabled>Font</option>
                      <option value="Arial">Arial</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Times New Roman">Times</option>
                      <option value="Courier New">Courier</option>
                    </select>
                    <input type="color" title="Text color" onChange={(event) => runCommand("foreColor", event.target.value)} className="h-10 w-12 rounded-full" />
                  </div>
                  <div ref={editorRef} contentEditable suppressContentEditableWarning className="admin-editor min-h-[32rem] rounded-3xl p-6 text-lg leading-8 text-black outline-none" />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <button disabled={postStatus === "loading"} className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-black px-7 py-4 text-base font-medium text-white disabled:bg-black/50">
                    {postStatus === "loading" ? "Saving" : selectedId ? "Save changes" : "Publish to LaunchLayer"}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={clearAllContent} className="rounded-full bg-red-50 px-6 py-4 text-sm font-medium text-red-700">Clear all fake/demo data</button>
                </div>
                {postStatus === "success" && <p className="mt-4 rounded-2xl bg-[#DDFB6D] px-5 py-4 text-sm font-medium text-black">Saved. This section is now updated in Convex.</p>}
                {postStatus === "error" && <p className="mt-4 rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-700">Could not save. Check login, required fields, or backend deploy.</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function Footer({ setPage }: { setPage: (page: PageKey) => void }) {
  const linkGroups = [
    [
      ["Company", "ecosystem"],
      ["Launch System", "launch"],
      ["Listings", "listings"],
      ["Growth Desk", "growth"],
      ["Funding", "funding"],
    ],
    [
      ["Partners", "partners"],
      ["Events", "events"],
      ["Community", "community"],
      ["Plans", "plans"],
      ["Contact Us", "contact"],
    ],
    [
      ["Blog", "blog"],
      ["Launch Guides", "blog"],
      ["Partner Network", "partners"],
      ["Book Launch", "contact"],
    ],
  ] as const;

  return (
    <footer className="site-footer">
      <div className="footer-dots" aria-hidden="true">
        <div className="footer-dots__line" />
      </div>
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <h2>Proven token launch infrastructure for listings, communities, partners, events, and funding routes.</h2>
          {linkGroups.map((group, index) => (
            <nav key={index} className="site-footer__nav" aria-label={`Footer links ${index + 1}`}>
              {group.map(([label, target]) => (
                <button key={label} onClick={() => setPage(target)}>
                  {label}
                </button>
              ))}
            </nav>
          ))}
        </div>
        <div className="site-footer__brand-row">
          <button className="site-footer__brand" onClick={() => setPage("home")} aria-label="LaunchLayer home">
            <LogoIcon className="site-footer__logo" />
            <span>LaunchLayer</span>
          </button>
        </div>
        <div className="site-footer__legal">
          <p>© 2026 LaunchLayer. All rights reserved.</p>
          <button onClick={() => setPage("privacy")}>Privacy Policy</button>
          <button onClick={() => setPage("terms")}>Terms of Use</button>
          <p>Independent launch support company. Third-party platform approvals are never guaranteed.</p>
        </div>
      </div>
    </footer>
  );
}
export default function App() {
  const [page, setPageState] = useState<PageKey>(getInitialPage);

  const pageTitle = useMemo(() => {
    const titles: Record<PageKey, string> = {
      home: "LaunchLayer | Token Launch Company",
      listings: "Listings | LaunchLayer",
      launch: "Launch System | LaunchLayer",
      growth: "Growth Desk | LaunchLayer",
      plans: "Plans | LaunchLayer",
      ecosystem: "Ecosystem | LaunchLayer",
      partners: "Partners | LaunchLayer",
      events: "Events | LaunchLayer",
      blog: "Blog | LaunchLayer",
      funding: "Funding | LaunchLayer",
      community: "Community | LaunchLayer",
      brand: "Brand Kit | LaunchLayer",
      privacy: "Privacy Policy | LaunchLayer",
      terms: "Terms of Use | LaunchLayer",
      admin: "Admin Portal | LaunchLayer",
      contact: "Contact | LaunchLayer",
    };
    return titles[page];
  }, [page]);

  const setPage = (target: PageKey) => {
    setPageState(target);
    window.history.pushState(null, "", `#${target}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  useEffect(() => {
    const onPopState = () => setPageState(getInitialPage());
    window.addEventListener("popstate", onPopState);
    window.addEventListener("hashchange", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("hashchange", onPopState);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-[#F5F5F5]">
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes backers-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { display: flex; width: max-content; animation: marquee 22s linear infinite; }
        .backers-track { display: flex; width: max-content; animation: backers-marquee 30s linear infinite; }
      `}</style>
      <Navbar page={page} setPage={setPage} />
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "listings" && <ListingsPage setPage={setPage} />}
      {page === "launch" && <LaunchPage />}
      {page === "growth" && <GrowthPage />}
      {page === "plans" && <PlansPage setPage={setPage} />}
      {page === "ecosystem" && <EcosystemPage setPage={setPage} />}
      {page === "partners" && <PartnersPage setPage={setPage} />}
      {page === "events" && <EventsPage setPage={setPage} />}
      {page === "blog" && <BlogPage />}
      {page === "funding" && <FundingPage setPage={setPage} />}
      {page === "community" && <CommunityPage setPage={setPage} />}
      {page === "brand" && <BrandKitPage />}
      {page === "privacy" && <LegalPage kind="privacy" />}
      {page === "terms" && <LegalPage kind="terms" />}
      {page === "admin" && <AdminPage />}
      {page === "contact" && <ContactPage />}
      <Footer setPage={setPage} />
    </main>
  );
}

































































