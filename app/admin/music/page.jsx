"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Upload,
  Plus,
  Trash2,
  Check,
  Save,
  RefreshCw,
  Sliders,
  Radio,
  Sparkles,
  Info,
  ExternalLink,
  ListMusic,
  Disc,
} from "lucide-react";

export default function AdminMusicPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Audio settings
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [masterVolume, setMasterVolume] = useState(0.15); // Default 15%
  const [playbackMode, setPlaybackMode] = useState("loop"); // "loop" | "playlist" | "shuffle"
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);

  // Playlist of songs
  const [tracks, setTracks] = useState([
    {
      id: "track-1",
      title: "Brocode Dark Minimalist Anthem",
      artist: "Brocode Studio // 12.webm",
      url: "/12.webm",
      isActive: true,
    },
  ]);

  // Modal for adding new song
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTrack, setNewTrack] = useState({
    title: "",
    artist: "",
    url: "",
  });
  const [uploading, setUploading] = useState(false);

  // Preview player inside studio
  const [previewTrackUrl, setPreviewTrackUrl] = useState(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const previewAudioRef = useRef(null);

  // Fetch settings on mount
  const fetchAudioSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        const s = data.settings;
        if (s.audio_enabled !== undefined) setAudioEnabled(Boolean(s.audio_enabled));
        if (s.audio_volume !== undefined) setMasterVolume(parseFloat(s.audio_volume));
        if (s.audio_mode) setPlaybackMode(s.audio_mode);
        if (Array.isArray(s.audio_tracks) && s.audio_tracks.length > 0) {
          setTracks(s.audio_tracks);
          const activeIdx = s.audio_tracks.findIndex((t) => t.isActive);
          setActiveTrackIndex(activeIdx >= 0 ? activeIdx : 0);
        }
      }
    } catch (e) {
      console.error("Failed to load audio settings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudioSettings();
  }, []);

  // Handle studio audio preview
  const togglePreview = (url) => {
    if (previewTrackUrl === url && isPreviewPlaying) {
      previewAudioRef.current?.pause();
      setIsPreviewPlaying(false);
    } else {
      setPreviewTrackUrl(url);
      if (previewAudioRef.current) {
        previewAudioRef.current.src = url;
        previewAudioRef.current.volume = masterVolume;
        previewAudioRef.current
          .play()
          .then(() => setIsPreviewPlaying(true))
          .catch((e) => console.error("Preview error:", e));
      }
    }
  };

  // Upload new audio file (.mp3, .webm, .wav, .ogg, etc.)
  const handleAudioUpload = async (e, isModal = false, trackIdx = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) {
        if (isModal) {
          setNewTrack((prev) => ({
            ...prev,
            url: data.url,
            title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
          }));
        } else if (trackIdx !== null) {
          setTracks((prev) => {
            const updated = [...prev];
            updated[trackIdx] = { ...updated[trackIdx], url: data.url };
            return updated;
          });
        }
      }
    } catch (err) {
      alert("Audio file upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Add song from modal
  const handleAddSong = (e) => {
    e.preventDefault();
    if (!newTrack.url) {
      alert("Please upload an audio file or enter a valid URL.");
      return;
    }

    const track = {
      id: `track-${Date.now()}`,
      title: newTrack.title || "Untitled Track",
      artist: newTrack.artist || "Brocode Soundtrack",
      url: newTrack.url,
      isActive: tracks.length === 0,
    };

    setTracks((prev) => [...prev, track]);
    setNewTrack({ title: "", artist: "", url: "" });
    setAddModalOpen(false);
  };

  // Delete track
  const handleDeleteTrack = (id, title) => {
    if (tracks.length <= 1) {
      if (!confirm(`Delete "${title}"? This will leave the playlist empty.`)) return;
    } else {
      if (!confirm(`Delete "${title}" from the background playlist?`)) return;
    }

    setTracks((prev) => {
      const remaining = prev.filter((t) => t.id !== id);
      if (remaining.length > 0 && !remaining.some((t) => t.isActive)) {
        remaining[0].isActive = true;
      }
      return remaining;
    });

    if (previewTrackUrl && isPreviewPlaying) {
      previewAudioRef.current?.pause();
      setIsPreviewPlaying(false);
    }
  };

  // Set active track
  const handleSetActive = (index) => {
    setActiveTrackIndex(index);
    setTracks((prev) =>
      prev.map((t, idx) => ({
        ...t,
        isActive: idx === index,
      }))
    );
  };

  // Save all settings to API & Invalidate Cache
  const handleSaveAll = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const payload = {
        settings: {
          audio_enabled: audioEnabled,
          audio_volume: masterVolume,
          audio_mode: playbackMode,
          audio_tracks: tracks,
        },
      };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("Failed to save audio settings.");
      }
    } catch (e) {
      alert("Error saving: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl pb-24">
      {/* Hidden audio element for studio previews */}
      <audio
        ref={previewAudioRef}
        onEnded={() => setIsPreviewPlaying(false)}
        playsInline
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 font-mono text-[10px] font-bold text-violet-400 mb-2">
            <Music className="h-3 w-3" />
            <span>BACKGROUND AUDIO & PLAYLIST STUDIO</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Background Music & Volume Manager
          </h1>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Add background songs, remove tracks, control master volume ({Math.round(masterVolume * 100)}%), and manage storefront playback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 font-mono text-xs font-bold text-neutral-200 hover:border-violet-500 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4 text-violet-400" />
            <span>Add New Song</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2 font-mono text-xs font-bold text-white transition-all hover:bg-violet-500 shadow-lg shadow-violet-600/20 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : saveSuccess ? (
              <Check className="h-4 w-4 text-emerald-300" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{saving ? "Saving..." : saveSuccess ? "Saved Live!" : "Save & Publish Audio"}</span>
          </button>
        </div>
      </div>

      {/* Top Grid: Master Sound & Volume Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Master Volume & Mode (7 cols) */}
        <div className="lg:col-span-7 space-y-5 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2 font-heading text-sm font-bold uppercase text-white">
              <Sliders className="h-4 w-4 text-violet-400" />
              <span>Master Sound Settings</span>
            </div>

            {/* Background Audio Toggle */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-neutral-400">Audio Playback:</span>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  audioEnabled ? "bg-violet-600" : "bg-neutral-800"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    audioEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Master Volume Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-neutral-300 font-bold flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-violet-400" />
                <span>Storefront Default Volume:</span>
              </span>
              <span className="rounded-lg bg-violet-500/20 border border-violet-500/30 px-2 py-0.5 text-sm font-black text-violet-300">
                {Math.round(masterVolume * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setMasterVolume(val);
                if (previewAudioRef.current) previewAudioRef.current.volume = val;
              }}
              className="w-full h-2 rounded-lg bg-neutral-950 accent-violet-500 cursor-pointer"
            />

            {/* Preset Volume Buttons */}
            <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
              <span className="text-neutral-500">Presets:</span>
              {[
                { label: "10% (Whisper)", val: 0.1 },
                { label: "15% (Recommended)", val: 0.15 },
                { label: "25% (Moderate)", val: 0.25 },
                { label: "50% (Prominent)", val: 0.5 },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMasterVolume(p.val);
                    if (previewAudioRef.current) previewAudioRef.current.volume = p.val;
                  }}
                  className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                    masterVolume === p.val
                      ? "bg-violet-600 text-white font-bold"
                      : "bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Playback Mode Radio Group */}
          <div className="border-t border-neutral-800 pt-4 space-y-2">
            <label className="block font-mono text-[10px] text-neutral-400 uppercase">
              Storefront Playback Strategy
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
              {[
                { id: "loop", label: "Single Track Loop", desc: "Repeats active song continuously" },
                { id: "playlist", label: "Full Playlist Sequence", desc: "Plays 1 by 1 in order" },
                { id: "shuffle", label: "Random Shuffle", desc: "Randomizes track order" },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setPlaybackMode(m.id)}
                  className={`cursor-pointer rounded-2xl border p-3 transition-all ${
                    playbackMode === m.id
                      ? "border-violet-500 bg-violet-500/10 text-white"
                      : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px]">{m.label}</span>
                    {playbackMode === m.id && (
                      <Check className="h-3.5 w-3.5 text-violet-400" />
                    )}
                  </div>
                  <p className="text-[9px] text-neutral-500 mt-1">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Sound Quick Status & Live Test (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 font-heading text-sm font-bold uppercase text-white border-b border-neutral-800 pb-3">
            <Disc className="h-4 w-4 text-violet-400" />
            <span>Live Sound Test</span>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-neutral-400 uppercase">
                Active Soundtrack:
              </span>
              <span className="rounded bg-violet-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-violet-300">
                {tracks[activeTrackIndex]?.title || "No song selected"}
              </span>
            </div>

            {/* Visual Equalizer Box */}
            <div className="flex items-center justify-between rounded-xl bg-neutral-900 px-4 py-3 border border-neutral-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => togglePreview(tracks[activeTrackIndex]?.url || "/12.webm")}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-500 shadow-md cursor-pointer transition-transform active:scale-95"
                >
                  {isPreviewPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5" />
                  )}
                </button>
                <div>
                  <h4 className="font-mono text-xs font-bold text-white line-clamp-1">
                    {tracks[activeTrackIndex]?.title || "Brocode Soundtrack"}
                  </h4>
                  <p className="font-mono text-[9px] text-neutral-400">
                    Testing at {Math.round(masterVolume * 100)}% Master Volume
                  </p>
                </div>
              </div>

              {/* Animated wave bars */}
              <div className="flex items-end gap-1 h-5">
                <span
                  className={`w-1 rounded-full bg-violet-400 ${
                    isPreviewPlaying ? "animate-[bounce_0.8s_infinite_ease-in-out]" : "h-2"
                  }`}
                  style={{ height: isPreviewPlaying ? "100%" : "30%" }}
                />
                <span
                  className={`w-1 rounded-full bg-violet-400 ${
                    isPreviewPlaying ? "animate-[bounce_1.1s_infinite_ease-in-out_0.2s]" : "h-3"
                  }`}
                  style={{ height: isPreviewPlaying ? "80%" : "40%" }}
                />
                <span
                  className={`w-1 rounded-full bg-violet-400 ${
                    isPreviewPlaying ? "animate-[bounce_0.9s_infinite_ease-in-out_0.4s]" : "h-1"
                  }`}
                  style={{ height: isPreviewPlaying ? "100%" : "25%" }}
                />
                <span
                  className={`w-1 rounded-full bg-violet-400 ${
                    isPreviewPlaying ? "animate-[bounce_1.2s_infinite_ease-in-out_0.1s]" : "h-3.5"
                  }`}
                  style={{ height: isPreviewPlaying ? "60%" : "50%" }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 bg-neutral-950/60 p-3 rounded-2xl border border-neutral-800/80">
            <Info className="h-4 w-4 text-violet-400 shrink-0" />
            <span>
              Supported Formats: <strong>.WEBM, .MP3, .WAV, .OGG, .M4A</strong>. Max file size: 25MB per song.
            </span>
          </div>
        </div>
      </div>

      {/* Playlist Tracks Table & Manager */}
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <ListMusic className="h-5 w-5 text-violet-400" />
            <h3 className="font-heading text-lg font-bold uppercase text-white">
              Soundtrack Playlist ({tracks.length} Songs)
            </h3>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-1.5 font-mono text-xs font-bold text-white hover:bg-violet-500 shadow-md cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Song</span>
          </button>
        </div>

        {/* Tracks List */}
        <div className="space-y-3">
          {tracks.map((t, idx) => {
            const isPlayingThis = previewTrackUrl === t.url && isPreviewPlaying;
            return (
              <div
                key={t.id || idx}
                className={`flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${
                  t.isActive
                    ? "border-violet-500/50 bg-violet-500/5"
                    : "border-neutral-800/80 bg-neutral-950/60 hover:border-neutral-700"
                }`}
              >
                {/* Track Info */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePreview(t.url)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-700 text-violet-400 hover:bg-violet-600 hover:text-white transition-all cursor-pointer"
                  >
                    {isPlayingThis ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 ml-0.5" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] font-bold text-neutral-500">
                        #{idx + 1}
                      </span>
                      <h4 className="font-heading text-sm font-bold text-white">
                        {t.title}
                      </h4>
                      {t.isActive && (
                        <span className="rounded-full bg-violet-500 px-2 py-0.5 font-mono text-[9px] font-bold text-white uppercase">
                          ACTIVE ON STORE
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-neutral-400 mt-0.5">
                      {t.artist || "Brocode Soundtrack"} •{" "}
                      <span className="text-neutral-500">{t.url}</span>
                    </p>
                  </div>
                </div>

                {/* Track Actions */}
                <div className="flex items-center gap-2 font-mono text-xs">
                  {!t.isActive && (
                    <button
                      onClick={() => handleSetActive(idx)}
                      className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-neutral-300 hover:border-violet-500 hover:text-white transition-colors cursor-pointer"
                    >
                      Set as Active
                    </button>
                  )}

                  {/* Replace Audio File Dropzone */}
                  <label className="inline-flex items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-neutral-300 hover:border-violet-500 hover:text-white transition-colors cursor-pointer">
                    <Upload className="h-3.5 w-3.5 text-neutral-400" />
                    <span>Replace Audio</span>
                    <input
                      type="file"
                      accept="audio/*,.webm"
                      onChange={(e) => handleAudioUpload(e, false, idx)}
                      className="hidden"
                    />
                  </label>

                  {/* Delete Song */}
                  <button
                    onClick={() => handleDeleteTrack(t.id, t.title)}
                    className="rounded-xl border border-neutral-800 p-2 text-neutral-400 hover:border-red-500 hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete track"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Song Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-heading text-lg font-bold uppercase text-white flex items-center gap-2">
                <Music className="h-4 w-4 text-violet-400" />
                <span>Add Song To Playlist</span>
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="rounded-xl p-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSong} className="space-y-3 font-sans text-xs">
              <div>
                <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                  SONG TITLE *
                </label>
                <input
                  type="text"
                  required
                  value={newTrack.title}
                  onChange={(e) => setNewTrack({ ...newTrack, title: e.target.value })}
                  placeholder="e.g. Param Anthem"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                  ARTIST / ALBUM NOTE
                </label>
                <input
                  type="text"
                  value={newTrack.artist}
                  onChange={(e) => setNewTrack({ ...newTrack, artist: e.target.value })}
                  placeholder="e.g. Brocode Records"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-violet-500 focus:outline-none"
                />
              </div>

              {/* File Upload Box */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-3.5 space-y-2">
                <label className="block font-mono text-[10px] text-neutral-400 uppercase">
                  Upload Audio File (.webm, .mp3, .wav, .ogg)
                </label>

                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-mono font-bold text-white hover:bg-violet-500 transition-all">
                    <Upload className="h-3.5 w-3.5" />
                    <span>{uploading ? "Uploading Audio..." : "Select Audio File"}</span>
                    <input
                      type="file"
                      accept="audio/*,.webm"
                      onChange={(e) => handleAudioUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="pt-1">
                  <input
                    type="text"
                    required
                    value={newTrack.url}
                    onChange={(e) => setNewTrack({ ...newTrack, url: e.target.value })}
                    placeholder="/audio/... or /uploads/... or https://..."
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2 text-[11px] text-neutral-300 font-mono focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-neutral-800 pt-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="rounded-xl border border-neutral-800 px-4 py-2 text-neutral-300 hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="rounded-xl bg-violet-600 px-5 py-2 font-mono font-bold text-white hover:bg-violet-500 shadow-lg shadow-violet-600/20 cursor-pointer"
                >
                  Add Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
