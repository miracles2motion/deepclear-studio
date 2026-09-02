"use client";

import React from "react";
import { PRESET_SCENARIOS } from "@/lib/scenarios";
import { PresetScenario } from "@/types";
import { ShieldCheck, Download, Sparkles, SlidersHorizontal, ArrowUpRight } from "lucide-react";

interface LinearHeaderProps {
  selectedScenario: PresetScenario;
  onSelectScenario: (scenario: PresetScenario) => void;
  onRunScan: () => void;
  isScanning: boolean;
  isCleared: boolean;
  onOpenExportModal: () => void;
  onOpenUploadModal: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const LinearHeader: React.FC<LinearHeaderProps> = ({
  selectedScenario,
  onSelectScenario,
  onRunScan,
  isScanning,
  isCleared,
  onOpenExportModal,
  onOpenUploadModal,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  return (
    <header className="w-full bg-[#0C0C0E]/90 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-40 px-5 py-3 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center font-bold text-xs text-zinc-100 shadow-sm">
          DC
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-zinc-100 tracking-tight">
            DeepClear Studio
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 border border-white/[0.06]">
            v0.1.0
          </span>
        </div>
      </div>

      {/* Preset Scenario Selector */}
      <div className="hidden md:flex items-center gap-1 bg-zinc-900/80 p-1 rounded-lg border border-white/[0.06] text-xs">
        {PRESET_SCENARIOS.map((sc) => {
          const isSelected = sc.id === selectedScenario.id;
          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc)}
              disabled={isScanning}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                isSelected
                  ? "bg-zinc-800 text-zinc-100 shadow-sm border border-white/10"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
              }`}
            >
              {sc.title}
            </button>
          );
        })}
        <button
          onClick={onOpenUploadModal}
          className="px-2.5 py-1.5 rounded-md font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all border border-transparent hover:border-white/10 ml-0.5"
        >
          + Upload Script
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Status Pill */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${
            isCleared
              ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30"
              : "bg-zinc-900 text-zinc-400 border-white/[0.06]"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isCleared ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
            }`}
          />
          <span>{isCleared ? "100% CLEARED" : "HAZARDS DETECTED"}</span>
        </div>

        {/* Export Action */}
        <button
          onClick={onOpenExportModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            isCleared
              ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold border-emerald-400 shadow-sm"
              : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-white/10"
          }`}
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Binder</span>
        </button>

        {/* Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className={`p-1.5 rounded-lg border text-zinc-400 hover:text-zinc-100 transition-all ${
            isSidebarOpen
              ? "bg-zinc-800 border-white/10 text-zinc-100"
              : "bg-zinc-900 border-white/[0.06] hover:bg-zinc-800"
          }`}
          title="Toggle Inspector"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
