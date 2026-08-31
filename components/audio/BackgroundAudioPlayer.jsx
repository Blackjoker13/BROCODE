"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useStorefront } from "@/lib/storefront/StorefrontContext";

export default function BackgroundAudioPlayer() {
  const pathname = usePathname();
  const isAdminSection = pathname?.startsWith("/admin");
  const { settings } = useStorefront();
  const audioRef = useRef(null);

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

  // Find active track on initial load
  useEffect(() => {
    const activeIdx = tracks.findIndex((t) => t.isActive);
    setCurrentTrackIndex(activeIdx >= 0 ? activeIdx : 0);
  }, [tracks]);

  const currentTrack =
    tracks[currentTrackIndex] || tracks[0] || { url: "/12.webm", title: "Brocode Ambient" };

  // Sync volume from admin settings
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, configuredVolume));
  }, [configuredVolume]);

  // Handle Autoplay & Browser Policy (ONLY in Customer Section, NEVER in Admin Section)
  useEffect(() => {
    // Strictly disable playback inside any Admin routes (/admin, /admin/...)
    if (isAdminSection || !isAudioEnabled) {
      if (audioRef.current) audioRef.current.pause();
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = configuredVolume;
    audio.loop = audioMode === "loop";

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Unlocks and starts playing seamlessly on first user interaction in customer section
        const unlockAudio = () => {
          if (audioRef.current && !pathname?.startsWith("/admin") && isAudioEnabled) {
            audioRef.current.volume = configuredVolume;
            audioRef.current
              .play()
              .catch((e) => console.log("Audio unlock:", e));
          }
          window.removeEventListener("click", unlockAudio);
          window.removeEventListener("keydown", unlockAudio);
          window.removeEventListener("touchstart", unlockAudio);
          window.removeEventListener("scroll", unlockAudio);
        };

        window.addEventListener("click", unlockAudio, { once: true, passive: true });
        window.addEventListener("keydown", unlockAudio, { once: true, passive: true });
        window.addEventListener("touchstart", unlockAudio, { once: true, passive: true });
        window.addEventListener("scroll", unlockAudio, { once: true, passive: true });
      });
    }

    return () => {
      if (audio) audio.pause();
    };
  }, [currentTrack?.url, isAudioEnabled, audioMode, configuredVolume, isAdminSection, pathname]);

  // Handle track ended (advances playlist / shuffle)
  const handleTrackEnded = () => {
    if (isAdminSection) return;

    if (audioMode === "loop") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
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

  // If in Admin section or disabled, do not render audio player
  if (isAdminSection || !isAudioEnabled) return null;

  return (
    // 100% Invisible Background Audio Engine (Active ONLY on Customer storefront)
    <audio
      ref={audioRef}
      src={currentTrack?.url || "/12.webm"}
      preload="auto"
      onEnded={handleTrackEnded}
      playsInline
      className="hidden pointer-events-none"
    />
  );
}
