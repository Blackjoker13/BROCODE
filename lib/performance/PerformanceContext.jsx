"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const PerformanceContext = createContext({
  tier: "ultra",
  isHeroVisible: true,
  isLowPower: false,
  setHeroVisible: () => {},
  toggleLowPower: () => {},
});

export function PerformanceProvider({ children }) {
  const [tier, setTier] = useState("ultra");
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isLowPower, setIsLowPower] = useState(false);

  const toggleLowPower = useCallback(() => {
    setIsLowPower((prev) => {
      const next = !prev;
      setTier(next ? "balanced" : "ultra");
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      tier,
      isHeroVisible,
      isLowPower,
      setHeroVisible: setIsHeroVisible,
      toggleLowPower,
    }),
    [tier, isHeroVisible, isLowPower, toggleLowPower]
  );

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  return useContext(PerformanceContext);
}
