"use client";

import { Suspense } from "react";
import { useStorefront } from "@/lib/storefront/StorefrontContext";
import HeroSection from "@/components/hero/HeroSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import PinkFloydBanner from "@/components/sections/PinkFloydBanner";
import NewArrivalsSection from "@/components/sections/NewArrivalsSection";
import AccessoriesSection from "@/components/sections/AccessoriesSection";
import FeaturedCollectionSection from "@/components/sections/FeaturedCollectionSection";
import AboutSection from "@/components/sections/AboutSection";
import MomentsGallerySection from "@/components/sections/MomentsGallerySection";
import Footer from "@/components/sections/Footer";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export default function StorefrontHome() {
  const { activeTheme } = useStorefront();

  return (
    <main
      data-theme={activeTheme}
      className={`relative min-h-screen w-full overflow-x-hidden transition-colors duration-700 ${
        activeTheme === "cyber"
          ? "bg-[#080B10] text-[#F0F6FC]"
          : activeTheme === "ragnarok"
          ? "bg-[#100C0C] text-[#FEF3C7]"
          : "bg-[#EFEEE8] text-[#000000]"
      }`}
    >
      {/* Ambient Dotted Glow Dynamic Canvas Background with Active Theme Glow */}
      <DottedGlowBackground
        theme={activeTheme}
        className="pointer-events-none fixed inset-0 z-0 opacity-80"
        opacity={activeTheme === "cyber" ? 0.95 : activeTheme === "ragnarok" ? 0.9 : 0.85}
        gap={20}
        radius={1.4}
        speedMin={0.3}
        speedMax={1.2}
        speedScale={1}
        glowRadius={140}
        orbCount={5}
        interactive={true}
      />

      {/* 1. Hero Section with 3D Studio & Kinetic Stencil (Immediate Render) */}
      <HeroSection />

      {/* 2. Categories Section (5 Circular Cards) */}
      <CategoriesSection />

      {/* 3. Pink Floyd World Tour Full-Width Merch Banner */}
      <Suspense fallback={<div className="h-96 w-full bg-[#000000] animate-pulse" />}>
        <PinkFloydBanner />
      </Suspense>

      {/* 4. New Arrivals Section (4 Grid Cards) */}
      <Suspense fallback={<div className="h-96 w-full animate-pulse opacity-50" />}>
        <NewArrivalsSection />
      </Suspense>

      {/* 5. Accessories Section (Caps, Patches, Tactical Bags) */}
      <Suspense fallback={<div className="h-96 w-full animate-pulse opacity-50" />}>
        <AccessoriesSection />
      </Suspense>

      {/* 6. Featured Ragnarok / Amon Amarth Drop */}
      <Suspense fallback={<div className="h-96 w-full animate-pulse opacity-50" />}>
        <FeaturedCollectionSection />
      </Suspense>

      {/* 7. About Us Section (Pallet Display, Founders, Story) */}
      <Suspense fallback={<div className="h-96 w-full animate-pulse opacity-50" />}>
        <AboutSection />
      </Suspense>

      {/* 8. Brocode Moments Community / Instagram Gallery */}
      <Suspense fallback={<div className="h-64 w-full animate-pulse opacity-50" />}>
        <MomentsGallerySection />
      </Suspense>

      {/* 9. Full-Site Adaptive Footer */}
      <Footer />
    </main>
  );
}
