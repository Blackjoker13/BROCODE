"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStorefront } from "@/lib/storefront/StorefrontContext";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { Tilt3DCard } from "@/components/ui/MotionCard";
import Footer from "@/components/sections/Footer";
import { safeJsonParse } from "@/lib/utils";
import {
  Search,
  ArrowLeft,
  X,
  Eye,
  ShoppingBag,
  Layers,
  Check,
  Zap,
  Sparkles,
  Shield,
  Radio,
  SlidersHorizontal,
  Flame,
} from "lucide-react";

// Robust Fallback Products
const FALLBACK_PRODUCTS = [
  {
    id: "p1",
    title: "PINK FLOYD THE DARK SIDE OVERSIZED TEE",
    price: 35.0,
    images: ["/images/pink_floyd_banner.jpg", "/images/sabaton_tee.jpg"],
    badges: ["SIGNATURE", "280 GSM"],
    themeSector: "noir",
    category: { name: "BANDS", slug: "bands" },
    tags: ["bands", "pink floyd", "rock"],
    description: "Luxury heavyweight boxy t-shirt with official licensed Pink Floyd tour artwork.",
    specs: { gsm: "280 GSM", fabric: "100% Combed Cotton", fit: "Boxy Oversized" },
  },
  {
    id: "p2",
    title: "SABATON THE GREAT WAR ACID WASH TEE",
    price: 38.0,
    images: ["/images/sabaton_tee.jpg", "/images/sabbath_tee.jpg"],
    badges: ["HOT", "ACID WASH"],
    themeSector: "cyber",
    category: { name: "ROPA", slug: "ropa" },
    tags: ["ropa", "sabaton", "metal"],
    description: "Charcoal enzyme wash with battle-distressed graphic and ribbed collar.",
    specs: { gsm: "300 GSM", fabric: "Enzyme Washed Cotton", fit: "Drop Shoulder" },
  },
  {
    id: "p3",
    title: "AMON AMARTH VALHALLA HEAVYWEIGHT TANKTOP",
    price: 35.0,
    images: ["/images/amon_tanktop.jpg"],
    badges: ["VALHALLA", "FORGED"],
    themeSector: "ragnarok",
    category: { name: "MODA", slug: "moda" },
    tags: ["moda", "amon amarth", "ragnarok"],
    description: "Ceremonial Norse battle wear with rune backplate and raw cut armholes.",
    specs: { gsm: "260 GSM", fabric: "Ribbed Combed Cotton", fit: "Muscle Cut" },
  },
  {
    id: "p4",
    title: "BLACK SABBATH 1970 WORLD TOUR TEE",
    price: 36.0,
    images: ["/images/sabbath_tee.jpg"],
    badges: ["LIMITED", "ARCHIVE"],
    themeSector: "noir",
    category: { name: "BANDS", slug: "bands" },
    tags: ["bands", "black sabbath", "vintage"],
    description: "Heavyweight vintage screenprint celebrating the pioneers of heavy metal.",
    specs: { gsm: "280 GSM", fabric: "100% Combed Cotton", fit: "Vintage Boxy" },
  },
  {
    id: "p5",
    title: "BDU TACTICAL UTILITY RIPSTOP SHORTS",
    price: 45.0,
    images: ["/images/amon_shorts.jpg"],
    badges: ["HARDWARE", "WATERPROOF"],
    themeSector: "cyber",
    category: { name: "MODA", slug: "moda" },
    tags: ["moda", "tactical", "shorts"],
    description: "6-pocket tactical combat shorts with reinforced nylon webbing and D-ring mounts.",
    specs: { gsm: "320 GSM", fabric: "Ripstop Cotton Blend", fit: "Cargo Regular" },
  },
  {
    id: "p6",
    title: "MODULAR CHEST RIG & TACTICAL HARNESS",
    price: 48.0,
    images: ["/images/tactical_bag.jpg"],
    badges: ["HARDWARE", "CORDURA"],
    themeSector: "cyber",
    category: { name: "ACCESORIOS", slug: "accesorios" },
    tags: ["accesorios", "accessories", "hardware"],
    description: "Mil-spec laser-cut modular harness with detachable pouch system.",
    specs: { gsm: "Cordura 1000D", fabric: "Nylon Webbing", fit: "Adjustable Harness" },
  },
  {
    id: "p7",
    title: "BROCODE STUDIO PALLET MERCH RACK",
    price: 42.0,
    images: ["/images/pallet_rack.jpg"],
    badges: ["STUDIO", "RAW"],
    themeSector: "noir",
    category: { name: "ROPA", slug: "ropa" },
    tags: ["ropa", "studio", "merch"],
    description: "Heavyweight studio apparel curated from our flagship Copenhagen workshop.",
    specs: { gsm: "280 GSM", fabric: "Heavyweight Combed Cotton", fit: "Boxy Fit" },
  },
  {
    id: "p8",
    title: "VALHALLA FOUNDERS SIGNATURE HOODIE",
    price: 68.0,
    images: ["/images/founders.jpg"],
    badges: ["SIGNATURE", "450 GSM"],
    themeSector: "ragnarok",
    category: { name: "MUSICA", slug: "musica" },
    tags: ["musica", "music", "gothic"],
    description: "Heavyweight double-fleece hoodie with embroidered gothic typography.",
    specs: { gsm: "450 GSM", fabric: "Heavy Fleece Cotton", fit: "Oversized Pullover" },
  },
];

export default function CatalogView() {
  const { categories, products, activeTheme, setActiveTheme, addToCart } =
    useStorefront();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("L");
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    setMounted(true);
    const catParam = searchParams.get("category");
    if (catParam) {
      setSelectedCategory(catParam.toLowerCase());
    }
  }, [searchParams]);

  // Master product list
  const allProds = useMemo(() => {
    if (Array.isArray(products) && products.length > 0) {
      return products;
    }
    return FALLBACK_PRODUCTS;
  }, [products]);

  // Categories list dynamically generated from actual active products
  const categoryList = useMemo(() => {
    const counts = {};
    const nameMap = {
      all: "ALL ARCHIVE",
      param: "PARAM",
      ropa: "ROPA",
      bands: "BANDS",
      accesorios: "ACCESORIOS",
      musica: "MUSICA",
      moda: "MODA",
    };

    allProds.forEach((p) => {
      const catKey = (p.category?.slug || p.category?.name || "ropa").toLowerCase();
      counts[catKey] = (counts[catKey] || 0) + 1;
      if (p.category?.name) {
        nameMap[catKey] = p.category.name.toUpperCase();
      }
    });

    const pills = [
      { id: "all", name: "ALL ARCHIVE", count: allProds.length, themeType: "combo" },
    ];

    Object.keys(counts).forEach((k) => {
      let themeType = "noir";
      if (k.includes("access") || k.includes("accesor") || k.includes("tech")) themeType = "cyber";
      else if (k.includes("band") || k.includes("valhalla") || k.includes("relic")) themeType = "ragnarok";

      pills.push({
        id: k,
        name: nameMap[k] || k.toUpperCase(),
        count: counts[k],
        themeType,
      });
    });

    return pills;
  }, [allProds]);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    let result = allProds.filter((p) => {
      // 1. Search Query Filter
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.category?.name && p.category.name.toLowerCase().includes(q)) ||
        (Array.isArray(p.badges) && p.badges.some((b) => b.toLowerCase().includes(q))) ||
        (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q)));

      // 2. Category Filter
      let matchCategory = true;
      if (selectedCategory !== "all") {
        const catName = (p.category?.name || "").toLowerCase();
        const catSlug = (p.category?.slug || "").toLowerCase();
        const pTags = Array.isArray(p.tags) ? p.tags.map((t) => t.toLowerCase()) : [];

        matchCategory =
          catName === selectedCategory ||
          catSlug === selectedCategory ||
          catName.includes(selectedCategory) ||
          selectedCategory.includes(catName) ||
          pTags.includes(selectedCategory);
      }

      return matchSearch && matchCategory;
    });

    // Sort result
    if (sortBy === "price-low") {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === "name") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return result;
  }, [allProds, searchQuery, selectedCategory, sortBy]);

  const handleAdd = (prod, e) => {
    if (e) e.stopPropagation();
    if (addToCart) {
      addToCart(prod, `Size: ${selectedSize}`, 1);
    }
    setAddedId(prod.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0A0D12] text-[#F3F4F6] selection:bg-[#EF0606] selection:text-white">
      {/* Tri-Theme Multi-Spectrum Ambient Background Canvas */}
      <DottedGlowBackground
        theme="cyber"
        className="pointer-events-none fixed inset-0 z-0 opacity-80"
        opacity={0.9}
        gap={20}
        radius={1.4}
      />

      {/* Tri-Theme Multi-Color Atmospheric Glow Orbs */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#EF0606]/15 blur-[120px]" />
      <div className="pointer-events-none fixed top-1/4 -right-40 h-[500px] w-[500px] rounded-full bg-[#CCFF00]/12 blur-[130px]" />
      <div className="pointer-events-none fixed bottom-10 left-1/3 h-[500px] w-[500px] rounded-full bg-[#F59E0B]/12 blur-[140px]" />

      {/* 1. TOP NAVBAR (TRI-THEME COMBO HEADER) */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0A0D12]/90 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          {/* Back to Home Link */}
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-1.5 font-geometric text-[11px] font-black uppercase tracking-wider text-white transition-all hover:border-[#EF0606] hover:bg-[#EF0606]/10 hover:text-[#EF0606]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>BACK TO HOME</span>
          </Link>

          {/* Centered Brand Logo */}
          <Link href="/" className="flex items-center gap-2 select-none py-1 transition-transform duration-300 hover:scale-[1.03]">
            <Image
              src="/images/brocode_logo_v2.png"
              alt="BROCODE."
              width={200}
              height={36}
              priority
              style={{ width: "auto", height: "auto" }}
              className="h-7 sm:h-8 w-auto max-w-[160px] sm:max-w-[200px] object-contain brightness-125 drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]"
            />
          </Link>

          {/* Tri-Theme Status Telemetry Badge */}
          <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[9px] text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
            <span className="text-[#CCFF00]">TRI-THEME</span>
            <span className="opacity-40">|</span>
            <span className="text-[#EF0606]">NOIR</span>
            <span className="opacity-40">•</span>
            <span className="text-[#00F0FF]">CYBER</span>
            <span className="opacity-40">•</span>
            <span className="text-[#F59E0B]">GOTHIC</span>
          </div>
        </div>
      </header>

      {/* 2. TRI-THEME COMBO HERO SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pt-12 pb-8 md:px-10 lg:pt-16">
        {/* Tri-Theme Sector Badges Trio */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Badge 1: Noir Acid Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#EF0606]/40 bg-[#EF0606]/15 px-3 py-1 font-geometric text-[9px] font-black uppercase tracking-[0.2em] text-[#EF0606] shadow-[0_0_15px_rgba(239,6,6,0.2)]">
            <Sparkles className="h-3 w-3" />
            <span>01 NOIR ARCHIVE</span>
          </div>

          {/* Badge 2: Cyber Kinetic Telemetry */}
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#00F0FF]/40 bg-[#00F0FF]/15 px-3 py-1 font-mono text-[9px] font-bold text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Zap className="h-3 w-3 animate-pulse text-[#CCFF00]" />
            <span>0x02 TELEMETRY MATRIX</span>
          </div>

          {/* Badge 3: Gothic Ragnarok Valhalla Runes */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#F59E0B]/40 bg-[#F59E0B]/15 px-3 py-1 font-heading text-[9px] font-bold uppercase tracking-widest text-[#FEF3C7] shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Flame className="h-3 w-3 text-[#F59E0B]" />
            <span>ᚱ 03 VALHALLA VAULT ᚱ</span>
          </div>
        </div>

        {/* Main Tri-Theme Title Composition */}
        <div className="mt-4 flex flex-col md:flex-row md:items-end justify-between border-b pb-8 gap-6 border-white/10">
          <div className="relative">
            {/* Tech Cyber Crosshairs */}
            <div className="text-[9px] font-mono text-[#CCFF00]/60 mb-1">
              ┌ HARDWARE_ID: [0xBROCODE_UNIFIED] // CATALOG_CORE
            </div>

            {/* Hybrid Title Combining Didone, Blackletter & Cyber Monospace */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-none text-white">
              <span className="font-didone text-white drop-shadow-[0_4px_20px_rgba(255,255,255,0.2)]">
                CATEGORIES
              </span>{" "}
              <span className="font-stay text-3xl sm:text-5xl md:text-6xl text-[#EF0606] px-1 font-normal select-none">
                &
              </span>{" "}
              <span className="font-mono text-[#CCFF00] drop-shadow-[0_0_25px_rgba(204,255,0,0.3)]">
                CATALOG
              </span>
            </h1>

            <p className="mt-3 max-w-xl font-sans text-xs md:text-sm text-neutral-300 font-medium leading-relaxed">
              <span className="text-[#EF0606] font-bold">Noir Streetwear Drops</span>,{" "}
              <span className="text-[#00F0FF] font-mono font-bold">High-Density Hardware</span>, and{" "}
              <span className="text-[#F59E0B] font-heading font-bold">Sacred Metalcore Armor</span> — all converged in one unified vault.
            </p>
          </div>

          {/* Tri-Theme Live Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#00F0FF]" />
              <input
                type="text"
                placeholder="Search across all 3 sectors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-[#12161F] py-3 pl-10 pr-8 text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00] transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-2xl border border-white/20 bg-[#12161F] px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-[#CCFF00] cursor-pointer"
            >
              <option value="featured" className="bg-[#0A0D12] text-white">★ Featured Drops</option>
              <option value="price-low" className="bg-[#0A0D12] text-white">₹ Price: Low to High</option>
              <option value="price-high" className="bg-[#0A0D12] text-white">₹ Price: High to Low</option>
              <option value="name" className="bg-[#0A0D12] text-white">A-Z Alphabetical</option>
            </select>
          </div>
        </div>

        {/* 3. SLEEK LUXURY CATEGORY PILLS DOCK */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar">
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-2xl">
            {categoryList.map((cat) => {
              const isSelected = selectedCategory === cat.id;

              // Clean micro-dot color indicator
              let dotColor = "bg-[#EF0606]"; // default Noir Red
              if (cat.id === "all") dotColor = "bg-white";
              else if (cat.themeType === "cyber" || cat.id.includes("access")) dotColor = "bg-[#CCFF00]";
              else if (cat.themeType === "ragnarok" || cat.id.includes("band") || cat.id.includes("valhalla")) dotColor = "bg-[#F59E0B]";
              else if (cat.id.includes("music")) dotColor = "bg-[#00F0FF]";

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`group relative shrink-0 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs uppercase tracking-wider font-geometric transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-white text-black font-black shadow-[0_0_25px_rgba(255,255,255,0.2)] scale-[1.02]"
                      : "text-neutral-300 hover:text-white hover:bg-white/[0.08] font-bold"
                  }`}
                >
                  {/* Theme Accent Micro-Dot */}
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-125 ${
                      isSelected ? "bg-black" : dotColor
                    }`}
                  />

                  <span>{cat.name}</span>

                  {/* Clean Counter Chip */}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold transition-colors ${
                      isSelected
                        ? "bg-black text-white"
                        : "bg-white/10 text-neutral-300 group-hover:bg-white/20 group-hover:text-white"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PRODUCTS CATALOG GRID (TRI-THEME CARDS) */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-8 md:px-10 lg:pb-24">
        {filteredProducts.length === 0 ? (
          <div className="my-16 rounded-3xl border border-white/15 bg-[#12161F]/80 p-12 text-center backdrop-blur-xl">
            <Layers className="mx-auto h-12 w-12 text-neutral-500" />
            <h3 className="mt-4 font-mono text-2xl font-black uppercase text-white">
              [ 0x00_NO_ITEMS_LOCATED ]
            </h3>
            <p className="mt-2 text-xs text-neutral-400 font-mono">
              No merchandise matches your current filter or telemetry parameters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#CCFF00] px-6 py-3 font-mono text-xs font-black uppercase text-black shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:bg-[#b8e600] cursor-pointer"
            >
              RESET ALL FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((prod, idx) => {
              const imgs = safeJsonParse(prod.images, ["/images/sabaton_tee.jpg"]);
              const badges = safeJsonParse(prod.badges, []);

              return (
                <Tilt3DCard key={prod.id || idx} maxTilt={6} scale={1.02}>
                  <div
                    onClick={() => setQuickViewProduct(prod)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-[#12161F]/90 p-5 backdrop-blur-2xl transition-all duration-500 hover:border-[#CCFF00] hover:shadow-[0_0_30px_rgba(204,255,0,0.18)] cursor-pointer"
                  >
                    {/* Corner Crosshairs */}
                    <div className="absolute top-2 left-2 text-[8px] font-mono text-white/30">┌</div>
                    <div className="absolute top-2 right-2 text-[8px] font-mono text-white/30">┐</div>
                    <div className="absolute bottom-2 left-2 text-[8px] font-mono text-white/30">└</div>
                    <div className="absolute bottom-2 right-2 text-[8px] font-mono text-white/30">┘</div>

                    {/* Top Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5 flex-wrap">
                        {badges.map((b, bIdx) => (
                          <span
                            key={bIdx}
                            className="rounded-md bg-[#EF0606] px-2 py-0.5 font-geometric text-[8px] font-black uppercase tracking-wider text-white shadow-md"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                      <span className="font-mono text-[9px] font-bold text-[#00F0FF]">
                        [{prod.category?.name || "ARCHIVE"}]
                      </span>
                    </div>

                    {/* Product Image */}
                    <div className="relative my-4 aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-[#080B10] p-1">
                      <div className="relative h-full w-full overflow-hidden rounded-xl">
                        <Image
                          src={imgs[0] || "/images/sabaton_tee.jpg"}
                          alt={prod.title || "Product"}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      </div>

                      {/* Quick View Hover Trigger */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#CCFF00] px-4 py-2 font-mono text-xs font-black uppercase text-black shadow-[0_0_20px_rgba(204,255,0,0.4)]">
                          <Eye className="h-3.5 w-3.5" />
                          <span>QUICK VIEW</span>
                        </span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div>
                      <h3 className="text-base font-bold uppercase leading-snug tracking-tight text-white line-clamp-1 group-hover:text-[#CCFF00] transition-colors font-didone">
                        {prod.title}
                      </h3>

                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                        <div>
                          <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-400 block">
                            PRICE
                          </span>
                          <span className="text-xl font-black text-white">
                            ₹{Math.round((Number(prod.price) || 40) * 85).toLocaleString("en-IN")}
                          </span>
                        </div>

                        <span className="font-mono text-[10px] font-bold text-neutral-400 group-hover:text-[#CCFF00] transition-colors inline-flex items-center gap-1">
                          <span>INSPECT</span>
                          <span>→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Tilt3DCard>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. INTERACTIVE PRODUCT QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 bg-[#0E131B] p-6 sm:p-8 text-white shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-5 right-5 rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Modal Product Image */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/15 bg-[#080B10]">
                <Image
                  src={
                    safeJsonParse(quickViewProduct.images, ["/images/sabaton_tee.jpg"])[0]
                  }
                  alt={quickViewProduct.title || "Product"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Modal Info */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#00F0FF]/40 bg-[#00F0FF]/15 px-3 py-0.5 font-mono text-[9px] font-bold text-[#00F0FF]">
                  <span>{quickViewProduct.category?.name || "STUDIO ARCHIVE"}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black uppercase leading-tight text-white font-didone">
                  {quickViewProduct.title}
                </h2>

                <div className="text-3xl font-black text-[#CCFF00] font-mono">
                  ₹{Math.round((Number(quickViewProduct.price) || 40) * 85).toLocaleString("en-IN")} INR
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  {quickViewProduct.description ||
                    "Heavyweight oversized streetwear cut with reinforced ribbed collar, drop shoulders, and high-density archive graphics."}
                </p>

                {/* Available Sizes Display */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#00F0FF]">
                      AVAILABLE SIZES
                    </span>
                    <span className="text-[9px] font-mono text-[#CCFF00] font-bold">
                      ● IN STOCK // READY TO SHIP
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["S", "M", "L", "XL", "XXL"].map((sz) => (
                      <div
                        key={sz}
                        className="flex h-9 min-w-10 items-center justify-center rounded-xl border border-white/20 bg-black/40 px-3 font-mono text-xs font-bold text-white shadow-inner"
                      >
                        {sz}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fabric Specifications */}
                {quickViewProduct.specs && (
                  <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[9px] font-mono">
                    <div>
                      <span className="text-neutral-400 block">WEIGHT:</span>
                      <span className="text-white font-bold">{quickViewProduct.specs.gsm || "280 GSM"}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block">FABRIC:</span>
                      <span className="text-white font-bold">{quickViewProduct.specs.fabric || "100% COTTON"}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block">FIT:</span>
                      <span className="text-[#CCFF00] font-bold">{quickViewProduct.specs.fit || "OVERSIZED"}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. FULL SITE FOOTER */}
      <Footer />
    </div>
  );
}
