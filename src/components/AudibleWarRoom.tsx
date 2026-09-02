"use client";

import React, { useState, useEffect, useRef } from "react";
import { DebateTurn } from "@/types";
import { Mic, Volume2, VolumeX, Radio, Sparkles, UserCheck } from "lucide-react";

interface AudibleWarRoomProps {
  debateTurns: DebateTurn[];
  isDebating: boolean;
}

export const AudibleWarRoom: React.FC<AudibleWarRoomProps> = ({
  debateTurns,
  isDebating,
}) => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Speak latest turn if audio is enabled
  useEffect(() => {
    if (!audioEnabled || !synthRef.current || debateTurns.length === 0) return;

    const latestTurn = debateTurns[debateTurns.length - 1];
    const utterance = new SpeechSynthesisUtterance(latestTurn.argument);

    // Differentiate voices by pitch and rate
    if (latestTurn.speaker === "director") {
      utterance.pitch = 1.2;
      utterance.rate = 1.05;
    } else {
      utterance.pitch = 0.9;
      utterance.rate = 1.0;
    }

    synthRef.current.speak(utterance);
  }, [debateTurns, audioEnabled]);

  const toggleAudio = () => {
    if (audioEnabled && synthRef.current) {
      synthRef.current.cancel();
    }
    setAudioEnabled(!audioEnabled);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-surface-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <Radio className={`h-4 w-4 ${isDebating ? "text-rose-400 animate-pulse" : "text-cyan-400"}`} />
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Audible Dialectic War Room
          </h2>
        </div>

        <button
          onClick={toggleAudio}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
            audioEnabled
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "bg-surface-subtle text-slate-400 border border-surface-border"
          }`}
        >
          {audioEnabled ? (
            <>
              <Volume2 className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>VOICE ON</span>
            </>
          ) : (
            <>
              <VolumeX className="h-3.5 w-3.5" />
              <span>VOICE MUTED</span>
            </>
          )}
        </button>
      </div>

      {/* Visualizer Waveform Bar */}
      <div className="h-8 bg-surface-subtle/80 rounded-xl border border-surface-border/60 flex items-center justify-center px-4 gap-1 overflow-hidden mb-3">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-150 ${
              isDebating
                ? "bg-cyan-400 animate-pulse"
                : "bg-slate-700 h-1.5"
            }`}
            style={{
              height: isDebating ? `${Math.max(4, (Math.sin(i * 0.8) + 1.2) * 12)}px` : "4px",
            }}
          />
        ))}
      </div>

      {/* Dialogue Stream Container */}
      <div className="flex-1 bg-surface-subtle/50 rounded-xl p-3 border border-surface-border/60 overflow-y-auto max-h-[300px] space-y-3 font-mono text-xs">
        {debateTurns.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-4">
            <Mic className="h-6 w-6 mb-2 text-slate-600" />
            <p>Click "Negotiate" on any hazardous script item to trigger real-time dialectic compromise.</p>
          </div>
        ) : (
          debateTurns.map((turn) => {
            const isDirector = turn.speaker === "director";
            return (
              <div
                key={turn.id}
                className={`p-3 rounded-xl border ${
                  isDirector
                    ? "bg-rose-950/30 border-rose-500/30 text-rose-200"
                    : "bg-cyan-950/30 border-cyan-500/30 text-cyan-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1 text-[11px] font-bold">
                  <span className={isDirector ? "text-rose-400" : "text-cyan-400"}>
                    {turn.speakerName.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {turn.timestamp}
                  </span>
                </div>
                <p className="leading-relaxed text-slate-200">
                  "{turn.argument}"
                </p>
                {turn.proposedCompromise && (
                  <div className="mt-2 p-1.5 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-[11px]">
                    🎯 Proposed Substitution: "{turn.proposedCompromise}"
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
