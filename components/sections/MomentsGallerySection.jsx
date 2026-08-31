"use client";

import Image from "next/image";
import { useStorefront } from "@/lib/storefront/StorefrontContext";
import { motion } from "framer-motion";
import { WordReveal, MagneticElement } from "@/components/ui/KineticText";
import { Camera, ArrowUpRight, Zap, Flame } from "lucide-react";

export default function MomentsGallerySection() {
  const { cms, activeTheme } = useStorefront();

  const moments = cms?.MOMENTS_GALLERY || {};
  const content = moments.content || {};

  const title = content.title || moments.title || "BROCODE MOMENTS";
  const tagline = content.tagline || moments.subtitle || "[ FOLLOW US ]";
  const instagramHandle = content.instagramHandle || "_brocode._co._";
  const instagramUrl =
    content.instagramUrl ||
    "https://www.instagram.com/_brocode._co._?igsi=ajhuZDRvbW50Yzhu";

  const defaultMediaList = [
    { id: 1, img: "/images/pallet_rack.jpg" },
    { id: 2, img: "/images/pink_floyd_banner.jpg" },
    { id: 3, img: "/images/patch.jpg" },
    { id: 4, img: "/images/cap.jpg" },
    { id: 5, img: "/images/founders.jpg" },
    { id: 6, img: "/images/screaming_vocalist.jpg" },
    { id: 7, img: "/images/amon_shorts.jpg" },
    { id: 8, img: "/images/sabaton_tee.jpg" },
  ];

  const rawMedia = moments.media || content.media || [];
  const mediaList =
    Array.isArray(rawMedia) && rawMedia.length > 0
      ? rawMedia.map((m, idx) => (typeof m === "string" ? { id: idx + 1, img: m } : m))
      : defaultMediaList;

  return (
    <section id="moments" className="content-auto relative w-full bg-transparent px-5 py-24 md:px-10 lg:px-14 select-none overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* =========================================================================
            1. THEME 01: NOIR ACID (CIRCULAR & RECTANGULAR FILM STRIP REEL)
            ========================================================================= */}
        {activeTheme === "noir" && (
          <div>
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-black/5 px-3.5 py-1 font-geometric text-[10px] font-black uppercase tracking-[0.3em]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#EF0606]" />
                <span>{tagline}</span>
              </div>

              <WordReveal
                text={title}
                className="mt-3 font-didone text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-black"
              />

              <div className="mt-5">
                <MagneticElement strength={16}>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 font-geometric text-[11px] font-black uppercase tracking-wider text-white hover:bg-[#EF0606] transition-all shadow-xl"
                  >
                    <Camera className="h-4 w-4 text-[#EF0606]" />
                    <span>@{instagramHandle}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </MagneticElement>
              </div>
            </div>

            <div className="mt-14 flex items-center justify-start md:justify-center gap-4 md:gap-5 overflow-x-auto pb-6 pt-2 no-scrollbar px-4">
              {mediaList.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className={`group relative shrink-0 aspect-square w-32 sm:w-36 md:w-40 lg:w-44 overflow-hidden ${
                    idx % 2 === 0 ? "rounded-full" : "rounded-3xl"
                  } border-2 border-black/15 bg-black p-1 shadow-lg transition-all duration-500 hover:scale-110 hover:border-[#EF0606]`}
                >
                  <div className={`relative h-full w-full overflow-hidden ${idx % 2 === 0 ? "rounded-full" : "rounded-2xl"}`}>
                    <Image
                      src={item.img}
                      alt="Brocode Moment"
                      fill
                      unoptimized={item.img?.startsWith("/uploads/") || item.img?.startsWith("http")}
                      sizes="180px"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-115"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            2. THEME 02: CYBER KINETIC (HOLOGRAPHIC GLITCH DATA MATRIX GRID)
            ========================================================================= */}
        {activeTheme === "cyber" && (
          <div className="rounded-3xl border border-[#CCFF00]/40 bg-[#080B10]/95 p-6 md:p-10 font-mono backdrop-blur-2xl shadow-[0_0_35px_rgba(204,255,0,0.15)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#CCFF00]/20 pb-4 gap-4">
              <div>
                <span className="text-[10px] text-[#00F0FF] flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#CCFF00]" />
                  [ {tagline} // DATA FEED ]
                </span>
                <h2 className="mt-2 text-3xl sm:text-4xl font-black uppercase text-[#CCFF00]">
                  {title}
                </h2>
              </div>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#CCFF00] px-4 py-2 text-xs font-black uppercase text-black hover:bg-[#b8e600] transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)]"
              >
                <Camera className="h-4 w-4" />
                <span>@{instagramHandle}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Cyber Glitch Grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {mediaList.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-white/15 bg-[#090C10] p-1.5 transition-all hover:border-[#CCFF00] hover:shadow-[0_0_25px_rgba(204,255,0,0.25)]"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-xl">
                    <Image
                      src={item.img}
                      alt="Cyber Moment"
                      fill
                      unoptimized={item.img?.startsWith("/uploads/") || item.img?.startsWith("http")}
                      sizes="220px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080B10]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-[8px] text-[#CCFF00]">
                        [SYS_FEED // 0x{idx + 1}A]
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            3. THEME 03: GOTHIC RAGNAROK (SACRED WAR RELIC WALL)
            ========================================================================= */}
        {activeTheme === "ragnarok" && (
          <div className="rounded-3xl border-2 border-[#F59E0B]/40 bg-[#120D0D]/95 p-6 md:p-10 font-heading backdrop-blur-2xl shadow-[0_0_35px_rgba(245,158,11,0.2)] text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-[#F59E0B]">
              <Flame className="h-4 w-4 animate-pulse" />
              <span>ᚱ {tagline} ᚱ</span>
              <Flame className="h-4 w-4 animate-pulse" />
            </div>

            <h2 className="mt-2 text-4xl sm:text-5xl font-black uppercase text-[#FEF3C7]">
              {title}
            </h2>

            <div className="mt-4">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F59E0B] px-5 py-2.5 font-heading text-xs font-black uppercase text-black hover:bg-amber-400 transition-all shadow-lg"
              >
                <Camera className="h-4 w-4" />
                <span>@{instagramHandle}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Sacred Arched Shields Grid */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-5 text-left">
              {mediaList.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="group relative aspect-[4/5] overflow-hidden rounded-t-[50px] rounded-b-2xl border-2 border-[#F59E0B]/40 bg-[#161010] p-1.5 transition-all hover:border-[#F59E0B] hover:-translate-y-2 shadow-xl"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-t-[42px] rounded-b-xl">
                    <Image
                      src={item.img}
                      alt="Valhalla Chronicle"
                      fill
                      unoptimized={item.img?.startsWith("/uploads/") || item.img?.startsWith("http")}
                      sizes="220px"
                      className="object-cover transition-transform duration-700 group-hover:scale-115"
                    />
                    <div className="absolute top-2 right-2 rounded-full bg-[#141010]/80 px-2 py-0.5 text-[9px] text-[#F59E0B] border border-[#F59E0B]/40">
                      ᚱ
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
