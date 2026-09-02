"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Sliders, ShieldCheck, Sparkles } from "lucide-react";

interface StoryboardInspectorProps {
  isDefused: boolean;
  onToggleDefuse: () => void;
}

export const StoryboardInspector: React.FC<StoryboardInspectorProps> = ({
  isDefused,
  onToggleDefuse,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-surface-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Multimodal Storyboard Inspector & Prop Defusal
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          FRAME 01 • SCENE 1
        </span>
      </div>

      {/* Storyboard Visual Canvas with interactive slider */}
      <div className="relative flex-1 bg-surface-subtle/80 rounded-xl border border-surface-border overflow-hidden min-h-[260px] flex flex-col items-center justify-center p-4">
        {/* Synthetic Frame Demonstration */}
        <div className="w-full h-full min-h-[220px] rounded-lg bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 relative flex flex-col items-center justify-center p-6 text-center">
          {/* Cyberpunk Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

          {/* Bounding Box Indicator */}
          <div
            className={`relative z-10 p-4 rounded-xl border-2 transition-all duration-500 max-w-sm w-full ${
              isDefused
                ? "border-emerald-400/80 bg-emerald-950/30 shadow-lg shadow-emerald-500/20"
                : "border-rose-500/80 bg-rose-950/30 shadow-lg shadow-rose-500/20 animate-pulse"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                  isDefused
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-rose-500 text-white"
                }`}
              >
                {isDefused ? "CLEARED PROP: VOLTRUSH ENERGY" : "HAZARD: RED BULL TRADEMARK"}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                [X: 142, Y: 210]
              </span>
            </div>

            <p className="text-xs text-slate-300 font-mono">
              {isDefused
                ? "Generative substitution applied. Fictionalized product geometry eliminates trademark tarnishment exposure."
                : "Prominent visible commercial energy beverage can in protagonist's right hand. Subject to Lanham Act § 43(a)."}
            </p>
          </div>

          {/* Before/After Toggle Action */}
          <div className="relative z-10 mt-6 flex items-center gap-3">
            <button
              onClick={onToggleDefuse}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                isDefused
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                  : "bg-gradient-to-r from-rose-500 to-amber-500 text-white border-rose-400 shadow-md shadow-rose-500/20 hover:scale-105"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isDefused ? "Reset to Infringing Frame" : "Swap to Generative Safe-Prop"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
