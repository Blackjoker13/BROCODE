"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useStorefront } from "@/lib/storefront/StorefrontContext";

export default function BackgroundAudioPlayer() {
  const pathname = usePathname();
  const isAdminSection = pathname?.startsWith("/admin");
  const { settings } = useStorefront();
  
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);
  const hasUnlockedRef = useRef(false);
  const volumeRef = useRef(0.2);

  // Settings from Admin Music Studio
  const isAudioEnabled = settings?.audio_enabled !== false;
  const configuredVolume =
    typeof settings?.audio_volume === "number"
      ? settings.audio_volume
      : parseFloat(settings?.audio_volume || 0.2);
  const audioMode = settings?.audio_mode || "loop"; // "loop" | "playlist" | "shuffle"
  
  const tracks =
    Array.isArray(settings?.audio_tracks) && settings.audio_tracks.length > 0
      ? settings.audio_tracks
      : [
          {
            id: "track-default",
            title: "Brocode Soundtrack // 12.webm",
            url: "/12.webm",
            isActive: true,
          },
        ];

  const currentTrackIndexRef = useRef(0);

  // Sync volume ref
  useEffect(() => {
    volumeRef.current = configuredVolume;
    if (audioRef.current) {
      audioRef.current.volume = volumeRef.current;
    }
  }, [configuredVolume]);

  const activeIdx = tracks.findIndex((t) => t.isActive);
  const currentTrack =
    tracks[activeIdx >= 0 ? activeIdx : currentTrackIndexRef.current] ||
    tracks[0] ||
    { url: "/12.webm", title: "Brocode Ambient" };

  // Safe Playback Method (starts immediately, handles browser autoplay rejection gracefully)
  const safePlay = useCallback(async () => {
    if (!audioRef.current || isAdminSection || !isAudioEnabled) return;
    
    try {
      audioRef.current.volume = volumeRef.current;
      audioRef.current.loop = audioMode === "loop";
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        await playPromise;
        isPlayingRef.current = true;
        hasUnlockedRef.current = true;
      }
    } catch {
      // Autoplay blocked by browser policy without user gesture yet
      isPlayingRef.current = false;
    }
  }, [isAdminSection, isAudioEnabled, audioMode]);

  // Headless Auto-Start + High-Priority Gesture Fallback Listeners
  useEffect(() => {
    if (isAdminSection || !isAudioEnabled) {
      if (audioRef.current) {
        audioRef.current.pause();
        isPlayingRef.current = false;
      }
      return;
    }

    // 1. Attempt immediate autoplay as soon as component mounts
    safePlay();

    // 2. Gesture fallback listener: Starts audio instantly on user's first touch/scroll/click
    const handleFirstInteraction = () => {
      if (!isPlayingRef.current && isAudioEnabled && !isAdminSection) {
        safePlay();
      }
    };

    const eventTypes = [
      "pointerdown",
      "touchstart",
      "touchend",
      "click",
      "keydown",
      "scroll",
      "wheel",
      "mousedown",
    ];

    eventTypes.forEach((evt) => {
      window.addEventListener(evt, handleFirstInteraction, { passive: true });
    });

    // 3. Tab Visibility & Background App State Handling
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isPlayingRef.current && audioRef.current) {
          audioRef.current.pause();
        }
      } else {
        if (hasUnlockedRef.current && isAudioEnabled && !isAdminSection) {
          safePlay();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      eventTypes.forEach((evt) => {
        window.removeEventListener(evt, handleFirstInteraction);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAdminSection, isAudioEnabled, safePlay]);

  // Handle Track Ended (advances playlist / shuffle / loop)
  const handleTrackEnded = () => {
    if (isAdminSection || !isAudioEnabled) return;

    if (audioMode === "loop") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        safePlay();
      }
    } else if (audioMode === "shuffle") {
      const nextIdx = Math.floor(Math.random() * tracks.length);
      currentTrackIndexRef.current = nextIdx;
      if (audioRef.current) {
        audioRef.current.src = tracks[nextIdx]?.url || "/12.webm";
        safePlay();
      }
    } else {
      // Playlist sequential mode
      const nextIdx = (currentTrackIndexRef.current + 1) % tracks.length;
      currentTrackIndexRef.current = nextIdx;
      if (audioRef.current) {
        audioRef.current.src = tracks[nextIdx]?.url || "/12.webm";
        safePlay();
      }
    }
  };

  // If in Admin section or audio disabled, do not render
  if (isAdminSection || !isAudioEnabled) return null;

  return (
    <audio
      ref={audioRef}
      src={currentTrack?.url || "/12.webm"}
      preload="auto"
      autoPlay
      loop={audioMode === "loop"}
      onEnded={handleTrackEnded}
      onPlay={() => {
        isPlayingRef.current = true;
        hasUnlockedRef.current = true;
      }}
      onPause={() => {
        isPlayingRef.current = false;
      }}
      onError={() => {
        // Fallback to /audio/12.webm if root url fails
        if (audioRef.current && audioRef.current.src !== "/audio/12.webm") {
          audioRef.current.src = "/audio/12.webm";
          safePlay();
        }
      }}
      playsInline
      className="hidden pointer-events-none"
      aria-hidden="true"
    />
  );
}
