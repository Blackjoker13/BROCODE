"use client";

import { useState } from "react";
import {
  X,
  History,
  RotateCcw,
  CheckCircle2,
  Calendar,
  User,
  Tag,
  Loader2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function VersionHistoryDrawer({
  isOpen,
  onClose,
  versions = [],
  onRollback,
  isRollingBack = false,
}) {
  const [selectedVersionForRollback, setSelectedVersionForRollback] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-full w-full max-w-md bg-neutral-900 border-l border-neutral-800 p-6 shadow-2xl flex flex-col justify-between overflow-hidden"
      >
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <History className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-mono text-sm font-black uppercase text-white">
                  Publication History
                </h3>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {versions.length} Total Releases Logged
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-3 text-xs text-neutral-300 font-sans leading-relaxed">
            Review previous published customer storefront versions and roll back instantly if unverified issues occur.
          </p>
        </div>

        {/* Versions List */}
        <div className="my-4 flex-1 overflow-y-auto space-y-3 pr-1">
          {versions.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500 font-mono">
              No version history logged yet.
            </div>
          ) : (
            versions.map((ver, idx) => {
              const isLive = ver.status === "PUBLISHED" || idx === 0;

              return (
                <div
                  key={ver.id}
                  className={`rounded-2xl border p-4 transition-all ${
                    isLive
                      ? "border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                      : "border-neutral-800 bg-neutral-950/60 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-white">
                        {ver.versionTag}
                      </span>
                      {isLive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>CURRENT LIVE</span>
                        </span>
                      ) : (
                        <span className="rounded-full bg-neutral-800 px-2 py-0.5 font-mono text-[9px] text-neutral-400">
                          ARCHIVED
                        </span>
                      )}
                    </div>

                    {!isLive && (
                      <button
                        type="button"
                        onClick={() => setSelectedVersionForRollback(ver)}
                        disabled={isRollingBack}
                        className="inline-flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] font-bold text-amber-400 hover:bg-amber-500 hover:text-black transition-colors cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Rollback</span>
                      </button>
                    )}
                  </div>

                  <h4 className="mt-2 text-xs font-bold text-neutral-200">
                    {ver.title || "Production Release"}
                  </h4>

                  {/* Summary Bullets */}
                  {Array.isArray(ver.summary) && ver.summary.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {ver.summary.slice(0, 3).map((s, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                          <CheckCircle2 className="h-3 w-3 shrink-0 text-neutral-500" />
                          <span className="truncate">{s}</span>
                        </div>
                      ))}
                      {ver.summary.length > 3 && (
                        <span className="text-[9px] font-mono text-neutral-500 block">
                          +{ver.summary.length - 3} more updates
                        </span>
                      )}
                    </div>
                  )}

                  {/* Metadata footer */}
                  <div className="mt-3 flex items-center justify-between border-t border-neutral-800/80 pt-2 text-[9px] font-mono text-neutral-400">
                    <span className="flex items-center gap-1">
                      <User className="h-2.5 w-2.5" />
                      <span>{ver.publishedBy || "Admin"}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-2.5 w-2.5" />
                      <span>{new Date(ver.publishedAt || ver.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rollback Confirmation Drawer Footer */}
        {selectedVersionForRollback && (
          <div className="rounded-2xl border border-amber-500/50 bg-amber-950/40 p-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-300">
                  Confirm Rollback to {selectedVersionForRollback.versionTag}?
                </h4>
                <p className="mt-1 text-[10px] text-neutral-300">
                  This will immediately restore the live customer storefront to the state captured in {selectedVersionForRollback.versionTag}.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onRollback(selectedVersionForRollback.id);
                      setSelectedVersionForRollback(null);
                    }}
                    disabled={isRollingBack}
                    className="inline-flex items-center gap-1 rounded-xl bg-amber-400 px-3 py-1.5 font-mono text-xs font-black text-black hover:bg-amber-300 transition-colors cursor-pointer"
                  >
                    {isRollingBack ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Restoring...</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-3 w-3" />
                        <span>Confirm Rollback</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedVersionForRollback(null)}
                    disabled={isRollingBack}
                    className="rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-1.5 font-mono text-xs text-neutral-300 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
