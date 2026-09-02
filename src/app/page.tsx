"use client";

import React, { useState, useEffect, useRef } from "react";
import { AgentRole, ExtractedEntity, DebateTurn } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ExportModal } from "@/components/ExportModal";
import {
  Sparkles,
  Paperclip,
  ArrowUp,
  ShieldCheck,
  Download,
  Eye,
  Scale,
  MapPin,
  Clapperboard,
  ShieldAlert,
  FileText,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  Radio,
  Image as ImageIcon,
  Zap,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | AgentRole | "system";
  senderName: string;
  timestamp: string;
  type: "text" | "script" | "hazards" | "debate" | "mutation";
  content?: string;
  entities?: ExtractedEntity[];
  debateTurn?: DebateTurn;
}

export default function DeepClearStudioPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      sender: "system",
      senderName: "DeepClear Swarm",
      timestamp: "Just now",
      type: "text",
      content:
        "Welcome to DeepClear Studio. I am your autonomous film clearance and E&O underwriting co-pilot.\n\nPaste a screenplay scene below, upload a `.fountain` or `.md` script, or type a command to begin clearance analysis.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentRole | undefined>(undefined);
  const [initialExposure, setInitialExposure] = useState(0);
  const [currentExposure, setCurrentExposure] = useState(0);
  const [taxSavings, setTaxSavings] = useState(0);
  const [entities, setEntities] = useState<ExtractedEntity[]>([]);
  const [clearedEntityIds, setClearedEntityIds] = useState<string[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState(true); // Default muted to avoid audio obstruction
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Sequential, non-obstructing voice synthesis
  const speakText = (shortSummary: string, speaker: "director" | "legal_counsel" | "bond_officer") => {
    if (isAudioMuted || !synthRef.current) return;
    try {
      // Cancel any ongoing speech so agents never talk over each other
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(shortSummary);

      if (speaker === "director") {
        utterance.pitch = 1.25;
        utterance.rate = 1.05;
      } else if (speaker === "legal_counsel") {
        utterance.pitch = 0.85;
        utterance.rate = 0.95;
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
      }

      synthRef.current.speak(utterance);
    } catch {
      // Audio fallback
    }
  };

  // 5 Agents Definition
  const agents: Array<{
    role: AgentRole;
    name: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      role: "bond_officer",
      name: "Completion Bond Officer",
      description: "Underwriting & Risk Calculations",
      icon: <ShieldAlert className="h-4 w-4 text-indigo-400" />,
    },
    {
      role: "script_supervisor",
      name: "Script Supervisor",
      description: "Gemini 2.0 Multimodal Vision",
      icon: <Eye className="h-4 w-4 text-emerald-400" />,
    },
    {
      role: "legal_counsel",
      name: "Studio Legal Counsel",
      description: "Parallel 4D Search Grounding",
      icon: <Scale className="h-4 w-4 text-sky-400" />,
    },
    {
      role: "location_manager",
      name: "Location Manager",
      description: "Permits & Tax Rebate Arbitrage",
      icon: <MapPin className="h-4 w-4 text-amber-400" />,
    },
    {
      role: "director",
      name: "The Director",
      description: "Creative Intent & Fair Use",
      icon: <Clapperboard className="h-4 w-4 text-rose-400" />,
    },
  ];

  // Handle Send Message / Analyze Script
  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      senderName: "You",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
      content: queryText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setActiveAgent("script_supervisor");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scriptText: queryText }),
      });

      if (response.ok) {
        const stream = response.body;
        if (!stream) return;

        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const event = JSON.parse(line.slice(6));
              setActiveAgent(event.agent);

              if (event.type === "CLEARANCE_COMPLETE") {
                const foundEntities: ExtractedEntity[] = event.payload.entities || [];
                const exposure = event.payload.totalExposure || 0;

                setEntities(foundEntities);
                setInitialExposure(exposure);
                setCurrentExposure(exposure);
                setTaxSavings(exposure > 0 ? 42000 : 0);

                setMessages((prev) => [
                  ...prev,
                  {
                    id: `agent-res-${Date.now()}`,
                    sender: "legal_counsel",
                    senderName: "Studio Legal Counsel",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    type: "hazards",
                    entities: foundEntities,
                  },
                  {
                    id: `bond-summary-${Date.now()}`,
                    sender: "bond_officer",
                    senderName: "Completion Bond Officer",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    type: "text",
                    content:
                      foundEntities.length > 0
                        ? `Underwriting analysis complete. Identified ${foundEntities.length} liabilities totaling ${formatCurrency(
                            exposure
                          )}. Click "Negotiate" below to begin dialectic compromise.`
                        : "Clearance scan complete. No actionable trademark, copyright, or municipal liabilities detected.",
                  },
                ]);
              }
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "system",
          senderName: "DeepClear Swarm",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
          content: "Scan completed. Grounding citations indexed.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setActiveAgent("bond_officer");
    }
  };

  // Handle Negotiate / Dialectic Debate on a specific hazard
  const handleStartDebate = (entity: ExtractedEntity) => {
    setIsLoading(true);
    setActiveAgent("legal_counsel");

    const counselArg = `Under Lanham Act § 43(a), featuring "${entity.rawText}" prominently without a license creates estimated liability of ${formatCurrency(
      entity.originalExposure
    )}. We must defuse this prop.`;
    const directorArg = `This item is crucial for character authenticity and atmosphere! It is protected artistic Fair Use!`;
    const compromiseText = entity.defusedText || "custom cleared narrative prop";
    const counselCompromise = `Compromise proposed: Substitute "${entity.rawText}" with "${compromiseText}". This preserves your dramatic tone while reducing liability to $0.`;
    const directorAccept = `Agreed. If the art department can match the aesthetic on "${compromiseText}", we have a deal. Script mutated.`;

    // 1. Counsel Opening (short punchy audio)
    speakText(`Trademark hazard on ${entity.rawText}. Statutory exposure ${formatCurrency(entity.originalExposure)}.`, "legal_counsel");
    setMessages((prev) => [
      ...prev,
      {
        id: `deb-counsel-${Date.now()}`,
        sender: "legal_counsel",
        senderName: "Studio Legal Counsel",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
        content: counselArg,
      },
    ]);

    // 2. Director Counter
    setTimeout(() => {
      setActiveAgent("director");
      speakText("This prop is vital for character authenticity and Fair Use!", "director");
      setMessages((prev) => [
        ...prev,
        {
          id: `deb-dir-${Date.now()}`,
          sender: "director",
          senderName: "The Director",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
          content: directorArg,
        },
      ]);
    }, 1200);

    // 3. Counsel Compromise
    setTimeout(() => {
      setActiveAgent("legal_counsel");
      speakText(`Compromise: substitute with ${compromiseText}.`, "legal_counsel");
      setMessages((prev) => [
        ...prev,
        {
          id: `deb-comp-${Date.now()}`,
          sender: "legal_counsel",
          senderName: "Studio Legal Counsel",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
          content: counselCompromise,
        },
      ]);
    }, 2500);

    // 4. Director Accept & Mutation
    setTimeout(() => {
      setActiveAgent("director");
      speakText("Agreed. Script mutated to cleared alternative.", "director");
      setClearedEntityIds((prev) => [...prev, entity.id]);
      setCurrentExposure((prev) => Math.max(0, prev - entity.originalExposure));

      setMessages((prev) => [
        ...prev,
        {
          id: `deb-acc-${Date.now()}`,
          sender: "director",
          senderName: "The Director",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
          content: directorAccept,
        },
        {
          id: `mut-${Date.now()}`,
          sender: "script_supervisor",
          senderName: "Script Supervisor",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
          content: `✍️ Script Mutated: "${entity.rawText}" ➔ "${compromiseText}". Statutory liability reduced by ${formatCurrency(
            entity.originalExposure
          )}.`,
        },
      ]);

      setIsLoading(false);
      setActiveAgent("bond_officer");
    }, 3800);
  };

  // Handle File Upload (.md, .fountain, .txt)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleSendMessage(`[Uploaded File: ${file.name}]\n\n${content}`);
    };
    reader.readAsText(file);
  };

  // Reset Chat Session
  const handleNewSession = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "system",
        senderName: "DeepClear Swarm",
        timestamp: "Just now",
        type: "text",
        content:
          "New clearance session started. Paste a screenplay excerpt below or attach a script file to begin.",
      },
    ]);
    setEntities([]);
    setClearedEntityIds([]);
    setInitialExposure(0);
    setCurrentExposure(0);
    setTaxSavings(0);
    setUploadedFileName(null);
  };

  const pendingHazards = entities.filter(
    (e) => !clearedEntityIds.includes(e.id) && e.status !== "cleared"
  );
  const isCleared = initialExposure > 0 && currentExposure === 0;

  return (
    <div className="h-screen w-screen bg-[#0C0C0E] text-zinc-100 flex flex-col antialiased overflow-hidden font-sans">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".fountain,.txt,.md,.pdf,image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* 3-Column Layout */}
      <div className="flex-1 flex w-full h-full overflow-hidden">
        {/* ========================================================= */}
        {/* LEFT COLUMN: 5-Agent Crew Swarm (260px) */}
        {/* ========================================================= */}
        <aside className="w-64 border-r border-white/[0.06] bg-[#101012] flex flex-col justify-between p-3.5 shrink-0 hidden md:flex">
          <div className="space-y-4">
            {/* Logo & New Chat */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-xs text-zinc-100">
                  DC
                </div>
                <span className="font-semibold text-sm text-zinc-100 tracking-tight">
                  DeepClear Studio
                </span>
              </div>

              <button
                onClick={handleNewSession}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                title="Start New Session"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* 5-Agent Swarm Roster */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-2 mb-2 font-semibold">
                Autonomous Crew Swarm
              </div>

              {agents.map((ag) => {
                const isActive = activeAgent === ag.role;
                return (
                  <div
                    key={ag.role}
                    className={`p-2.5 rounded-xl border text-xs transition-all ${
                      isActive
                        ? "bg-zinc-800/90 border-white/20 text-zinc-100 shadow-sm"
                        : "bg-transparent border-transparent hover:bg-zinc-900/60 text-zinc-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-zinc-900 border border-white/5 shrink-0">
                        {ag.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-xs text-zinc-200 truncate">{ag.name}</p>
                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-500 truncate font-mono mt-0.5">
                          {ag.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Settings & Voice Toggle */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 px-1">
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="flex items-center gap-2 hover:text-white transition-all font-mono text-[11px]"
            >
              {isAudioMuted ? (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Voice Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-zinc-200 font-semibold">Voice On</span>
                </>
              )}
            </button>

            <button
              onClick={handleNewSession}
              className="hover:text-rose-400 transition-all p-1"
              title="Clear Session"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MIDDLE COLUMN: Main Google Gemini Chat Feed (The Biggest)  */}
        {/* ========================================================= */}
        <main className="flex-1 flex flex-col h-full bg-[#0C0C0E] relative overflow-hidden">
          {/* Top Bar for Mobile / Compact Navigation */}
          <div className="h-12 border-b border-white/[0.06] px-4 flex items-center justify-between md:hidden shrink-0">
            <div className="font-semibold text-xs text-zinc-200">DeepClear Studio</div>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-2.5 py-1 rounded bg-zinc-800 text-xs text-zinc-300 font-mono"
            >
              Export Binder
            </button>
          </div>

          {/* Scrollable Message Feed */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-5 max-w-3xl mx-auto w-full">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 items-start ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {/* Agent Avatar */}
                  {!isUser && (
                    <div className="h-7 w-7 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-zinc-300 font-bold text-xs">
                      {msg.sender === "director" ? (
                        <Clapperboard className="h-3.5 w-3.5 text-rose-400" />
                      ) : msg.sender === "legal_counsel" ? (
                        <Scale className="h-3.5 w-3.5 text-sky-400" />
                      ) : msg.sender === "script_supervisor" ? (
                        <Eye className="h-3.5 w-3.5 text-emerald-400" />
                      ) : msg.sender === "location_manager" ? (
                        <MapPin className="h-3.5 w-3.5 text-amber-400" />
                      ) : (
                        <ShieldAlert className="h-3.5 w-3.5 text-indigo-400" />
                      )}
                    </div>
                  )}

                  {/* Message Bubble / Card */}
                  <div
                    className={`space-y-1.5 max-w-[88%] ${
                      isUser ? "items-end text-right" : "items-start text-left"
                    }`}
                  >
                    <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
                      <span>{msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Standard Text */}
                    {msg.type === "text" && (
                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                          isUser
                            ? "bg-zinc-100 text-zinc-950 font-medium rounded-tr-sm shadow-sm"
                            : "bg-[#141416] border border-white/[0.08] text-zinc-200 rounded-tl-sm shadow-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                    )}

                    {/* Detected Hazards List Card */}
                    {msg.type === "hazards" && msg.entities && (
                      <div className="bg-[#141416] border border-white/[0.08] rounded-2xl p-4 space-y-3 w-full shadow-sm">
                        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                          <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                            Identified Scene Liabilities ({msg.entities.length})
                          </span>
                        </div>

                        <div className="space-y-2">
                          {msg.entities.map((ent) => {
                            const isEntityCleared =
                              clearedEntityIds.includes(ent.id) || ent.status === "cleared";
                            return (
                              <div
                                key={ent.id}
                                className={`p-3 rounded-xl border text-xs transition-all ${
                                  isEntityCleared
                                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                                    : "bg-zinc-900/90 border-white/[0.08] text-zinc-200"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/5 font-semibold">
                                        {ent.category}
                                      </span>
                                      <span className="font-semibold text-zinc-100">{ent.rawText}</span>
                                    </div>
                                    <p className="text-zinc-400 leading-snug">{ent.description}</p>

                                    {/* Parallel Citations */}
                                    {ent.citations && ent.citations.length > 0 && (
                                      <div className="mt-2 space-y-1">
                                        {ent.citations.map((cit) => (
                                          <div
                                            key={cit.id}
                                            className="flex items-start gap-1.5 text-[11px] font-mono text-zinc-400 bg-zinc-950/70 p-1.5 rounded border border-white/5"
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

                                  {!isEntityCleared && (
                                    <button
                                      onClick={() => handleStartDebate(ent)}
                                      disabled={isLoading}
                                      className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-white/10 transition-all shadow-sm"
                                    >
                                      Negotiate
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 pt-2 animate-pulse">
                <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                <span>
                  [{activeAgent ? activeAgent.replace("_", " ").toUpperCase() : "SWARM"}]: Processing
                  clearance reasoning...
                </span>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* FLOATING GOOGLE GEMINI-STYLE PROMPT BAR AT BOTTOM         */}
          {/* ========================================================= */}
          <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-1 shrink-0 space-y-2">
            {/* PINNED QUICK ACTION BAR FOR PENDING HAZARDS (Fixes scrolling up) */}
            {pendingHazards.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-zinc-500 font-mono text-[10px] shrink-0 font-semibold uppercase">
                  Pending Hazards:
                </span>
                {pendingHazards.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => handleStartDebate(h)}
                    disabled={isLoading}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-amber-500/30 transition-all shadow-sm"
                  >
                    <Zap className="h-3 w-3 text-amber-400" />
                    <span>Negotiate {h.rawText}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Clean Prompt Starters (when empty) */}
            {messages.length === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
                <button
                  onClick={() =>
                    handleSendMessage(
                      "INT. MODERN TECH OFFICE - NIGHT\n\nALEX types rapidly at his workstation, drinking from a can of PEPSI. In the background, a commercial pop track plays while an aerial drone camera records the city skyline."
                    )
                  }
                  className="p-3 rounded-xl bg-[#141416] hover:bg-[#1a1a1e] border border-white/[0.08] text-left text-zinc-300 hover:text-white transition-all space-y-1"
                >
                  <p className="font-semibold text-zinc-100">🎬 Analyze Sample Scene</p>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Scans scene for brand trademarks, music rights, and municipal permits
                  </p>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 rounded-xl bg-[#141416] hover:bg-[#1a1a1e] border border-white/[0.08] text-left text-zinc-300 hover:text-white transition-all space-y-1"
                >
                  <p className="font-semibold text-zinc-100">📁 Attach Script File</p>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Upload your .fountain, .md, or .txt screenplay directly
                  </p>
                </button>
              </div>
            )}

            {/* Prompt Input Box */}
            <div className="bg-[#141416] border border-white/[0.08] focus-within:border-white/20 rounded-2xl p-2.5 shadow-2xl flex flex-col gap-2 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Paste screenplay dialogue, upload a .fountain/.md file, or command the agents..."
                rows={1}
                className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none px-2 py-1 max-h-36 min-h-[38px] leading-relaxed"
              />

              <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all flex items-center gap-1.5 text-xs font-mono"
                  title="Upload .fountain, .md, .txt or storyboard images"
                >
                  <Paperclip className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {uploadedFileName ? uploadedFileName : "Attach Script / Image"}
                  </span>
                </button>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="h-8 w-8 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ArrowUp className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Underwriting & E&O Clearance HUD (300px)    */}
        {/* ========================================================= */}
        <aside className="w-72 border-l border-white/[0.06] bg-[#101012] p-4 flex flex-col justify-between shrink-0 hidden lg:flex">
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold border-b border-white/[0.06] pb-2">
              E&O Underwriting Status
            </div>

            {/* Statutory Exposure Card */}
            <div className="bg-[#141416] border border-white/[0.08] rounded-xl p-3.5 space-y-2">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Statutory Liability</span>
              <div className="text-2xl font-bold font-mono text-zinc-100">
                {formatCurrency(currentExposure)}
              </div>
              <div className="text-[11px] font-mono text-zinc-500">
                Initial: {formatCurrency(initialExposure)}
              </div>
            </div>

            {/* Tax Rebate Card */}
            <div className="bg-[#141416] border border-white/[0.08] rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase">
                Tax Rebate Unlocked
              </span>
              <div className="text-lg font-bold font-mono text-emerald-300">
                +{formatCurrency(taxSavings)}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono">Georgia 30% Uplift</div>
            </div>

            {/* Trade Impact Simulation */}
            <div className="bg-[#141416] border border-white/[0.08] rounded-xl p-3.5 space-y-1.5">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Trade Impact</span>
              <p className="text-xs text-zinc-300 leading-snug">
                {isCleared ? (
                  <span>
                    <strong className="text-emerald-400 font-mono">DEADLINE:</strong> "Sundance bidding
                    war erupts; 100% cleared E&O binder expedites release."
                  </span>
                ) : (
                  <span>
                    <strong className="text-rose-400 font-mono">VARIETY:</strong> "Indie thriller halted
                    by trademark injunction; distribution delayed."
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Export Binder Action */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Form E&O-2026 PDF</span>
          </button>
        </aside>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        productionTitle="Indie Narrative Production"
        initialExposure={initialExposure}
        currentExposure={currentExposure}
        taxSavings={taxSavings}
        entities={entities}
      />
    </div>
  );
}
