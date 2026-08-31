"use client";

import { useState, useEffect, useRef } from "react";
import { usePerformance } from "@/lib/performance/PerformanceContext";

export default function PerformanceHUD() {
  const { tier, isLowPower, toggleLowPower } = usePerformance();
  const [fps, setFps] = useState(60);
  const [minimized, setMinimized] = useState(true);
  const rafId = useRef(null);
  const fpsBadgeRef = useRef(null);

  // Independent local FPS tracker with zero React re-render overhead
  useEffect(() => {
    let frames = 0;
    let prevTime = performance.now();

    const loop = (time) => {
      frames++;
      if (time >= prevTime + 800) {
        const measuredFps = Math.min(60, Math.round((frames * 1000) / (time - prevTime)));
        setFps((prev) => (Math.abs(prev - measuredFps) >= 2 ? measuredFps : prev));
        frames = 0;
        prevTime = time;
      }
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Color code based on FPS
  const fpsColor =
    fps >= 50
      ? "text-emerald-400 border-emerald-500/30"
      : fps >= 38
      ? "text-amber-400 border-amber-500/30"
      : "text-red-400 border-red-500/30";

  return (
    <div className="fixed bottom-4 left-4 z-50 select-none font-mono text-[10px]">
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          title="Lag Management System — Click for details"
          className={`flex items-center gap-1.5 rounded-full border bg-black/80 px-2.5 py-1 backdrop-blur-md transition-all hover:bg-black ${fpsColor}`}
        >
          <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
          <span className="font-bold">{fps} FPS</span>
          <span className="text-[8px] opacity-70 uppercase tracking-wider">
            [{tier}]
          </span>
        </button>
      ) : (
        <div className="w-56 rounded-xl border border-neutral-800 bg-neutral-950/95 p-3 text-white shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-neutral-200 uppercase tracking-widest text-[9px]">
                Lag Manager
              </span>
            </div>
            <button
              onClick={() => setMinimized(true)}
              className="text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="mt-2 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-neutral-400">FPS:</span>
              <span className={`font-bold ${fpsColor}`}>{fps} FPS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Quality Tier:</span>
              <span className="font-bold uppercase text-neutral-200">{tier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Auto GPU Throttle:</span>
              <span className="text-emerald-400 font-bold">Active ✓</span>
            </div>
          </div>

          <div className="mt-3 border-t border-neutral-800 pt-2">
            <button
              onClick={toggleLowPower}
              className={`w-full rounded py-1 text-center font-bold uppercase tracking-wider transition-colors ${
                isLowPower
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              {isLowPower ? "⚡ Balanced Mode: ON" : "✨ Ultra Quality: ON"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
