"use client";

import React from "react";
import { ExtractedEntity, DebateTurn, AgentRole } from "@/types";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ShieldAlert,
  Scale,
  Eye,
  MapPin,
  Clapperboard,
  Volume2,
  VolumeX,
  ImageIcon,
} from "lucide-react";

export interface FeedMessage {
  id: string;
  sender: "user" | AgentRole | "system";
  senderName: string;
  timestamp: string;
  type: "text" | "script_card" | "hazard_list" | "debate_card" | "storyboard_card" | "mutation_diff";
  content?: string;
  entities?: ExtractedEntity[];
  debateTurn?: DebateTurn;
  isDefused?: boolean;
}

interface ConversationalFeedProps {
  messages: FeedMessage[];
  entities: ExtractedEntity[];
  clearedEntityIds: string[];
  onStartDebate: (entity: ExtractedEntity) => void;
  isDebating: boolean;
  isDefused: boolean;
  onToggleDefuse: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
}

export const ConversationalFeed: React.FC<ConversationalFeedProps> = ({
  messages,
  entities,
  clearedEntityIds,
  onStartDebate,
  isDebating,
  isDefused,
  onToggleDefuse,
  isAudioMuted,
  onToggleAudio,
}) => {
  const getAgentBadge = (sender: string) => {
    switch (sender) {
      case "script_supervisor":
        return {
          name: "Script Supervisor",
          role: "Multimodal Vision",
          icon: <Eye className="h-3.5 w-3.5 text-emerald-400" />,
          badgeColor: "bg-emerald-950/40 text-emerald-400 border-emerald-500/20",
        };
      case "legal_counsel":
        return {
          name: "Legal Counsel",
          role: "Parallel 4D Search",
          icon: <Scale className="h-3.5 w-3.5 text-sky-400" />,
          badgeColor: "bg-sky-950/40 text-sky-400 border-sky-500/20",
        };
      case "director":
        return {
          name: "The Director",
          role: "Creative Intent",
          icon: <Clapperboard className="h-3.5 w-3.5 text-rose-400" />,
          badgeColor: "bg-rose-950/40 text-rose-400 border-rose-500/20",
        };
      case "location_manager":
        return {
          name: "Location Manager",
          role: "Permits & Tax",
          icon: <MapPin className="h-3.5 w-3.5 text-amber-400" />,
          badgeColor: "bg-amber-950/40 text-amber-400 border-amber-500/20",
        };
      case "bond_officer":
        return {
          name: "Completion Bond Officer",
          role: "Underwriting",
          icon: <ShieldAlert className="h-3.5 w-3.5 text-indigo-400" />,
          badgeColor: "bg-indigo-950/40 text-indigo-400 border-indigo-500/20",
        };
      default:
        return {
          name: "You",
          role: "Filmmaker",
          icon: null,
          badgeColor: "bg-zinc-800 text-zinc-300 border-white/10",
        };
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 max-w-4xl mx-auto w-full">
      {messages.map((msg) => {
        const agent = getAgentBadge(msg.sender);
        const isUser = msg.sender === "user";

        return (
          <div
            key={msg.id}
            className={`flex gap-3.5 items-start ${isUser ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            {!isUser && (
              <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                {agent.icon}
              </div>
            )}

            {/* Message Body */}
            <div className={`space-y-2 max-w-[85%] sm:max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
              {/* Header */}
              <div className={`flex items-center gap-2 text-xs ${isUser ? "justify-end" : "justify-start"}`}>
                <span className="font-semibold text-zinc-200">{agent.name}</span>
                {!isUser && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${agent.badgeColor}`}>
                    {agent.role}
                  </span>
                )}
                <span className="text-[10px] text-zinc-500 font-mono">{msg.timestamp}</span>
              </div>

              {/* 1. Text Message */}
              {msg.type === "text" && (
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-blue-600 text-white rounded-tr-sm shadow-sm"
                      : "bg-[#141416] border border-white/[0.08] text-zinc-200 rounded-tl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              )}

              {/* 2. Script Card */}
              {msg.type === "script_card" && (
                <div className="bg-[#141416] border border-white/[0.08] rounded-xl p-4 space-y-2 w-full text-xs font-mono">
                  <div className="flex items-center justify-between text-zinc-400 border-b border-white/[0.06] pb-2">
                    <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
                      <FileText className="h-3.5 w-3.5 text-zinc-400" />
                      Screenplay Excerpt (Scene 1)
                    </span>
                    <span className="text-[10px]">FOUNTAIN FORMAT</span>
                  </div>
                  <pre className="text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto pt-1">
                    {msg.content}
                  </pre>
                </div>
              )}

              {/* 3. Hazard List Card */}
              {msg.type === "hazard_list" && entities.length > 0 && (
                <div className="bg-[#141416] border border-white/[0.08] rounded-xl p-4 space-y-3 w-full">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                      Detected Liabilities & Grounding ({entities.length})
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {entities.map((ent) => {
                      const isCleared = clearedEntityIds.includes(ent.id) || ent.status === "cleared";
                      return (
                        <div
                          key={ent.id}
                          className={`p-3 rounded-lg border transition-all text-xs ${
                            isCleared
                              ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                              : "bg-zinc-900/90 border-white/[0.08] text-zinc-200"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/5">
                                  {ent.category}
                                </span>
                                <span className="font-semibold text-zinc-100">{ent.rawText}</span>
                              </div>
                              <p className="text-zinc-400 leading-snug">{ent.description}</p>

                              {/* Defused Compromise Pill */}
                              {isCleared && ent.defusedText && (
                                <div className="mt-1.5 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  <span>MUTATED: "{ent.defusedText}"</span>
                                </div>
                              )}

                              {/* Parallel Citations */}
                              {ent.citations && ent.citations.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {ent.citations.map((cit) => (
                                    <div
                                      key={cit.id}
                                      className="flex items-start gap-1.5 text-[11px] font-mono text-zinc-400 bg-zinc-900 p-1.5 rounded border border-white/5"
                                    >
                                      <ExternalLink className="h-3 w-3 mt-0.5 shrink-0 text-sky-400" />
                                      <div>
                                        <span className="text-zinc-200 font-semibold">{cit.title}: </span>
                                        <span>{cit.snippet}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Negotiate Action Button */}
                            {!isCleared && (
                              <button
                                onClick={() => onStartDebate(ent)}
                                disabled={isDebating}
                                className="shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 transition-all flex items-center gap-1"
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
              )}

              {/* 4. Storyboard Visual Card */}
              {msg.type === "storyboard_card" && (
                <div className="bg-[#141416] border border-white/[0.08] rounded-xl p-4 space-y-3 w-full">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-emerald-400" />
                      Multimodal Storyboard Frame
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">FRAME 01</span>
                  </div>

                  <div className="p-4 rounded-lg bg-zinc-950 border border-white/5 text-center space-y-3">
                    <div
                      className={`p-3 rounded-lg border text-xs font-mono transition-all ${
                        isDefused
                          ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                          : "bg-rose-950/20 border-rose-500/40 text-rose-300"
                      }`}
                    >
                      <div className="font-semibold uppercase mb-1">
                        {isDefused ? "CLEARED PROP: VOLTRUSH ENERGY" : "HAZARD: RED BULL TRADEMARK"}
                      </div>
                      <p className="text-zinc-400 text-[11px]">
                        {isDefused
                          ? "Generative substitution applied. Brand geometry altered to fictional product."
                          : "Visible commercial energy drink can in hero shot. High infringement risk under Lanham Act."}
                      </p>
                    </div>

                    <button
                      onClick={onToggleDefuse}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 transition-all inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      <span>{isDefused ? "Revert to Infringing Frame" : "Swap to Generative Safe-Prop"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
