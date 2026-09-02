"use client";

import React from "react";
import { ExtractedEntity } from "@/types";
import { FileText, AlertTriangle, CheckCircle, ExternalLink, Sparkles, MessageSquare } from "lucide-react";

interface ScriptViewerProps {
  scriptText: string;
  entities: ExtractedEntity[];
  clearedEntityIds: string[];
  onStartDebate: (entity: ExtractedEntity) => void;
  isDebating: boolean;
}

export const ScriptViewer: React.FC<ScriptViewerProps> = ({
  scriptText,
  entities,
  clearedEntityIds,
  onStartDebate,
  isDebating,
}) => {
  // Render script with highlighted / mutated tokens
  const renderInteractiveScript = () => {
    if (!entities || entities.length === 0) {
      return (
        <pre className="font-mono text-xs md:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
          {scriptText}
        </pre>
      );
    }

    let modified = scriptText;
    return (
      <div className="font-mono text-xs md:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed space-y-4">
        {scriptText.split("\n\n").map((paragraph, pIdx) => {
          return (
            <p key={pIdx}>
              {paragraph.split(" ").map((word, wIdx) => {
                // Check if this word is part of any hazardous entity
                const matchedEntity = entities.find((e) =>
                  paragraph.toLowerCase().includes(e.rawText.toLowerCase()) &&
                  e.rawText.toLowerCase().includes(word.toLowerCase().replace(/[^a-z0-9]/g, ""))
                );

                return word + " ";
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-surface-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Screenplay & Clearance Editor
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          FOUNTAIN FORMAT • SCENE 1
        </span>
      </div>

      {/* Script Text Container */}
      <div className="flex-1 bg-surface-subtle/70 rounded-xl p-4 border border-surface-border/60 overflow-y-auto max-h-[340px] font-mono text-xs md:text-sm leading-relaxed text-slate-200">
        <div className="whitespace-pre-wrap">{scriptText}</div>
      </div>

      {/* Detected Hazards & Clearance Items */}
      <div className="mt-4 pt-3 border-t border-surface-border">
        <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          Identified Scene Hazards & Parallel Grounding ({entities.length})
        </h3>

        <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
          {entities.map((ent) => {
            const isCleared = clearedEntityIds.includes(ent.id) || ent.status === "cleared";

            return (
              <div
                key={ent.id}
                className={`p-3 rounded-xl border transition-all ${
                  isCleared
                    ? "bg-emerald-950/20 border-emerald-500/40"
                    : "bg-rose-950/20 border-rose-500/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                          isCleared
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {ent.category}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {ent.rawText}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-snug">
                      {ent.description}
                    </p>

                    {/* Defused Compromise Text */}
                    {isCleared && ent.defusedText && (
                      <div className="mt-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 font-mono">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>MUTATED TO: "{ent.defusedText}"</span>
                      </div>
                    )}

                    {/* Parallel Search Citations */}
                    {ent.citations && ent.citations.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {ent.citations.map((cit) => (
                          <div
                            key={cit.id}
                            className="flex items-start gap-1.5 text-[11px] text-cyan-300/90 font-mono bg-cyan-950/30 p-1.5 rounded border border-cyan-800/40"
                          >
                            <ExternalLink className="h-3 w-3 mt-0.5 shrink-0 text-cyan-400" />
                            <div>
                              <span className="font-semibold text-cyan-200">
                                {cit.title}:{" "}
                              </span>
                              <span className="text-slate-300">
                                {cit.snippet}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Trigger Dialectic Negotiation Button */}
                  {!isCleared && (
                    <button
                      onClick={() => onStartDebate(ent)}
                      disabled={isDebating}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-all"
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>Negotiate</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
