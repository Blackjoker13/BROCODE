"use client";

import React, { useEffect, useRef, useCallback } from "react";

export function DottedGlowBackground({
  className = "",
  opacity = 1,
  gap = 26,
  radius = 1.4,
  theme = "noir",
  colorLightVar = "--color-neutral-500",
  glowColorLightVar = "--theme-glow-color",
  colorDarkVar = "--color-neutral-500",
  glowColorDarkVar = "--theme-glow-color",
  backgroundOpacity = 0,
  speedMin = 0.3,
  speedMax = 0.8,
  speedScale = 0.9,
  glowRadius = 130,
  orbCount = 4,
  interactive = true,
  ...props
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mouseRef = useRef({ x: -2000, y: -2000, active: false, intensity: 0 });
  const orbsRef = useRef([]);
  const isVisibleRef = useRef(true);

  // Resolve CSS variable or fallback color
  const resolveColor = useCallback((cssVar, fallback) => {
    if (typeof window === "undefined") return fallback;
    if (cssVar) {
      const varName = cssVar.startsWith("--") ? cssVar : `--${cssVar}`;
      const val = getComputedStyle(document.documentElement).getPropertyValue(varName)?.trim();
      if (val) return val;
    }
    return fallback;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = 1; // Strict 1x DPR for background matrix eliminates memory pressure

    let baseCanvas = null;
    let glowSprite = null;

    const isDark = document.documentElement.classList.contains("dark") || theme === "cyber" || theme === "ragnarok";
    const themeDefaultGlow = theme === "cyber" ? "#CCFF00" : theme === "ragnarok" ? "#F59E0B" : "#EF0606";
    const baseColor = resolveColor(
      isDark ? colorDarkVar : colorLightVar,
      isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"
    );
    const glowColor = resolveColor(
      isDark ? glowColorDarkVar : glowColorLightVar,
      themeDefaultGlow
    );

    // Pre-rendered sprite for glowing dots
    const createGlowSprite = () => {
      const size = Math.ceil(radius * 8 + 14);
      const half = size / 2;
      const sCanvas = document.createElement("canvas");
      sCanvas.width = size;
      sCanvas.height = size;
      const sCtx = sCanvas.getContext("2d");

      const grad = sCtx.createRadialGradient(half, half, radius * 0.5, half, half, half);
      grad.addColorStop(0, glowColor);
      grad.addColorStop(0.4, glowColor);
      grad.addColorStop(1, "transparent");

      sCtx.fillStyle = grad;
      sCtx.beginPath();
      sCtx.arc(half, half, half, 0, Math.PI * 2);
      sCtx.fill();

      sCtx.fillStyle = "#FFFFFF";
      sCtx.globalAlpha = 0.6;
      sCtx.beginPath();
      sCtx.arc(half, half, radius * 0.7, 0, Math.PI * 2);
      sCtx.fill();

      return { canvas: sCanvas, size, half };
    };

    // Pre-rendered static base dots grid
    const renderBaseGrid = (w, h, cols, rows, effectiveGap) => {
      baseCanvas = document.createElement("canvas");
      baseCanvas.width = w;
      baseCanvas.height = h;
      const bCtx = baseCanvas.getContext("2d");

      bCtx.fillStyle = baseColor;
      bCtx.beginPath();
      for (let r = 0; r <= rows; r++) {
        const y = r * effectiveGap;
        for (let c = 0; c <= cols; c++) {
          const x = c * effectiveGap;
          bCtx.moveTo(x + radius, y);
          bCtx.arc(x, y, radius, 0, Math.PI * 2);
        }
      }
      bCtx.fill();
    };

    const initOrbs = (w, h) => {
      const count = Math.max(2, Math.min(orbCount, 4));
      orbsRef.current = Array.from({ length: count }, () => {
        const speed = (speedMin + Math.random() * (speedMax - speedMin)) * speedScale;
        const angle = Math.random() * Math.PI * 2;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: glowRadius * (0.8 + Math.random() * 0.3),
          pulsePhase: Math.random() * Math.PI * 2,
        };
      });
    };

    let effectiveGap = Math.max(16, gap);
    let cols = 0;
    let rows = 0;

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = Math.min(rect.width || window.innerWidth, window.innerWidth);
      height = Math.min(rect.height || window.innerHeight, window.innerHeight);

      if (width === 0 || height === 0) return;

      canvas.width = width;
      canvas.height = height;

      effectiveGap = Math.max(16, gap);
      cols = Math.ceil(width / effectiveGap);
      rows = Math.ceil(height / effectiveGap);

      glowSprite = createGlowSprite();
      renderBaseGrid(width, height, cols, rows, effectiveGap);

      if (orbsRef.current.length === 0) {
        initOrbs(width, height);
      }
    };

    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    if (containerRef.current) {
      intersectionObserver.observe(containerRef.current);
    }

    // Passive mouse tracking
    let mouseThrottle = false;
    const onMouseMove = (e) => {
      if (!interactive || !containerRef.current || mouseThrottle) return;
      mouseThrottle = true;
      requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
        mouseRef.current.active = true;
        mouseRef.current.intensity = 1.0;
        mouseThrottle = false;
      });
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const containerEl = containerRef.current;
    if (containerEl && interactive) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      containerEl.addEventListener("mouseleave", onMouseLeave, { passive: true });
    }

    // 30-FPS Throttled Render Loop saves over 70% CPU/GPU overhead
    let lastRenderTime = 0;
    const targetInterval = 1000 / 30; // 30 FPS cap for background matrix

    const render = (time) => {
      animationFrameRef.current = requestAnimationFrame(render);

      if (!isVisibleRef.current || width === 0 || height === 0) return;

      const elapsed = time - lastRenderTime;
      if (elapsed < targetInterval) return;

      lastRenderTime = time - (elapsed % targetInterval);
      const dt = Math.min(elapsed / 1000, 0.06);

      ctx.clearRect(0, 0, width, height);

      if (baseCanvas) {
        ctx.drawImage(baseCanvas, 0, 0, width, height);
      }

      if (!glowSprite) return;

      const orbs = orbsRef.current;
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        orb.x += orb.vx * dt * 45;
        orb.y += orb.vy * dt * 45;
        orb.pulsePhase += dt * 1.2;

        if (orb.x < -orb.radius) orb.x = width + orb.radius;
        if (orb.x > width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = height + orb.radius;
        if (orb.y > height + orb.radius) orb.y = -orb.radius;
      }

      if (!mouseRef.current.active && mouseRef.current.intensity > 0) {
        mouseRef.current.intensity = Math.max(0, mouseRef.current.intensity - dt * 2.5);
      }

      // Draw active glow sprites directly
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        const curRadius = orb.radius * (0.85 + Math.sin(orb.pulsePhase) * 0.15);
        const rSq = curRadius * curRadius;

        const minC = Math.max(0, Math.floor((orb.x - curRadius) / effectiveGap));
        const maxC = Math.min(cols, Math.ceil((orb.x + curRadius) / effectiveGap));
        const minR = Math.max(0, Math.floor((orb.y - curRadius) / effectiveGap));
        const maxR = Math.min(rows, Math.ceil((orb.y + curRadius) / effectiveGap));

        for (let r = minR; r <= maxR; r++) {
          const y = r * effectiveGap;
          const dy = y - orb.y;
          const dySq = dy * dy;

          for (let c = minC; c <= maxC; c++) {
            const x = c * effectiveGap;
            const dx = x - orb.x;
            const distSq = dx * dx + dySq;

            if (distSq < rSq) {
              const d = Math.sqrt(distSq);
              const factor = (1 - d / curRadius) * (1 - d / curRadius);
              ctx.globalAlpha = Math.min(factor * 0.85, 0.9);
              ctx.drawImage(
                glowSprite.canvas,
                x - glowSprite.half,
                y - glowSprite.half,
                glowSprite.size,
                glowSprite.size
              );
            }
          }
        }
      }

      ctx.globalAlpha = 1.0;
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (interactive) {
        window.removeEventListener("mousemove", onMouseMove);
        if (containerEl) {
          containerEl.removeEventListener("mouseleave", onMouseLeave);
        }
      }
    };
  }, [
    theme,
    gap,
    radius,
    colorLightVar,
    glowColorLightVar,
    colorDarkVar,
    glowColorDarkVar,
    backgroundOpacity,
    speedMin,
    speedMax,
    speedScale,
    glowRadius,
    orbCount,
    interactive,
    resolveColor,
  ]);

  return (
    <div
      ref={containerRef}
      style={{ opacity }}
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      {...props}
    >
      <canvas ref={canvasRef} className="block h-full w-full pointer-events-none will-change-transform" />
    </div>
  );
}

export default DottedGlowBackground;
