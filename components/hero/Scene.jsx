"use client";

import { Suspense, useRef, useState, useCallback, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Html,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import TshirtModel from "./TshirtModel";
import { usePerformance } from "@/lib/performance/PerformanceContext";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-1.5 rounded-full border border-black/10 bg-[#EFEEE8]/90 px-4 py-1.5 backdrop-blur-md shadow-sm select-none">
        <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-[#000000]">
          STREAMING 3D ASSET {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
}

const THEME_LIGHTING = {
  noir: {
    ambient: 1.35,
    ambientColor: "#ffffff",
    hemiArgs: ["#ffffff", "#949088", 1.1],
    keyColor: "#fffcf5",
    keyIntensity: 3.2,
    rimColor: "#e5edff",
    rimIntensity: 1.8,
    secondaryRim: null,
    shadowOpacity: 0.45,
    exposure: 1.42,
  },
  cyber: {
    ambient: 1.2,
    ambientColor: "#0f172a",
    hemiArgs: ["#38bdf8", "#0f172a", 1.0],
    keyColor: "#f8fafc",
    keyIntensity: 3.4,
    rimColor: "#CCFF00",
    rimIntensity: 3.2,
    secondaryRim: { color: "#00F0FF", intensity: 2.4, pos: [3.5, -1.0, -3.5] },
    shadowOpacity: 0.65,
    exposure: 1.48,
  },
  ragnarok: {
    ambient: 1.25,
    ambientColor: "#1c1412",
    hemiArgs: ["#fbbf24", "#18181b", 1.0],
    keyColor: "#fffbeb",
    keyIntensity: 3.4,
    rimColor: "#F59E0B",
    rimIntensity: 3.2,
    secondaryRim: { color: "#dc2626", intensity: 2.2, pos: [3.5, 2.0, -3.5] },
    shadowOpacity: 0.7,
    exposure: 1.45,
  },
};

export default function Scene({
  activeTheme = "noir",
  autoRotate = true,
  rotateSpeed = 0.7,
  targetAngle = null,
}) {
  const { isHeroVisible, tier, isLowPower } = usePerformance();
  const controlsRef = useRef();
  const resumeTimer = useRef();
  const [userInteracting, setUserInteracting] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);

  const lighting = THEME_LIGHTING[activeTheme] || THEME_LIGHTING.noir;

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(resumeTimer.current);
    };
  }, []);

  const handleStart = useCallback(() => {
    clearTimeout(resumeTimer.current);
    setUserInteracting(true);
  }, []);

  const handleEnd = useCallback(() => {
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setUserInteracting(false), 600);
  }, []);

  // Adaptive Tiered DPR
  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1;
    const isMobile = window.innerWidth < 768;
    const deviceDPR = window.devicePixelRatio || 1;

    if (isLowPower || tier === "low") {
      return Math.min(deviceDPR, 0.9);
    }
    if (isMobile || tier === "medium") {
      return Math.min(deviceDPR, 1.05);
    }
    return Math.min(deviceDPR, 1.2);
  }, [tier, isLowPower]);

  const shadowRes = useMemo(() => {
    return isLowPower || tier === "low" ? 128 : 256;
  }, [tier, isLowPower]);

  const shouldRender = isHeroVisible && isTabVisible;

  return (
    <Canvas
      dpr={dpr}
      frameloop={shouldRender ? "always" : "never"}
      camera={{ position: [0, 0.12, 4.5], fov: 32, near: 0.1, far: 30 }}
      gl={{
        antialias: false,
        alpha: true,
        stencil: false,
        depth: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: lighting.exposure,
      }}
    >
      <ambientLight intensity={lighting.ambient} color={lighting.ambientColor} />
      <hemisphereLight args={lighting.hemiArgs} />

      {/* Main Studio Key Light */}
      <directionalLight
        position={[4.2, 5.5, 4.5]}
        intensity={lighting.keyIntensity}
        color={lighting.keyColor}
      />

      {/* Dynamic Themed Rim / Contour Back Light */}
      <directionalLight
        position={[-3.5, 3.0, -4.0]}
        intensity={lighting.rimIntensity}
        color={lighting.rimColor}
      />

      {/* Secondary Accent Light for Cyber and Ragnarok themes */}
      {lighting.secondaryRim && (
        <directionalLight
          position={lighting.secondaryRim.pos}
          intensity={lighting.secondaryRim.intensity}
          color={lighting.secondaryRim.color}
        />
      )}

      <Suspense fallback={<Loader />}>
        <TshirtModel
          activeTheme={activeTheme}
          autoRotate={autoRotate && shouldRender}
          rotateSpeed={rotateSpeed}
          targetAngle={targetAngle}
          userInteracting={userInteracting}
          floatBase={0.12}
          position={[0, 0.12, 0]}
        />
      </Suspense>

      {/* Ground Contact Shadow */}
      <ContactShadows
        position={[0, -1.02, 0]}
        opacity={lighting.shadowOpacity}
        scale={7.8}
        blur={2.2}
        far={3.0}
        resolution={shadowRes}
        frames={1}
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableZoom={false}
        enablePan={false}
        target={[0, 0.12, 0]}
        minPolarAngle={Math.PI / 2.3}
        maxPolarAngle={Math.PI / 1.8}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.85}
        onStart={handleStart}
        onEnd={handleEnd}
      />
    </Canvas>
  );
}
