"use client";

import { useStorefront } from "@/lib/storefront/StorefrontContext";
import { MagneticElement } from "@/components/ui/KineticText";

export default function Footer() {
  const { activeTheme } = useStorefront();

  const themeConfig = {
    noir: {
      bg: "bg-[#EF0606] text-white",
      deckleFill: "#EF0606",
      wordmark: "BROCODE.",
      wordmarkFont: "'Bodoni Moda', 'Bodoni Poster', 'Didot', serif",
      wordmarkFill: "#ffffff",
      adminBadge: "bg-[#EF0606]/20 border-[#EF0606]/40 text-white hover:bg-[#EF0606]",
      adminIcon: "text-[#EF0606]",
    },
    cyber: {
      bg: "bg-[#080B10] text-[#F0F6FC] border-t border-[#CCFF00]/40 shadow-[0_-10px_30px_rgba(204,255,0,0.1)]",
      deckleFill: "#080B10",
      wordmark: "BROCODE.",
      wordmarkFont: "'JetBrains Mono', 'Space Mono', monospace",
      wordmarkFill: "#CCFF00",
      adminBadge: "bg-[#CCFF00]/15 border-[#CCFF00]/40 text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black",
      adminIcon: "text-[#CCFF00]",
    },
    ragnarok: {
      bg: "bg-[#100C0C] text-[#FEF3C7] border-t border-[#F59E0B]/40 shadow-[0_-10px_30px_rgba(245,158,11,0.1)]",
      deckleFill: "#100C0C",
      wordmark: "BROCODE.",
      wordmarkFont: "'Cinzel', 'Playfair Display', serif",
      wordmarkFill: "#F59E0B",
      adminBadge: "bg-[#F59E0B]/20 border-[#F59E0B]/40 text-[#F59E0B] hover:bg-[#F59E0B] hover:text-black",
      adminIcon: "text-[#F59E0B]",
    },
  };

  const currentTheme = themeConfig[activeTheme] || themeConfig.noir;

  return (
    <footer className={`relative w-full select-none overflow-hidden font-geometric transition-colors duration-700 ${currentTheme.bg}`}>
      {/* Top Deckle Edge */}
      <div className="absolute inset-x-0 top-0 z-20 h-10 w-full -translate-y-[90%] overflow-hidden pointer-events-none">
        <svg
          className="h-full w-full"
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
          fill={currentTheme.deckleFill}
        >
          <path d="M0,40 L0,18 Q35,4 70,14 T140,8 T210,20 T280,6 T350,16 T420,8 T490,20 T560,6 T630,14 T700,8 T770,20 T840,6 T910,16 T980,8 T1050,20 T1120,6 T1190,14 T1260,8 T1330,16 T1400,6 T1440,14 L1440,40 Z" />
        </svg>
      </div>

      {/* Main Footer Links */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-10 md:px-10 lg:px-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Col 1: CATALOG */}
          <div>
            <h4 className="font-geometric text-[10px] font-black uppercase tracking-[0.25em] opacity-80">
              CATALOG
            </h4>
            <ul className="mt-4 space-y-2.5 font-geometric text-[11px] font-bold uppercase tracking-wider">
              {[
                { label: "MODA ↗", href: "#new-arrivals" },
                { label: "ROPA ↗", href: "#new-arrivals" },
                { label: "ACCESORIOS ↗", href: "#accessories" },
                { label: "MUSICA ↗", href: "#moments" },
              ].map((item, i) => (
                <li key={i}>
                  <a href={item.href} className="inline-block transition-transform hover:translate-x-1 hover:text-theme-accent">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: COLLECTIONS */}
          <div>
            <h4 className="font-geometric text-[10px] font-black uppercase tracking-[0.25em] opacity-80">
              COLLECTIONS
            </h4>
            <ul className="mt-4 space-y-2.5 font-geometric text-[11px] font-bold uppercase tracking-wider">
              {[
                { label: "PERSONALIZADO ↗", href: "#featured-drop" },
                { label: "COLECCIONABLES ↗", href: "#featured-drop" },
                { label: "TECNOLOGÍA ↗", href: "#new-arrivals" },
                { label: "MUSICA ↗", href: "#moments" },
              ].map((item, i) => (
                <li key={i}>
                  <a href={item.href} className="inline-block transition-transform hover:translate-x-1 hover:text-theme-accent">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: MORE */}
          <div>
            <h4 className="font-geometric text-[10px] font-black uppercase tracking-[0.25em] opacity-80">
              MORE
            </h4>
            <ul className="mt-4 space-y-2.5 font-geometric text-[11px] font-bold uppercase tracking-wider">
              {[
                { label: "ANIME", href: "#categories" },
                { label: "BANDS", href: "#featured-drop" },
                { label: "CARTOON", href: "#categories" },
                { label: "MOVIES", href: "#categories" },
                { label: "SHOWS", href: "#categories" },
              ].map((item, i) => (
                <li key={i}>
                  <a href={item.href} className="inline-block transition-transform hover:translate-x-1 hover:text-theme-accent">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: CONNECT & CONTACT */}
          <div>
            <h4 className="font-geometric text-[10px] font-black uppercase tracking-[0.25em] opacity-80">
              CONNECT
            </h4>
            <ul className="mt-4 space-y-3 font-geometric text-[11px] font-bold uppercase tracking-wider">
              <li>
                <a
                  href="https://www.instagram.com/_brocode._co._?igsi=ajhuZDRvbW50Yzhu"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 transition-transform hover:translate-x-1 hover:text-theme-accent"
                >
                  <span>INSTAGRAM</span>
                  <span className="text-[9px] opacity-70">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:brOcOde.2k26.param@gmail.com"
                  className="inline-flex items-center gap-1.5 transition-transform hover:translate-x-1 hover:text-theme-accent text-[10px] lowercase break-all"
                >
                  <span>brOcOde.2k26.param@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* GIANT FOOTER WORDMARK */}
        <div className="relative mt-14 w-full overflow-hidden py-4 text-center gpu-accelerated">
          <svg
            className="h-28 w-full select-none md:h-44 lg:h-56"
            viewBox="0 0 2000 360"
            preserveAspectRatio="xMidYMid meet"
          >
            <text
              x="50%"
              y="52%"
              textAnchor="middle"
              dominantBaseline="central"
              fill={currentTheme.wordmarkFill}
              fontSize={activeTheme === "ragnarok" ? "270" : activeTheme === "cyber" ? "275" : "290"}
              fontWeight="900"
              fontFamily={currentTheme.wordmarkFont}
              letterSpacing={activeTheme === "ragnarok" ? "0.01em" : "-0.01em"}
              transform="scale(1, 1.12)"
              transformOrigin="center"
              opacity="0.95"
              className="drop-shadow-[0_4px_25px_rgba(0,0,0,0.35)]"
            >
              {currentTheme.wordmark}
            </text>
          </svg>
        </div>
      </div>

      {/* Very Bottom Copyright Bar */}
      <div className="border-t border-black/20 bg-[#000000] px-6 py-4 font-geometric text-[10px] font-bold uppercase tracking-widest text-[#EFEEE8]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span 
            onClick={() => {
              if (!window._adminClickCount) window._adminClickCount = 0;
              window._adminClickCount += 1;
              if (window._adminClickCount >= 3) {
                window.location.href = "/admin";
                window._adminClickCount = 0;
              }
              setTimeout(() => { window._adminClickCount = 0; }, 1500);
            }}
            className="cursor-default select-none"
            title="Brocode Studio"
          >
            © 2025 BROCODE. ALL RIGHTS RESERVED
          </span>
          <div className="flex items-center gap-4">
            <a href="#terms" className="hover:text-white transition-colors">
              TERMS & POLICIES
            </a>
            <span>•</span>
            <a href="#privacy" className="hover:text-white transition-colors">
              PRIVACY POLICY
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
