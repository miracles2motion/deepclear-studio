"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
import { TrendingDown, Award, Newspaper, DollarSign, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";

interface DynamicHUDProps {
  initialExposure: number;
  currentExposure: number;
  taxSavings: number;
  isCleared: boolean;
}

export const DynamicHUD: React.FC<DynamicHUDProps> = ({
  initialExposure,
  currentExposure,
  taxSavings,
  isCleared,
}) => {
  const percentCleared =
    initialExposure > 0
      ? Math.round(((initialExposure - currentExposure) / initialExposure) * 100)
      : 100;

  return (
    <div className="space-y-4">
      {/* 1. Trade Publication Headline Simulation */}
      <div
        className={`glass-panel rounded-2xl p-4 border transition-all duration-500 ${
          isCleared
            ? "bg-gradient-to-r from-emerald-950/40 via-surface to-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
            : "bg-gradient-to-r from-rose-950/40 via-surface to-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-500/10"
        }`}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Newspaper className={`h-4 w-4 ${isCleared ? "text-emerald-400" : "text-rose-400"}`} />
          <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-slate-400">
            TRADE PUBLICATION IMPACT SIMULATION
          </span>
        </div>

        <p className="text-sm font-semibold tracking-tight text-white leading-snug">
          {isCleared ? (
            <span className="text-emerald-300 flex items-center gap-1.5">
              <span className="font-mono text-emerald-400 font-black">DEADLINE:</span>{" "}
              "Streamer Bidding War Erupts for Cyberpunk Thriller at Sundance; Pristine Form E&O-2026 Clearance Binder Expedites Q4 Release."
            </span>
          ) : (
            <span className="text-rose-300 flex items-center gap-1.5">
              <span className="font-mono text-rose-400 font-black">VARIETY:</span>{" "}
              "Indie Feature Facing $2.8M Trademark & Unpermitted Drone Injunction; Global Streaming Distribution Halted."
            </span>
          )}
        </p>
      </div>

      {/* 2. Actuarial Risk Gauge & Exposure Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Initial Exposure */}
        <div className="glass-panel rounded-xl p-3.5 border border-surface-border">
          <span className="text-[10px] font-mono text-slate-400 uppercase">
            Statutory Exposure
          </span>
          <div className="text-lg font-bold font-mono text-rose-400 mt-0.5">
            {formatCurrency(currentExposure)}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">
            Initial: {formatCurrency(initialExposure)}
          </div>
        </div>

        {/* Clearance Efficiency */}
        <div className="glass-panel rounded-xl p-3.5 border border-surface-border">
          <span className="text-[10px] font-mono text-slate-400 uppercase">
            Risk Mitigated
          </span>
          <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5 flex items-center gap-1">
            <TrendingDown className="h-4 w-4" />
            {percentCleared}%
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentCleared}%` }}
            />
          </div>
        </div>

        {/* State Tax Incentive Arbitrage */}
        <div className="glass-panel rounded-xl p-3.5 border border-emerald-500/30 bg-emerald-950/20">
          <span className="text-[10px] font-mono text-emerald-400 uppercase flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            Tax Rebate Unlocked
          </span>
          <div className="text-lg font-bold font-mono text-emerald-300 mt-0.5">
            +{formatCurrency(taxSavings)}
          </div>
          <div className="text-[10px] text-emerald-400/80 font-mono mt-1">
            Georgia 30% Uplift Applied
          </div>
        </div>
      </div>

      {/* 3. Location Tax Arbitrage Table */}
      <div className="glass-panel rounded-xl p-3.5 border border-surface-border">
        <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase mb-2">
          State Tax Rebate Arbitrage (Parallel Grounded)
        </h4>
        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between p-1.5 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
            <span className="font-semibold">Savannah, Georgia</span>
            <span>30.0% Rebate (+ $42,000)</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/50 border border-surface-border text-slate-400">
            <span>Albuquerque, New Mexico</span>
            <span>25.0% Rebate (+ $35,000)</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded bg-rose-950/30 border border-rose-500/30 text-rose-300">
            <span>Los Angeles, California</span>
            <span>0.0% Tier (Over Limit)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
