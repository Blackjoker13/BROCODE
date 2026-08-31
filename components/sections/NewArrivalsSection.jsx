"use client";

import { useState } from "react";
import Image from "next/image";
import { useStorefront } from "@/lib/storefront/StorefrontContext";
import { SectionHeaderMotion, MagneticElement } from "@/components/ui/KineticText";
import { Tilt3DCard, StaggerContainer, StaggerItem } from "@/components/ui/MotionCard";
import { Check, Zap, Flame } from "lucide-react";
import { safeJsonParse } from "@/lib/utils";

export default function NewArrivalsSection() {
  const { newArrivals, activeTheme, addToCart } = useStorefront();
  const [addedId, setAddedId] = useState(null);

  const displayProducts =
    newArrivals && newArrivals.length > 0
      ? newArrivals
      : [
          {
            id: "sabaton",
            title: '"TEMPLARS" T-SHIRT BLACK BY SABATON',
            price: 38.0,
            images: ["/images/sabaton_tee.jpg"],
            badges: ["NEW", "LIMITED"],
            colors: ["#EF0606", "#000000", "#D3CCC7", "#EFEEE8"],
            category: { name: "BAND T-SHIRT" },
            specs: { gsm: "280 GSM", fabric: "100% COMBED COTTON", rig: "BOX CUT" },
            hex: "0x8F1",
          },
          {
            id: "sabbath",
            title: "BLACK SABBATH T-SHIRT WORLD TOUR",
            price: 36.0,
            images: ["/images/sabbath_tee.jpg"],
            badges: ["NEW", "LIMITED"],
            colors: ["#000000", "#EF0606", "#D3CCC7", "#EFEEE8"],
            category: { name: "BAND T-SHIRT" },
            specs: { gsm: "260 GSM", fabric: "VINTAGE WASH", rig: "RELAXED" },
            hex: "0x8F2",
          },
          {
            id: "bdu_shorts",
            title: 'BDU RIPSTOP SHORT" SHORTS',
            price: 45.0,
            images: ["/images/olive_shorts.jpg"],
            badges: ["NEW", "LIMITED"],
            colors: ["#EF0606", "#000000", "#D3CCC7"],
            category: { name: "SHORTS" },
            specs: { gsm: "320 GSM", fabric: "TACTICAL RIPSTOP", rig: "CARGO" },
            hex: "0x8F3",
          },
          {
            id: "pink_floyd",
            title: "PINK FLOYD T-SHIRT WORLD TOUR",
            price: 35.0,
            images: ["/images/amon_tanktop.jpg"],
            badges: ["NEW", "LIMITED"],
            colors: ["#000000", "#EF0606", "#D3CCC7", "#EFEEE8"],
            category: { name: "BAND T-SHIRT" },
            specs: { gsm: "240 GSM", fabric: "ACID CHARCOAL", rig: "DROP SHOULDER" },
            hex: "0x8F4",
          },
        ];

  const handleQuickAdd = (prod) => {
    addToCart(prod, "Size: L", 1);
    setAddedId(prod.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="new-arrivals" className="content-auto relative w-full bg-transparent px-5 py-20 md:px-10 lg:px-14 select-none">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* =========================================================================
            1. THEME 01: NOIR ACID (4-COLUMN LOOKBOOK FASHION CATALOG)
            ========================================================================= */}
        {activeTheme === "noir" && (
          <div>
            <SectionHeaderMotion
              badge="FRESH RELEASES // DROP 01"
              badgeColor="bg-[#EF0606] text-white"
              title="NEW ARRIVALS"
              actionText="VIEW ALL ARCHIVE"
              actionHref="/catalog"
            />

            <StaggerContainer
              stagger={0.08}
              className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {displayProducts.map((prod, pIdx) => {
                const imgs = safeJsonParse(prod.images, []);
                const badges = safeJsonParse(prod.badges, []);

                return (
                  <StaggerItem key={prod.id || pIdx}>
                    <Tilt3DCard maxTilt={8} scale={1.03}>
                      <div className="group flex flex-col justify-between">
                        <div className="glass-theme-card relative aspect-square w-full overflow-hidden rounded-3xl p-6 border border-black/10">
                          <div className="absolute left-3.5 top-3.5 z-10 flex gap-1.5">
                            {badges.map((badge, idx) => (
                              <span
                                key={idx}
                                className="rounded-lg bg-[#EF0606] px-2 py-0.5 font-geometric text-[8px] font-black uppercase text-white shadow-sm"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>

                          <div className="relative h-full w-full overflow-hidden rounded-2xl">
                            <Image
                              src={imgs[0] || "/images/sabaton_tee.jpg"}
                              alt={prod.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 25vw"
                              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                          </div>
                        </div>

                        <div className="mt-4 px-1">
                          <span className="font-geometric text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500">
                            {prod.category?.name || "STUDIO PIECE"}
                          </span>
                          <h3 className="mt-1 font-didone text-xl font-bold uppercase leading-snug tracking-tight text-black line-clamp-1 group-hover:text-[#EF0606] transition-colors">
                            {prod.title}
                          </h3>
                          <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-2 font-didone text-lg font-black text-black">
                            <span>₹{Math.round((prod.price || 38) * 85).toLocaleString('en-IN')}</span>
                            <span className="font-geometric text-[9px] text-neutral-400">STUDIO CUT</span>
                          </div>
                        </div>
                      </div>
                    </Tilt3DCard>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        )}

        {/* =========================================================================
            2. THEME 02: CYBER KINETIC (ASYMMETRIC BENTO TECH-SPEC HARDWARE GRID)
            ========================================================================= */}
        {activeTheme === "cyber" && (
          <div>
            <SectionHeaderMotion
              badge="VELOCITY RELEASES // 02"
              badgeColor="bg-[#CCFF00] text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]"
              title="BROCODE._HARDWARE"
              actionText="VIEW HARDWARE →"
              actionHref="/catalog"
            />

            {/* Asymmetric Tech Bento Grid */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
              {/* 1 Large Primary Hardware Box */}
              <div className="lg:col-span-6 rounded-3xl border-2 border-[#CCFF00]/40 bg-[#090C10]/95 p-6 md:p-8 backdrop-blur-2xl shadow-[0_0_35px_rgba(204,255,0,0.18)] flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between text-[9px] text-[#00F0FF]">
                    <span>[ FLAGSHIP_0x01 ]</span>
                    <span className="text-[#CCFF00] font-bold">● ONLINE</span>
                  </div>

                  <h3 className="mt-3 text-2xl sm:text-3xl font-black uppercase text-[#CCFF00]">
                    {displayProducts[0].title}
                  </h3>

                  {/* Tech Spec Sheet Table */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-[9px]">
                    <div>
                      <span className="text-neutral-400 block">WEIGHT:</span>
                      <span className="text-white font-bold">{displayProducts[0].specs?.gsm || "280 GSM"}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block">FABRIC:</span>
                      <span className="text-white font-bold">{displayProducts[0].specs?.fabric || "COMBED COTTON"}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block">PHYSX:</span>
                      <span className="text-[#CCFF00] font-bold">ACTIVE 60FPS</span>
                    </div>
                  </div>
                </div>

                <div className="relative my-6 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#CCFF00]/30">
                  <Image
                    src={safeJsonParse(displayProducts[0].images, ["/images/sabaton_tee.jpg"])[0]}
                    alt={displayProducts[0].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <div>
                    <span className="text-[9px] text-neutral-400 block">HEX PRICING</span>
                    <span className="text-2xl font-black text-white">₹{Math.round((displayProducts[0].price || 48) * 85).toLocaleString('en-IN')} INR</span>
                  </div>
                  <button
                    onClick={() => handleQuickAdd(displayProducts[0])}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#CCFF00] px-5 py-2.5 text-xs font-black uppercase text-black shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all hover:bg-[#b8e600]"
                  >
                    {addedId === displayProducts[0].id ? <Check className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                    <span>{addedId === displayProducts[0].id ? "INITIALIZED" : "DEPLOY HARDWARE"}</span>
                  </button>
                </div>
              </div>

              {/* 3 Compact Telemetry Hardware Cards */}
              <div className="lg:col-span-6 flex flex-col justify-between gap-4">
                {displayProducts.slice(1).map((prod, idx) => {
                  const imgs = safeJsonParse(prod.images, ["/images/sabbath_tee.jpg"]);
                  return (
                    <div
                      key={prod.id || idx}
                      className="group flex items-center justify-between gap-4 rounded-3xl border border-white/15 bg-[#090C10]/90 p-4 backdrop-blur-xl transition-all duration-300 hover:border-[#CCFF00] font-mono hover:shadow-[0_0_20px_rgba(204,255,0,0.15)]"
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/20">
                        <Image
                          src={imgs[0]}
                          alt={prod.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      <div className="flex-1">
                        <span className="text-[9px] text-[#00F0FF]">[UNIT_{prod.hex || "0x" + idx}]</span>
                        <h4 className="text-base font-black uppercase text-white group-hover:text-[#CCFF00] line-clamp-1">
                          {prod.title}
                        </h4>
                        <div className="mt-1 flex items-center gap-3 text-[10px] text-neutral-400">
                          <span>{prod.specs?.gsm || "260 GSM"}</span>
                          <span>•</span>
                          <span className="text-white font-bold">₹{Math.round((prod.price || 38) * 85).toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleQuickAdd(prod)}
                        className="h-10 w-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-[#CCFF00] border border-[#CCFF00]/40 hover:bg-[#CCFF00] hover:text-black transition-all"
                      >
                        {addedId === prod.id ? <Check className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. THEME 03: GOTHIC RAGNAROK (MASONRY RELIC VAULT)
            ========================================================================= */}
        {activeTheme === "ragnarok" && (
          <div>
            <SectionHeaderMotion
              badge="UNHOLY INVENTORY // 03"
              badgeColor="bg-[#F59E0B] text-black shadow-[0_0_12px_rgba(245,158,11,0.3)]"
              title="VALHALLA ARMORY"
              actionText="RAID CATALOG →"
              actionHref="/catalog"
            />

            {/* Masonry Relic Vault Grid */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 font-heading">
              {displayProducts.map((prod, pIdx) => {
                const imgs = safeJsonParse(prod.images, ["/images/sabaton_tee.jpg"]);
                return (
                  <div
                    key={prod.id || pIdx}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-[#F59E0B]/40 bg-[#120D0D]/95 p-5 backdrop-blur-2xl shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-500 hover:border-[#F59E0B] hover:-translate-y-2"
                  >
                    {/* Ancient Iron Corner Rivets */}
                    <div className="absolute top-2 left-2 text-[10px] text-[#F59E0B]">ᛟ</div>
                    <div className="absolute top-2 right-2 text-[10px] text-[#F59E0B]">ᛟ</div>

                    <div>
                      <div className="flex items-center justify-between text-[9px] text-[#F59E0B]">
                        <span>RELIC #{pIdx + 1}</span>
                        <span className="rounded-full bg-[#F59E0B]/20 px-2 py-0.5 font-bold text-[#FEF3C7]">
                          🔥 FORGED
                        </span>
                      </div>

                      <div className="relative my-4 aspect-square w-full overflow-hidden rounded-xl border border-[#F59E0B]/30 p-1">
                        <div className="relative h-full w-full overflow-hidden rounded-lg">
                          <Image
                            src={imgs[0]}
                            alt={prod.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                      </div>

                      <h3 className="text-lg font-black uppercase text-[#FEF3C7] group-hover:text-[#F59E0B] transition-colors line-clamp-1">
                        {prod.title}
                      </h3>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#F59E0B]/20 pt-3">
                      <div>
                        <span className="text-[8px] text-[#FDE68A]/60 block uppercase">GOLD VALUE</span>
                        <span className="text-xl font-black text-[#FEF3C7]">₹{Math.round((prod.price || 52) * 85).toLocaleString('en-IN')}</span>
                      </div>

                      <button
                        onClick={() => handleQuickAdd(prod)}
                        className="flex items-center gap-1.5 rounded-xl bg-[#F59E0B] px-3.5 py-2 text-xs font-black uppercase text-black shadow-lg hover:bg-amber-400 transition-all"
                      >
                        {addedId === prod.id ? <Check className="h-3.5 w-3.5" /> : <Flame className="h-3.5 w-3.5" />}
                        <span>{addedId === prod.id ? "CLAIMED" : "CLAIM"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
