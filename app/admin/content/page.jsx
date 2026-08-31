"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Save, CheckCircle, Upload, Plus, Trash2, Sparkles, MessageSquare } from "lucide-react";

export default function AdminContentPage() {
  const [contents, setContents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Section forms
  const [aboutData, setAboutData] = useState({
    title: "THIS IS BROCODE LOUD, PROUD, AND UNTAMED",
    subtitle: "[ about us ]",
    body: "Brocode is all about turning up the volume on what matters — real bands, real fans, real merch. We're here to dress your rebellion, fuel your playlists, and celebrate the chaos of sound and self-expression. No rules, no trends — just raw music energy.",
    tagline: "LOUD, PROUD, AND UNTAMED",
  });

  const [marqueeData, setMarqueeData] = useState({
    text: "FREE SHIPPING WITHIN SOUTH AMERICA",
    emoji: "💥",
    speed: 24,
  });

  const [momentsData, setMomentsData] = useState({
    title: "BROCODE MOMENTS",
    subtitle: "[ follow us ]",
    instagramHandle: "_brocode._co._",
    instagramUrl: "https://www.instagram.com/_brocode._co._?igsi=ajhuZDRvbW50Yzhu",
    media: [
      { id: 1, img: "/images/pallet_rack.jpg" },
      { id: 2, img: "/images/pink_floyd_banner.jpg" },
      { id: 3, img: "/images/patch.jpg" },
      { id: 4, img: "/images/cap.jpg" },
      { id: 5, img: "/images/founders.jpg" },
      { id: 6, img: "/images/screaming_vocalist.jpg" },
      { id: 7, img: "/images/amon_shorts.jpg" },
      { id: 8, img: "/images/sabaton_tee.jpg" },
    ],
  });

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      if (data.contents) {
        setContents(data.contents);
        if (data.contents.ABOUT_US) {
          setAboutData({
            title: data.contents.ABOUT_US.title || "",
            subtitle: data.contents.ABOUT_US.subtitle || "",
            body: data.contents.ABOUT_US.content?.body || "",
            tagline: data.contents.ABOUT_US.content?.tagline || "",
          });
        }
        if (data.contents.MARQUEE_TEXT) {
          setMarqueeData({
            text: data.contents.MARQUEE_TEXT.content?.text || "",
            emoji: data.contents.MARQUEE_TEXT.content?.emoji || "💥",
            speed: data.contents.MARQUEE_TEXT.content?.speed || 24,
          });
        }
        if (data.contents.MOMENTS_GALLERY) {
          setMomentsData({
            title: data.contents.MOMENTS_GALLERY.title || "BROCODE MOMENTS",
            subtitle: data.contents.MOMENTS_GALLERY.subtitle || "[ follow us ]",
            instagramHandle: data.contents.MOMENTS_GALLERY.content?.instagramHandle || "_brocode._co._",
            instagramUrl: data.contents.MOMENTS_GALLERY.content?.instagramUrl || "https://www.instagram.com/_brocode._co._?igsi=ajhuZDRvbW50Yzhu",
            media: data.contents.MOMENTS_GALLERY.media || [],
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const saveSection = async (sectionKey, payload) => {
    setSavingSection(sectionKey);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMsg(`"${sectionKey}" updated successfully! Changes reflect on storefront immediately.`);
        setTimeout(() => setSuccessMsg(""), 3500);
      }
    } catch (e) {
      alert("Save failed");
    } finally {
      setSavingSection("");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-white">
          Website Content & Story CMS
        </h1>
        <p className="font-mono text-xs text-neutral-400">
          Edit brand manifesto, announcement ticker, and community Instagram moments gallery
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ============ 1. MARQUEE ANNOUNCEMENT TICKER ============ */}
      <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2 font-heading text-base font-bold text-white uppercase">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Top Marquee Announcement Bar</span>
          </div>
          <button
            onClick={() =>
              saveSection("MARQUEE_TEXT", {
                sectionKey: "MARQUEE_TEXT",
                title: "Top Marquee Announcement",
                content: marqueeData,
              })
            }
            disabled={savingSection === "MARQUEE_TEXT"}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-1.5 font-mono text-xs font-bold text-black hover:bg-amber-400 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{savingSection === "MARQUEE_TEXT" ? "Saving..." : "Save Marquee"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 font-sans text-xs">
          <div className="sm:col-span-2">
            <label className="block font-mono text-[10px] text-neutral-400 mb-1">
              PROMOTIONAL TICKER TEXT
            </label>
            <input
              type="text"
              value={marqueeData.text}
              onChange={(e) => setMarqueeData({ ...marqueeData, text: e.target.value })}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] text-neutral-400 mb-1">
              ICON / EMOJI
            </label>
            <input
              type="text"
              value={marqueeData.emoji}
              onChange={(e) => setMarqueeData({ ...marqueeData, emoji: e.target.value })}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Live Preview Strip */}
        <div className="mt-2 rounded-xl bg-[#e5a823] p-2.5 text-black font-mono text-xs font-black uppercase tracking-widest text-center">
          {marqueeData.emoji} {marqueeData.text} {marqueeData.emoji} {marqueeData.text}
        </div>
      </div>

      {/* ============ 2. ABOUT US MANIFESTO ============ */}
      <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2 font-heading text-base font-bold text-white uppercase">
            <FileText className="h-4 w-4 text-amber-400" />
            <span>About Us & Brand Story</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/about"
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 font-mono text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-black transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Dedicated Studio ↗</span>
            </Link>
            <button
              onClick={() =>
                saveSection("ABOUT_US", {
                  sectionKey: "ABOUT_US",
                  title: aboutData.title,
                  subtitle: aboutData.subtitle,
                  content: { body: aboutData.body, tagline: aboutData.tagline },
                })
              }
              disabled={savingSection === "ABOUT_US"}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-1.5 font-mono text-xs font-bold text-black hover:bg-amber-400 disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{savingSection === "ABOUT_US" ? "Saving..." : "Save Story"}</span>
            </button>
          </div>
        </div>

        <div className="space-y-3 font-sans text-xs">
          <div>
            <label className="block font-mono text-[10px] text-neutral-400 mb-1">
              SECTION HEADLINE
            </label>
            <input
              type="text"
              value={aboutData.title}
              onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-heading font-bold text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] text-neutral-400 mb-1">
              MANIFESTO BODY TEXT
            </label>
            <textarea
              rows={4}
              value={aboutData.body}
              onChange={(e) => setAboutData({ ...aboutData, body: e.target.value })}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ============ 3. MOMENTS GALLERY & INSTAGRAM ============ */}
      <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2 font-heading text-base font-bold text-white uppercase">
            <MessageSquare className="h-4 w-4 text-pink-400" />
            <span>Moments Gallery & Social Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/social"
              className="flex items-center gap-1.5 rounded-xl border border-pink-500/40 bg-pink-500/10 px-3.5 py-1.5 font-mono text-xs font-bold text-pink-400 hover:bg-pink-500 hover:text-white transition-all shadow-sm"
            >
              <span>Open Social Studio ↗</span>
            </Link>
            <button
              onClick={() =>
                saveSection("MOMENTS_GALLERY", {
                  sectionKey: "MOMENTS_GALLERY",
                  title: momentsData.title,
                  subtitle: momentsData.subtitle,
                  content: {
                    instagramHandle: momentsData.instagramHandle,
                    instagramUrl: momentsData.instagramUrl,
                  },
                  media: momentsData.media,
                })
              }
              disabled={savingSection === "MOMENTS_GALLERY"}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-1.5 font-mono text-xs font-bold text-black hover:bg-amber-400 disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{savingSection === "MOMENTS_GALLERY" ? "Saving..." : "Save Gallery"}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 font-sans text-xs">
          <div>
            <label className="block font-mono text-[10px] text-neutral-400 mb-1">
              INSTAGRAM HANDLE
            </label>
            <input
              type="text"
              value={momentsData.instagramHandle}
              onChange={(e) => setMomentsData({ ...momentsData, instagramHandle: e.target.value })}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] text-neutral-400 mb-1">
              INSTAGRAM PROFILE LINK
            </label>
            <input
              type="text"
              value={momentsData.instagramUrl}
              onChange={(e) => setMomentsData({ ...momentsData, instagramUrl: e.target.value })}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Media items */}
        <div>
          <label className="block font-mono text-[10px] text-neutral-400 mb-2">
            GALLERY PHOTO STRIP ({momentsData.media.length} items)
          </label>
          <div className="flex flex-wrap gap-3">
            {momentsData.media.map((item, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={item.img}
                  alt={`moment-${idx}`}
                  className="h-16 w-16 rounded-xl object-cover border border-neutral-800"
                />
                <button
                  onClick={() =>
                    setMomentsData({
                      ...momentsData,
                      media: momentsData.media.filter((_, i) => i !== idx),
                    })
                  }
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[9px]"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
