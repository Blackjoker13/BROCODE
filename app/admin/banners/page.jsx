"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  Check,
  Eye,
  Compass,
  Play,
  Sparkles,
  Info,
  Layers,
} from "lucide-react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    tag: "",
    buttonText: "",
    buttonLink: "",
    image: "/images/pink_floyd_banner.jpg",
    placement: "TOUR_BANNER",
    isActive: true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      if (data.banners) setBanners(data.banners);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      subtitle: "",
      tag: "[ COLLECTION ]",
      buttonText: "EXPLORE COLLECTION →",
      buttonLink: "/#catalog",
      image: "/images/pink_floyd_banner.jpg",
      placement: "TOUR_BANNER",
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBanner(b);
    setFormData({
      title: b.title,
      subtitle: b.subtitle || "",
      tag: b.tag || "",
      buttonText: b.buttonText || "",
      buttonLink: b.buttonLink || "",
      image: b.image || "/images/pink_floyd_banner.jpg",
      placement: b.placement || "TOUR_BANNER",
      isActive: b.isActive,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      }
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingBanner
        ? `/api/admin/banners/${editingBanner.id}`
        : "/api/admin/banners";
      const method = editingBanner ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.banner) {
          setBanners((prev) => {
            const exists = prev.some((b) => b.id === data.banner.id);
            if (exists) {
              return prev.map((b) => (b.id === data.banner.id ? data.banner : b));
            }
            return [data.banner, ...prev];
          });
        }
        setModalOpen(false);
        fetchBanners();
      } else {
        alert(data.error || "Failed to save banner");
      }
    } catch (e) {
      alert("Failed to save banner");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete banner "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      if (res.ok) fetchBanners();
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 font-mono text-[10px] font-bold text-amber-400 mb-2">
            <Play className="h-3 w-3" />
            <span>3.5s AUTO-PLAYING SLIDESHOW ACTIVE</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Homepage Banners & Slideshows ({banners.length})
          </h1>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            All active Tour & Hero banners automatically rotate in a smooth 3.5s slideshow on the customer storefront.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/guidelines"
            className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 font-mono text-xs font-bold text-neutral-300 hover:border-amber-500 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <Compass className="h-4 w-4 text-amber-400" />
            <span>Dimensions Specs Manual ↗</span>
          </Link>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 font-mono text-xs font-bold text-black transition-all hover:bg-amber-400 shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Banner</span>
          </button>
        </div>
      </div>

      {/* Recommended Dimensions Quick Tip Callout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs">
        <div className="flex items-center gap-2.5">
          <Info className="h-5 w-5 text-amber-400 shrink-0" />
          <span className="text-neutral-300 font-mono text-[11px]">
            <strong className="text-white">Slideshow Banner Specs:</strong> Recommended size is{" "}
            <span className="text-amber-400 font-bold">1920 × 700 px</span> (16:9 or 21:9 Widescreen) • JPG / PNG / WEBP (Max 5MB).
          </span>
        </div>
        <Link
          href="/admin/guidelines"
          className="font-mono text-[10px] font-bold text-amber-400 hover:underline shrink-0 uppercase tracking-wider"
        >
          View Full Asset Manual →
        </Link>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {banners.map((b, idx) => (
          <div
            key={b.id}
            className="group relative overflow-hidden rounded-3xl border border-neutral-800/80 bg-neutral-900/60 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-neutral-700"
          >
            {/* Banner Preview Graphic */}
            <div className="relative h-48 w-full overflow-hidden bg-neutral-950">
              <img
                src={b.image}
                alt={b.title}
                className="h-full w-full object-cover brightness-75 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
              <div className="absolute top-3 left-4 flex items-center gap-2">
                <span className="rounded-full bg-black/80 px-2.5 py-0.5 font-mono text-[9px] font-bold text-amber-400 border border-amber-500/30 backdrop-blur-md">
                  SLIDE #{idx + 1}
                </span>
                <span className="rounded-full bg-black/80 px-2.5 py-0.5 font-mono text-[9px] font-bold text-white/80 border border-white/10 backdrop-blur-md uppercase">
                  {b.placement}
                </span>
              </div>

              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="font-heading text-xl font-black text-white leading-tight">
                  {b.title}
                </h3>
              </div>
            </div>

            {/* Banner Details & Actions */}
            <div className="p-4 space-y-3 font-sans text-xs">
              <p className="text-neutral-400 line-clamp-2">{b.subtitle || "No subtitle."}</p>

              <div className="flex items-center justify-between border-t border-neutral-800 pt-3 font-mono text-[11px]">
                <span className="text-amber-400 font-bold">{b.buttonText || "EXPLORE"}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(b)}
                    className="rounded-xl border border-neutral-800 p-2 text-neutral-400 hover:border-amber-500 hover:text-amber-300 transition-colors cursor-pointer"
                    title="Edit banner"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id, b.title)}
                    className="rounded-xl border border-neutral-800 p-2 text-neutral-400 hover:border-red-500 hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete banner"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h2 className="font-heading text-lg font-bold uppercase text-white">
                  {editingBanner ? "Edit Banner Slide" : "New Banner Slide"}
                </h2>
                <p className="font-mono text-[10px] text-neutral-400 mt-0.5">
                  Recommended size: 1920 × 700 px (16:9 or 21:9)
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-xl p-1.5 text-neutral-400 hover:text-white cursor-pointer hover:bg-neutral-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 font-sans text-xs">
              <div>
                <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                  BANNER TITLE *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. PINK FLOYD WORLD TOUR"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                  SUBTITLE / MANIFESTO LINE
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="LIMITED EDITION TOUR APPAREL DROP"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                    PLACEMENT
                  </label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white font-mono focus:border-amber-500 focus:outline-none"
                  >
                    <option value="TOUR_BANNER">Tour Banner (Slideshow)</option>
                    <option value="FEATURED_DROP">Featured Drop (Amon Amarth)</option>
                    <option value="HERO">Hero Banner</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                    TAG BADGE
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="[ COLLECTION ]"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                    BUTTON TEXT
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="EXPLORE COLLECTION →"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-neutral-400 mb-1">
                    BUTTON LINK
                  </label>
                  <input
                    type="text"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    placeholder="/#catalog or #featured-drop"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Banner Image Upload & Preview */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-mono text-[10px] font-bold text-neutral-300 uppercase">
                    Banner Artwork (1920 × 700 px)
                  </label>
                  <span className="font-mono text-[9px] text-amber-400">16:9 or 21:9</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative aspect-[21/9] w-36 shrink-0 overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900">
                    <img
                      src={formData.image}
                      alt="preview"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-mono font-bold text-amber-400 hover:bg-amber-500 hover:text-black transition-all">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[9px] font-mono text-neutral-500">
                      Supports JPG, PNG, WEBP up to 5MB
                    </p>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/banner.jpg or https://..."
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2 text-[11px] text-neutral-300 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-neutral-800 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-neutral-800 px-4 py-2 text-neutral-300 hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-amber-500 px-5 py-2 font-mono font-bold text-black hover:bg-amber-400 shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
