"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Image as ImageIcon,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Maximize2,
  FileCheck,
  Zap,
  Info,
} from "lucide-react";

export default function AdminAssetDimensionsManualPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const assetGuidelines = [
    {
      id: "tour-banner",
      category: "banners",
      title: "Full-Width Tour & Merch Banners (Slideshow)",
      placement: "Homepage Tour Banner Slideshow (Pink Floyd / Drops)",
      recommendedDimensions: "1920 × 700 px",
      aspectRatio: "16:9 or 21:9 Widescreen",
      minDimensions: "1440 × 550 px",
      maxFileSize: "5 MB (Recommended < 800 KB)",
      formats: ["JPG", "WEBP", "PNG"],
      accentColor: "border-red-500/40 bg-red-500/10 text-red-400",
      description:
        "Full-width hero and tour slideshow banners. Changes automatically every 3.5 seconds on the customer storefront.",
      tips: [
        "Keep the focal point in the right/center 60% of the image.",
        "Leave the bottom-left area dark or gradient-friendly for headline text and CTA buttons.",
        "Use 1920px width for crisp 4K and Retina displays.",
      ],
      ratioBox: "aspect-[21/9]",
    },
    {
      id: "featured-drop",
      category: "banners",
      title: "Featured Drop & Collection Banner",
      placement: "Featured Drop Banner Section (Amon Amarth / Ragnarok)",
      recommendedDimensions: "1200 × 600 px",
      aspectRatio: "2:1 Wide",
      minDimensions: "900 × 450 px",
      maxFileSize: "3 MB (Recommended < 500 KB)",
      formats: ["JPG", "WEBP", "PNG"],
      accentColor: "border-amber-500/40 bg-amber-500/10 text-amber-400",
      description:
        "Mid-page promotional spotlight container for seasonal capsules and artist collaborations.",
      tips: [
        "Dark or moody textures complement the Gothic Ragnarok and Noir themes.",
        "Ensure artwork is centered with strong contrast.",
      ],
      ratioBox: "aspect-[2/1]",
    },
    {
      id: "product-photo",
      category: "products",
      title: "Product Showcase & Apparel Photos",
      placement: "Catalog Cards, Product Details Modal, Quick View",
      recommendedDimensions: "1000 × 1200 px",
      aspectRatio: "5:6 Portrait Studio Ratio",
      minDimensions: "800 × 960 px",
      maxFileSize: "3 MB (Recommended < 400 KB)",
      formats: ["JPG", "WEBP", "PNG (Transparent allowed)"],
      accentColor: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
      description:
        "Individual t-shirt, hoodie, accessory, and apparel product photography.",
      tips: [
        "Use vertical 5:6 portrait orientation for consistent catalog grid alignment.",
        "Maintain consistent neutral studio background lighting across all catalog items.",
        "Multiple angles (front, back, model fit) can be uploaded as an array.",
      ],
      ratioBox: "aspect-[5/6]",
    },
    {
      id: "category-card",
      category: "categories",
      title: "Category Bento Cards & Portal Thumbnails",
      placement: "5 Category Circles, Bento Capsule Grid, Ragnarok Portals",
      recommendedDimensions: "800 × 800 px (or 600 × 750 px)",
      aspectRatio: "1:1 Square (or 4:5 Portal)",
      minDimensions: "500 × 500 px",
      maxFileSize: "2 MB (Recommended < 300 KB)",
      formats: ["JPG", "WEBP", "PNG"],
      accentColor: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400",
      description:
        "Visual thumbnails representing store categories (Ropa, Accesorios, Drops).",
      tips: [
        "Theme 01 crops to round circles; Theme 03 crops to arched gothic portals.",
        "Ensure the product or model is centered so it looks stunning in circular and arched masks.",
      ],
      ratioBox: "aspect-square",
    },
    {
      id: "about-studio-rack",
      category: "about",
      title: "Primary Studio Rack Photo",
      placement: "About Us Studio Manifesto Section (Left Card)",
      recommendedDimensions: "1200 × 900 px",
      aspectRatio: "4:3 Landscape",
      minDimensions: "800 × 600 px",
      maxFileSize: "3 MB (Recommended < 600 KB)",
      formats: ["JPG", "WEBP", "PNG"],
      accentColor: "border-purple-500/40 bg-purple-500/10 text-purple-400",
      description:
        "Widescreen apparel rack, warehouse studio, or production workshop aesthetic photo.",
      tips: [
        "Horizontal 4:3 orientation delivers maximum impact inside 3D tilt cards.",
        "Shows clothing on racks or in production to communicate authentic quality.",
      ],
      ratioBox: "aspect-[4/3]",
    },
    {
      id: "about-founders",
      category: "about",
      title: "Founders & Community Photo",
      placement: "About Us Creators Tile & Moments Gallery",
      recommendedDimensions: "800 × 800 px",
      aspectRatio: "1:1 Square",
      minDimensions: "500 × 500 px",
      maxFileSize: "2 MB (Recommended < 350 KB)",
      formats: ["JPG", "WEBP", "PNG"],
      accentColor: "border-pink-500/40 bg-pink-500/10 text-pink-400",
      description:
        "Community, founder portraits, artist live moments, or brand team shots.",
      tips: [
        "Square 1:1 framing fits all responsive device cards seamlessly.",
        "Candid, energetic concert or studio photos connect best with customers.",
      ],
      ratioBox: "aspect-square",
    },
    {
      id: "brand-logo",
      category: "branding",
      title: "Brand Logos, Marks & Favicons",
      placement: "Header Navigation, Footer, Admin Dashboard, Browser Tab",
      recommendedDimensions: "500 × 150 px (Wide) & 512 × 512 px (Square Icon)",
      aspectRatio: "Flexible (Wide Logo / Square Icon)",
      minDimensions: "250 × 80 px",
      maxFileSize: "1 MB (Recommended < 100 KB)",
      formats: ["SVG (Preferred)", "PNG (Transparent)"],
      accentColor: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
      description:
        "Official vector logos and monochrome badges for light and dark backgrounds.",
      tips: [
        "Always use transparent backgrounds (`.svg` or `.png`).",
        "Maintain high contrast for readability over both dark and acid light backgrounds.",
      ],
      ratioBox: "aspect-[3/1]",
    },
  ];

  const filteredGuidelines =
    activeCategory === "all"
      ? assetGuidelines
      : assetGuidelines.filter((g) => g.category === activeCategory);

  return (
    <div className="space-y-8 max-w-7xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 font-mono text-[10px] font-bold text-amber-400 mb-2">
            <Compass className="h-3 w-3" />
            <span>OFFICIAL ASSET SPECIFICATIONS</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Image & Banner Dimensions Manual
          </h1>
          <p className="font-mono text-xs text-neutral-400 mt-1">
            Exact aspect ratios, recommended pixel resolutions, and file format guidelines for all storefront imagery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/banners"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-mono font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
          >
            <ImageIcon className="h-4 w-4" />
            <span>Manage Banners CMS →</span>
          </Link>
        </div>
      </div>

      {/* Quick Summary Spec Sheet Card */}
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 mb-4">
          <Zap className="h-4 w-4 text-amber-400" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            Quick Reference Dimension Table
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-[10px] uppercase text-neutral-400">
                <th className="pb-3 pr-4 font-bold">Asset Type</th>
                <th className="pb-3 px-4 font-bold">Recommended Resolution</th>
                <th className="pb-3 px-4 font-bold">Aspect Ratio</th>
                <th className="pb-3 px-4 font-bold">Max Size</th>
                <th className="pb-3 pl-4 font-bold">Formats</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              <tr>
                <td className="py-3 pr-4 font-bold text-white">Tour Slideshow Banners</td>
                <td className="py-3 px-4 text-amber-400 font-bold">1920 × 700 px</td>
                <td className="py-3 px-4">16:9 / 21:9 Widescreen</td>
                <td className="py-3 px-4 text-neutral-400">&lt; 1 MB (Max 5MB)</td>
                <td className="py-3 pl-4 text-neutral-400">JPG, WEBP, PNG</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold text-white">Featured Drop Banners</td>
                <td className="py-3 px-4 text-amber-400 font-bold">1200 × 600 px</td>
                <td className="py-3 px-4">2:1 Ratio</td>
                <td className="py-3 px-4 text-neutral-400">&lt; 800 KB (Max 3MB)</td>
                <td className="py-3 pl-4 text-neutral-400">JPG, WEBP, PNG</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold text-white">Product Apparel Photos</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">1000 × 1200 px</td>
                <td className="py-3 px-4">5:6 Portrait Studio</td>
                <td className="py-3 px-4 text-neutral-400">&lt; 400 KB (Max 3MB)</td>
                <td className="py-3 pl-4 text-neutral-400">JPG, WEBP, PNG</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold text-white">Category Bento Cards</td>
                <td className="py-3 px-4 text-cyan-400 font-bold">800 × 800 px</td>
                <td className="py-3 px-4">1:1 Square</td>
                <td className="py-3 px-4 text-neutral-400">&lt; 350 KB (Max 2MB)</td>
                <td className="py-3 pl-4 text-neutral-400">JPG, WEBP, PNG</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold text-white">Studio Rack Photo (About Us)</td>
                <td className="py-3 px-4 text-purple-400 font-bold">1200 × 900 px</td>
                <td className="py-3 px-4">4:3 Landscape</td>
                <td className="py-3 px-4 text-neutral-400">&lt; 600 KB (Max 3MB)</td>
                <td className="py-3 pl-4 text-neutral-400">JPG, WEBP, PNG</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold text-white">Founders & Moments (About Us)</td>
                <td className="py-3 px-4 text-pink-400 font-bold">800 × 800 px</td>
                <td className="py-3 px-4">1:1 Square</td>
                <td className="py-3 px-4 text-neutral-400">&lt; 350 KB (Max 2MB)</td>
                <td className="py-3 pl-4 text-neutral-400">JPG, WEBP, PNG</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-bold text-white">Brand Logos & Badges</td>
                <td className="py-3 px-4 text-yellow-400 font-bold">500 × 150 px</td>
                <td className="py-3 px-4">Vector / Wide</td>
                <td className="py-3 px-4 text-neutral-400">&lt; 100 KB</td>
                <td className="py-3 pl-4 text-neutral-400">SVG, PNG Transparent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "All Asset Specs" },
          { id: "banners", label: "Banners & Slideshows" },
          { id: "products", label: "Products & Apparel" },
          { id: "categories", label: "Categories & Portals" },
          { id: "about", label: "About Us & Story" },
          { id: "branding", label: "Logos & Marks" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all cursor-pointer ${
              activeCategory === tab.id
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                : "border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Detailed Guideline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuidelines.map((guide) => (
          <div
            key={guide.id}
            className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 backdrop-blur-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase mb-2 ${guide.accentColor}`}
                  >
                    {guide.aspectRatio}
                  </span>
                  <h3 className="font-heading text-lg font-black uppercase text-white tracking-tight">
                    {guide.title}
                  </h3>
                  <p className="font-mono text-[10px] text-neutral-400 mt-0.5">
                    {guide.placement}
                  </p>
                </div>
              </div>

              {/* Proportion Visualizer Box */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 flex items-center justify-center">
                <div
                  className={`w-full max-w-[240px] rounded-xl border-2 border-dashed border-amber-500/50 bg-amber-500/5 flex flex-col items-center justify-center p-3 text-center ${guide.ratioBox}`}
                >
                  <span className="font-mono text-sm font-black text-amber-400">
                    {guide.recommendedDimensions}
                  </span>
                  <span className="font-mono text-[9px] text-neutral-400 mt-0.5">
                    {guide.aspectRatio}
                  </span>
                </div>
              </div>

              <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                {guide.description}
              </p>

              {/* Specs Breakdown */}
              <div className="grid grid-cols-2 gap-2 border-t border-neutral-800/80 pt-3 text-[11px] font-mono">
                <div>
                  <span className="text-neutral-500 block text-[9px]">MINIMUM RESOLUTION:</span>
                  <span className="text-neutral-200 font-bold">{guide.minDimensions}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[9px]">MAX FILE SIZE:</span>
                  <span className="text-neutral-200 font-bold">{guide.maxFileSize}</span>
                </div>
              </div>

              {/* Pro Tips */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-3 space-y-1.5">
                <span className="font-mono text-[9px] font-bold text-neutral-400 flex items-center gap-1">
                  <Info className="h-3 w-3 text-amber-400" />
                  PRO TIPS & BEST PRACTICES:
                </span>
                <ul className="space-y-1 font-sans text-xs text-neutral-300">
                  {guide.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
