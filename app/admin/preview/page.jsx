"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Send,
  Eye,
  ArrowLeft,
  History,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Search,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sliders,
  SlidersHorizontal,
  ChevronRight,
  Trash2,
} from "lucide-react";
import PublishConfirmationModal from "@/components/admin/PublishConfirmationModal";
import VersionHistoryDrawer from "@/components/admin/VersionHistoryDrawer";

export default function AdminCustomerPreviewPage() {
  const [device, setDevice] = useState("desktop"); // 'desktop', 'tablet', 'mobile'
  const [activePage, setActivePage] = useState("/"); // '/', '/catalog'
  const [activeTheme, setActiveTheme] = useState("noir"); // 'noir', 'cyber', 'ragnarok'
  const [zoom, setZoom] = useState(100);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [draftState, setDraftState] = useState(null);
  const [versions, setVersions] = useState([]);

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showDiffPanel, setShowDiffPanel] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch draft state + diff summaries
  const fetchPreviewState = useCallback(async () => {
    try {
      setRefreshing(true);
      const [prevRes, verRes] = await Promise.all([
        fetch("/api/admin/preview"),
        fetch("/api/admin/versions"),
      ]);

      if (prevRes.ok) {
        const data = await prevRes.json();
        setDraftState(data);
      }
      if (verRes.ok) {
        const vData = await verRes.json();
        setVersions(vData.versions || []);
      }
    } catch (e) {
      console.error("Failed to fetch preview state:", e);
      showToast("Failed to load draft preview state", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPreviewState();
  }, [fetchPreviewState]);

  // Handle Publish Draft
  const handlePublish = async (releaseTitle) => {
    try {
      setIsPublishing(true);
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: releaseTitle }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to publish");

      showToast(`Successfully published ${result.versionTag}! Customer panel is now live.`);
      setShowPublishModal(false);
      await fetchPreviewState();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle Discard Draft
  const handleDiscard = async () => {
    if (!confirm("Are you sure you want to discard all uncommitted draft changes?")) return;

    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/publish", { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to discard");

      showToast("Draft changes discarded. Reverted to live published state.");
      await fetchPreviewState();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setRefreshing(false);
    }
  };

  // Handle Version Rollback
  const handleRollback = async (versionId) => {
    try {
      setIsRollingBack(true);
      const res = await fetch("/api/admin/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to rollback");

      showToast(`Successfully rolled back to release ${result.versionTag}!`);
      setShowHistoryDrawer(false);
      await fetchPreviewState();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsRollingBack(false);
    }
  };

  const diffCount = draftState?.diffSummary?.length || 0;
  const hasChanges = draftState?.hasPendingChanges || false;
  const targetTag = draftState?.publishedVersion?.versionTag
    ? `v1.${(draftState.publishedVersion.versionNumber || 1) + 1}`
    : "v1.1";

  // Device width configuration
  const deviceStyles = {
    desktop: {
      width: "100%",
      maxWidth: "100%",
      frameClass: "rounded-2xl border border-neutral-800 shadow-2xl",
    },
    tablet: {
      width: "768px",
      maxWidth: "768px",
      frameClass: "rounded-[32px] border-[10px] border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]",
    },
    mobile: {
      width: "390px",
      maxWidth: "390px",
      frameClass: "rounded-[40px] border-[12px] border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]",
    },
  };

  const currentDevice = deviceStyles[device] || deviceStyles.desktop;

  return (
    <div className="flex h-screen w-full flex-col bg-neutral-950 text-neutral-100 font-sans overflow-hidden select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold shadow-2xl border animate-in slide-in-from-top duration-300 ${
            toastMessage.type === "error"
              ? "bg-red-950 border-red-500/50 text-red-200"
              : "bg-emerald-950 border-emerald-500/50 text-emerald-200"
          }`}
        >
          {toastMessage.type === "error" ? (
            <AlertCircle className="h-4 w-4 text-red-400" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ================= TOP CONTROL BAR ================= */}
      <header className="relative z-30 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-900/90 px-4 py-2.5 backdrop-blur-xl">
        {/* Left: Back Link & Draft Badge */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="group inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-bold text-neutral-300 hover:bg-neutral-700 hover:text-white transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Admin Dashboard</span>
          </Link>

          <div className="h-4 w-[1px] bg-neutral-800 hidden sm:block" />

          {/* Pending Changes Status Chip */}
          <div
            onClick={() => setShowDiffPanel(!showDiffPanel)}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-mono font-bold cursor-pointer transition-all ${
              hasChanges
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/40 hover:bg-amber-500/25"
                : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                hasChanges ? "bg-amber-400 animate-ping" : "bg-emerald-400"
              }`}
            />
            <span>
              {hasChanges
                ? `${diffCount} PENDING ${diffCount === 1 ? "CHANGE" : "CHANGES"}`
                : "DRAFT IN SYNC"}
            </span>
            <ChevronRight className="h-3 w-3 opacity-60" />
          </div>
        </div>

        {/* Center: Device Viewport Toggle & Page Switcher */}
        <div className="flex items-center gap-2">
          {/* Page Selector */}
          <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-950 p-1">
            {[
              { path: "/", label: "Home Storefront" },
              { path: "/catalog", label: "Catalog & Categories" },
            ].map((p) => (
              <button
                key={p.path}
                type="button"
                onClick={() => setActivePage(p.path)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                  activePage === p.path
                    ? "bg-neutral-800 text-white shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Device Toggle */}
          <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-950 p-1">
            {[
              { id: "desktop", icon: Monitor, label: "Desktop (1440px)" },
              { id: "tablet", icon: Tablet, label: "Tablet (768px)" },
              { id: "mobile", icon: Smartphone, label: "Mobile (390px)" },
            ].map((d) => {
              const Icon = d.icon;
              const isSel = device === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDevice(d.id)}
                  title={d.label}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-mono transition-all cursor-pointer ${
                    isSel
                      ? "bg-neutral-800 text-emerald-400 shadow-sm font-bold"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">{d.id.toUpperCase()}</span>
                </button>
              );
            })}
          </div>

          {/* Refresh Draft */}
          <button
            type="button"
            onClick={fetchPreviewState}
            disabled={refreshing}
            title="Refresh Draft Preview"
            className="flex items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        </div>

        {/* Right: Actions (Diff Inspector, Version History, Publish) */}
        <div className="flex items-center gap-2">
          {/* Version History Button */}
          <button
            type="button"
            onClick={() => setShowHistoryDrawer(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs font-mono font-bold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all cursor-pointer"
          >
            <History className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Versions</span>
          </button>

          {/* Discard Draft Button */}
          {hasChanges && (
            <button
              type="button"
              onClick={handleDiscard}
              className="inline-flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-mono font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
              title="Discard all draft edits"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Discard</span>
            </button>
          )}

          {/* Review & Publish CTA */}
          <button
            type="button"
            onClick={() => setShowPublishModal(true)}
            disabled={!hasChanges}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Publish Changes</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN PREVIEW WORKSPACE ================= */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Responsive Preview Canvas */}
        <main className="flex-1 overflow-auto bg-neutral-950 p-3 sm:p-6 flex flex-col items-center justify-start transition-all">
          {/* Viewport Meta Details */}
          <div className="mb-2 flex items-center justify-between w-full max-w-7xl px-2 text-[10px] font-mono text-neutral-500">
            <span className="flex items-center gap-1.5">
              <Eye className="h-3 w-3 text-emerald-400" />
              <span>LIVE CUSTOMER PREVIEW — DRAFT RUNTIME</span>
            </span>
            <span>
              MODE: {device.toUpperCase()} ({device === "desktop" ? "100%" : device === "tablet" ? "768px" : "390px"})
            </span>
          </div>

          {/* Device Frame */}
          <div
            style={{ width: currentDevice.width }}
            className={`relative flex-1 overflow-hidden transition-all duration-300 bg-black ${currentDevice.frameClass}`}
          >
            <iframe
              src={activePage}
              title="Customer Live Preview"
              className="h-full w-full border-0 bg-black"
              style={{ minHeight: "calc(100vh - 120px)" }}
            />
          </div>
        </main>

        {/* ================= SIDE DIFF INSPECTOR PANEL ================= */}
        {showDiffPanel && (
          <aside className="w-80 border-l border-neutral-800 bg-neutral-900/95 backdrop-blur-2xl p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-emerald-400" />
                  <h3 className="font-mono text-xs font-black uppercase text-white">
                    Pending Modifications
                  </h3>
                </div>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-400 border border-amber-500/30">
                  {diffCount}
                </span>
              </div>

              <p className="mt-2.5 text-[11px] text-neutral-300 leading-relaxed font-sans">
                Review exact modifications in this draft before publishing live to customers.
              </p>

              <div className="mt-4 space-y-2">
                {draftState?.diffSummary && draftState.diffSummary.length > 0 ? (
                  draftState.diffSummary.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 rounded-xl bg-neutral-950/80 p-2.5 border border-neutral-800 text-xs text-neutral-200 font-sans"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400 mt-0.5" />
                      <span className="leading-tight">{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-neutral-500 font-mono">
                    No pending draft modifications.
                  </div>
                )}
              </div>
            </div>

            {hasChanges && (
              <div className="pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 font-mono text-xs font-black uppercase text-black hover:bg-emerald-400 transition-all cursor-pointer shadow-lg"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Verify & Publish</span>
                </button>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* ================= MODALS & DRAWERS ================= */}
      <PublishConfirmationModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onConfirm={handlePublish}
        diffSummary={draftState?.diffSummary || []}
        targetVersionTag={targetTag}
        isLoading={isPublishing}
      />

      <VersionHistoryDrawer
        isOpen={showHistoryDrawer}
        onClose={() => setShowHistoryDrawer(false)}
        versions={versions}
        onRollback={handleRollback}
        isRollingBack={isRollingBack}
      />
    </div>
  );
}
