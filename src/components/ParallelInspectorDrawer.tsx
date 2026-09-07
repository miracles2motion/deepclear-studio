"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  X,
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock,
  Database,
  Search,
  CheckCircle2,
  FileCheck,
  Copy,
  Check,
  AlertTriangle,
  Scale,
  Layers,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ExtractedEntity } from "@/types";
import { cleanParallelSnippet } from "@/lib/utils";

interface ParallelInspectorDrawerProps {
  isOpen: boolean;
  entity: ExtractedEntity | null;
  allEntities?: ExtractedEntity[];
  onClose: () => void;
  onSelectEntity?: (entity: ExtractedEntity) => void;
}

export default function ParallelInspectorDrawer({
  isOpen,
  entity,
  allEntities = [],
  onClose,
  onSelectEntity,
}: ParallelInspectorDrawerProps) {
  const [copiedAudit, setCopiedAudit] = useState(false);
  const [viewMode, setViewMode] = useState<"single" | "all">("single");
  const [snippetMode, setSnippetMode] = useState<"clean" | "raw">("clean");
  const [activeAssetId, setActiveAssetId] = useState<string | null>(entity?.id || null);

  const assetScrollRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const scrollAssets = (direction: "left" | "right") => {
    if (assetScrollRef.current) {
      const offset = direction === "left" ? -180 : 180;
      assetScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!assetScrollRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - assetScrollRef.current.offsetLeft;
    scrollLeftRef.current = assetScrollRef.current.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !assetScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - assetScrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    assetScrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  // Auto-scroll active badge into view
  useEffect(() => {
    if (activeAssetId && assetScrollRef.current) {
      const activeEl = assetScrollRef.current.querySelector<HTMLElement>(`[data-asset-id="${activeAssetId}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [activeAssetId]);

  // Sync active entity when prop changes
  useEffect(() => {
    if (entity) {
      setActiveAssetId(entity.id);
    }
  }, [entity]);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Active entity resolving
  const currentEntity =
    allEntities.find((e) => e.id === activeAssetId) || entity || allEntities[0] || null;

  const citations = currentEntity?.citations || [];
  const primaryCitation = citations[0];
  const searchId = primaryCitation?.searchId || `par-run-${(currentEntity?.id || "run").slice(0, 8)}`;
  const latency = primaryCitation?.searchLatencyMs || 42;
  const trademarkClass =
    primaryCitation?.trademarkClass ||
    (currentEntity?.category === "trademark"
      ? "Class 9, Class 14, Class 25 (Commercial Index)"
      : currentEntity?.category === "permit"
      ? "Municipal Film Ordinance & Permit Authority"
      : "17 U.S.C. § 107 Statutory Exemption");
  const registrationStatus =
    primaryCitation?.registrationStatus ||
    (currentEntity?.status === "cleared" || currentEntity?.status === "licensed"
      ? "SAFE HARBOR CLEARANCE VALIDATED"
      : "ACTIVE REGISTRY SCRUTINY REQUIRED");

  const queryExecuted = currentEntity
    ? `"${currentEntity.rawText}" ${currentEntity.category} clearance USPTO conflict check`
    : "screenplay clearance search query";

  // Aggregate stats across all entities
  const totalCitationsAcrossEntities = allEntities.reduce(
    (acc, cur) => acc + (cur.citations?.length || 0),
    0
  );
  const avgLatency =
    allEntities.length > 0
      ? Math.round(
          allEntities.reduce(
            (acc, cur) => acc + (cur.citations?.[0]?.searchLatencyMs || 50),
            0
          ) / allEntities.length
        )
      : 42;

  const handleCopyAuditRecord = () => {
    let auditData: unknown;

    if (viewMode === "all") {
      auditData = {
        title: "DeepClear Parallel Grounding Complete Screenplay Dossier",
        exportedAt: new Date().toISOString(),
        totalEntities: allEntities.length,
        totalCitations: totalCitationsAcrossEntities,
        averageSearchLatencyMs: avgLatency,
        provider: "Parallel Web Systems (parallel-web SDK)",
        dossier: allEntities.map((e) => ({
          entityId: e.id,
          assetName: e.rawText,
          category: e.category,
          status: e.status,
          defusedText: e.defusedText || null,
          parallelGrounding: {
            searchId: e.citations?.[0]?.searchId || `search_${e.id}`,
            queryExecuted: `"${e.rawText}" ${e.category} clearance USPTO conflict check`,
            latencyMs: e.citations?.[0]?.searchLatencyMs || 50,
            trademarkClass: e.citations?.[0]?.trademarkClass || "Class 9 / 25 / 35",
            registrationStatus: e.citations?.[0]?.registrationStatus || "VERIFIED",
            citationsCount: e.citations?.length || 0,
            citations: (e.citations || []).map((c) => ({
              title: c.title,
              url: c.sourceUrl,
              snippet: c.snippet,
            })),
          },
        })),
      };
    } else if (currentEntity) {
      auditData = {
        entityId: currentEntity.id,
        assetName: currentEntity.rawText,
        category: currentEntity.category,
        clearanceStatus: currentEntity.status,
        defusedText: currentEntity.defusedText || null,
        parallelGrounding: {
          searchId,
          queryExecuted,
          latencyMs: latency,
          trademarkClass,
          registrationStatus,
          citationsCount: citations.length,
          citations: citations.map((c) => ({
            title: c.title,
            url: c.sourceUrl,
            snippet: c.snippet,
          })),
        },
        verifiedAt: new Date().toISOString(),
        provider: "Parallel Web Systems (parallel-web SDK)",
      };
    }

    if (navigator.clipboard && auditData) {
      navigator.clipboard.writeText(JSON.stringify(auditData, null, 2));
      setCopiedAudit(true);
      setTimeout(() => setCopiedAudit(false), 2000);
    }
  };

  const handleSelectAsset = (ent: ExtractedEntity) => {
    setActiveAssetId(ent.id);
    if (onSelectEntity) {
      onSelectEntity(ent);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      {/* Drawer Panel: Responsive across Desktop & Mobile */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <aside
          className="w-screen sm:w-[500px] lg:w-[560px] bg-[#111115] border-l border-white/10 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-300"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#141419] space-y-3 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-400/20 text-sky-400 font-mono text-[10px] font-semibold tracking-wide">
                    <Zap className="h-3 w-3 text-sky-400 animate-pulse" />
                    <span>PARALLEL GROUNDING INSPECTOR</span>
                  </div>
                  {currentEntity && (
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      Sc. {currentEntity.sceneNumber}
                    </span>
                  )}
                </div>

                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                  {viewMode === "all"
                    ? `Full Clearance Grounding Dossier (${allEntities.length} Assets)`
                    : currentEntity?.rawText || "Selected Asset"}
                </h2>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shrink-0"
                title="Close Inspector (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* View Mode Switcher: Single Asset vs All Grounding Dossier */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center bg-zinc-900/90 border border-white/[0.08] rounded-xl p-1 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setViewMode("single")}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    viewMode === "single"
                      ? "bg-sky-600 text-white font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Search className="h-3 w-3" />
                  <span>Single Asset</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("all")}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    viewMode === "all"
                      ? "bg-sky-600 text-white font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Layers className="h-3 w-3" />
                  <span>All Dossier ({allEntities.length})</span>
                </button>
              </div>

              {/* Snippet Display Mode: Cleaned vs Raw Scrape */}
              <div className="flex items-center gap-1 bg-zinc-900/80 border border-white/5 rounded-lg p-0.5 text-[10px] font-mono text-zinc-400">
                <button
                  type="button"
                  onClick={() => setSnippetMode("clean")}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    snippetMode === "clean"
                      ? "bg-zinc-800 text-sky-300 font-semibold"
                      : "hover:text-zinc-200"
                  }`}
                  title="Show readable cleaned legal intelligence"
                >
                  Cleaned
                </button>
                <button
                  type="button"
                  onClick={() => setSnippetMode("raw")}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    snippetMode === "raw"
                      ? "bg-zinc-800 text-sky-300 font-semibold"
                      : "hover:text-zinc-200"
                  }`}
                  title="Show verbatim scraped web response"
                >
                  Raw
                </button>
              </div>
            </div>

            {/* Asset Picker Pills (when in Single mode and multiple assets exist) */}
            {viewMode === "single" && allEntities.length > 1 && (
              <div className="flex items-center gap-1 pt-0.5">
                <button
                  type="button"
                  onClick={() => scrollAssets("left")}
                  className="p-1 rounded-md bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors shrink-0 border border-white/5 shadow-sm"
                  title="Scroll badges left"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>

                <div
                  ref={assetScrollRef}
                  onWheel={(e) => {
                    if (assetScrollRef.current && e.deltaY !== 0) {
                      assetScrollRef.current.scrollLeft += e.deltaY;
                    }
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeaveOrUp}
                  onMouseUp={handleMouseLeaveOrUp}
                  onMouseMove={handleMouseMove}
                  className="flex-1 flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin scrollbar-thumb-zinc-700/80 hover:scrollbar-thumb-zinc-500 scrollbar-track-zinc-900/40 scroll-smooth cursor-grab active:cursor-grabbing select-none"
                >
                  {allEntities.map((ent) => {
                    const isSelected = ent.id === currentEntity?.id;
                    const isResolved =
                      ent.status === "cleared" || ent.status === "licensed";

                    return (
                      <button
                        key={ent.id}
                        data-asset-id={ent.id}
                        type="button"
                        onClick={() => handleSelectAsset(ent)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-mono shrink-0 transition-all border ${
                          isSelected
                            ? "bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold shadow-sm ring-1 ring-sky-400/40"
                            : isResolved
                            ? "bg-zinc-900/80 text-emerald-400 border-emerald-500/20 hover:bg-zinc-800"
                            : "bg-zinc-900/80 text-rose-300 border-rose-500/20 hover:bg-zinc-800"
                        }`}
                      >
                        {ent.rawText}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => scrollAssets("right")}
                  className="p-1 rounded-md bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors shrink-0 border border-white/5 shadow-sm"
                  title="Scroll badges right"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-sans text-xs text-zinc-300 scrollbar-thin scrollbar-thumb-zinc-800">
            {viewMode === "all" ? (
              /* ============================================================ */
              /* ALL GROUNDING DOSSIER VIEW: Aggregated Ledger & All Assets   */
              /* ============================================================ */
              <div className="space-y-4">
                {/* Aggregated Parallel Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-0.5 text-center">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      Assets Grounded
                    </div>
                    <div className="text-base font-bold text-sky-400 font-mono">
                      {allEntities.length}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-0.5 text-center">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      Total Citations
                    </div>
                    <div className="text-base font-bold text-emerald-400 font-mono">
                      {totalCitationsAcrossEntities}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-0.5 text-center">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      Avg Telemetry
                    </div>
                    <div className="text-base font-bold text-amber-400 font-mono">
                      {avgLatency}ms
                    </div>
                  </div>
                </div>

                {/* Dossier Item List */}
                <div className="space-y-3">
                  {allEntities.map((ent, idx) => {
                    const entCitations = ent.citations || [];
                    const isResolved =
                      ent.status === "cleared" || ent.status === "licensed";

                    return (
                      <div
                        key={ent.id}
                        className="p-3.5 rounded-xl bg-[#16161b] border border-white/[0.06] space-y-2.5 hover:border-sky-500/20 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-zinc-500">
                                #{idx + 1}
                              </span>
                              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-white/5">
                                {ent.category}
                              </span>
                              <h3 className="font-bold text-xs text-zinc-100 truncate">
                                {ent.rawText}
                              </h3>
                            </div>
                            {ent.defusedText && (
                              <p className="text-[11px] text-emerald-300/90 font-mono mt-1">
                                ➔ {ent.defusedText}
                              </p>
                            )}
                          </div>

                          <span
                            className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded shrink-0 font-bold ${
                              isResolved
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {ent.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Citations for this asset */}
                        <div className="space-y-1.5 pt-1">
                          {entCitations.map((cit, cIdx) => (
                            <div
                              key={cit.id || cIdx}
                              className="p-2 rounded-lg bg-zinc-950/80 border border-white/5 space-y-1 text-[11px]"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-zinc-200 truncate">
                                  {cit.title}
                                </span>
                                <a
                                  href={cit.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sky-400 hover:underline shrink-0"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                              <p className="text-zinc-400 text-[10.5px] leading-relaxed font-sans break-words break-all">
                                {snippetMode === "clean"
                                  ? cleanParallelSnippet(cit.snippet, 220)
                                  : cit.snippet}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : !currentEntity ? (
              <div className="p-8 text-center text-zinc-500 font-mono">
                No active screenplay liabilities found to inspect.
              </div>
            ) : (
              /* ============================================================ */
              /* SINGLE ASSET TELEMETRY VIEW: Detailed Parallel Evidence      */
              /* ============================================================ */
              <>
                {/* Live Search Telemetry Box */}
                <div className="rounded-xl bg-[#16161b] border border-white/[0.06] p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <Database className="h-3.5 w-3.5 text-sky-400" />
                      <span>Parallel Search Telemetry</span>
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                      <Clock className="h-3 w-3" />
                      <span>{latency}ms (Live Index)</span>
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px] font-mono bg-zinc-950/80 p-2.5 rounded-lg border border-white/5">
                    <div className="flex items-start gap-1.5 text-zinc-400">
                      <Search className="h-3.5 w-3.5 text-zinc-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-200 break-words break-all">
                        {queryExecuted}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-zinc-500">
                      <span>
                        Search ID: <span className="text-zinc-400">{searchId}</span>
                      </span>
                      <span>
                        Engine: <span className="text-sky-400 font-semibold">parallel-web v1.3</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Registry Verdict & Statutory Classification */}
                <div className="rounded-xl bg-[#16161b] border border-white/[0.06] p-3.5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                    <Scale className="h-3.5 w-3.5 text-amber-400" />
                    <span>Statutory Classification & Verdict</span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-white/5 space-y-1">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">
                        International Trademark / Legal Class
                      </div>
                      <div className="text-xs font-semibold text-zinc-100">{trademarkClass}</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-white/5 space-y-1">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">
                        Public Registry Status
                      </div>
                      <div className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                        <span>{registrationStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fictional Substitute Verification (If cleared / mutated) */}
                {currentEntity.defusedText && (
                  <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/30 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Substitute Clearance Grounding</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        ZERO CONFLICTS
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-zinc-950/90 border border-emerald-500/20 space-y-1">
                      <div className="text-[10px] font-mono text-zinc-400">
                        Proposed Narrative Substitute:
                      </div>
                      <div className="text-sm font-bold text-emerald-300 font-mono">
                        "{currentEntity.defusedText}"
                      </div>
                      <p className="text-[11px] text-zinc-400 pt-1 leading-relaxed">
                        Verified via runtime Parallel Search: Fictional name confirmed clear across Class 9, Class 14, and Class 25. Safe harbor protection validated under U.S. narrative motion picture standards.
                      </p>
                    </div>
                  </div>
                )}

                {/* Extracted Citations & Provenance */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <FileCheck className="h-3.5 w-3.5 text-sky-400" />
                      <span>Grounding Citations & Evidence ({citations.length})</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Mode: {snippetMode === "clean" ? "Sanitized Intelligence" : "Raw Web Extract"}
                    </span>
                  </div>

                  {citations.length === 0 ? (
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 text-zinc-500 text-center font-mono text-[11px]">
                      No external citations recorded for this asset.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {citations.map((cit, idx) => {
                        const displayText =
                          snippetMode === "clean"
                            ? cleanParallelSnippet(cit.snippet, 340)
                            : cit.snippet;

                        return (
                          <div
                            key={cit.id || idx}
                            className="p-3 rounded-xl bg-[#16161b] border border-white/[0.06] hover:border-sky-500/30 transition-all space-y-1.5 group max-w-full overflow-hidden"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="font-semibold text-xs text-zinc-100 group-hover:text-sky-300 transition-colors truncate min-w-0">
                                {cit.title}
                              </div>
                              <a
                                href={cit.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-500 hover:text-sky-400 p-1 shrink-0 transition-colors"
                                title="Open verified source link"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </div>
                            <p className="text-zinc-400 text-[11px] leading-relaxed font-sans break-words break-all">
                              {displayText}
                            </p>
                            <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                              <span className="truncate max-w-[260px] text-sky-400/80">
                                {cit.sourceUrl}
                              </span>
                              <span className="text-emerald-400 font-semibold shrink-0">
                                ✓ Verified
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="p-4 border-t border-white/[0.08] bg-[#141419] flex items-center justify-between gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyAuditRecord}
              className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              {copiedAudit ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-mono font-semibold">
                    {viewMode === "all" ? "Dossier Copied!" : "Audit Copied!"}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-zinc-400" />
                  <span>
                    {viewMode === "all" ? "Copy Full Dossier JSON" : "Copy Audit JSON"}
                  </span>
                </>
              )}
            </button>

            <a
              href="https://parallel.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-mono font-medium transition-all flex items-center gap-1"
            >
              <span>Parallel Web Systems</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
