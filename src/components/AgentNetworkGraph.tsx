"use client";

import React from "react";
import { AgentRole } from "@/types";
import { ShieldAlert, Eye, Scale, MapPin, Clapperboard, CheckCircle2, Activity } from "lucide-react";

interface AgentNodeProps {
  role: AgentRole;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  status: "idle" | "thinking" | "active" | "cleared";
  colorClass: string;
  activeThought?: string;
}

interface AgentNetworkGraphProps {
  activeAgent?: AgentRole;
  activeThought?: string;
  isScanning: boolean;
  isCleared: boolean;
}

export const AgentNetworkGraph: React.FC<AgentNetworkGraphProps> = ({
  activeAgent,
  activeThought,
  isScanning,
  isCleared,
}) => {
  const agents: Array<{
    role: AgentRole;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    colorClass: string;
  }> = [
    {
      role: "bond_officer",
      title: "Completion Bond Officer",
      subtitle: "Actuarial Underwriting & Risk",
      icon: <ShieldAlert className="h-5 w-5 text-indigo-400" />,
      colorClass: "border-indigo-500/40 bg-indigo-950/20 text-indigo-300",
    },
    {
      role: "script_supervisor",
      title: "Script Supervisor",
      subtitle: "Gemini Multimodal Vision",
      icon: <Eye className="h-5 w-5 text-emerald-400" />,
      colorClass: "border-emerald-500/40 bg-emerald-950/20 text-emerald-300",
    },
    {
      role: "legal_counsel",
      title: "Studio Legal Counsel",
      subtitle: "Parallel 4D Search Grounding",
      icon: <Scale className="h-5 w-5 text-cyan-400" />,
      colorClass: "border-cyan-500/40 bg-cyan-950/20 text-cyan-300",
    },
    {
      role: "location_manager",
      title: "Location Manager",
      subtitle: "Permits & Tax Arbitrage",
      icon: <MapPin className="h-5 w-5 text-amber-400" />,
      colorClass: "border-amber-500/40 bg-amber-950/20 text-amber-300",
    },
    {
      role: "director",
      title: "The Director",
      subtitle: "Creative Intent & Fair Use",
      icon: <Clapperboard className="h-5 w-5 text-rose-400" />,
      colorClass: "border-rose-500/40 bg-rose-950/20 text-rose-300",
    },
  ];

  return (
    <div className="w-full glass-panel rounded-2xl p-4 border border-surface-border">
      <div className="flex items-center justify-between mb-3 border-b border-surface-border pb-2">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
          <h2 className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
            Autonomous Crew Swarm Telemetry
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>5 AGENTS CONNECTED (SSE)</span>
        </div>
      </div>

      {/* 5-Agent Swarm Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {agents.map((ag) => {
          const isActive = activeAgent === ag.role;
          return (
            <div
              key={ag.role}
              className={`relative rounded-xl p-3 border transition-all duration-300 ${
                isActive
                  ? "bg-surface-elevated/90 border-cyan-400/70 shadow-lg shadow-cyan-500/15 scale-[1.02]"
                  : "bg-surface-subtle/50 border-surface-border/60 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`p-1.5 rounded-lg border ${ag.colorClass}`}>
                  {ag.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-semibold text-white truncate">
                    {ag.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono truncate">
                    {ag.subtitle}
                  </p>
                </div>
              </div>

              {/* Status pill */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] font-mono">
                <span className="text-slate-500">STATE:</span>
                {isActive ? (
                  <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    STREAMING
                  </span>
                ) : isCleared ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    CLEARED
                  </span>
                ) : (
                  <span className="text-slate-400">STANDBY</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Active Thought Banner */}
      {activeThought && (
        <div className="mt-3 p-2.5 rounded-xl bg-surface-subtle/80 border border-cyan-500/30 flex items-start gap-2.5 text-xs">
          <div className="h-2 w-2 rounded-full bg-cyan-400 mt-1 shrink-0 animate-ping" />
          <p className="text-cyan-200 font-mono text-xs leading-relaxed">
            <span className="text-slate-400 uppercase font-semibold mr-1.5">
              [{activeAgent ? activeAgent.replace("_", " ") : "SWARM"}]:
            </span>
            {activeThought}
          </p>
        </div>
      )}
    </div>
  );
};
