"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useStorefront } from "@/lib/storefront/StorefrontContext";

/**
 * Word-by-word staggered kinetic text reveal
 */
export function WordReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.04,
  as: Component = "h2",
}) {
  const words = typeof text === "string" ? text.split(" ") : [];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hidden: {
      opacity: 0,
      y: "100%",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <Component className={`overflow-hidden ${className}`}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="inline-flex flex-wrap gap-x-[0.28em] gap-y-[0.05em]"
      >
        {words.map((word, index) => (
          <span key={index} className="inline-block overflow-hidden pb-[0.08em]">
            <motion.span variants={child} className="inline-block">
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
}

/**
 * Magnetic element that softly pulls toward cursor on hover (Zero React re-renders)
 */
export function MagneticElement({ children, className = "", strength = 18 }) {
  const ref = useRef(null);
  const rafRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current || rafRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const middleX = clientX - (rect.left + rect.width / 2);
      const middleY = clientY - (rect.top + rect.height / 2);
      const x = (middleX / rect.width) * strength;
      const y = (middleY / rect.height) * strength;
      ref.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0px)`;
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (ref.current) {
      ref.current.style.transform = "translate3d(0px, 0px, 0px)";
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: "transform 0.15s ease-out",
      }}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Section Header with animated badge line and staggered title (theme-adaptive)
 */
export function SectionHeaderMotion({
  badge,
  badgeColor,
  title,
  actionText,
  actionHref = "#catalog",
  className = "",
  theme,
}) {
  const { activeTheme } = useStorefront();
  const currentTheme = theme || activeTheme || "noir";

  const themeStyles = {
    noir: {
      border: "border-black/10",
      badgeText: "text-black/70",
      badgeDot: "bg-[#EF0606]",
      titleFont: "font-didone",
      titleColor: "text-black",
      btnClass: "bg-black text-white hover:bg-[#EF0606]",
    },
    cyber: {
      border: "border-[#CCFF00]/25",
      badgeText: "text-[#00F0FF] font-mono",
      badgeDot: "bg-[#CCFF00] shadow-[0_0_12px_rgba(204,255,0,0.8)]",
      titleFont: "font-mono",
      titleColor: "text-[#CCFF00] drop-shadow-[0_0_30px_rgba(204,255,0,0.4)]",
      btnClass: "bg-[#CCFF00] text-black hover:bg-[#b8e600] font-mono shadow-[0_0_20px_rgba(204,255,0,0.3)]",
    },
    ragnarok: {
      border: "border-[#F59E0B]/30",
      badgeText: "text-[#F59E0B] font-heading",
      badgeDot: "bg-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.8)]",
      titleFont: "font-heading",
      titleColor: "text-[#FEF3C7] drop-shadow-[0_0_30px_rgba(245,158,11,0.45)]",
      btnClass: "bg-[#F59E0B] text-black hover:bg-amber-400 font-heading shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    },
  };

  const style = themeStyles[currentTheme] || themeStyles.noir;
  const activeBadgeColor = badgeColor || style.badgeDot;

  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between border-b ${style.border} pb-5 gap-3 ${className}`}>
      <div>
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`flex items-center gap-2 font-geometric text-[10px] font-black uppercase tracking-[0.25em] ${style.badgeText}`}
        >
          <span className={`h-2 w-2 rounded-full ${activeBadgeColor} animate-pulse`} />
          <span>{badge}</span>
        </motion.div>

        <WordReveal
          text={title}
          className={`mt-1.5 ${style.titleFont} text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight ${style.titleColor} leading-none uppercase`}
        />
      </div>

      {actionText && (
        <MagneticElement strength={14}>
          <a
            href={actionHref}
            className={`group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-geometric text-[11px] font-black uppercase tracking-wider transition-all hover:scale-105 shadow-md self-start sm:self-auto ${style.btnClass}`}
          >
            <span>{actionText}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              ↗
            </span>
          </a>
        </MagneticElement>
      )}
    </div>
  );
}

/**
 * Kinetic Ticker Ribbon for unexpected brutalist transitions
 */
export function KineticRibbon({
  text = "BROCODE ARCHIVE // NEW DROPS 2026 // LIMITED PIECES // AUTHENTIC MERCH",
  bg = "bg-[#000000]",
  textColor = "text-[#EFEEE8]",
  speed = 20,
}) {
  return (
    <div className={`relative w-full overflow-hidden ${bg} py-2 select-none border-y border-white/10 z-20`}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
        className="flex w-[200%] whitespace-nowrap font-geometric text-[10px] font-black uppercase tracking-[0.3em]"
      >
        <span className={`flex gap-8 ${textColor} mx-4`}>
          <span>{text}</span>
          <span>✦</span>
          <span>{text}</span>
          <span>✦</span>
          <span>{text}</span>
          <span>✦</span>
        </span>
        <span className={`flex gap-8 ${textColor} mx-4`}>
          <span>{text}</span>
          <span>✦</span>
          <span>{text}</span>
          <span>✦</span>
          <span>{text}</span>
          <span>✦</span>
        </span>
      </motion.div>
    </div>
  );
}
