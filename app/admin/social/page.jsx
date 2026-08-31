"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Camera,
  Instagram,
  Mail,
  Share2,
  Upload,
  Save,
  Check,
  Eye,
  RefreshCw,
  Sparkles,
  Zap,
  Flame,
  ArrowUpRight,
  ExternalLink,
  Layers,
  Compass,
  Info,
  Sliders,
  Plus,
  Trash2,
} from "lucide-react";

export default function AdminSocialPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("gallery"); // "gallery" | "accounts" | "text"
  const [previewTheme, setPreviewTheme] = useState("noir"); // "noir" | "cyber" | "ragnarok"
  const [uploadingSlot, setUploadingSlot] = useState(null);

  // Social accounts state
  const [socialData, setSocialData] = useState({
    instagramHandle: "_brocode._co._",
    instagramUrl: "https://www.instagram.com/_brocode._co._?igsi=ajhuZDRvbW50Yzhu",
    email: "brOcOde.2k26.param@gmail.com",
    facebookUrl: "",
    youtubeUrl: "",
    twitterUrl: "",
    tiktokUrl: "",
  });

  // Moments Gallery Section content state
  const [momentsData, setMomentsData] = useState({
    title: "BROCODE MOMENTS",
    tagline: "[ FOLLOW US ]",
    subtitle: "TAG @_BROCODE._CO._ TO BE FEATURED IN OUR ARCHIVE",
  });

  // 8 Moments gallery photos
  const [mediaList, setMediaList] = useState([
    "/images/pallet_rack.jpg",
    "/images/pink_floyd_banner.jpg",
    "/images/patch.jpg",
    "/images/cap.jpg",
    "/images/founders.jpg",
    "/images/screaming_vocalist.jpg",
    "/images/amon_shorts.jpg",
    "/images/sabaton_tee.jpg",
  ]);

  const presetPhotos = [
    { label: "Studio Rack", url: "/images/pallet_rack.jpg" },
    { label: "Pink Floyd", url: "/images/pink_floyd_banner.jpg" },
    { label: "Band Patch", url: "/images/patch.jpg" },
    { label: "Distressed Cap", url: "/images/cap.jpg" },
    { label: "Founders", url: "/images/founders.jpg" },
    { label: "Live Vocalist", url: "/images/screaming_vocalist.jpg" },
    { label: "Amon Shorts", url: "/images/amon_shorts.jpg" },
    { label: "Sabaton Tee", url: "/images/sabaton_tee.jpg" },
    { label: "Hoodie Graphic", url: "/images/hoodie.jpg" },
    { label: "Amon Banner", url: "/images/amon_banner.jpg" },
  ];

  // Fetch initial content from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/content");
      const data = await res.json();

      if (data.contents?.MOMENTS_GALLERY) {
        const mg = data.contents.MOMENTS_GALLERY;
        const c = mg.content || {};

        setMomentsData({
          title: c.title || mg.title || "BROCODE MOMENTS",
          tagline: c.tagline || mg.subtitle || "[ FOLLOW US ]",
          subtitle: c.subtitle || "TAG @_BROCODE._CO._ TO BE FEATURED IN OUR ARCHIVE",
        });

        setSocialData((prev) => ({
          ...prev,
          instagramHandle: c.instagramHandle || "_brocode._co._",
          instagramUrl:
            c.instagramUrl ||
            "https://www.instagram.com/_brocode._co._?igsi=ajhuZDRvbW50Yzhu",
        }));

        if (Array.isArray(mg.media) && mg.media.length > 0) {
          const urls = mg.media.map((m) => (typeof m === "string" ? m : m.img || ""));
          setMediaList(urls);
        }
      }
    } catch (e) {
      console.error("Failed to load social & moments data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMediaUpload = async (slotIdx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlot(slotIdx);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) {
        setMediaList((prev) => {
          const updated = [...prev];
          updated[slotIdx] = data.url;
          return updated;
        });
      }
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleMediaChange = (slotIdx, val) => {
    setMediaList((prev) => {
      const updated = [...prev];
      updated[slotIdx] = val;
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      // 1. Save MOMENTS_GALLERY to webContent
      const payload = {
        sectionKey: "MOMENTS_GALLERY",
        title: momentsData.title,
        subtitle: momentsData.tagline,
        content: {
          title: momentsData.title,
          tagline: momentsData.tagline,
          subtitle: momentsData.subtitle,
          instagramHandle: socialData.instagramHandle,
          instagramUrl: socialData.instagramUrl,
          email: socialData.email,
          facebookUrl: socialData.facebookUrl,
          youtubeUrl: socialData.youtubeUrl,
          twitterUrl: socialData.twitterUrl,
          tiktokUrl: socialData.tiktokUrl,
        },
        media: mediaList,
      };

      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("Failed to save changes.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/10 px-3 py-1 font-mono text-[10px] font-bold text-pink-400 mb-2">
            <Instagram className="h-3 w-3" />
            <span>COMMUNITY & SOCIAL MEDIA STUDIO</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Social Media & Moments Gallery
          </h1>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Customize official Instagram handle, profile links, contact email, and the 8 live community moment photos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/guidelines"
            className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 font-mono text-xs font-bold text-neutral-300 hover:border-amber-500 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <Compass className="h-4 w-4 text-amber-400" />
            <span>Dimensions Manual ↗</span>
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-2 font-mono text-xs font-bold text-white transition-all hover:bg-pink-500 shadow-lg shadow-pink-600/20 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : saveSuccess ? (
              <Check className="h-4 w-4 text-emerald-300" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{saving ? "Publishing..." : saveSuccess ? "Published Live!" : "Publish Changes"}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 gap-2">
        <button
          onClick={() => setActiveTab("gallery")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 font-mono text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "gallery"
              ? "border-pink-500 text-pink-400"
              : "border-transparent text-neutral-400 hover:text-white"
          }`}
        >
          <Camera className="h-4 w-4" />
          <span>8 Community Moments Photos</span>
        </button>

        <button
          onClick={() => setActiveTab("accounts")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 font-mono text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "accounts"
              ? "border-pink-500 text-pink-400"
              : "border-transparent text-neutral-400 hover:text-white"
          }`}
        >
          <Share2 className="h-4 w-4" />
          <span>Social Media & Contact Links</span>
        </button>

        <button
          onClick={() => setActiveTab("text")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 font-mono text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "text"
              ? "border-pink-500 text-pink-400"
              : "border-transparent text-neutral-400 hover:text-white"
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Section Headings & Tagline</span>
        </button>
      </div>

      {/* Main Grid: Form + Live Mini Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Configuration Forms (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: 8 COMMUNITY MOMENT PHOTOS */}
          {activeTab === "gallery" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3.5 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-xs">
                  <Info className="h-4 w-4 text-pink-400 shrink-0" />
                  <span className="text-neutral-300 font-mono text-[11px]">
                    <strong className="text-white">Image Dimension Specs:</strong> Recommended{" "}
                    <span className="text-pink-400 font-bold">800 × 800 px</span> (1:1 Square) • Max 2MB.
                  </span>
                </div>
                <span className="font-mono text-[10px] text-neutral-400">
                  {mediaList.length} Active Slots
                </span>
              </div>

              {/* 8 Photo Slots Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mediaList.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/80 p-3.5 backdrop-blur-xl space-y-3 transition-all hover:border-neutral-700"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-black/80 px-2 py-0.5 font-mono text-[9px] font-bold text-pink-400 border border-pink-500/30">
                        PHOTO SLOT #{idx + 1}
                      </span>
                      <span className="font-mono text-[9px] text-neutral-500">
                        {idx % 2 === 0 ? "Circle / Frame" : "Squircle"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border border-neutral-700 bg-neutral-950">
                        <img
                          src={imgUrl}
                          alt={`Slot ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {uploadingSlot === idx && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                            <RefreshCw className="h-5 w-5 animate-spin text-pink-400" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 flex-1 min-w-0">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer rounded-xl border border-pink-500/40 bg-pink-500/10 px-3 py-1.5 text-[11px] font-mono font-bold text-pink-400 hover:bg-pink-500 hover:text-white transition-all">
                          <Upload className="h-3.5 w-3.5" />
                          <span>{uploadingSlot === idx ? "Uploading..." : "Upload Photo"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMediaUpload(idx, e)}
                            className="hidden"
                          />
                        </label>

                        {/* Preset Quick Select Dropdown */}
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) handleMediaChange(idx, e.target.value);
                          }}
                          className="block w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1 text-[10px] text-neutral-400 font-mono focus:border-pink-500 focus:outline-none"
                        >
                          <option value="">Select preset photo...</option>
                          {presetPhotos.map((p, pIdx) => (
                            <option key={pIdx} value={p.url}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Direct Image Path / URL */}
                    <div>
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => handleMediaChange(idx, e.target.value)}
                        placeholder="/images/... or https://..."
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-[11px] font-mono text-neutral-300 focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SOCIAL ACCOUNTS & CONTACTS */}
          {activeTab === "accounts" && (
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 backdrop-blur-xl space-y-5">
              <div>
                <h3 className="font-heading text-base font-bold uppercase text-white flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-pink-400" />
                  <span>Primary Instagram Account</span>
                </h3>
                <p className="font-mono text-xs text-neutral-400 mt-0.5">
                  Directly linked to the prominent button in the Moments Gallery & Footer.
                </p>
              </div>

              <div className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 uppercase mb-1">
                    Instagram Handle (Displayed on Button) *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-pink-400 font-bold">
                      @
                    </span>
                    <input
                      type="text"
                      required
                      value={socialData.instagramHandle}
                      onChange={(e) =>
                        setSocialData({ ...socialData, instagramHandle: e.target.value.replace(/^@/, "") })
                      }
                      placeholder="_brocode._co._"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-8 pr-3 py-2.5 text-white font-mono focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 uppercase mb-1">
                    Instagram Profile Full URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={socialData.instagramUrl}
                    onChange={(e) => setSocialData({ ...socialData, instagramUrl: e.target.value })}
                    placeholder="https://www.instagram.com/_brocode._co._?igsi=ajhuZDRvbW50Yzhu"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-mono focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div className="border-t border-neutral-800 pt-4">
                  <label className="block font-mono text-[10px] text-neutral-400 uppercase mb-1 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-amber-400" />
                    <span>Official Customer Inquiries Email *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={socialData.email}
                    onChange={(e) => setSocialData({ ...socialData, email: e.target.value })}
                    placeholder="brOcOde.2k26.param@gmail.com"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-mono focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div className="border-t border-neutral-800 pt-4 space-y-3">
                  <h4 className="font-mono text-xs font-bold text-neutral-300 uppercase">
                    Additional Social Links (Optional)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[9px] text-neutral-400 mb-1">
                        YouTube Channel
                      </label>
                      <input
                        type="url"
                        value={socialData.youtubeUrl}
                        onChange={(e) => setSocialData({ ...socialData, youtubeUrl: e.target.value })}
                        placeholder="https://youtube.com/@brocode"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2 text-white font-mono text-[11px] focus:border-pink-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[9px] text-neutral-400 mb-1">
                        TikTok Profile
                      </label>
                      <input
                        type="url"
                        value={socialData.tiktokUrl}
                        onChange={(e) => setSocialData({ ...socialData, tiktokUrl: e.target.value })}
                        placeholder="https://tiktok.com/@brocode"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2 text-white font-mono text-[11px] focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECTION HEADINGS & TAGLINE */}
          {activeTab === "text" && (
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 backdrop-blur-xl space-y-4">
              <h3 className="font-heading text-base font-bold uppercase text-white">
                Gallery Section Headings
              </h3>

              <div className="space-y-3 font-sans text-xs">
                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                    MAIN TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={momentsData.title}
                    onChange={(e) => setMomentsData({ ...momentsData, title: e.target.value })}
                    placeholder="BROCODE MOMENTS"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-heading text-sm uppercase focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                    BADGE / TAGLINE *
                  </label>
                  <input
                    type="text"
                    required
                    value={momentsData.tagline}
                    onChange={(e) => setMomentsData({ ...momentsData, tagline: e.target.value })}
                    placeholder="[ FOLLOW US ]"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-mono text-xs focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                    SUBTITLE / CALLOUT PROMPT
                  </label>
                  <input
                    type="text"
                    value={momentsData.subtitle}
                    onChange={(e) => setMomentsData({ ...momentsData, subtitle: e.target.value })}
                    placeholder="TAG @_BROCODE._CO._ TO BE FEATURED IN OUR ARCHIVE"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-sans focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Real-Time Multi-Theme Live Mini-Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-6">
          <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/90 p-3.5 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-pink-400" />
              <span className="font-mono text-xs font-bold text-white uppercase">
                Live Storefront Preview
              </span>
            </div>

            {/* Theme switcher tabs */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-neutral-800 text-[10px] font-mono">
              <button
                onClick={() => setPreviewTheme("noir")}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  previewTheme === "noir"
                    ? "bg-[#EF0606] text-white font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Noir
              </button>
              <button
                onClick={() => setPreviewTheme("cyber")}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  previewTheme === "cyber"
                    ? "bg-[#CCFF00] text-black font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Cyber
              </button>
              <button
                onClick={() => setPreviewTheme("ragnarok")}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  previewTheme === "ragnarok"
                    ? "bg-[#F59E0B] text-black font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Gothic
              </button>
            </div>
          </div>

          {/* Mini Browser Frame */}
          <div className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 shadow-2xl">
            {/* Browser topbar */}
            <div className="flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/90 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="font-mono text-[9px] text-neutral-400">
                brocode.io/#moments
              </span>
              <a
                href="/#moments"
                target="_blank"
                className="text-neutral-400 hover:text-white"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Preview Body based on selected theme */}
            <div className="p-4 sm:p-6 select-none overflow-hidden max-h-[560px] overflow-y-auto">
              {/* THEME 1: NOIR */}
              {previewTheme === "noir" && (
                <div className="bg-[#FAF9F5] p-5 rounded-2xl text-center space-y-4 border border-neutral-300">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-black/5 px-2.5 py-0.5 font-geometric text-[9px] font-black uppercase text-black">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#EF0606]" />
                    <span>{momentsData.tagline}</span>
                  </div>

                  <h3 className="font-didone text-2xl font-black uppercase tracking-tight text-black">
                    {momentsData.title}
                  </h3>

                  <div>
                    <a
                      href={socialData.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-black px-4 py-1.5 text-[10px] font-black uppercase text-white hover:bg-[#EF0606] transition-all shadow-md"
                    >
                      <Camera className="h-3.5 w-3.5 text-[#EF0606]" />
                      <span>@{socialData.instagramHandle}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Horizontal reel */}
                  <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
                    {mediaList.slice(0, 8).map((img, i) => (
                      <div
                        key={i}
                        className={`aspect-square w-14 shrink-0 overflow-hidden ${
                          i % 2 === 0 ? "rounded-full" : "rounded-xl"
                        } border border-black/20 bg-black p-0.5`}
                      >
                        <img
                          src={img}
                          alt="moment"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* THEME 2: CYBER */}
              {previewTheme === "cyber" && (
                <div className="rounded-2xl border border-[#CCFF00]/40 bg-[#080B10] p-4 text-left font-mono space-y-3 shadow-[0_0_20px_rgba(204,255,0,0.1)]">
                  <div className="flex items-center justify-between border-b border-[#CCFF00]/20 pb-2">
                    <div>
                      <span className="text-[8px] text-[#00F0FF] flex items-center gap-1">
                        <Zap className="h-3 w-3 text-[#CCFF00]" />
                        [ {momentsData.tagline} ]
                      </span>
                      <h4 className="text-base font-black uppercase text-[#CCFF00] mt-0.5">
                        {momentsData.title}
                      </h4>
                    </div>
                    <a
                      href={socialData.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-[#CCFF00] px-2.5 py-1 text-[9px] font-black uppercase text-black"
                    >
                      <Camera className="h-3 w-3" />
                      <span>@{socialData.instagramHandle}</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {mediaList.slice(0, 8).map((img, i) => (
                      <div
                        key={i}
                        className="aspect-square overflow-hidden rounded-lg border border-white/10 bg-neutral-900"
                      >
                        <img
                          src={img}
                          alt="cyber"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* THEME 3: RAGNAROK */}
              {previewTheme === "ragnarok" && (
                <div className="rounded-2xl border border-[#F59E0B]/40 bg-[#120D0D] p-4 text-center font-heading space-y-3 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#F59E0B]">
                    <Flame className="h-3 w-3" />
                    <span>ᚱ {momentsData.tagline} ᚱ</span>
                  </div>

                  <h4 className="text-xl font-black uppercase text-[#FEF3C7]">
                    {momentsData.title}
                  </h4>

                  <div>
                    <a
                      href={socialData.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#F59E0B] px-3.5 py-1.5 text-[10px] font-black uppercase text-black"
                    >
                      <Camera className="h-3 w-3" />
                      <span>@{socialData.instagramHandle}</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {mediaList.slice(0, 8).map((img, i) => (
                      <div
                        key={i}
                        className="aspect-[4/5] overflow-hidden rounded-t-2xl rounded-b-lg border border-[#F59E0B]/40 bg-[#161010]"
                      >
                        <img
                          src={img}
                          alt="gothic"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
