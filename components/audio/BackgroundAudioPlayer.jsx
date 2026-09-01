"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useStorefront } from "@/lib/storefront/StorefrontContext";
import { Volume2, VolumeX, Music } from "lucide-react";

export default function BackgroundAudioPlayer() {
  const pathname = usePathname();
  const isAdminSection = pathname?.startsWith("/admin");
  const { settings, activeTheme } = useStorefront();
  
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);
  const hasUnlockedRef = useRef(false);
  const volumeRef = useRef(0.15);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Settings from Admin Music Studio
  const isAudioEnabled = settings?.audio_enabled !== false;
  const configuredVolume =
    typeof settings?.audio_volume === "number"
      ? settings.audio_volume
      : parseFloat(settings?.audio_volume || 0.15);
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

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Sync volume ref
  useEffect(() => {
    volumeRef.current = isMuted ? 0 : configuredVolume;
    if (audioRef.current) {
      audioRef.current.volume = volumeRef.current;
    }
  }, [configuredVolume, isMuted]);

  // Find active track on initial load
  useEffect(() => {
    const activeIdx = tracks.findIndex((t) => t.isActive);
    setCurrentTrackIndex(activeIdx >= 0 ? activeIdx : 0);
  }, [tracks]);

  const currentTrack =
    tracks[currentTrackIndex] || tracks[0] || { url: "/12.webm", title: "Brocode Ambient" };

  // Safe Playback Method (never throws or crashes on browser policy rejection)
  const safePlay = useCallback(async () => {
    if (!audioRef.current || isAdminSection || !isAudioEnabled) return;
    
    try {
      audioRef.current.volume = isMuted ? 0 : volumeRef.current;
      audioRef.current.loop = audioMode === "loop";
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        await playPromise;
        isPlayingRef.current = true;
        hasUnlockedRef.current = true;
        setIsPlaying(true);
      }
    } catch (err) {
      // Browser blocked autoplay; will automatically start on user interaction
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
  }, [isAdminSection, isAudioEnabled, isMuted, audioMode]);

  // Safe Pause Method
  const safePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
  }, []);

  // Global Interaction Listeners for Instant Audio Unlocking (Mobile + Desktop)
  useEffect(() => {
    if (isAdminSection || !isAudioEnabled) {
      safePause();
      return;
    }

    // Try initial playback immediately
    safePlay();

    const handleUserGesture = () => {
      setHasInteracted(true);
      if (!isPlayingRef.current && isAudioEnabled && !isAdminSection) {
        safePlay();
      }
    };

    // Attach high-priority gesture listeners across mobile touch & desktop pointer events
    const eventTypes = ["pointerdown", "touchstart", "touchend", "click", "keydown", "scroll"];
    eventTypes.forEach((evt) => {
      window.addEventListener(evt, handleUserGesture, { passive: true });
    });

    // Handle Page Visibility Changes (Tab switching & Mobile app foregrounding)
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
        window.removeEventListener(evt, handleUserGesture);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAdminSection, isAudioEnabled, safePlay, safePause]);

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
      setCurrentTrackIndex(nextIdx);
    } else {
      // Playlist sequential mode
      const nextIdx = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(nextIdx);
    }
  };

  // Toggle Mute / Playback directly from floating pill
  const toggleSound = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      safePause();
    } else {
      if (isMuted) setIsMuted(false);
      safePlay();
    }
  };

  // If in Admin section or disabled, do not render
  if (isAdminSection || !isAudioEnabled) return null;

  // Thematic Styling for floating pill
  const themeStyles = {
    noir: "border-black/15 bg-[#EFEEE8]/90 text-black shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:border-[#EF0606] hover:text-[#EF0606]",
    cyber: "border-[#CCFF00]/40 bg-[#090C10]/95 text-[#CCFF00] shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:border-[#00F0FF] hover:text-[#00F0FF]",
    ragnarok: "border-[#F59E0B]/40 bg-[#161010]/95 text-[#FEF3C7] shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:border-[#F59E0B] hover:text-[#F59E0B]",
  };

  const activePillStyle = themeStyles[activeTheme] || themeStyles.noir;

  return (
    <>
      {/* HTML5 Audio Element (with preload auto and playsInline) */}
      <audio
        ref={audioRef}
        src={currentTrack?.url || "/12.webm"}
        preload="auto"
        onEnded={handleTrackEnded}
        onPlay={() => {
          isPlayingRef.current = true;
          setIsPlaying(true);
        }}
        onPause={() => {
          isPlayingRef.current = false;
          setIsPlaying(false);
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
      />

      {/* Discreet Floating Audio Controller Pill (Bottom-Left on Mobile & Desktop) */}
      <div className="fixed bottom-4 left-4 z-40 pointer-events-auto select-none">
        <button
          onClick={toggleSound}
          title={isPlaying ? "Mute soundtrack" : "Play soundtrack"}
          className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-xl transition-all active:scale-95 ${activePillStyle}`}
        >
          {isPlaying ? (
            <>
              {/* Animated Equalizer Waveform Bars */}
              <div className="flex items-end gap-0.5 h-3.5 w-3.5">
                <span className="w-0.5 bg-current rounded-full animate-music-bar-1 h-full" />
                <span className="w-0.5 bg-current rounded-full animate-music-bar-2 h-2/3" />
                <span className="w-0.5 bg-current rounded-full animate-music-bar-3 h-4/5" />
              </div>
              <span className="font-geometric text-[9px] font-black uppercase tracking-wider hidden sm:inline">
                SOUND ON
              </span>
            </>
          ) : (
            <>
              <VolumeX className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              <span className="font-geometric text-[9px] font-bold uppercase tracking-wider hidden sm:inline opacity-60 group-hover:opacity-100">
                SOUND OFF
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
