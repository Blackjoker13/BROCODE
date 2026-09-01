"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { usePerformance } from "@/lib/performance/PerformanceContext";
import { useStorefront } from "@/lib/storefront/StorefrontContext";
import { WordReveal, MagneticElement } from "@/components/ui/KineticText";
import { Tilt3DCard } from "@/components/ui/MotionCard";
import {
  User,
  ArrowRight,
  ArrowLeft,
  Flame,
  Zap,
  Sparkles,
  Shield,
  RotateCw,
  Check,
  ChevronDown,
} from "lucide-react";

// React Three Fiber 3D Canvas
const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center">
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-6 py-4 backdrop-blur-md shadow-2xl">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#CCFF00] border-t-transparent" />
        <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-white/80">
          INITIALIZING 3D ENGINE...
        </span>
      </div>
    </div>
  ),
});

function Marquee({ activeTheme }) {
  const { cms } = useStorefront();
  const defaultText =
    activeTheme === "cyber"
      ? "BROCODE. CYBER // 60 FPS CLOTH SIMULATION // WORLDWIDE DELIVERY"
      : activeTheme === "ragnarok"
      ? "BROCODE. GOTHIC // AMON HEAVYWEIGHT // FORGED IN DARKNESS"
      : cms?.MARQUEE_TEXT?.content?.text || "FREE SHIPPING WITHIN SOUTH AMERICA // BROCODE ARCHIVE";

  const emoji = activeTheme === "cyber" ? "⚡" : activeTheme === "ragnarok" ? "🔥" : "💥";
  const items = Array.from({ length: 8 });

  const bgStyle =
    activeTheme === "cyber"
      ? "bg-[#CCFF00] text-black"
      : activeTheme === "ragnarok"
      ? "bg-gradient-to-r from-[#881337] via-[#D97706] to-[#881337] text-white"
      : "bg-[#EF0606] text-white";

  return (
    <div className={`relative z-30 w-full overflow-hidden py-1 sm:py-1.5 shadow-sm select-none border-b border-black/10 transition-colors duration-700 ${bgStyle}`}>
      <div className="animate-marquee whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {items.map((_, i) => (
              <span
                key={i}
                className="mx-3 sm:mx-4 flex items-center gap-2 sm:gap-3 font-geometric text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.24em]"
              >
                <span className="text-xs sm:text-sm drop-shadow-sm">{emoji}</span>
                <span>{defaultText}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function BrocodeLogo() {
  const [clickCount, setClickCount] = useState(0);

  const handleSecretClick = () => {
    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        window.location.href = "/admin";
        return 0;
      }
      return next;
    });
    setTimeout(() => setClickCount(0), 1500);
  };

  return (
    <div 
      onClick={handleSecretClick}
      className="flex items-center select-none py-1 transition-transform duration-300 hover:scale-[1.03] cursor-pointer"
    >
      <Image
        src="/images/brocode_logo_v2.png"
        alt="BROCODE"
        width={240}
        height={40}
        priority
        style={{ width: "auto", height: "auto" }}
        className="h-7 sm:h-8 md:h-10 w-auto max-w-[170px] sm:max-w-[220px] md:max-w-[280px] object-contain brightness-110 drop-shadow-[0_2px_12px_rgba(255,255,255,0.2)]"
      />
    </div>
  );
}

export const TSHIRT_VARIATIONS = [
  {
    id: "noir",
    themeId: "noir",
    title: "BROCODE ACID WASH HEAVYWEIGHT",
    shortTitle: "PARAM NOIR",
    collection: "PARAM COLLECTION",
    badge: "PREMIUM MERCH",
    badgeIcon: Sparkles,
    badgeClass: "bg-[#EF0606]/15 text-[#EF0606] border-[#EF0606]/30",
    price: 35.0,
    variationTag: "01 // NOIR ACID",
    description: "Signature boxy cut in charcoal enzyme wash with reinforced collar and heavyweight combed cotton.",
    watermark: "BROCODE",
    watermarkFont: "'Archivo Black', 'Anton', sans-serif",
    watermarkFill: "#000000",
    watermarkOpacity: 0.85,
    subheadline: "PARAM COLLECTION",
    headlineLine1: "MERCH THAT HITS",
    headlineLine2: "DIFFERENT",
    headlineAccentClass: "text-[#EF0606] drop-shadow-[0_2px_14px_rgba(239,6,6,0.6)]",
    fontFamily: "font-didone",
    bgClass: "bg-[#D3CCC7]",
    bgGradient: "radial-gradient(circle at 50% 50%, rgba(239,238,232,0.7) 0%, rgba(211,204,199,0.98) 100%)",
    accentColor: "#EF0606",
    hudTag: "STATIC STUDIO ROTATION 360°",
    cornerInfo: {
      title: "BROCODE STUDIO ARCHIVE",
      line1: "PARAM COLLECTION // MERCH",
      line2: "© 2025 ALL RIGHTS RESERVED",
    },
    specs: ["280 GSM", "ENZYME WASH", "BOXY DROP"],
    previewImage: "/images/sabaton_tee.jpg",
  },
  {
    id: "cyber",
    themeId: "cyber",
    title: "BROCODE. CYBER // WALKING OVERSIZED",
    shortTitle: "CYBER KINETIC",
    collection: "CYBERPUNK ARCHIVE",
    badge: "BROCODE. CLOTH SIM",
    badgeIcon: Zap,
    badgeClass: "bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/40 shadow-[0_0_12px_rgba(204,255,0,0.25)]",
    price: 48.0,
    variationTag: "02 // BROCODE. CYBER",
    description: "Dynamic cloth-simulated boxy drape in deep void carbon fiber blend with active velocity kinematics.",
    watermark: "BROCODE.",
    watermarkFont: "'JetBrains Mono', 'Space Mono', monospace",
    watermarkFill: "#152033",
    watermarkOpacity: 0.95,
    subheadline: "BROCODE. // NEO-TOKYO 02",
    headlineLine1: "CLOTH SIMULATION",
    headlineLine2: "IN MOTION",
    headlineAccentClass: "text-[#CCFF00] drop-shadow-[0_2px_18px_rgba(204,255,0,0.7)]",
    fontFamily: "font-mono",
    bgClass: "bg-[#090C10]",
    bgGradient: "radial-gradient(circle at 50% 45%, rgba(18,27,44,0.9) 0%, rgba(9,12,16,1) 100%)",
    accentColor: "#CCFF00",
    hudTag: "REALTIME CLOTH DRAPE SIMULATION",
    cornerInfo: {
      title: "BROCODE. SIMULATION LAB",
      line1: "DYNAMIC VELOCITY // 60 FPS",
      line2: "ACTIVE PROCEDURAL PHYSICS",
    },
    specs: ["DYNAMIC RIG", "CARBON BLEND", "VELOCITY DRAPE"],
    previewImage: "/images/amon_tanktop.jpg",
  },
  {
    id: "ragnarok",
    themeId: "ragnarok",
    title: "BROCODE. GOTHIC // AMON HEAVYWEIGHT",
    shortTitle: "GOTHIC RAGNAROK",
    collection: "UNHOLY METALCORE",
    badge: "BROCODE. EDITION",
    badgeIcon: Flame,
    badgeClass: "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]",
    price: 52.0,
    variationTag: "03 // BROCODE. GOTHIC",
    description: "280GSM distressed metalcore apparel featuring hand-drawn heraldic graphics and battle-tested ribbed hems.",
    watermark: "BROCODE.",
    watermarkFont: "'Cinzel', 'Playfair Display', serif",
    watermarkFill: "#261515",
    watermarkOpacity: 0.92,
    subheadline: "BROCODE. // GOTHIC RELIC",
    headlineLine1: "FORGED IN THE",
    headlineLine2: "DARKNESS",
    headlineAccentClass: "text-[#F59E0B] drop-shadow-[0_2px_18px_rgba(245,158,11,0.7)]",
    fontFamily: "font-heading",
    bgClass: "bg-[#120E0E]",
    bgGradient: "radial-gradient(circle at 50% 50%, rgba(42,20,20,0.85) 0%, rgba(18,14,14,1) 100%)",
    accentColor: "#F59E0B",
    hudTag: "ANCIENT METAL RELIC ARCHIVE",
    cornerInfo: {
      title: "BROCODE. RELIC ARCHIVE",
      line1: "AMON AMARTH RUNES // ᚱ ᚨ ᚷ",
      line2: "SCORCHED HEAVYWEIGHT MERCH",
    },
    specs: ["320 GSM", "DISTRESSED HEM", "HERALDIC ART"],
    previewImage: "/images/sabbath_tee.jpg",
  },
];

const CURRENCIES = [
  { symbol: "₹", code: "INR", rate: 86.5 },
  { symbol: "$", code: "USD", rate: 1.0 },
  { symbol: "€", code: "EUR", rate: 0.92 },
  { symbol: "£", code: "GBP", rate: 0.79 },
  { symbol: "¥", code: "JPY", rate: 154.0 },
];

export default function HeroSection() {
  const { setHeroVisible } = usePerformance();
  const { activeTheme, setActiveTheme } = useStorefront();
  const heroRef = useRef(null);

  const currentIdx = Math.max(
    0,
    TSHIRT_VARIATIONS.findIndex((v) => v.themeId === activeTheme)
  );

  const [currencyIdx, setCurrencyIdx] = useState(0);

  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [setHeroVisible]);

  useEffect(() => {
    const handleAdminHotkey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        window.location.href = "/admin";
      }
    };
    window.addEventListener("keydown", handleAdminHotkey);
    return () => window.removeEventListener("keydown", handleAdminHotkey);
  }, []);

  const activeVariation = TSHIRT_VARIATIONS[currentIdx] || TSHIRT_VARIATIONS[0];
  const activeCurrency = CURRENCIES[currencyIdx];

  const handleSelectVariation = (idx) => {
    const target = TSHIRT_VARIATIONS[idx];
    if (target) {
      setActiveTheme(target.themeId);
    }
  };

  const prevSlide = () => {
    const prev = currentIdx > 0 ? currentIdx - 1 : TSHIRT_VARIATIONS.length - 1;
    setActiveTheme(TSHIRT_VARIATIONS[prev].themeId);
  };

  const nextSlide = () => {
    const next = currentIdx < TSHIRT_VARIATIONS.length - 1 ? currentIdx + 1 : 0;
    setActiveTheme(TSHIRT_VARIATIONS[next].themeId);
  };

  const cycleCurrency = () => {
    setCurrencyIdx((i) => (i + 1) % CURRENCIES.length);
  };

  return (
    <div
      ref={heroRef}
      className={`relative flex min-h-[100dvh] md:h-screen w-full flex-col overflow-hidden select-none transition-colors duration-700 ${activeVariation.bgClass}`}
    >
      {/* 1. TOP MARQUEE WITH DYNAMIC THEMED ACCENTS */}
      <Marquee activeTheme={activeVariation.themeId} />

      {/* 2. TOP DARK NAVBAR (#000000 BLACK) */}
      <header className="relative z-30 flex h-14 sm:h-16 md:h-18 w-full items-center justify-between bg-[#000000] px-3.5 sm:px-6 md:px-8 text-white backdrop-blur-xl border-b border-white/10 shadow-lg font-geometric">
        {/* Left: Brand Logo (Secret triple-click to open admin) */}
        <div className="flex items-center gap-6">
          <button className="flex items-center text-left focus:outline-none">
            <BrocodeLogo />
          </button>
        </div>

        {/* Center: Navigation Quicklinks (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 font-geometric text-[11px] font-bold uppercase tracking-widest text-[#EFEEE8]">
          {[
            { label: "Categories", href: "#categories" },
            { label: "New Drops", href: "#new-arrivals" },
            { label: "Accessories", href: "#accessories" },
            { label: "About Us", href: "#about" },
          ].map((link, idx) => (
            <MagneticElement key={idx} strength={8}>
              <a
                href={link.href}
                className="relative py-1 transition-colors hover:text-[#EF0606] group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#EF0606] transition-all duration-300 group-hover:w-full" />
              </a>
            </MagneticElement>
          ))}
        </nav>

        {/* Right: Theme Switcher Pills & Currency Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-[#EFEEE8]">
          {/* Quick theme indicators for mobile/tablet */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {TSHIRT_VARIATIONS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => handleSelectVariation(idx)}
                title={t.title}
                className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                  currentIdx === idx
                    ? t.themeId === "cyber"
                      ? "bg-[#CCFF00] text-black shadow-sm font-black"
                      : t.themeId === "ragnarok"
                      ? "bg-[#F59E0B] text-black shadow-sm font-black"
                      : "bg-[#EF0606] text-white shadow-sm font-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>

          <MagneticElement strength={10}>
            <button
              onClick={cycleCurrency}
              title={`Switch currency (Current: ${activeCurrency.code})`}
              className="flex h-8 sm:h-9 min-w-[32px] sm:min-w-[36px] items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-2.5 font-geometric text-xs font-bold text-white transition-all hover:border-[#EF0606] hover:bg-white/10 hover:text-[#EF0606] shadow-sm"
            >
              {activeCurrency.symbol}
            </button>
          </MagneticElement>
        </div>
      </header>

      {/* 3. HERO 3D DYNAMIC THEMED TRANSFORMATION CANVAS */}
      <section className="relative flex flex-1 flex-col justify-between overflow-hidden md:block">
        {/* Dynamic Atmospheric Radial Background Blend */}
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-1000"
          style={{ background: activeVariation.bgGradient }}
        />

        {/* Dynamic Theme Pattern Overlay */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {activeVariation.themeId === "cyber" && (
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-80" />
          )}
          {activeVariation.themeId === "ragnarok" && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.12),transparent_70%)] animate-pulse" style={{ animationDuration: "6s" }} />
          )}
          {activeVariation.themeId === "noir" && (
            <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:24px_24px]" />
          )}
        </div>

        {/* Dynamic Background Stencil (BROCODE / KINETIC / RAGNAROK) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeVariation.watermark}
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: activeVariation.watermarkOpacity, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -15 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
          >
            <svg
              className="h-full w-full select-none"
              viewBox="0 0 1920 700"
              preserveAspectRatio="xMidYMid meet"
            >
              <text
                x="50%"
                y="53%"
                textAnchor="middle"
                dominantBaseline="central"
                fill={activeVariation.watermarkFill}
                fontSize={activeVariation.themeId === "ragnarok" ? "250" : activeVariation.themeId === "cyber" ? "280" : "320"}
                fontWeight="900"
                fontFamily={activeVariation.watermarkFont}
                letterSpacing={activeVariation.themeId === "ragnarok" ? "0.03em" : "-0.02em"}
                transform="scale(1, 1.14)"
                transformOrigin="center"
              >
                {activeVariation.watermark}
              </text>
            </svg>
          </motion.div>
        </AnimatePresence>

        {/* =========================================================================
            DESKTOP 3D CANVAS (Full-screen background behind floating cards)
            ========================================================================= */}
        <div className="hidden md:block absolute inset-0 z-10 cursor-grab active:cursor-grabbing">
          <Scene
            activeTheme={activeVariation.themeId}
            autoRotate={true}
            rotateSpeed={0.75}
          />
        </div>

        {/* =========================================================================
            MOBILE LAYOUT (< 768px): Dedicated Clean Vertical Flow
            ========================================================================= */}
        <div className="flex md:hidden flex-col justify-between flex-1 w-full z-20 py-2 px-3.5">
          {/* Mobile Top Headline Banner */}
          <div className="text-center pt-1 pb-1">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm mb-1.5"
              style={{
                backgroundColor: activeVariation.themeId === "cyber" ? "rgba(204,255,0,0.15)" : activeVariation.themeId === "ragnarok" ? "rgba(245,158,11,0.2)" : "rgba(239,6,6,0.15)",
                color: activeVariation.accentColor,
                border: `1px solid ${activeVariation.accentColor}40`,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: activeVariation.accentColor }} />
              <span>{activeVariation.variationTag}</span>
            </div>

            <h1 className="font-didone text-3xl sm:text-4xl font-black uppercase leading-none tracking-tight text-black"
              style={{
                color: activeVariation.themeId === "cyber" ? "#F0F6FC" : activeVariation.themeId === "ragnarok" ? "#FEF3C7" : "#000000",
                fontFamily: activeVariation.themeId === "cyber" ? "monospace" : activeVariation.themeId === "ragnarok" ? "var(--font-heading)" : "inherit"
              }}
            >
              {activeVariation.shortTitle}
            </h1>

            <div className="flex items-center justify-center gap-2 mt-1 font-geometric text-[9px] font-bold tracking-widest uppercase opacity-75"
              style={{ color: activeVariation.themeId === "cyber" ? "#CCFF00" : activeVariation.themeId === "ragnarok" ? "#F59E0B" : "#333333" }}
            >
              {activeVariation.specs.join(" • ")}
            </div>
          </div>

          {/* Mobile Dedicated 3D Interactive Canvas (Cleanly framed, no overlapping text/cards) */}
          <div className="relative w-full h-[44vh] min-h-[295px] max-h-[415px] my-auto cursor-grab active:cursor-grabbing">
            <Scene
              activeTheme={activeVariation.themeId}
              autoRotate={true}
              rotateSpeed={0.75}
              isMobileView={true}
            />
            {/* Subtle 360 Drag Hint */}
            <div className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-2.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-white/70 backdrop-blur-sm">
              DRAG 360°
            </div>
          </div>

          {/* Mobile Bottom Lookbook Controller */}
          <div className="w-full max-w-sm mx-auto pb-1">
            <div
              className="rounded-2xl p-3.5 backdrop-blur-xl border shadow-xl transition-all"
              style={{
                backgroundColor: activeVariation.themeId === "cyber" ? "rgba(9,12,16,0.92)" : activeVariation.themeId === "ragnarok" ? "rgba(18,14,14,0.92)" : "rgba(239,238,232,0.92)",
                borderColor: activeVariation.themeId === "cyber" ? "rgba(204,255,0,0.3)" : activeVariation.themeId === "ragnarok" ? "rgba(245,158,11,0.3)" : "rgba(0,0,0,0.12)",
                color: activeVariation.themeId === "noir" ? "#000000" : "#FFFFFF"
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider opacity-60 block">
                    {activeVariation.collection}
                  </span>
                  <div className="text-sm sm:text-base font-black font-didone uppercase tracking-wider leading-tight mt-0.5">
                    {activeVariation.shortTitle}
                  </div>
                </div>

                {/* Touch-Friendly Prev / Next Arrows */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={prevSlide}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border bg-black/5 hover:bg-black hover:text-white transition-all active:scale-95"
                    style={{ borderColor: activeVariation.themeId === "noir" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)" }}
                    title="Previous Model"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border bg-black/5 hover:bg-black hover:text-white transition-all active:scale-95"
                    style={{ borderColor: activeVariation.themeId === "noir" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)" }}
                    title="Next Model"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            DESKTOP ONLY (md:block) THEME LAYOUTS (100% UNTOUCHED DESKTOP LUXURY DESIGN)
            ========================================================================= */}
        <div className="hidden md:block">
          {/* THEME 01: NOIR ACID (EDITORIAL HIGH-FASHION LOOKBOOK LAYOUT) */}
          {activeVariation.themeId === "noir" && (
            <>
              {/* Left Headline */}
              <div className="pointer-events-none absolute left-6 top-16 md:top-20 z-20 md:left-10 select-none">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-geometric text-[9px] font-black uppercase tracking-[0.25em] bg-[#EF0606] text-white shadow-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                      <span>EDITORIAL // DROP 01</span>
                    </span>
                    <span className="font-mono text-[9px] font-bold text-black/50 tracking-widest">
                      ARCHIVE EDITION
                    </span>
                  </div>

                  <div className="mt-3 font-didone uppercase leading-[0.85] tracking-tight text-black text-4xl sm:text-6xl md:text-7xl">
                    <div>PARAM</div>
                    <div className="text-[#EF0606] drop-shadow-[0_2px_12px_rgba(239,6,6,0.4)]">NOIR</div>
                  </div>

                  <p className="mt-2 max-w-xs font-geometric text-[10px] font-bold uppercase tracking-widest text-black/70">
                    HEAVYWEIGHT ACID WASH BOX CUT // 100% COMBED COTTON
                  </p>
                </motion.div>
              </div>

              {/* Bottom Right: Frosted Luxury Lookbook Card */}
              <div className="absolute right-4 bottom-12 z-20 md:right-8 md:bottom-14 w-full max-w-[310px] sm:max-w-[340px]">
                <Tilt3DCard maxTilt={6} scale={1.02}>
                  <div className="glass-surface-light relative rounded-3xl p-5 border border-black/10 text-black shadow-2xl backdrop-blur-2xl">
                    <div className="flex items-center justify-between">
                      <span className="font-geometric text-[9px] font-black uppercase tracking-[0.2em] text-neutral-700">
                        PARAM STUDIO ARCHIVE
                      </span>
                      <span className="rounded-full bg-[#EF0606] px-2.5 py-0.5 font-geometric text-[8px] font-black uppercase text-white shadow-sm">
                        ★ SIGNATURE
                      </span>
                    </div>

                    <h2 className="mt-2 font-didone text-2xl font-black uppercase leading-tight text-black">
                      {activeVariation.title}
                    </h2>

                    <p className="mt-1 text-xs text-neutral-600 line-clamp-2">
                      {activeVariation.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3">
                      <div className="flex items-center gap-2">
                        <button onClick={prevSlide} className="flex h-8 w-8 items-center justify-center rounded-xl border border-black/20 bg-black/5 hover:bg-black hover:text-white transition-all" title="Previous Variation">
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={nextSlide} className="flex h-8 w-8 items-center justify-center rounded-xl border border-black/20 bg-black/5 hover:bg-black hover:text-white transition-all" title="Next Variation">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-geometric text-[9px] font-black tracking-wider text-neutral-700">
                        THEME 01 // NOIR
                      </span>
                    </div>
                  </div>
                </Tilt3DCard>
              </div>
            </>
          )}

          {/* THEME 02: CYBER KINETIC (HIGH-TECH COCKPIT TELEMETRY HUD LAYOUT) */}
          {activeVariation.themeId === "cyber" && (
            <>
              {/* Left Cockpit Telemetry Stream Panel */}
              <div className="pointer-events-none absolute left-4 top-16 md:top-24 z-20 md:left-8 select-none max-w-[280px]">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border border-[#CCFF00]/30 bg-[#080B10]/90 p-4 font-mono text-white backdrop-blur-xl shadow-[0_0_25px_rgba(204,255,0,0.12)]"
                >
                  <div className="flex items-center justify-between border-b border-[#CCFF00]/20 pb-2 text-[9px] text-[#CCFF00]">
                    <span>[ TELEMETRY FEED ]</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#CCFF00] animate-ping" />
                  </div>

                  <div className="mt-2 text-2xl font-black uppercase text-[#CCFF00] tracking-tight">
                    BROCODE._02
                  </div>

                  <div className="mt-3 space-y-1.5 text-[9px] text-neutral-300">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">VELOCITY:</span>
                      <span className="text-[#00F0FF] font-bold">8.4 M/S [ACTIVE]</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">CLOTH DRAPE:</span>
                      <span className="text-white font-bold">PHYSX RIG 60FPS</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">FABRIC ID:</span>
                      <span className="text-[#CCFF00] font-bold">CARBON VOID 280G</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">SECTOR:</span>
                      <span className="text-white font-bold">NEO-TOKYO 0x48A</span>
                    </div>
                  </div>

                  {/* Animated Signal Frequency Bars */}
                  <div className="mt-3 flex items-end gap-1 h-4 pt-1 border-t border-white/10">
                    {[40, 80, 60, 100, 30, 90, 70, 85, 45].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-[#CCFF00] rounded-t-sm"
                        style={{ height: `${h}%`, opacity: 0.7 + (i % 3) * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right HUD Command Module */}
              <div className="absolute right-4 bottom-12 z-20 md:right-8 md:bottom-14 w-full max-w-[310px] sm:max-w-[340px]">
                <Tilt3DCard maxTilt={6} scale={1.02}>
                  <div className="relative rounded-3xl p-5 border border-[#CCFF00]/40 bg-[#090C10]/95 text-white backdrop-blur-2xl shadow-[0_0_35px_rgba(204,255,0,0.2)]">
                    {/* Corner Target Reticles */}
                    <div className="absolute top-2 left-2 text-[8px] font-mono text-[#CCFF00]/50">┌ 0x2A</div>
                    <div className="absolute top-2 right-2 text-[8px] font-mono text-[#CCFF00]/50">0x2B ┐</div>
                    <div className="absolute bottom-2 left-2 text-[8px] font-mono text-[#CCFF00]/50">└ 0x2C</div>
                    <div className="absolute bottom-2 right-2 text-[8px] font-mono text-[#CCFF00]/50">0x2D ┘</div>

                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#00F0FF]">
                        HARDWARE UNIT // 02
                      </span>
                      <span className="rounded-md border border-[#CCFF00]/50 bg-[#CCFF00]/15 px-2 py-0.5 font-mono text-[8px] font-black text-[#CCFF00]">
                        ⚡ BROCODE. RIG
                      </span>
                    </div>

                    <h2 className="mt-2 font-mono text-xl font-black uppercase text-[#CCFF00]">
                      {activeVariation.title}
                    </h2>

                    <p className="mt-1 font-mono text-xs text-neutral-400 line-clamp-2">
                      {activeVariation.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[9px]">
                      <div className="flex items-center gap-2">
                        <button onClick={prevSlide} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#CCFF00]/30 bg-white/5 text-white hover:bg-[#CCFF00] hover:text-black transition-all" title="Previous Variation">
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={nextSlide} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#CCFF00]/30 bg-white/5 text-white hover:bg-[#CCFF00] hover:text-black transition-all" title="Next Variation">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-[#CCFF00] font-bold">
                        [ SECTOR 02 // ACTIVE ]
                      </span>
                    </div>
                  </div>
                </Tilt3DCard>
              </div>
            </>
          )}

          {/* THEME 03: GOTHIC RAGNAROK (SACRED NORSE ALTAR & HERALDIC RELIQUARY) */}
          {activeVariation.themeId === "ragnarok" && (
            <>
              {/* Top Norse Rune Sigil Header */}
              <div className="pointer-events-none absolute top-14 md:top-18 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 md:gap-3 rounded-full border border-[#F59E0B]/40 bg-[#141010]/90 px-4 md:px-6 py-1 font-heading text-[10px] md:text-xs font-bold text-[#F59E0B] backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                <span>ᚱ ᚨ ᚷ ᚾ ᚨ ᚱ ᛟ ᚲ</span>
                <span className="text-white/40">⚔</span>
                <span className="text-[#FEF3C7]">VALHALLA FORGE // SACRED ARTIFACT</span>
              </div>

              {/* Left Ancient Runic Stone Pillar */}
              <div className="pointer-events-none absolute left-4 top-16 md:top-24 z-20 md:left-8 select-none max-w-[260px]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border-2 border-[#F59E0B]/40 bg-[#100C0C]/90 p-4 font-heading text-white backdrop-blur-xl shadow-[0_0_25px_rgba(245,158,11,0.2)]"
                >
                  <div className="flex items-center justify-between border-b border-[#F59E0B]/30 pb-2 text-[10px] text-[#F59E0B]">
                    <span>[ WAR RELIC 03 ]</span>
                    <Flame className="h-3.5 w-3.5 text-[#F59E0B] animate-pulse" />
                  </div>

                  <div className="mt-2 text-2xl font-black uppercase text-[#FEF3C7] tracking-wider">
                    BROCODE.
                  </div>

                  <p className="mt-2 font-serif text-[10px] leading-relaxed text-[#FDE68A] opacity-90">
                    FORGED IN DARK EMBERS // SACRED METALCORE ARMOR FROM THE VALHALLA FORGE.
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-[#F59E0B]/20 pt-2 font-heading text-[9px] text-[#F59E0B]">
                    <span>SACRED SEAL:</span>
                    <span className="font-black text-white">FORGED IN BATTLE</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Scorched Iron Relic Plaque */}
              <div className="absolute right-4 bottom-12 z-20 md:right-8 md:bottom-14 w-full max-w-[310px] sm:max-w-[340px]">
                <Tilt3DCard maxTilt={6} scale={1.02}>
                  <div className="relative rounded-3xl p-5 border-2 border-[#F59E0B]/50 bg-[#161010]/95 text-white backdrop-blur-2xl shadow-[0_0_35px_rgba(245,158,11,0.25)]">
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-[9px] font-black uppercase tracking-[0.2em] text-[#F59E0B]">
                        AMON AMARTH RELIC
                      </span>
                      <span className="rounded-full border border-[#F59E0B]/60 bg-[#F59E0B]/20 px-2.5 py-0.5 font-heading text-[8px] font-black text-[#FEF3C7]">
                        🔥 VALHALLA
                      </span>
                    </div>

                    <h2 className="mt-2 font-heading text-2xl font-black uppercase text-[#FEF3C7] tracking-wide">
                      {activeVariation.title}
                    </h2>

                    <p className="mt-1 font-serif text-xs text-[#FDE68A]/80 line-clamp-2">
                      {activeVariation.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-[#F59E0B]/20 pt-3 font-heading text-[9px]">
                      <div className="flex items-center gap-2">
                        <button onClick={prevSlide} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F59E0B]/40 bg-white/5 text-[#FEF3C7] hover:bg-[#F59E0B] hover:text-black transition-all" title="Previous Variation">
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={nextSlide} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F59E0B]/40 bg-white/5 text-[#FEF3C7] hover:bg-[#F59E0B] hover:text-black transition-all" title="Next Variation">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-[#F59E0B] font-bold">
                        ⚔ BROCODE. GOTHIC
                      </span>
                    </div>
                  </div>
                </Tilt3DCard>
              </div>
            </>
          )}
        </div>

        {/* Torn Paper Deckle Edge for Noir theme */}
        {activeVariation.themeId === "noir" && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-5 sm:h-7 w-full overflow-hidden transition-opacity duration-500">
            <svg
              className="h-full w-full"
              viewBox="0 0 1440 30"
              preserveAspectRatio="none"
              fill="#EFEEE8"
            >
              <path d="M0,30 L0,14 Q35,6 70,12 T140,8 T210,16 T280,6 T350,14 T420,8 T490,16 T560,6 T630,12 T700,8 T770,16 T840,6 T910,14 T980,8 T1050,16 T1120,6 T1190,12 T1260,8 T1330,14 T1400,6 T1440,12 L1440,30 Z" />
            </svg>
          </div>
        )}
      </section>
    </div>
  );
}
