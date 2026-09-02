"use client";

import React from "react";
import { PRESET_SCENARIOS } from "@/lib/scenarios";
import { PresetScenario } from "@/types";
import { Film, Play, Sparkles, ShieldCheck, Download, RefreshCw } from "lucide-react";

interface HeaderControlBarProps {
  selectedScenario: PresetScenario;
  onSelectScenario: (scenario: PresetScenario) => void;
  onRunScan: () => void;
  isScanning: boolean;
  isCleared: boolean;
  onOpenExportModal: () => void;
}

export const HeaderControlBar: React.FC<HeaderControlBarProps> = ({
  selectedScenario,
  onSelectScenario,
  onRunScan,
  isScanning,
  isCleared,
  onOpenExportModal,
}) => {
  return (
    <header className="w-full bg-surface/90 backdrop-blur-md border-b border-surface-border sticky top-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Film className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                DEEPCLEAR <span className="text-cyan-400 font-mono text-sm tracking-wider">STUDIO</span>
              </h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                v0.1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Autonomous Multimodal Film Clearance & E&O Underwriting
            </p>
          </div>
        </div>

        {/* 1-Click Preset Scenario Selector */}
        <div className="flex items-center gap-2 bg-surface-subtle/80 p-1 rounded-xl border border-surface-border text-xs">
          <span className="text-slate-400 font-mono px-2 font-medium hidden lg:inline">PRESETS:</span>
          {PRESET_SCENARIOS.map((sc) => {
            const isSelected = sc.id === selectedScenario.id;
            return (
              <button
                key={sc.id}
                onClick={() => onSelectScenario(sc)}
                disabled={isScanning}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20"
                    : "text-slate-300 hover:text-white hover:bg-surface-elevated/60"
                }`}
              >
                {sc.title}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRunScan}
            disabled={isScanning}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg ${
              isScanning
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-wait"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25"
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-amber-400" />
                <span>Scanning Swarm...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>Execute Scan</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenExportModal}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
              isCleared
                ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900/60"
                : "bg-surface-elevated/60 text-slate-300 border-surface-border hover:bg-surface-elevated hover:text-white"
            }`}
          >
            {isCleared ? (
              <>
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Form E&O-2026</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4 text-slate-400" />
                <span>Export Binder</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
