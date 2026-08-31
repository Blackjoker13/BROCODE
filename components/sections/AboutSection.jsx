"use client";

import Image from "next/image";
import { useStorefront } from "@/lib/storefront/StorefrontContext";
import { motion } from "framer-motion";
import { WordReveal } from "@/components/ui/KineticText";
import { Tilt3DCard } from "@/components/ui/MotionCard";
import { Zap, Flame, Shield, Radio } from "lucide-react";

export default function AboutSection() {
  const { cms, activeTheme } = useStorefront();

  const about = cms?.ABOUT_US || {};
  const content = about.content || {};

  const tagline = content.tagline || "[ ABOUT US ]";
  const titleLine1 = content.titleLine1 || about.title || "THIS IS BROCODE";
  const titleLine2 = content.titleLine2 || about.subtitle || "LOUD, PROUD, UNTAMED";
  const bodyText =
    content.body ||
    "Brocode is all about turning up the volume on what matters — real bands, real fans, real merch. We're here to dress your rebellion, fuel your playlists, and celebrate the chaos of sound and self-expression. No rules, no trends — just raw music energy.";
  const rackImage = content.rackImage || "/images/pallet_rack.jpg";
  const rackLabel = content.rackLabel || "STUDIO RACK // 001";
  const foundersImage = content.foundersImage || "/images/founders.jpg";
  const foundersLabel = content.foundersLabel || "BROCODE CREATORS";

  return (
    <section id="about" className="content-auto relative w-full bg-transparent px-5 py-24 md:px-10 lg:px-14 select-none">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* =========================================================================
            1. THEME 01: NOIR ACID (EDITORIAL 50/50 STUDIO MANIFESTO)
            ========================================================================= */}
        {activeTheme === "noir" && (
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Tilt3DCard maxTilt={6} scale={1.02}>
                <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-black/15 bg-black p-2 shadow-2xl transition-all duration-700 hover:border-[#EF0606]">
                  <div className="relative h-full w-full overflow-hidden rounded-2xl">
                    <Image
                      src={rackImage}
                      alt={rackLabel}
                      fill
                      priority
                      unoptimized={rackImage.startsWith("/uploads/") || rackImage.startsWith("http")}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-5 left-5 rounded-full bg-black/85 px-3 py-1 font-geometric text-[9px] font-black tracking-widest text-white backdrop-blur-md border border-white/20">
                    {rackLabel}
                  </div>
                </div>
              </Tilt3DCard>
            </div>

            <div className="flex flex-col items-center text-center lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/5 px-3.5 py-1 font-geometric text-[10px] font-black uppercase tracking-[0.3em]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#EF0606]" />
                <span>{tagline}</span>
              </div>

              <WordReveal
                text={titleLine1}
                className="mt-4 font-didone text-5xl sm:text-6xl md:text-7xl font-black uppercase leading-[0.88] tracking-tight text-black"
              />
              <div className="font-didone text-4xl sm:text-5xl md:text-6xl font-black uppercase mt-1 text-[#EF0606]">
                {titleLine2}
              </div>

              <div className="my-6">
                <Tilt3DCard maxTilt={12} scale={1.05}>
                  <div className="group aspect-square w-48 overflow-hidden rounded-3xl border-2 border-black/15 bg-black p-1.5 shadow-2xl transition-all sm:w-56 hover:border-[#EF0606]">
                    <div className="relative h-full w-full overflow-hidden rounded-2xl">
                      <Image
                        src={foundersImage}
                        alt={foundersLabel}
                        fill
                        unoptimized={foundersImage.startsWith("/uploads/") || foundersImage.startsWith("http")}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </Tilt3DCard>
              </div>

              <p className="max-w-md font-sans text-xs font-semibold leading-relaxed text-black/80 md:text-sm">
                {bodyText}
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            2. THEME 02: CYBER KINETIC (3-COLUMN TELEMETRY LAB STREAM)
            ========================================================================= */}
        {activeTheme === "cyber" && (
          <div className="rounded-3xl border border-[#CCFF00]/40 bg-[#080B10]/95 p-6 md:p-10 font-mono backdrop-blur-2xl shadow-[0_0_35px_rgba(204,255,0,0.15)]">
            <div className="flex items-center justify-between border-b border-[#CCFF00]/20 pb-4">
              <span className="flex items-center gap-2 text-xs text-[#00F0FF]">
                <Zap className="h-4 w-4 text-[#CCFF00]" />
                {tagline}
              </span>
              <span className="text-xs text-[#CCFF00]">SYS_VERSION: 2.4.0</span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3 items-center">
              {/* Col 1: System Specs */}
              <div className="rounded-2xl border border-white/10 bg-[#090C10] p-5 space-y-4">
                <span className="text-[10px] text-[#00F0FF] block">{rackLabel}</span>
                <h3 className="text-2xl font-black uppercase text-[#CCFF00]">{titleLine1}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Real-time GPU cloth simulation engine producing ultra-high velocity procedural drape.
                </p>
                <div className="border-t border-white/10 pt-3 text-[10px] text-neutral-500">
                  ENGINES: THREE.JS // WEBGL 2.0 // 60FPS
                </div>
              </div>

              {/* Col 2: Founders Cyber HUD Badge */}
              <div className="flex flex-col items-center text-center">
                <div className="relative aspect-square w-48 overflow-hidden rounded-2xl border-2 border-[#CCFF00] p-1 shadow-[0_0_25px_rgba(204,255,0,0.3)]">
                  <Image
                    src={foundersImage}
                    alt={foundersLabel}
                    fill
                    unoptimized={foundersImage.startsWith("/uploads/") || foundersImage.startsWith("http")}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080B10]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 inset-x-2 text-[9px] text-[#CCFF00] font-bold">
                    [{foundersLabel}]
                  </div>
                </div>
                <h4 className="mt-3 text-lg font-black uppercase text-white">{titleLine2}</h4>
              </div>

              {/* Col 3: Live Manifesto Terminal */}
              <div className="rounded-2xl border border-white/10 bg-[#090C10] p-5 space-y-4">
                <span className="text-[10px] text-[#00F0FF] block">MANIFESTO FEED</span>
                <h3 className="text-2xl font-black uppercase text-white">{titleLine2}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {bodyText}
                </p>
                <div className="border-t border-white/10 pt-3 text-[10px] text-[#CCFF00]">
                  STATUS: SYNCHRONIZED & OPERATIONAL
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. THEME 03: GOTHIC RAGNAROK (BLACKSMITH FORGE CHRONICLE)
            ========================================================================= */}
        {activeTheme === "ragnarok" && (
          <div className="rounded-3xl border-2 border-[#F59E0B]/40 bg-[#120D0D]/95 p-6 md:p-10 font-heading backdrop-blur-2xl shadow-[0_0_35px_rgba(245,158,11,0.2)]">
            <div className="text-center">
              <span className="text-xs text-[#F59E0B] tracking-widest uppercase">ᚱ {tagline} ᚱ</span>
              <h2 className="mt-2 text-4xl sm:text-5xl font-black uppercase text-[#FEF3C7]">
                {titleLine1}
              </h2>
              <div className="text-2xl font-bold uppercase text-[#F59E0B] mt-1">
                {titleLine2}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-5 relative aspect-square overflow-hidden rounded-t-[60px] rounded-b-2xl border-2 border-[#F59E0B] p-2 shadow-2xl">
                <div className="relative h-full w-full overflow-hidden rounded-t-[52px] rounded-b-xl">
                  <Image
                    src={foundersImage}
                    alt={foundersLabel}
                    fill
                    unoptimized={foundersImage.startsWith("/uploads/") || foundersImage.startsWith("http")}
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="flex items-center gap-2 text-[#F59E0B]">
                  <Flame className="h-5 w-5 animate-pulse" />
                  <span className="text-sm font-bold uppercase tracking-wider">{foundersLabel}</span>
                </div>

                <p className="font-serif text-sm md:text-base leading-relaxed text-[#FDE68A] opacity-90">
                  {bodyText}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#F59E0B]/30 pt-4 text-xs text-[#FEF3C7]">
                  <div>
                    <span className="text-[#F59E0B] block">ORIGIN:</span>
                    <span>SACRED VALHALLA FORGE</span>
                  </div>
                  <div>
                    <span className="text-[#F59E0B] block">CREED:</span>
                    <span>NO RULES // PURE METAL ENERGY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
