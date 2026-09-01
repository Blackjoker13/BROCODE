"use client";

import { useMemo } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { useStorefront } from "@/lib/storefront/StorefrontContext";
import { SectionHeaderMotion } from "@/components/ui/KineticText";
import { Tilt3DCard, StaggerContainer, StaggerItem } from "@/components/ui/MotionCard";
import { Zap, Flame, Sparkles } from "lucide-react";

export default function CategoriesSection() {
  const { categories, activeTheme } = useStorefront();

  const displayCategories = categories && categories.length > 0 ? categories : [
    { id: "ropa", name: "ROPA", itemCount: 1087, image: "/images/pallet_rack.jpg", hex: "0x1A" },
    { id: "bands", name: "BANDS", itemCount: 757, image: "/images/pink_floyd_banner.jpg", actionText: "SHOP BANDS", hex: "0x2B" },
    { id: "accesorios", name: "ACCESORIOS", itemCount: 347, image: "/images/tactical_bag.jpg", hex: "0x3C" },
    { id: "musica", name: "MUSICA", itemCount: 97, image: "/images/founders.jpg", hex: "0x4D" },
    { id: "moda", name: "MODA", itemCount: 427, image: "/images/amon_shorts.jpg", hex: "0x5E" },
  ];

  const getCategoryHref = (nameOrId) => {
    const term = (nameOrId || "").toLowerCase();
    return `/catalog?category=${encodeURIComponent(term)}`;
  };

  return (
    <section id="categories" className="content-auto relative w-full bg-transparent px-5 py-20 md:px-10 lg:px-14 select-none">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* =========================================================================
            1. THEME 01: NOIR ACID (CIRCULAR MINIMALIST LOOKBOOK PODS)
            ========================================================================= */}
        {activeTheme === "noir" && (
          <div>
            <SectionHeaderMotion
              badge="ARCHIVE DIRECTORY // 01"
              badgeColor="bg-[#EF0606] text-white"
              title="CATEGORIES"
              actionText="SHOP ALL CATALOG"
              actionHref="/catalog"
            />

            <StaggerContainer
              stagger={0.07}
              className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-6"
            >
              {displayCategories.map((cat, idx) => (
                <StaggerItem key={cat.id || idx}>
                  <Tilt3DCard maxTilt={8} scale={1.02}>
                    <a
                      href={getCategoryHref(cat.name || cat.id)}
                      className="glass-theme-card group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-black/10 block cursor-pointer transition-transform hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-didone text-lg sm:text-2xl md:text-3xl font-black leading-tight tracking-tight text-black transition-colors group-hover:text-[#EF0606] line-clamp-1">
                            {cat.name}
                          </h3>
                          <p className="mt-0.5 sm:mt-1.5 font-geometric text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-neutral-500">
                            {cat.itemCount || "100+"} ITEMS
                          </p>
                        </div>
                        <span className="font-geometric text-xs font-bold text-black/30 group-hover:text-[#EF0606]">
                          ✦
                        </span>
                      </div>

                      {/* Circular Preview Container */}
                      <div className="relative mx-auto mt-3 sm:mt-7 aspect-square w-full max-w-[120px] sm:max-w-[150px] md:max-w-[175px] overflow-hidden rounded-full border-2 sm:border-[3px] border-black p-0.5 sm:p-1 shadow-lg transition-all duration-300 group-hover:border-[#EF0606]">
                        <div className="relative h-full w-full overflow-hidden rounded-full">
                          <OptimizedImage
                            src={cat.image || "/images/pallet_rack.jpg"}
                            alt={cat.name}
                            width={180}
                            height={180}
                            priority={idx < 2}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-115"
                          />
                        </div>

                        {cat.actionText && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity group-hover:bg-black/20">
                            <span className="rounded-xl bg-black px-3.5 py-1.5 font-geometric text-[9px] font-black uppercase tracking-wider text-white shadow-lg group-hover:bg-[#EF0606]">
                              {cat.actionText}
                            </span>
                          </div>
                        )}
                      </div>
                    </a>
                  </Tilt3DCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}

        {/* =========================================================================
            2. THEME 02: CYBER KINETIC (ASYMMETRIC BENTO TELEMETRY MATRIX)
            ========================================================================= */}
        {activeTheme === "cyber" && (
          <div>
            <SectionHeaderMotion
              badge="CYBER SECTORS // TELEMETRY 02"
              badgeColor="bg-[#CCFF00] text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]"
              title="SYSTEM_SECTORS"
              actionText="ACCESS ALL DATASETS →"
              actionHref="/catalog"
            />

            {/* Asymmetric Cyber Bento Matrix */}
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-2">
              {/* Feature Large Bento Module */}
              <a
                href={getCategoryHref(displayCategories[0]?.name || displayCategories[0]?.id)}
                className="group relative col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 overflow-hidden rounded-3xl border border-[#CCFF00]/40 bg-[#080B10]/95 p-6 backdrop-blur-2xl shadow-[0_0_30px_rgba(204,255,0,0.12)] block cursor-pointer transition-all hover:border-[#CCFF00] hover:shadow-[0_0_40px_rgba(204,255,0,0.25)]"
              >
                {/* Tech Corner Crosshairs */}
                <div className="absolute top-3 left-3 text-[9px] font-mono text-[#CCFF00]">┌ SYSTEM_01</div>
                <div className="absolute top-3 right-3 text-[9px] font-mono text-[#CCFF00]">0x99 ┐</div>
                <div className="absolute bottom-3 left-3 text-[9px] font-mono text-[#CCFF00]">└ HARDWARE</div>
                <div className="absolute bottom-3 right-3 text-[9px] font-mono text-[#CCFF00]">SYNC_OK ┘</div>

                <div className="relative z-10 flex h-full flex-col justify-between pt-6 pb-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-[#00F0FF]/40 bg-[#00F0FF]/15 px-2.5 py-0.5 font-mono text-[9px] font-bold text-[#00F0FF]">
                      <Zap className="h-3 w-3 animate-pulse" />
                      PRIMARY HARDWARE CAPSULE
                    </span>
                    <h3 className="mt-3 font-mono text-3xl sm:text-4xl font-black uppercase text-[#CCFF00] tracking-tight">
                      {displayCategories[0].name} // CORE
                    </h3>
                    <p className="mt-1 font-mono text-xs text-neutral-400">
                      TELEMETRY UNITS: {displayCategories[0].itemCount || 1087} // HIGH-DENSITY APPAREL
                    </p>
                  </div>

                  <div className="relative my-6 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#CCFF00]/30">
                    <OptimizedImage
                      src={displayCategories[0].image || "/images/pallet_rack.jpg"}
                      alt={displayCategories[0].name}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080B10] via-transparent to-transparent" />
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-3 font-mono text-xs">
                    <span className="text-neutral-400">HEX_SECTOR: [0x1A_ROPA]</span>
                    <span className="text-[#CCFF00] font-bold group-hover:underline">INITIALIZE SECTOR →</span>
                  </div>
                </div>
              </a>

              {/* 4 Modular Compact Bento Capsules */}
              {displayCategories.slice(1).map((cat, idx) => (
                <a
                  key={cat.id || idx}
                  href={getCategoryHref(cat.name || cat.id)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-[#090C10]/90 p-5 backdrop-blur-xl transition-all duration-300 hover:border-[#CCFF00] hover:shadow-[0_0_25px_rgba(204,255,0,0.2)] block cursor-pointer"
                >
                  <div className="flex items-center justify-between font-mono text-[9px]">
                    <span className="text-[#00F0FF]">[HEX_{cat.hex || "0x" + idx}]</span>
                    <span className="text-[#CCFF00] font-bold">● ONLINE</span>
                  </div>

                  <div className="my-3 flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/20">
                      <OptimizedImage
                        src={cat.image || "/images/pallet_rack.jpg"}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-115"
                      />
                    </div>
                    <div>
                      <h4 className="font-mono text-xl font-black uppercase text-white group-hover:text-[#CCFF00]">
                        {cat.name}
                      </h4>
                      <span className="font-mono text-[10px] text-neutral-400">
                        {cat.itemCount || "250"} UNITS
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-2 font-mono text-[9px] text-neutral-400 group-hover:text-[#CCFF00]">
                    <span>STATUS: READY</span>
                    <span className="font-bold">ACCESS →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            3. THEME 03: GOTHIC RAGNAROK (MEDIEVAL ARCHED STONE HERALDIC SHIELDS)
            ========================================================================= */}
        {activeTheme === "ragnarok" && (
          <div>
            <SectionHeaderMotion
              badge="VALHALLA REALMS // RELICS 03"
              badgeColor="bg-[#F59E0B] text-black shadow-[0_0_12px_rgba(245,158,11,0.3)]"
              title="SACRED DOMAINS"
              actionText="FORGE INVENTORY →"
              actionHref="/catalog"
            />

            {/* Medieval Arched Stone Portals */}
            <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-5">
              {displayCategories.map((cat, idx) => (
                <a
                  key={cat.id || idx}
                  href={getCategoryHref(cat.name || cat.id)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-t-[40px] sm:rounded-t-[70px] rounded-b-2xl sm:rounded-b-3xl border-2 border-[#F59E0B]/40 bg-[#120D0D]/95 p-2.5 sm:p-4 text-center backdrop-blur-2xl shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-500 hover:border-[#F59E0B] hover:-translate-y-2 block cursor-pointer"
                >
                  {/* Arched Heraldic Portal Image */}
                  <div className="relative mx-auto mt-2 aspect-[4/5] w-full overflow-hidden rounded-t-[60px] rounded-b-2xl border border-[#F59E0B]/30 p-1">
                    <div className="relative h-full w-full overflow-hidden rounded-t-[54px] rounded-b-xl">
                      <OptimizedImage
                        src={cat.image || "/images/pallet_rack.jpg"}
                        alt={cat.name}
                        fill
                        priority={idx < 2}
                        className="object-cover transition-transform duration-700 group-hover:scale-115"
                      />
                    </div>
                    {/* Ancient Rune Seal */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-[#F59E0B] bg-[#141010] px-2.5 py-0.5 font-heading text-[10px] font-bold text-[#FEF3C7] shadow-lg">
                      ᚱ
                    </div>
                  </div>

                  <div className="mt-4 pb-2">
                    <h3 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-wider text-[#FEF3C7] transition-colors group-hover:text-[#F59E0B]">
                      {cat.name}
                    </h3>
                    <p className="mt-1 font-heading text-[10px] font-bold uppercase tracking-widest text-[#F59E0B]/80">
                      {cat.itemCount || "100+"} SACRED RELICS
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
