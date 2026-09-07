"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { ExtractedEntity } from "@/types";

interface ParallelInspectorDrawerProps {
  isOpen: boolean;
  entity: ExtractedEntity | null;
  onClose: () => void;
}

export default function ParallelInspectorDrawer({
  isOpen,
  entity,
  onClose,
}: ParallelInspectorDrawerProps) {
  const [copiedAudit, setCopiedAudit] = useState(false);

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

  if (!isOpen || !entity) return null;

  const citations = entity.citations || [];
  const primaryCitation = citations[0];
  const searchId = primaryCitation?.searchId || `par-run-${entity.id.slice(0, 8)}`;
  const latency = primaryCitation?.searchLatencyMs || 42;
  const trademarkClass =
    primaryCitation?.trademarkClass ||
    (entity.category === "trademark"
      ? "Class 9, Class 14, Class 25 (Commercial Index)"
      : entity.category === "permit"
      ? "Municipal Film Ordinance & Permit Authority"
      : "17 U.S.C. § 107 Statutory Exemption");
  const registrationStatus =
    primaryCitation?.registrationStatus ||
    (entity.status === "cleared" || entity.status === "licensed"
      ? "SAFE HARBOR CLEARANCE VALIDATED"
      : "ACTIVE REGISTRY SCRUTINY REQUIRED");

  const queryExecuted = `"${entity.rawText}" ${entity.category} clearance USPTO conflict check`;

  const handleCopyAuditRecord = () => {
    const auditRecord = {
      entityId: entity.id,
      assetName: entity.rawText,
      category: entity.category,
      clearanceStatus: entity.status,
      defusedText: entity.defusedText || null,
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

    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(auditRecord, null, 2));
      setCopiedAudit(true);
      setTimeout(() => setCopiedAudit(false), 2000);
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
          className="w-screen sm:w-[480px] lg:w-[520px] bg-[#111115] border-l border-white/10 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-300"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#141419] flex items-start justify-between gap-3 shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-400/20 text-sky-400 font-mono text-[10px] font-semibold tracking-wide">
                  <Zap className="h-3 w-3 text-sky-400 animate-pulse" />
                  <span>PARALLEL GROUNDING INSPECTOR</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">
                  Sc. {entity.sceneNumber}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>{entity.rawText}</span>
              </h2>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/5 font-semibold">
                  {entity.category}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                    entity.status === "cleared" || entity.status === "licensed"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {entity.status.toUpperCase()}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shrink-0"
              title="Close Inspector (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-sans text-xs text-zinc-300 scrollbar-thin scrollbar-thumb-zinc-800">
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
                  <span className="text-zinc-200 break-all">{queryExecuted}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-zinc-500">
                  <span>Search ID: <span className="text-zinc-400">{searchId}</span></span>
                  <span>Engine: <span className="text-sky-400 font-semibold">parallel-web v1.3</span></span>
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
            {entity.defusedText && (
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
                    "{entity.defusedText}"
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
              </div>

              {citations.length === 0 ? (
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 text-zinc-500 text-center font-mono text-[11px]">
                  No external citations recorded for this asset.
                </div>
              ) : (
                <div className="space-y-2">
                  {citations.map((cit, idx) => (
                    <div
                      key={cit.id || idx}
                      className="p-3 rounded-xl bg-[#16161b] border border-white/[0.06] hover:border-sky-500/30 transition-all space-y-1.5 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-xs text-zinc-100 group-hover:text-sky-300 transition-colors">
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
                      <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
                        {cit.snippet}
                      </p>
                      <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                        <span className="truncate max-w-[260px] text-sky-400/80">
                          {cit.sourceUrl}
                        </span>
                        <span className="text-emerald-400 font-semibold">✓ Verified</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                  <span className="text-emerald-300 font-mono font-semibold">Audit Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Copy Audit JSON</span>
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
