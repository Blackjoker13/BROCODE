"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useStorefront } from "@/lib/storefront/StorefrontContext";
import { WordReveal, MagneticElement } from "@/components/ui/KineticText";
import { Tilt3DCard } from "@/components/ui/MotionCard";
import { Check, Flame, Zap, Sparkles, Shield } from "lucide-react";

export default function FeaturedCollectionSection() {
  const { featuredDrop, activeTheme, addToCart } = useStorefront();
  const [addedId, setAddedId] = useState(null);

  const tanktopProd = featuredDrop?.find((p) => p.slug.includes("tanktop")) || {
    id: "ragnarok-tanktop",
    title: '"BROCODE." TANKTOP BLACK',
    price: 32.0,
    images: ["/images/amon_tanktop.jpg"],
    category: { name: "AMON AMARTH" },
  };

  const shortsProd = featuredDrop?.find((p) => p.slug.includes("shorts")) || {
    id: "amon-shorts",
    title: '"AMON AMARTH" SHORTS GREY',
    price: 44.0,
    images: ["/images/amon_shorts.jpg"],
    category: { name: "AMON AMARTH" },
  };

  const handleQuickAdd = (prod) => {
    addToCart(prod, "Size: L", 1);
    setAddedId(prod.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="featured-drop" className="content-auto relative w-full bg-transparent px-5 py-20 md:px-10 lg:px-14 select-none">
      <div id="catalog" className="absolute -top-20" />
      <div id="collections" className="absolute -top-20" />
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* =========================================================================
            1. THEME 01: NOIR ACID (EDITORIAL LOOKBOOK SPOTLIGHT)
            ========================================================================= */}
        {activeTheme === "noir" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 items-center">
            <div className="flex flex-col justify-between lg:col-span-4 h-full">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-geometric text-[9px] font-black uppercase tracking-[0.25em] bg-[#EF0606]/15 text-[#EF0606] border border-[#EF0606]/30">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  <span>[ FEATURED DROP ]</span>
                </div>
                <h2 className="mt-3 font-didone text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl text-black">
                  PARAM STUDIO ARCHIVE
                </h2>
                <p className="mt-2 font-geometric text-xs text-neutral-600 uppercase tracking-wider">
                  SIGNATURE ACID WASH & BOXY HEAVYWEIGHT MERCH.
                </p>
              </div>

              <div className="mt-8 lg:mt-24">
                <WordReveal
                  text="PARAM MERCH"
                  className="font-didone text-5xl font-black uppercase leading-[0.85] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-black"
                />
                <div className="font-didone text-5xl font-black uppercase leading-[0.85] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-[#EF0606] drop-shadow-[0_2px_14px_rgba(239,6,6,0.6)]">
                  ARCHIVE
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[tanktopProd, shortsProd].map((prod, idx) => (
                <Tilt3DCard key={prod.id || idx} maxTilt={8} scale={1.03}>
                  <div className="glass-theme-card relative aspect-[3/4] w-full overflow-hidden rounded-3xl p-6 border border-black/10 flex flex-col justify-between group">
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                      <Image
                        src={prod.images?.[0] || "/images/amon_tanktop.jpg"}
                        alt={prod.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="mt-4">
                      <span className="font-geometric text-[9px] font-black uppercase tracking-widest text-neutral-500">
                        {prod.category?.name || "FEATURED"}
                      </span>
                      <h3 className="mt-1 font-didone text-xl font-bold uppercase text-black line-clamp-1">
                        {prod.title}
                      </h3>
                      <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-2">
                        <span className="font-didone text-2xl font-black text-black">₹{Math.round((prod.price || 45) * 85).toLocaleString('en-IN')}</span>
                        <span className="font-geometric text-[9px] font-black uppercase tracking-wider text-neutral-400">STUDIO ARCHIVE</span>
                      </div>
                    </div>
                  </div>
                </Tilt3DCard>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            2. THEME 02: CYBER KINETIC (HORIZONTAL CYBER DECK TERMINAL)
            ========================================================================= */}
        {activeTheme === "cyber" && (
          <div className="rounded-3xl border border-[#CCFF00]/40 bg-[#080B10]/95 p-6 md:p-10 font-mono backdrop-blur-2xl shadow-[0_0_35px_rgba(204,255,0,0.15)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#CCFF00]/20 pb-4 gap-4">
              <div>
                <span className="inline-flex items-center gap-2 text-[10px] text-[#00F0FF]">
                  <Zap className="h-4 w-4 text-[#CCFF00] animate-pulse" />
                  [ CYBER DECK // SCHEMATIC SPOTLIGHT ]
                </span>
                <h2 className="mt-2 text-3xl sm:text-4xl font-black uppercase text-[#CCFF00]">
                  BROCODE. // NEO TOKYO DECK
                </h2>
              </div>
              <div className="text-[10px] text-neutral-400">
                <span>SIMULATION: 60FPS</span> | <span className="text-[#CCFF00]">TELEMETRY: SYNCHRONIZED</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[tanktopProd, shortsProd].map((prod, idx) => (
                <div
                  key={prod.id || idx}
                  className="group flex flex-col justify-between rounded-2xl border border-white/15 bg-[#090C10] p-5 transition-all hover:border-[#CCFF00]"
                >
                  <div className="flex items-center justify-between text-[9px] text-[#00F0FF]">
                    <span>[ SCHEMATIC_{idx === 0 ? "0xALPHA" : "0xBETA"} ]</span>
                    <span className="text-[#CCFF00]">● DEPLOYED</span>
                  </div>

                  <div className="relative my-4 aspect-[16/10] w-full overflow-hidden rounded-xl border border-[#CCFF00]/30">
                    <Image
                      src={prod.images?.[0] || "/images/amon_tanktop.jpg"}
                      alt={prod.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-black uppercase text-white group-hover:text-[#CCFF00]">
                      {prod.title}
                    </h3>
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                      <span className="text-2xl font-black text-[#CCFF00]">₹{Math.round((prod.price || 48) * 85).toLocaleString('en-IN')} INR</span>
                      <button
                        onClick={() => handleQuickAdd(prod)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#CCFF00] px-4 py-2 text-xs font-black uppercase text-black hover:bg-[#b8e600] transition-all"
                      >
                        {addedId === prod.id ? <Check className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                        <span>{addedId === prod.id ? "SYNCED" : "INITIALIZE"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            3. THEME 03: GOTHIC RAGNAROK (SACRED WARRIOR PEDESTAL SHRINE)
            ========================================================================= */}
        {activeTheme === "ragnarok" && (
          <div className="rounded-3xl border-2 border-[#F59E0B]/40 bg-[#120D0D]/95 p-6 md:p-10 font-heading backdrop-blur-2xl shadow-[0_0_35px_rgba(245,158,11,0.2)] text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-[#F59E0B]">
              <Shield className="h-4 w-4 animate-pulse" />
              <span>ᚱ SACRED PEDESTAL SHRINE ᚱ</span>
              <Shield className="h-4 w-4 animate-pulse" />
            </div>

            <h2 className="mt-3 text-3xl sm:text-5xl font-black uppercase text-[#FEF3C7] tracking-wide">
              AMON AMARTH // BROCODE. VAULT
            </h2>
            <p className="mt-2 text-xs text-[#FDE68A]/80 max-w-xl mx-auto">
              CEREMONIAL BATTLE WEAR FORGED WITH BLOOD, FIRE AND SACRED RUNES.
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {[tanktopProd, shortsProd].map((prod, idx) => (
                <div
                  key={prod.id || idx}
                  className="group rounded-t-[50px] rounded-b-2xl border-2 border-[#F59E0B]/50 bg-[#161010] p-6 transition-all hover:border-[#F59E0B] hover:-translate-y-2 shadow-2xl"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-t-[40px] rounded-b-xl border border-[#F59E0B]/40 p-1">
                    <div className="relative h-full w-full overflow-hidden rounded-t-[36px] rounded-b-lg">
                      <Image
                        src={prod.images?.[0] || "/images/amon_tanktop.jpg"}
                        alt={prod.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <span className="text-[9px] uppercase tracking-widest text-[#F59E0B]">SACRED ARMOR</span>
                    <h3 className="mt-1 text-2xl font-black uppercase text-[#FEF3C7] group-hover:text-[#F59E0B]">
                      {prod.title}
                    </h3>
                    <div className="mt-4 flex items-center justify-between border-t border-[#F59E0B]/20 pt-3">
                      <span className="text-2xl font-black text-[#FEF3C7]">₹{Math.round((prod.price || 52) * 85).toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => handleQuickAdd(prod)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#F59E0B] px-5 py-2.5 text-xs font-black uppercase text-black hover:bg-amber-400 transition-all shadow-lg"
                      >
                        {addedId === prod.id ? <Check className="h-4 w-4" /> : <Flame className="h-4 w-4" />}
                        <span>{addedId === prod.id ? "CLAIMED" : "CLAIM ARTIFACT"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
