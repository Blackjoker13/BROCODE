"use client";

import { useState } from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Send,
  Loader2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function PublishConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  diffSummary = [],
  targetVersionTag = "v1.1",
  isLoading = false,
}) {
  const [releaseTitle, setReleaseTitle] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(releaseTitle);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-xl w-full rounded-3xl border border-emerald-500/30 bg-neutral-900/95 p-6 sm:p-8 text-white shadow-[0_0_60px_rgba(16,185,129,0.2)]"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400 mb-1">
              <Sparkles className="h-3 w-3" />
              <span>PRE-PUBLISH VERIFICATION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              Publish Draft to Live Storefront
            </h2>
          </div>
        </div>

        <p className="mt-3 text-xs text-neutral-300 leading-relaxed font-sans">
          You are about to publish all verified draft changes live to the customer storefront. Customers will immediately see this updated release (
          <span className="font-mono text-emerald-400 font-bold">{targetVersionTag}</span>).
        </p>

        {/* Change Summary Breakdown */}
        <div className="mt-5 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-neutral-400">
              PENDING MODIFICATIONS SUMMARY ({diffSummary.length})
            </span>
            <span className="text-[9px] font-mono text-emerald-400 font-bold">
              VERIFIED IN DRAFT
            </span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 text-xs">
            {diffSummary.length === 0 ? (
              <p className="text-neutral-400 italic">No modifications detected in draft.</p>
            ) : (
              diffSummary.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 rounded-xl bg-neutral-900/60 p-2.5 border border-neutral-800 text-neutral-200"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Release Title Input */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-[10px] font-mono font-black uppercase tracking-wider text-neutral-400 mb-1.5">
              RELEASE NOTES / LABEL (OPTIONAL)
            </label>
            <input
              type="text"
              placeholder="e.g. Summer Merch Drop, New Acid Wash Pricing..."
              value={releaseTitle}
              onChange={(e) => setReleaseTitle(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 px-5 py-2.5 text-xs font-bold text-neutral-300 hover:bg-neutral-700 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Edit</span>
            </button>

            <button
              type="submit"
              disabled={isLoading || diffSummary.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Publishing Release...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Approve & Publish Live</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
