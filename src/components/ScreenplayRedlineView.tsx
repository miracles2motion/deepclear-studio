"use client";

import React, { useState, useRef } from "react";
import {
  Download,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Split,
  Eye,
  FileCode,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ExtractedEntity } from "@/types";

interface ScreenplayRedlineViewProps {
  originalScript: string;
  clearedScript: string;
  entities: ExtractedEntity[];
  clearedEntityIds: string[];
  licensedEntityIds: string[];
  productionTitle: string;
  uploadedFileName?: string | null;
  onInspectEntity: (entity: ExtractedEntity) => void;
  onOpenExportModal: () => void;
}

export default function ScreenplayRedlineView({
  originalScript,
  clearedScript,
  entities,
  clearedEntityIds,
  licensedEntityIds,
  productionTitle,
  uploadedFileName,
  onInspectEntity,
  onOpenExportModal,
}: ScreenplayRedlineViewProps) {
  const [mobileMode, setMobileMode] = useState<"cleared" | "original" | "split">("cleared");
  const [isCopied, setIsCopied] = useState(false);
  const badgeScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollBadges = (direction: "left" | "right") => {
    if (badgeScrollRef.current) {
      const offset = direction === "left" ? -280 : 280;
      badgeScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // Fallback to active text if original is empty
  const baseOriginal = originalScript || clearedScript || "No screenplay loaded yet.";
  const baseCleared = clearedScript || originalScript || "No screenplay loaded yet.";

  const resolvedEntities = entities.filter(
    (e) =>
      clearedEntityIds.includes(e.id) ||
      licensedEntityIds.includes(e.id) ||
      e.status === "cleared" ||
      e.status === "licensed"
  );

  const pendingEntities = entities.filter(
    (e) =>
      !clearedEntityIds.includes(e.id) &&
      !licensedEntityIds.includes(e.id) &&
      e.status !== "cleared" &&
      e.status !== "licensed"
  );

  const handleCopyCleared = () => {
    if (navigator.clipboard && baseCleared) {
      navigator.clipboard.writeText(baseCleared);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDownload = (fmt: "fountain" | "md" | "txt") => {
    const ext = uploadedFileName ? uploadedFileName.split(".").pop() || fmt : fmt;
    const baseName = uploadedFileName
      ? uploadedFileName.replace(/\.[^/.]+$/, "")
      : productionTitle.replace(/\s+/g, "_");
    const blob = new Blob([baseCleared], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${baseName}_PARALLEL_CLEARED.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#111114] rounded-2xl border border-white/[0.08] overflow-hidden shadow-xl">
      {/* Top Action & Sub-Navigation Bar */}
      <div className="p-3.5 sm:p-4 border-b border-white/[0.08] bg-[#141418] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FileCode className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Screenplay Redline Diff
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] font-semibold">
                <Zap className="h-2.5 w-2.5" />
                <span>Parallel Grounded</span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              {resolvedEntities.length} substitutions verified • {pendingEntities.length} liabilities pending
            </p>
          </div>
        </div>

        {/* Responsive Layout Toggle (Mobile & Tablet segmented controller) */}
        <div className="flex items-center gap-2">
          <div className="flex lg:hidden bg-zinc-900 border border-white/10 rounded-lg p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setMobileMode("cleared")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mobileMode === "cleared"
                  ? "bg-emerald-600 text-white font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Cleared
            </button>
            <button
              type="button"
              onClick={() => setMobileMode("original")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                mobileMode === "original"
                  ? "bg-rose-950 text-rose-300 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Original
            </button>
            <button
              type="button"
              onClick={() => setMobileMode("split")}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                mobileMode === "split"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Split className="h-3 w-3" />
              <span>Split</span>
            </button>
          </div>

          {/* Quick Actions: Export PDF, Copy */}
          <button
            type="button"
            onClick={onOpenExportModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 text-xs font-medium transition-all"
          >
            <FileText className="h-3.5 w-3.5 text-indigo-400" />
            <span>Export Binder</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCleared}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 text-xs font-medium transition-all"
            title="Copy Cleared Screenplay"
          >
            {isCopied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Copy Script</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Screenplay Content Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* ============================================================== */}
        {/* LEFT COLUMN: Original Script with Liabilities Highlighted */}
        {/* ============================================================== */}
        <div
          className={`flex-1 flex-col border-r border-white/[0.08] bg-[#0d0d10] overflow-hidden ${
            mobileMode === "original" || mobileMode === "split" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="p-2.5 px-4 bg-rose-950/20 border-b border-rose-500/20 flex items-center justify-between text-[11px] font-mono text-rose-300 shrink-0">
            <span className="flex items-center gap-1.5 font-semibold">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
              <span>Original Screenplay Draft</span>
            </span>
            <span className="text-[10px] text-zinc-500">Uncleared Raw Text</span>
          </div>

          <div className="flex-1 p-4 sm:p-5 overflow-y-auto font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap selection:bg-rose-500/30 scrollbar-thin scrollbar-thumb-zinc-800">
            {baseOriginal}
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: Cleared Production Script with Parallel Chips */}
        {/* ============================================================== */}
        <div
          className={`flex-1 flex-col bg-[#0f0f13] overflow-hidden ${
            mobileMode === "cleared" || mobileMode === "split" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="p-2.5 px-4 bg-emerald-950/20 border-b border-emerald-500/20 flex items-center justify-between text-[11px] font-mono text-emerald-300 shrink-0">
            <span className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Adjudicated Production Script</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              E&O CERTIFIED
            </span>
          </div>

          <div className="flex-1 p-4 sm:p-5 overflow-y-auto font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap selection:bg-emerald-500/30 scrollbar-thin scrollbar-thumb-zinc-800">
            {baseCleared}
          </div>
        </div>
      </div>

      {/* Bottom Entity Chips Quick-Inspector Bar */}
      <div className="p-3 border-t border-white/[0.08] bg-[#141418] shrink-0">
        <div className="flex items-center justify-between pb-2 text-[10px] font-mono text-zinc-400">
          <span className="font-semibold text-zinc-300">
            Interactive Clearance Badges (Click to Inspect Parallel Grounding):
          </span>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">
              {entities.length} detected assets
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollBadges("left")}
                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                title="Scroll badges left"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => scrollBadges("right")}
                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                title="Scroll badges right"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={badgeScrollRef}
          onWheel={(e) => {
            if (badgeScrollRef.current && e.deltaY !== 0) {
              badgeScrollRef.current.scrollLeft += e.deltaY;
            }
          }}
          className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-zinc-800"
        >
          {entities.map((entity) => {
            const isResolved =
              clearedEntityIds.includes(entity.id) ||
              licensedEntityIds.includes(entity.id) ||
              entity.status === "cleared" ||
              entity.status === "licensed";

            return (
              <button
                key={entity.id}
                type="button"
                onClick={() => onInspectEntity(entity)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 shrink-0 transition-all border shadow-sm group ${
                  isResolved
                    ? "bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-950/40 hover:bg-rose-900/60 border-rose-500/30 text-rose-300"
                }`}
                title={`Inspect Parallel Grounding for ${entity.rawText}`}
              >
                <Zap className="h-3 w-3 text-sky-400 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">{entity.rawText}</span>
                {entity.defusedText && (
                  <span className="text-zinc-400">→ <span className="text-zinc-200 font-semibold">{entity.defusedText}</span></span>
                )}
                <span className="text-[9px] uppercase px-1 rounded bg-white/5 text-zinc-400">
                  {entity.category}
                </span>
                <Eye className="h-3 w-3 text-zinc-500 group-hover:text-zinc-200 ml-0.5" />
              </button>
            );
          })}
        </div>

        {/* Download Format Pills */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-[10px] uppercase">Download:</span>
            {(["fountain", "md", "txt"] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => handleDownload(fmt)}
                className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/5 hover:border-emerald-500/30 transition-all flex items-center gap-1"
              >
                <Download className="h-2.5 w-2.5 text-emerald-400" />
                <span>.{fmt}</span>
              </button>
            ))}
          </div>

          <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
            Parallel Web Systems Grounded • DeepClear Studio
          </span>
        </div>
      </div>
    </div>
  );
}
