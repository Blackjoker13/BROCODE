"use client";

import { useState } from "react";
import Image from "next/image";
import { useStorefront } from "@/lib/storefront/StorefrontContext";
import { SectionHeaderMotion, MagneticElement } from "@/components/ui/KineticText";
import { Tilt3DCard, StaggerContainer, StaggerItem } from "@/components/ui/MotionCard";
import { Check } from "lucide-react";
import { safeJsonParse } from "@/lib/utils";

export default function AccessoriesSection() {
  const { accessories, activeTheme, addToCart } = useStorefront();
  const [selectedColor, setSelectedColor] = useState({});
  const [addedId, setAddedId] = useState(null);

  const displayItems =
    accessories && accessories.length > 0
      ? accessories
      : [
          {
            id: "cap",
            title: "CAP BLACK BY RAMMSTEIN",
            price: 35.0,
            images: ["/images/cap.jpg"],
            badges: ["NEW"],
            colors: ["#000000", "#EF0606"],
            category: { name: "ACCESORIOS" },
          },
          {
            id: "patch",
            title: 'MASTER OF PUPPETS" PATCH MULTICOLOUR',
            price: 14.0,
            images: ["/images/patch.jpg"],
            badges: ["NEW"],
            colors: ["#000000", "#EF0606", "#D3CCC7"],
            category: { name: "ACCESORIOS" },
          },
          {
            id: "belt_bag",
            title: '"BELT BAG" BUM BAG BLACK BY GOTHICANA',
            price: 49.0,
            images: ["/images/tactical_bag.jpg"],
            badges: ["SOLD OUT", "NEW", "LIMITED"],
            colors: ["#000000", "#EF0606"],
            category: { name: "ACCESORIOS" },
            isOutOfStock: true,
          },
          {
            id: "cole_belt",
            title: '"COLE" BELT BLACK BY GOTHICANA',
            price: 28.0,
            images: ["/images/tactical_bag.jpg"],
            badges: ["NEW"],
            colors: ["#EF0606", "#000000", "#D3CCC7"],
            category: { name: "ACCESORIOS" },
          },
        ];

  const themeConfig = {
    noir: {
      badge: "TACTICAL & HARDWARE GEAR",
      badgeColor: "bg-[#EF0606] text-white",
      title: "ACCESORIOS",
      actionText: "VIEW ALL",
      fontHeading: "font-didone",
      btnClass: "bg-[#000000] hover:bg-[#EF0606] text-white",
      swatchRing: "ring-[#000000]",
    },
    cyber: {
      badge: "TACTICAL HARDWARE // CYBER MODULES",
      badgeColor: "bg-[#CCFF00] text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]",
      title: "TACTICAL_MODULES",
      actionText: "ACCESS HARDWARE →",
      fontHeading: "font-mono",
      btnClass: "bg-[#CCFF00] hover:bg-[#b8e600] text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]",
      swatchRing: "ring-[#CCFF00]",
    },
    ragnarok: {
      badge: "WARRIOR ARTIFACTS // IRON & LEATHER",
      badgeColor: "bg-[#F59E0B] text-black shadow-[0_0_12px_rgba(245,158,11,0.3)]",
      title: "SACRED RELICS",
      actionText: "FORGE RELICS →",
      fontHeading: "font-heading",
      btnClass: "bg-[#F59E0B] hover:bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]",
      swatchRing: "ring-[#F59E0B]",
    },
  };

  const currentTheme = themeConfig[activeTheme] || themeConfig.noir;

  const handleQuickAdd = (item) => {
    if (item.isOutOfStock) return;
    addToCart(item, "Size: ONE SIZE", 1);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="accessories" className="content-auto relative w-full bg-transparent px-5 py-20 md:px-10 lg:px-14 select-none">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <SectionHeaderMotion
          badge={currentTheme.badge}
          badgeColor={currentTheme.badgeColor}
          title={currentTheme.title}
          actionText={currentTheme.actionText}
          actionHref="#featured-drop"
        />

        {/* Staggered Grid of 4 Cards */}
        <StaggerContainer
          stagger={0.08}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {displayItems.map((item, idx) => {
            const imgs = safeJsonParse(item.images, []);
            const badges = safeJsonParse(item.badges, []);
            const colors = safeJsonParse(item.colors, []);

            return (
              <StaggerItem key={item.id || idx}>
                <Tilt3DCard maxTilt={8} scale={1.03}>
                  <div className="group flex flex-col justify-between">
                    {/* Image Box with Adaptive Glass Treatment */}
                    <div className="glass-theme-card relative aspect-square w-full overflow-hidden rounded-3xl p-6">
                      {/* Badges */}
                      <div className="absolute left-3.5 top-3.5 z-10 flex gap-1.5">
                        {badges.map((badge, bIdx) => (
                          <span
                            key={bIdx}
                            className="glass-theme-badge rounded-lg px-2 py-0.5 font-geometric text-[8px] font-black uppercase tracking-wider"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>

                      {/* Product Image via next/image */}
                      <div className="relative flex h-full w-full items-center justify-center">
                        <Image
                          src={imgs[0] || "/images/cap.jpg"}
                          alt={item.title}
                          width={320}
                          height={320}
                          style={{ width: "auto", height: "auto" }}
                          className="max-h-full max-w-full object-contain transition-transform duration-700 ease-out group-hover:scale-110 drop-shadow-md"
                        />
                      </div>

                      {/* Color Swatches Glass Tray */}
                      <div className="glass-theme-surface absolute bottom-3.5 left-3.5 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1">
                        {colors.map((color, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() =>
                              setSelectedColor({ ...selectedColor, [item.id]: cIdx })
                            }
                            style={{ backgroundColor: color }}
                            className={`h-2.5 w-2.5 rounded-full transition-transform ${
                              selectedColor[item.id] === cIdx
                                ? `scale-135 ring-2 ${currentTheme.swatchRing}`
                                : "opacity-85 hover:scale-120"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Product Meta */}
                    <div className="mt-3.5">
                      <h3
                        className={`${currentTheme.fontHeading} text-xl font-bold uppercase leading-tight tracking-tight transition-colors group-hover:text-theme-accent`}
                      >
                        {item.title}
                      </h3>
                      <div className="mt-1 flex items-center justify-between font-geometric">
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                          {item.category?.name || "ACCESORIOS"}
                        </p>
                        <span className="text-xs font-black">
                          ₹{Math.round((typeof item.price === "number" ? item.price : 25) * 85).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Tilt3DCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
