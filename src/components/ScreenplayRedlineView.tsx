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
import { ExtractedEntity, ClearancePassportData } from "@/types";
import { embedClearancePassport } from "@/lib/passport";
import { generateClearanceMerkleHash } from "@/lib/web3";

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

  const isFullyCleared = entities.length > 0 && pendingEntities.length === 0;
  const isPartiallyCleared = resolvedEntities.length > 0 && pendingEntities.length > 0;
  const lastResolved = resolvedEntities.length > 0 ? resolvedEntities[resolvedEntities.length - 1] : null;

  // Segment and highlight original text with red pending liabilities / muted cleared tokens
  const renderHighlightedOriginal = (text: string) => {
    if (!text || entities.length === 0) return text;

    const sorted = [...entities].filter((e) => Boolean(e.rawText)).sort((a, b) => b.rawText.length - a.rawText.length);
    if (sorted.length === 0) return text;

    const pattern = new RegExp(
      `(${sorted.map((e) => e.rawText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
      "gi"
    );

    const parts = text.split(pattern);
    return parts.map((part, idx) => {
      const matchedEntity = sorted.find((e) => e.rawText.toLowerCase() === part.toLowerCase());
      if (!matchedEntity) return part;

      const isResolved =
        clearedEntityIds.includes(matchedEntity.id) ||
        licensedEntityIds.includes(matchedEntity.id) ||
        matchedEntity.status === "cleared" ||
        matchedEntity.status === "licensed";

      if (isResolved) {
        return (
          <mark
            key={idx}
            className="bg-zinc-800/80 line-through text-zinc-500 px-1.5 py-0.5 rounded border border-white/5 mx-0.5 font-mono"
            title={`Resolved: ${matchedEntity.rawText} (${matchedEntity.category.toUpperCase()})`}
          >
            {part}
          </mark>
        );
      }

      return (
        <mark
          key={idx}
          className="bg-rose-950/70 border border-rose-500/50 text-rose-200 px-1.5 py-0.5 rounded font-mono font-semibold mx-0.5 shadow-sm inline-flex items-center gap-1"
          title={`Active Liability: ${matchedEntity.rawText} (${matchedEntity.category.toUpperCase()})`}
        >
          <span>{part}</span>
          <span className="text-[9px] uppercase px-1 rounded bg-rose-900/80 text-rose-300 font-normal">
            {matchedEntity.category}
          </span>
        </mark>
      );
    });
  };

  // Segment and highlight living production draft with green verified substitutions
  const renderHighlightedAdjudicated = (text: string) => {
    if (!text || entities.length === 0) return text;

    const searchTokens: { token: string; entity: ExtractedEntity; isDefused: boolean }[] = [];

    entities.forEach((ent) => {
      const isResolved =
        clearedEntityIds.includes(ent.id) ||
        licensedEntityIds.includes(ent.id) ||
        ent.status === "cleared" ||
        ent.status === "licensed";

      if (isResolved && ent.defusedText) {
        searchTokens.push({ token: ent.defusedText, entity: ent, isDefused: true });
      } else if (!isResolved && ent.rawText) {
        searchTokens.push({ token: ent.rawText, entity: ent, isDefused: false });
      }
    });

    if (searchTokens.length === 0) return text;

    searchTokens.sort((a, b) => b.token.length - a.token.length);

    const pattern = new RegExp(
      `(${searchTokens.map((t) => t.token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
      "gi"
    );

    const parts = text.split(pattern);
    return parts.map((part, idx) => {
      const matched = searchTokens.find((t) => t.token.toLowerCase() === part.toLowerCase());
      if (!matched) return part;

      if (matched.isDefused) {
        return (
          <mark
            key={idx}
            className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-1.5 py-0.5 rounded font-mono font-semibold mx-0.5 inline-flex items-center gap-1 shadow-sm ring-1 ring-emerald-500/30 animate-in fade-in zoom-in-95 duration-300"
            title={`Cleared Substitution: ${matched.token}`}
          >
            <Check className="h-3 w-3 text-emerald-400 shrink-0" />
            <span>{part}</span>
            {matched.entity.adjudicationMethod === "producer_directive" && (
              <span className="text-[8px] uppercase px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                PRODUCER
              </span>
            )}
          </mark>
        );
      }

      return (
        <mark
          key={idx}
          className="bg-amber-950/30 border border-dashed border-amber-500/40 text-amber-200/90 px-1 py-0.5 rounded font-mono italic mx-0.5 animate-pulse inline-flex items-center gap-1"
          title="Awaiting Swarm Clearance / Debate"
        >
          <span>{part}</span>
          <span className="text-[8px] uppercase px-1 rounded bg-amber-900/50 text-amber-300 font-normal not-italic">
            Pending
          </span>
        </mark>
      );
    });
  };

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
      : (productionTitle ? productionTitle.replace(/\s+/g, "_") : "Indie_Production");

    const currentTitle = productionTitle || "Indie Production";
    const merkleHash = generateClearanceMerkleHash(currentTitle, entities, new Date().toISOString());

    const passportData: ClearancePassportData = {
      version: "2026.1",
      productionTitle: currentTitle,
      merkleRoot: merkleHash,
      bondPolicyId: `EO-2026-${merkleHash.slice(2, 8).toUpperCase()}`,
      policyStatus: pendingEntities.length === 0 ? "APPROVED" : "PENDING_REMEDY",
      timestamp: new Date().toISOString(),
      assets: entities.map((e) => {
        const isLicensed = licensedEntityIds.includes(e.id) || e.status === "licensed";
        return {
          originalText: e.rawText,
          clearedAs: isLicensed ? undefined : (e.defusedText || "Cleared Narrative Prop"),
          category: e.category,
          status: isLicensed ? "licensed" : "cleared",
          licenseRef: isLicensed ? "Active Production Rights & Licensing Exemption" : undefined,
          parallelVerified: true,
        };
      }),
    };

    const textWithPassport = embedClearancePassport(baseCleared, passportData);

    const blob = new Blob([textWithPassport], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${baseName}_CLEARED_FINAL.${ext}`;
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
            {renderHighlightedOriginal(baseOriginal)}
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
            {isFullyCleared ? (
              <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                <span>E&O EVIDENCE READY (100% RESOLVED)</span>
              </span>
            ) : isPartiallyCleared ? (
              <span className="text-[10px] text-sky-400 font-semibold px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 flex items-center gap-1 animate-pulse">
                <Zap className="h-3 w-3" />
                <span>LIVE UPDATE: {resolvedEntities.length} OF {entities.length} CLEARED</span>
              </span>
            ) : (
              <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                <span>AWAITING CLEARANCE (0 OF {entities.length})</span>
              </span>
            )}
          </div>

          {/* Live Sequential Resolution Pop-Up Banner */}
          {lastResolved && (
            <div className="p-2.5 px-4 bg-emerald-950/40 border-b border-emerald-500/30 flex items-center justify-between gap-2 text-xs font-mono text-emerald-200 animate-in fade-in slide-in-from-top-2 duration-300 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-zinc-400 text-[11px] shrink-0">Live Clearance Update:</span>
                <span className="line-through text-rose-300 font-semibold truncate max-w-[120px]">{lastResolved.rawText}</span>
                <span className="text-emerald-400 font-bold shrink-0">→</span>
                <span className="text-emerald-300 font-semibold truncate max-w-[140px]">{lastResolved.defusedText || "Cleared"}</span>
                {lastResolved.adjudicationMethod === "producer_directive" && (
                  <span className="text-[9px] uppercase px-1 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold shrink-0">
                    PRODUCER DIRECTIVE
                  </span>
                )}
              </div>
              <span className="text-[10px] text-emerald-400/90 shrink-0">
                {resolvedEntities.length}/{entities.length} Resolved
              </span>
            </div>
          )}

          <div className="flex-1 p-4 sm:p-5 overflow-y-auto font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap selection:bg-emerald-500/30 scrollbar-thin scrollbar-thumb-zinc-800">
            {renderHighlightedAdjudicated(baseCleared)}
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
                {isResolved ? (
                  <Check className="h-3 w-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                ) : (
                  <Zap className="h-3 w-3 text-rose-400 group-hover:scale-110 transition-transform" />
                )}
                <span className="font-semibold">{entity.rawText}</span>
                {entity.defusedText && isResolved && (
                  <span className="text-zinc-400">→ <span className="text-zinc-200 font-semibold">{entity.defusedText}</span></span>
                )}
                {entity.adjudicationMethod === "producer_directive" && (
                  <span className="text-[9px] uppercase px-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold">
                    PRODUCER
                  </span>
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
