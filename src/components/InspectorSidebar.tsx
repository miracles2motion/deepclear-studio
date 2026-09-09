"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
import { AgentRole } from "@/types";
import {
  TrendingDown,
  Newspaper,
  DollarSign,
  ShieldCheck,
  Eye,
  Scale,
  MapPin,
  Clapperboard,
  ShieldAlert,
  Volume2,
  VolumeX,
} from "lucide-react";

interface InspectorSidebarProps {
  initialExposure: number;
  currentExposure: number;
  taxSavings: number;
  isCleared: boolean;
  activeAgent?: AgentRole;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
}

export const InspectorSidebar: React.FC<InspectorSidebarProps> = ({
  initialExposure,
  currentExposure,
  taxSavings,
  isCleared,
  activeAgent,
  isAudioMuted,
  onToggleAudio,
}) => {
  const percentCleared =
    initialExposure > 0
      ? Math.round(((initialExposure - currentExposure) / initialExposure) * 100)
      : 100;

  const agents: Array<{
    role: AgentRole;
    name: string;
    sub: string;
    icon: React.ReactNode;
  }> = [
    {
      role: "bond_officer",
      name: "Bond Officer",
      sub: "Risk Underwriting",
      icon: <ShieldAlert className="h-3.5 w-3.5 text-indigo-400" />,
    },
    {
      role: "script_supervisor",
      name: "Script Supervisor",
      sub: "Multimodal Vision",
      icon: <Eye className="h-3.5 w-3.5 text-emerald-400" />,
    },
    {
      role: "legal_counsel",
      name: "Legal Counsel",
      sub: "Parallel Search",
      icon: <Scale className="h-3.5 w-3.5 text-sky-400" />,
    },
    {
      role: "location_manager",
      name: "Location Manager",
      sub: "Permits & Tax",
      icon: <MapPin className="h-3.5 w-3.5 text-amber-400" />,
    },
    {
      role: "director",
      name: "The Director",
      sub: "Creative Intent",
      icon: <Clapperboard className="h-3.5 w-3.5 text-rose-400" />,
    },
  ];

  return (
    <aside className="w-80 h-full border-l border-white/[0.06] bg-[#0C0C0E] p-4 flex flex-col gap-4 overflow-y-auto shrink-0">
      {/* 1. Actuarial Financial Exposure */}
      <div className="bg-[#141416] border border-white/[0.08] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>STATUTORY EXPOSURE</span>
          <span className={isCleared ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
            {percentCleared}% MITIGATED
          </span>
        </div>

        <div className="text-2xl font-bold font-mono text-zinc-100">
          {formatCurrency(currentExposure)}
        </div>

        <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentCleared}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] font-mono text-zinc-500 pt-1">
          <span>Original: {formatCurrency(initialExposure)}</span>
          <span className="text-emerald-400">Tax: +{formatCurrency(taxSavings)}</span>
        </div>
      </div>

      {/* 2. Dynamic Distribution Risk */}
      <div className="bg-[#141416] border border-white/[0.08] rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Newspaper className="h-3.5 w-3.5" />
            <span>DISTRIBUTION RISK</span>
          </div>
          <span className={isCleared ? "text-emerald-400 font-semibold" : initialExposure === 0 ? "text-zinc-500" : "text-rose-400 font-semibold"}>
            {initialExposure === 0 ? "IDLE" : isCleared ? "APPROVED" : "HOLD"}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-zinc-300 font-medium">
          {initialExposure === 0 ? (
            <span className="text-zinc-500">
              Awaiting script ingestion to compute real-time distribution risk.
            </span>
          ) : isCleared ? (
            <span className="text-emerald-300">
              All clearance hazards resolved. E&O Evidence Binder ready for distribution.
            </span>
          ) : (
            <span className="text-rose-300">
              Active clearance hazards detected. Distribution hold pending crew negotiation.
            </span>
          )}
        </p>
      </div>

      {/* 3. Audio Voice Toggle */}
      <div className="bg-[#141416] border border-white/[0.08] rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
          {isAudioMuted ? <VolumeX className="h-4 w-4 text-zinc-500" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
          <span>Dual-Voice Synthesizer</span>
        </div>
        <button
          onClick={onToggleAudio}
          className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
            !isAudioMuted
              ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
              : "bg-zinc-800 text-zinc-400 border border-white/5"
          }`}
        >
          {!isAudioMuted ? "ON" : "MUTED"}
        </button>
      </div>

      {/* 4. Swarm Health & Status */}
      <div className="bg-[#141416] border border-white/[0.08] rounded-xl p-4 space-y-2.5 flex-1">
        <div className="text-xs font-mono text-zinc-400 mb-2">
          CREW SWARM TELEMETRY (5)
        </div>

        <div className="space-y-2">
          {agents.map((ag) => {
            const isActive = activeAgent === ag.role;
            return (
              <div
                key={ag.role}
                className={`p-2 rounded-lg border text-xs flex items-center justify-between transition-all ${
                  isActive
                    ? "bg-zinc-800 border-white/20 text-zinc-100"
                    : "bg-zinc-900/50 border-white/5 text-zinc-400"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1 rounded bg-zinc-800 shrink-0">{ag.icon}</div>
                  <div className="min-w-0 truncate">
                    <p className="font-semibold truncate text-zinc-200">{ag.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate font-mono">{ag.sub}</p>
                  </div>
                </div>

                <div className="text-[10px] font-mono shrink-0 pl-2">
                  {isActive ? (
                    <span className="text-emerald-400 font-semibold animate-pulse">ACTIVE</span>
                  ) : (
                    <span className="text-zinc-600">IDLE</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
