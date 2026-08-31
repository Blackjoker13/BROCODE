"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useStorefront } from "@/lib/storefront/StorefrontContext";
import { motion, AnimatePresence } from "framer-motion";
import { WordReveal, MagneticElement, KineticRibbon } from "@/components/ui/KineticText";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Radio,
  Pause,
  Play,
  Flame,
  Zap,
} from "lucide-react";

export default function PinkFloydBanner() {
  const { tourBanners, banners, tourBanner, activeTheme } = useStorefront();

  const defaultBanner = {
    title: "PINK FLOYD WORLD TOUR",
    subtitle: "PINK FLOYD COLLECTION TOUR // THE DARK SIDE OF THE MOON",
    tag: "[ COLLECTION ]",
    buttonText: "EXPLORE COLLECTION",
    buttonLink: "#featured-drop",
    image: "/images/pink_floyd_banner.jpg",
  };

  // Compile active slides list - strictly include all active banners
  const slides =
    banners && banners.length > 0
      ? banners
      : tourBanners && tourBanners.length > 0
      ? tourBanners
      : [tourBanner || defaultBanner];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play slideshow every 3.5 seconds (3500ms)
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 3500);

    return () => clearInterval(timer);
  }, [slides.length, isPaused, nextSlide]);

  // Keep index within bounds if slide count changes
  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  const currentBanner = slides[currentIndex] || defaultBanner;

  return (
    <section
      id="tour-banners"
      className="content-auto relative w-full overflow-hidden bg-[#000000] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* =========================================================================
          1. THEME 01: NOIR ACID (WIDESCREEN BRUTALIST SLIDESHOW)
          ========================================================================= */}
      {activeTheme === "noir" && (
        <>
          <KineticRibbon
            text={`${currentBanner.title} // ${currentBanner.subtitle || "EXCLUSIVE MERCH DROP"} // BROCODE VAULT`}
            bg="bg-[#EF0606]"
            textColor="text-white"
            speed={22}
          />

          <div className="relative mx-auto h-[440px] w-full md:h-[520px] lg:h-[580px] overflow-hidden group">
            {/* Background Slideshow Image with Crossfade */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`noir-slide-${currentIndex}-${currentBanner.id || currentIndex}`}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute inset-0 h-full w-full"
              >
                <Image
                  src={currentBanner.image || "/images/pink_floyd_banner.jpg"}
                  alt={currentBanner.title}
                  fill
                  priority={currentIndex === 0}
                  unoptimized={
                    currentBanner.image?.startsWith("/uploads/") ||
                    currentBanner.image?.startsWith("http")
                  }
                  sizes="100vw"
                  className="h-full w-full object-cover object-center brightness-90"
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient Overlays */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#000000]/95 via-[#000000]/50 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#000000]/85 via-[#000000]/30 to-transparent z-10" />

            {/* Slide Content Box */}
            <div className="absolute bottom-12 left-6 z-20 max-w-2xl md:bottom-16 md:left-12 lg:left-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`noir-text-${currentIndex}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-3 py-1 font-geometric text-[9px] font-black uppercase tracking-[0.25em] text-[#EFEEE8] backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#EF0606] animate-ping" />
                    <span>{currentBanner.tag || `[ BANNER 0${currentIndex + 1} ]`}</span>
                  </div>

                  <WordReveal
                    text={currentBanner.title}
                    className="mt-3 font-didone text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.85] tracking-tight text-white drop-shadow-2xl"
                  />

                  <p className="mt-3 font-geometric text-[11px] font-bold uppercase tracking-[0.2em] text-[#D3CCC7]">
                    {currentBanner.subtitle || "EXCLUSIVE MERCH DROP"}
                  </p>

                  <div className="mt-6">
                    <MagneticElement strength={16}>
                      <a
                        href={currentBanner.buttonLink || "#featured-drop"}
                        className="btn-shimmer inline-flex items-center gap-2.5 rounded-xl bg-white px-6 py-3 font-geometric text-xs font-black uppercase tracking-wider text-black transition-all duration-300 hover:bg-[#EF0606] hover:text-white shadow-xl"
                      >
                        <span>{currentBanner.buttonText || "EXPLORE COLLECTION"}</span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </MagneticElement>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slideshow Interactive Controls (If > 1 Banner) */}
            {slides.length > 1 && (
              <>
                {/* Arrow Controls */}
                <div className="absolute inset-y-0 right-6 z-20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous Slide"
                    className="h-10 w-10 rounded-full border border-white/20 bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#EF0606] hover:border-[#EF0606] transition-all cursor-pointer shadow-lg"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next Slide"
                    className="h-10 w-10 rounded-full border border-white/20 bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#EF0606] hover:border-[#EF0606] transition-all cursor-pointer shadow-lg"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Progress Indicators / Navigation Dots */}
                <div className="absolute bottom-5 right-6 z-20 flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
                  <span className="font-mono text-[9px] text-white/80 font-bold mr-1">
                    0{currentIndex + 1} / 0{slides.length}
                  </span>
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        currentIndex === i
                          ? "w-6 bg-[#EF0606]"
                          : "w-1.5 bg-white/40 hover:bg-white/80"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                  {isPaused && (
                    <span className="font-mono text-[8px] text-amber-400 font-bold ml-1">
                      [PAUSED]
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* =========================================================================
          2. THEME 02: CYBER KINETIC (SPLIT-SCREEN HOLOGRAPHIC SLIDESHOW)
          ========================================================================= */}
      {activeTheme === "cyber" && (
        <>
          <KineticRibbon
            text="BROCODE. CYBER TOUR // VELOCITY 60FPS // PROCEDURAL DRAPE MATRIX // AUDIO FREQ 44.1KHZ"
            bg="bg-[#CCFF00]"
            textColor="text-black"
            speed={20}
          />

          <div className="relative mx-auto max-w-7xl px-5 py-12 md:py-16 font-mono">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
              {/* Left Terminal: Audio Waveform Equalizer & Dynamic Text */}
              <div className="lg:col-span-6 rounded-3xl border border-[#CCFF00]/40 bg-[#080B10]/95 p-6 md:p-8 backdrop-blur-2xl shadow-[0_0_35px_rgba(204,255,0,0.15)]">
                <div className="flex items-center justify-between border-b border-[#CCFF00]/20 pb-3 text-xs text-[#CCFF00]">
                  <span className="flex items-center gap-2">
                    <Radio className="h-4 w-4 animate-pulse" />
                    SLIDE TELEMETRY [0{currentIndex + 1}/0{slides.length}]
                  </span>
                  <span className="text-[#00F0FF]">ROTATION: 3.5s AUTO</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`cyber-text-${currentIndex}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-[#CCFF00] tracking-tight">
                      {currentBanner.title}
                    </h2>
                    <p className="mt-2 text-xs text-neutral-300">
                      {currentBanner.subtitle || "HIGH-VELOCITY SOUND WAVE SYNCHRONIZATION // PROCEDURAL APPAREL"}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Animated 16-Bar Waveform Equalizer */}
                <div className="mt-6 flex items-end gap-1.5 h-14 border-b border-white/10 pb-2">
                  {[25, 60, 45, 90, 100, 75, 40, 85, 95, 30, 70, 80, 65, 90, 50, 85].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-[#00F0FF] to-[#CCFF00] rounded-t-sm"
                      style={{ height: `${h}%`, opacity: 0.8 + (i % 2) * 0.2 }}
                    />
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400">
                    STATUS: {isPaused ? "SLIDESHOW_HOLD" : "STREAMING_AUTO"}
                  </span>
                  <a
                    href={currentBanner.buttonLink || "#featured-drop"}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#CCFF00] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all hover:bg-[#b8e600]"
                  >
                    <span>{currentBanner.buttonText || "INITIALIZE CAPSULE"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Right Terminal: Hologram Visualizer Box */}
              <div className="lg:col-span-6 relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-[#00F0FF]/40 shadow-[0_0_30px_rgba(0,240,255,0.15)] group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`cyber-img-${currentIndex}`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 h-full w-full"
                  >
                    <Image
                      src={currentBanner.image || "/images/pink_floyd_banner.jpg"}
                      alt={currentBanner.title}
                      fill
                      unoptimized={
                        currentBanner.image?.startsWith("/uploads/") ||
                        currentBanner.image?.startsWith("http")
                      }
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B10]/90 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 rounded-md border border-[#CCFF00]/50 bg-[#080B10]/80 px-3 py-1 font-mono text-[9px] text-[#CCFF00]">
                  [ HOLOGRAM: 0{currentIndex + 1}/{slides.length} ]
                </div>

                {/* Cyber Dot Indicators */}
                {slides.length > 1 && (
                  <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded transition-all ${
                          currentIndex === idx
                            ? "w-6 bg-[#CCFF00]"
                            : "w-2 bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          3. THEME 03: GOTHIC RAGNAROK (VALHALLA WAR TOUR TAPESTRY SLIDESHOW)
          ========================================================================= */}
      {activeTheme === "ragnarok" && (
        <>
          <KineticRibbon
            text="UNHOLY VALHALLA WAR TOUR // FORGED IN DARKNESS // AMON AMARTH RELICS // BLOOD & EMBERS"
            bg="bg-gradient-to-r from-[#881337] via-[#D97706] to-[#881337]"
            textColor="text-white"
            speed={20}
          />

          <div className="relative mx-auto max-w-7xl px-5 py-12 md:py-16 font-heading">
            <div className="relative aspect-[21/9] w-full min-h-[380px] overflow-hidden rounded-3xl border-2 border-[#F59E0B]/50 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`ragnarok-slide-${currentIndex}`}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 h-full w-full"
                >
                  <Image
                    src={currentBanner.image || "/images/pink_floyd_banner.jpg"}
                    alt={currentBanner.title}
                    fill
                    unoptimized={
                      currentBanner.image?.startsWith("/uploads/") ||
                      currentBanner.image?.startsWith("http")
                    }
                    className="object-cover brightness-75"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-[#100C0C]/95 via-[#100C0C]/50 to-transparent" />

              <div className="absolute bottom-10 left-8 z-10 max-w-xl text-left">
                <span className="text-xs text-[#F59E0B] tracking-widest uppercase block mb-2">
                  ᚱ {currentBanner.tag || `RELIC WAR BANNER 0${currentIndex + 1}`} ᚱ
                </span>
                <h3 className="text-3xl sm:text-5xl font-black uppercase text-[#FEF3C7] leading-tight">
                  {currentBanner.title}
                </h3>
                <p className="mt-2 text-xs font-serif text-[#FDE68A] opacity-90">
                  {currentBanner.subtitle || "ANCIENT WAR CLAN ARTIFACTS // FORGED IN SACRED EMBERS"}
                </p>
                <div className="mt-5">
                  <a
                    href={currentBanner.buttonLink || "#featured-drop"}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#F59E0B] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-black hover:bg-[#d97706] transition-all shadow-lg"
                  >
                    <span>{currentBanner.buttonText || "CLAIM WAR RELIC"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Ragnarok Slide Controls */}
              {slides.length > 1 && (
                <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="h-9 w-9 rounded-xl border border-[#F59E0B]/50 bg-black/70 text-[#F59E0B] hover:bg-[#F59E0B] hover:text-black flex items-center justify-center transition-all cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="h-9 w-9 rounded-xl border border-[#F59E0B]/50 bg-black/70 text-[#F59E0B] hover:bg-[#F59E0B] hover:text-black flex items-center justify-center transition-all cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
