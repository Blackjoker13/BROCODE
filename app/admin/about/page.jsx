"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  Save,
  CheckCircle,
  Eye,
  Sparkles,
  Upload,
  Layers,
  Image as ImageIcon,
  RotateCcw,
  Send,
  AlertCircle,
  Loader2,
  FolderOpen,
  Link as LinkIcon,
  Trash2,
} from "lucide-react";

// Interactive Image Picker & File Uploader Component
function ImageUploadField({
  label,
  id,
  value,
  onChange,
  onBadgeChange,
  badgeValue,
  badgePlaceholder,
}) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (data.url) {
        onChange(data.url);
      }
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-300">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="inline-flex items-center gap-1 font-mono text-[9px] text-neutral-400 hover:text-amber-400 cursor-pointer"
        >
          <LinkIcon className="h-2.5 w-2.5" />
          <span>{showUrlInput ? "Hide Direct URL" : "Edit URL Directly"}</span>
        </button>
      </div>

      {/* Interactive Thumbnail & Upload Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Preview Thumbnail */}
        <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900 shadow-md">
          {value ? (
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-600">
              <ImageIcon className="h-6 w-6" />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-amber-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-[8px] font-mono mt-1">Uploading...</span>
            </div>
          )}
        </div>

        {/* Upload Buttons */}
        <div className="flex-1 space-y-2 w-full">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 px-3.5 py-2 font-mono text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-black transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Choose & Upload Image</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 font-mono text-xs text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Clear image"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <p className="text-[10px] text-neutral-500 font-mono">
            Supported: JPG, PNG, WEBP, GIF (Max 10MB)
          </p>
        </div>
      </div>

      {/* Direct URL Input Fallback */}
      {showUrlInput && (
        <div className="pt-2 animate-in fade-in duration-200">
          <span className="block font-mono text-[9px] text-neutral-400 mb-1">
            IMAGE URL / PATH
          </span>
          <input
            id={id}
            name={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/example.jpg or https://..."
            className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
          />
        </div>
      )}

      {/* Badge Label Input */}
      {onBadgeChange && (
        <div className="pt-2 border-t border-neutral-900">
          <label htmlFor={`${id}-badge`} className="block font-mono text-[10px] text-neutral-400 mb-1">
            PHOTO BADGE / LABEL TEXT
          </label>
          <input
            id={`${id}-badge`}
            name={`${id}-badge`}
            type="text"
            value={badgeValue}
            onChange={(e) => onBadgeChange(e.target.value)}
            placeholder={badgePlaceholder || "STUDIO RACK // 001"}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}

export default function AdminAboutUsStudioPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [previewTheme, setPreviewTheme] = useState("noir"); // 'noir', 'cyber', 'ragnarok'

  const [form, setForm] = useState({
    tagline: "[ ABOUT US ]",
    titleLine1: "THIS IS BROCODE",
    titleLine2: "LOUD, PROUD, UNTAMED",
    body: "Brocode is all about turning up the volume on what matters — real bands, real fans, real merch. We're here to dress your rebellion, fuel your playlists, and celebrate the chaos of sound and self-expression. No rules, no trends — just raw music energy.",
    rackImage: "/images/pallet_rack.jpg",
    rackLabel: "STUDIO RACK // 001",
    foundersImage: "/images/founders.jpg",
    foundersLabel: "BROCODE CREATORS",
  });

  // Preset image gallery
  const presetImages = [
    { url: "/images/pallet_rack.jpg", label: "Studio Rack" },
    { url: "/images/founders.jpg", label: "Founders" },
    { url: "/images/pink_floyd_banner.jpg", label: "Pink Floyd" },
    { url: "/images/sabaton_tee.jpg", label: "Sabaton Tee" },
    { url: "/images/amon_tanktop.jpg", label: "Amon Valhalla" },
    { url: "/images/sabbath_tee.jpg", label: "Black Sabbath" },
  ];

  const fetchAboutContent = async () => {
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      if (data.contents && data.contents.ABOUT_US) {
        const item = data.contents.ABOUT_US;
        const c = item.content || {};
        setForm({
          tagline: c.tagline || "[ ABOUT US ]",
          titleLine1: c.titleLine1 || item.title || "THIS IS BROCODE",
          titleLine2: c.titleLine2 || item.subtitle || "LOUD, PROUD, UNTAMED",
          body: c.body || "",
          rackImage: c.rackImage || "/images/pallet_rack.jpg",
          rackLabel: c.rackLabel || "STUDIO RACK // 001",
          foundersImage: c.foundersImage || "/images/founders.jpg",
          foundersLabel: c.foundersLabel || "BROCODE CREATORS",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionKey: "ABOUT_US",
          title: form.titleLine1,
          subtitle: form.titleLine2,
          content: {
            tagline: form.tagline,
            titleLine1: form.titleLine1,
            titleLine2: form.titleLine2,
            body: form.body,
            rackImage: form.rackImage,
            rackLabel: form.rackLabel,
            foundersImage: form.foundersImage,
            foundersLabel: form.foundersLabel,
          },
          media: [form.rackImage, form.foundersImage],
        }),
      });

      if (res.ok) {
        setSuccessMsg("About Us section saved to draft! Ready for preview and publication.");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      alert("Failed to save About Us content: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 font-mono text-[10px] font-bold text-amber-400 mb-2">
            <Sparkles className="h-3 w-3" />
            <span>SPECIALIZED CONTENT STUDIO</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            About Us Studio & Story CMS
          </h1>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Change your brand photos, upload new imagery, edit manifesto headlines, and verify live customer rendering.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/preview"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-mono font-bold text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          >
            <Eye className="h-4 w-4" />
            <span>Live Customer Preview</span>
          </Link>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs text-emerald-300 shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <Link
            href="/admin/preview"
            className="rounded-lg bg-emerald-500 px-3 py-1 text-[10px] font-mono font-black uppercase text-black hover:bg-emerald-400"
          >
            Publish Now →
          </Link>
        </div>
      )}

      {/* Main Studio Grid: Left Form, Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT: EDITING FORM ================= */}
        <form onSubmit={handleSave} className="lg:col-span-6 space-y-6">
          {/* Card 1: Imagery & Photo Uploads */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-amber-400" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  Photo Uploads & Imagery
                </h3>
              </div>
              <span className="font-mono text-[9px] text-amber-400 font-bold">
                DIRECT FILE UPLOAD READY
              </span>
            </div>

            {/* Studio Rack Image Upload Dropzone */}
            <ImageUploadField
              label="1. Primary Studio Photo"
              id="rackImage"
              value={form.rackImage}
              onChange={(url) => setForm({ ...form, rackImage: url })}
              badgeValue={form.rackLabel}
              onBadgeChange={(val) => setForm({ ...form, rackLabel: val })}
              badgePlaceholder="STUDIO RACK // 001"
            />

            {/* Founders / Moment Image Upload Dropzone */}
            <ImageUploadField
              label="2. Founders / Community Photo"
              id="foundersImage"
              value={form.foundersImage}
              onChange={(url) => setForm({ ...form, foundersImage: url })}
              badgeValue={form.foundersLabel}
              onBadgeChange={(val) => setForm({ ...form, foundersLabel: val })}
              badgePlaceholder="BROCODE CREATORS"
            />

            {/* Presets Quick Picker */}
            <div className="pt-2">
              <span className="block font-mono text-[9px] text-neutral-400 mb-2">
                OR CLICK TO SELECT FROM AVAILABLE ASSETS:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {presetImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (idx % 2 === 0) setForm({ ...form, rackImage: img.url });
                      else setForm({ ...form, foundersImage: img.url });
                    }}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-800 hover:border-amber-500 transition-all p-1 text-left cursor-pointer"
                  >
                    <Image
                      src={img.url}
                      alt={img.label}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] font-mono text-white font-bold p-1 text-center transition-opacity">
                      Use Photo
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Headlines & Typography */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
              <FileText className="h-4 w-4 text-amber-400" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                Headlines & Story Copy
              </h3>
            </div>

            <div>
              <label htmlFor="tagline" className="block font-mono text-[10px] text-neutral-400 mb-1">
                TOP BADGE TAGLINE
              </label>
              <input
                id="tagline"
                name="tagline"
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="[ ABOUT US ]"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="titleLine1" className="block font-mono text-[10px] text-neutral-400 mb-1">
                  MAIN HEADLINE (LINE 1)
                </label>
                <input
                  id="titleLine1"
                  name="titleLine1"
                  type="text"
                  value={form.titleLine1}
                  onChange={(e) => setForm({ ...form, titleLine1: e.target.value })}
                  placeholder="THIS IS BROCODE"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="titleLine2" className="block font-mono text-[10px] text-neutral-400 mb-1">
                  HIGHLIGHT TITLE (LINE 2)
                </label>
                <input
                  id="titleLine2"
                  name="titleLine2"
                  type="text"
                  value={form.titleLine2}
                  onChange={(e) => setForm({ ...form, titleLine2: e.target.value })}
                  placeholder="LOUD, PROUD, UNTAMED"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-xs font-bold text-[#EF0606] focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="body" className="block font-mono text-[10px] text-neutral-400 mb-1">
                BRAND MANIFESTO / STORY BODY
              </label>
              <textarea
                id="body"
                name="body"
                rows={4}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Write the full brand story and vision..."
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-200 leading-relaxed focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 font-mono text-xs font-bold text-black hover:bg-amber-400 shadow-xl shadow-amber-500/10 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Saving Draft..." : "Save About Us Draft"}</span>
            </button>
          </div>
        </form>

        {/* ================= RIGHT: LIVE MINI-PREVIEW ================= */}
        <div className="lg:col-span-6 sticky top-20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-emerald-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                Live Dynamic Preview
              </span>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-950 p-1">
              {[
                { id: "noir", label: "01 Noir" },
                { id: "cyber", label: "02 Cyber" },
                { id: "ragnarok", label: "03 Gothic" },
              ].map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setPreviewTheme(th.id)}
                  className={`rounded-lg px-2.5 py-1 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                    previewTheme === th.id
                      ? "bg-amber-500 text-black shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Container */}
          <div
            className={`rounded-3xl border p-6 transition-all duration-300 overflow-hidden shadow-2xl ${
              previewTheme === "cyber"
                ? "bg-[#080B10] border-[#CCFF00]/40 text-[#F0F6FC]"
                : previewTheme === "ragnarok"
                ? "bg-[#100C0C] border-[#F59E0B]/40 text-[#FEF3C7]"
                : "bg-[#EFEEE8] border-black/15 text-black"
            }`}
          >
            {/* Theme 01 Noir Preview */}
            {previewTheme === "noir" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-black/15 shadow-md bg-black">
                    {form.rackImage ? (
                      <Image
                        src={form.rackImage}
                        alt={form.rackLabel}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-600 font-mono text-xs">
                        [ NO PHOTO ]
                      </div>
                    )}
                    <div className="absolute top-2 left-2 rounded-full bg-black/80 px-2 py-0.5 text-[8px] font-bold text-white font-mono">
                      {form.rackLabel}
                    </div>
                  </div>

                  <div className="text-center sm:text-left space-y-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-black/20 bg-black/5 px-2.5 py-0.5 text-[8px] font-black tracking-widest text-black">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#EF0606]" />
                      <span>{form.tagline}</span>
                    </div>

                    <h3 className="font-didone text-2xl font-black uppercase leading-tight text-black">
                      {form.titleLine1}
                    </h3>
                    <div className="font-didone text-xl font-black uppercase text-[#EF0606]">
                      {form.titleLine2}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-center border-t border-black/10 pt-4">
                  <div className="relative aspect-square w-20 shrink-0 rounded-2xl overflow-hidden border border-black/20 bg-black shadow-md">
                    {form.foundersImage ? (
                      <Image
                        src={form.foundersImage}
                        alt={form.foundersLabel}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-600 font-mono text-[10px]">
                        [ NO PHOTO ]
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-black/80 font-sans leading-relaxed">
                    {form.body}
                  </p>
                </div>
              </div>
            )}

            {/* Theme 02 Cyber Preview */}
            {previewTheme === "cyber" && (
              <div className="space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-[#CCFF00]/20 pb-2 text-[9px]">
                  <span className="text-[#00F0FF]">{form.tagline}</span>
                  <span className="text-[#CCFF00]">SYS_VERSION: 2.4</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-[#090C10] p-3">
                    <span className="text-[8px] text-[#00F0FF] block">{form.rackLabel}</span>
                    <h4 className="text-sm font-black text-[#CCFF00] uppercase mt-1">{form.titleLine1}</h4>
                  </div>
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-[#CCFF00]">
                    {form.foundersImage ? (
                      <Image
                        src={form.foundersImage}
                        alt={form.foundersLabel}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-600 font-mono text-xs">
                        [ NO PHOTO ]
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#090C10] p-3 text-[10px] text-neutral-300">
                  <span className="text-[#CCFF00] font-bold block mb-1">{form.titleLine2}</span>
                  <p className="line-clamp-3">{form.body}</p>
                </div>
              </div>
            )}

            {/* Theme 03 Gothic Preview */}
            {previewTheme === "ragnarok" && (
              <div className="space-y-4 font-heading text-center">
                <span className="text-[9px] text-[#F59E0B] tracking-widest uppercase">ᚱ {form.tagline} ᚱ</span>
                <h3 className="text-xl font-black uppercase text-[#FEF3C7]">{form.titleLine1}</h3>
                <div className="text-base font-bold uppercase text-[#F59E0B]">{form.titleLine2}</div>

                <div className="flex items-center gap-3 text-left border-t border-[#F59E0B]/30 pt-3">
                  <div className="relative aspect-square w-16 shrink-0 rounded-t-2xl rounded-b-lg overflow-hidden border-2 border-[#F59E0B]">
                    {form.foundersImage ? (
                      <Image
                        src={form.foundersImage}
                        alt={form.foundersLabel}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-600 font-mono text-[9px]">
                        [ NO PHOTO ]
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-[#FDE68A] opacity-90 leading-relaxed font-serif">
                    {form.body}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
