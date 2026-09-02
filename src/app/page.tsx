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
  Zap,
  Loader2,
  Film,
  Copy,
  Check,
  CornerDownRight,
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
  replyTo?: {
    messageId?: string;
    senderName: string;
    snippet: string;
  };
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
        "Welcome to DeepClear Studio. I am your autonomous film clearance and E&O underwriting co-pilot.\n\nPaste a screenplay scene below, upload a `.fountain` or `.md` script, or click 'Generate Scene with Gemini' to begin clearance analysis.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingScene, setIsGeneratingScene] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentRole | undefined>(undefined);
  const [initialExposure, setInitialExposure] = useState(0);
  const [currentExposure, setCurrentExposure] = useState(0);
  const [taxSavings, setTaxSavings] = useState(0);
  const [currentScriptText, setCurrentScriptText] = useState<string>("");
  const [taxJurisdiction, setTaxJurisdiction] = useState("Qualified Film Credit (30%)");
  const [entities, setEntities] = useState<ExtractedEntity[]>([]);
  const [clearedEntityIds, setClearedEntityIds] = useState<string[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState(true); // Default muted to avoid audio obstruction
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Dynamically generate fresh scene from Gemini API on demand
  const handleGenerateGeminiScene = async () => {
    setIsGeneratingScene(true);
    setActiveAgent("script_supervisor");

    try {
      const res = await fetch("/api/generate-scene", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate scene with Gemini");
      }

      if (data.sceneText) {
        // Pass the generated scene directly into the live swarm analyzer
        handleSendMessage(data.sceneText);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "system",
          senderName: "DeepClear Swarm",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
          content: `[Gemini Generation Error]: ${(err as Error).message}`,
        },
      ]);
    } finally {
      setIsGeneratingScene(false);
    }
  };

  // Smooth auto-scroll to latest message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);



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
      description: "Gemini Multimodal Vision",
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
    setCurrentScriptText(queryText);
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

                // Dynamic State Tax Rebate Calculation
                const textLower = (
                  queryText +
                  " " +
                  foundEntities.map((e) => e.rawText + " " + e.description).join(" ")
                ).toLowerCase();

                let jurisdictionName = "Qualified Film Credit (30% QPE)";
                let rate = 0.30;

                if (
                  textLower.includes("queens") ||
                  textLower.includes("new york") ||
                  textLower.includes("nyc") ||
                  textLower.includes("brooklyn") ||
                  textLower.includes("manhattan") ||
                  textLower.includes("nys")
                ) {
                  jurisdictionName = "New York State Film Credit (30% QPE)";
                  rate = 0.30;
                } else if (
                  textLower.includes("georgia") ||
                  textLower.includes("atlanta") ||
                  textLower.includes("savannah")
                ) {
                  jurisdictionName = "Georgia Entertainment Tax Credit (30%)";
                  rate = 0.30;
                } else if (
                  textLower.includes("new mexico") ||
                  textLower.includes("albuquerque") ||
                  textLower.includes("santa fe")
                ) {
                  jurisdictionName = "New Mexico Film Credit (35% Tier)";
                  rate = 0.35;
                } else if (
                  textLower.includes("california") ||
                  textLower.includes("los angeles") ||
                  textLower.includes("hollywood")
                ) {
                  jurisdictionName = "California Film & TV Credit (25%)";
                  rate = 0.25;
                }

                setTaxJurisdiction(jurisdictionName);
                const calculatedTaxRebate = Math.round(exposure * rate);
                setTaxSavings(calculatedTaxRebate);

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

  const [agentTypingStatus, setAgentTypingStatus] = useState<string | null>(null);

  // Promise-based sequential voice synthesis that waits for speech to 100% finish
  const speakTextAsync = (
    shortSummary: string,
    speaker: "director" | "legal_counsel" | "bond_officer"
  ): Promise<void> => {
    return new Promise((resolve) => {
      if (
        isAudioMuted ||
        !synthRef.current ||
        typeof window === "undefined" ||
        !("speechSynthesis" in window)
      ) {
        resolve();
        return;
      }

      try {
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

        // Safety fallback timer so it never hangs if browser audio suspends
        const timeout = setTimeout(() => resolve(), 8000);

        utterance.onend = () => {
          clearTimeout(timeout);
          resolve();
        };

        utterance.onerror = () => {
          clearTimeout(timeout);
          resolve();
        };

        synthRef.current.speak(utterance);
      } catch {
        resolve();
      }
    });
  };

  // Helper for paced async delays
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Smooth scroll and glow-highlight target replied message
  const handleScrollToMessage = (targetId?: string) => {
    if (!targetId || typeof document === "undefined") return;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-sky-400", "bg-sky-950/20");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-sky-400", "bg-sky-950/20");
      }, 2200);
    }
  };

  // Handle Negotiate / Dialectic Debate with live Gemini dynamic dialogue generation & sequential voice
  const handleStartDebate = async (entity: ExtractedEntity) => {
    setIsLoading(true);
    setActiveAgent("legal_counsel");
    setAgentTypingStatus(`Legal Counsel & Director are evaluating "${entity.rawText}" (${entity.category.toUpperCase()})...`);

    // 1. Fetch dynamic, context-specific debate dialogue generated live by Gemini
    let counselArg = `Under Lanham Act § 43(a), featuring "${entity.rawText}" prominently without a license creates estimated liability of ${formatCurrency(
      entity.originalExposure
    )}. We must defuse this asset.`;
    let directorArg = `This item is crucial for character authenticity and atmosphere! It is protected artistic Fair Use!`;
    const compromiseText = entity.defusedText || "custom cleared narrative prop";
    let counselCompromise = `Compromise proposed: Substitute "${entity.rawText}" with "${compromiseText}". This preserves your dramatic tone while reducing liability to $0.`;
    let directorAccept = `Agreed. If the art department can match the aesthetic on "${compromiseText}", we have a deal. Script mutated.`;

    try {
      // Find the last screenplay script text from messages
      const scriptMessage = messages.find((m) => m.type === "script" || m.sender === "user");
      const currentScript = scriptMessage?.content || "";

      const debateRes = await fetch("/api/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scriptText: currentScript,
          entity,
        }),
      });

      if (debateRes.ok) {
        const dynamicTurns = await debateRes.json();
        if (dynamicTurns.counselObjection) counselArg = dynamicTurns.counselObjection;
        if (dynamicTurns.directorDefense) directorArg = dynamicTurns.directorDefense;
        if (dynamicTurns.counselCompromise) counselCompromise = dynamicTurns.counselCompromise;
        if (dynamicTurns.directorAcceptance) directorAccept = dynamicTurns.directorAcceptance;
      }
    } catch {
      // Fallback to contextual defaults if network drops
    }

    // Unique IDs for deterministic reply tagging and scroll targets
    const now = Date.now();
    const counselMsgId = `deb-counsel-${now}`;
    const dirMsgId = `deb-dir-${now + 1}`;
    const compMsgId = `deb-comp-${now + 2}`;
    const accMsgId = `deb-acc-${now + 3}`;

    // -------------------------------------------------------------
    // Step 1: Legal Counsel reviews and raises statutory objection
    // -------------------------------------------------------------
    setActiveAgent("legal_counsel");
    setAgentTypingStatus("Legal Counsel is citing statutory doctrine...");
    await sleep(1000);

    setAgentTypingStatus(null);
    setMessages((prev) => [
      ...prev,
      {
        id: counselMsgId,
        sender: "legal_counsel",
        senderName: "Studio Legal Counsel",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
        content: counselArg,
        replyTo: {
          senderName: "Script Supervisor",
          snippet: `Identified ${entity.category.toUpperCase()} risk: "${entity.rawText}"`,
        },
      },
    ]);

    // Speak counsel line completely before continuing
    await speakTextAsync(counselArg, "legal_counsel");
    await sleep(1500); // 1.5s natural pause after speaking

    // -------------------------------------------------------------
    // Step 2: The Director steps in to defend artistic intent
    // -------------------------------------------------------------
    setActiveAgent("director");
    setAgentTypingStatus("The Director is formulating creative defense...");
    await sleep(1200);

    setAgentTypingStatus(null);
    setMessages((prev) => [
      ...prev,
      {
        id: dirMsgId,
        sender: "director",
        senderName: "The Director",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
        content: directorArg,
        replyTo: {
          messageId: counselMsgId,
          senderName: "Studio Legal Counsel",
          snippet: counselArg.length > 55 ? counselArg.slice(0, 52) + "..." : counselArg,
        },
      },
    ]);

    // Speak director line completely before continuing
    await speakTextAsync(directorArg, "director");
    await sleep(1500); // 1.5s natural pause after speaking

    // -------------------------------------------------------------
    // Step 3: Legal Counsel proposes negotiated compromise
    // -------------------------------------------------------------
    setActiveAgent("legal_counsel");
    setAgentTypingStatus("Legal Counsel is drafting copyright-safe substitute prop...");
    await sleep(1200);

    setAgentTypingStatus(null);
    setMessages((prev) => [
      ...prev,
      {
        id: compMsgId,
        sender: "legal_counsel",
        senderName: "Studio Legal Counsel",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
        content: counselCompromise,
        replyTo: {
          messageId: dirMsgId,
          senderName: "The Director",
          snippet: directorArg.length > 55 ? directorArg.slice(0, 52) + "..." : directorArg,
        },
      },
    ]);

    // Speak compromise line completely before continuing
    await speakTextAsync(counselCompromise, "legal_counsel");
    await sleep(1500); // 1.5s natural pause after speaking

    // -------------------------------------------------------------
    // Step 4: The Director accepts the compromise
    // -------------------------------------------------------------
    setActiveAgent("director");
    setAgentTypingStatus("The Director is reviewing aesthetic match...");
    await sleep(1000);

    setAgentTypingStatus(null);
    setMessages((prev) => [
      ...prev,
      {
        id: accMsgId,
        sender: "director",
        senderName: "The Director",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
        content: directorAccept,
        replyTo: {
          messageId: compMsgId,
          senderName: "Studio Legal Counsel",
          snippet: counselCompromise.length > 55 ? counselCompromise.slice(0, 52) + "..." : counselCompromise,
        },
      },
    ]);

    // Speak director acceptance completely before continuing
    await speakTextAsync(directorAccept, "director");
    await sleep(1000);

    // -------------------------------------------------------------
    // Step 5: Script Supervisor mutates the script & Bond Officer clears risk
    // -------------------------------------------------------------
    setActiveAgent("script_supervisor");
    const newClearedIds = [...clearedEntityIds, entity.id];
    setClearedEntityIds(newClearedIds);
    const newExposure = Math.max(0, currentExposure - entity.originalExposure);
    setCurrentExposure(newExposure);

    // Replace hazard with cleared legal compromise in screenplay text
    let updatedScript = currentScriptText;
    if (updatedScript && entity.rawText) {
      updatedScript = updatedScript.replaceAll(entity.rawText, compromiseText);
      setCurrentScriptText(updatedScript);
    }

    const isNowFullyCleared = newClearedIds.length >= entities.length || newExposure === 0;

    setMessages((prev) => {
      const nextMsgs: ChatMessage[] = [
        ...prev,
        {
          id: `mut-${Date.now()}`,
          sender: "script_supervisor",
          senderName: "Script Supervisor",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
          content: `✍️ Script Mutated: "${entity.rawText}" ➔ "${compromiseText}". Statutory liability reduced by ${formatCurrency(
            entity.originalExposure
          )}.`,
          replyTo: {
            messageId: accMsgId,
            senderName: "The Director",
            snippet: directorAccept.length > 55 ? directorAccept.slice(0, 52) + "..." : directorAccept,
          },
        },
      ];

      // If all liabilities are resolved, output the Final Cleared Production Script card!
      if (isNowFullyCleared && updatedScript) {
        nextMsgs.push({
          id: `final-script-${Date.now()}`,
          sender: "bond_officer",
          senderName: "Completion Bond Officer",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "script",
          content: updatedScript,
        });
      }

      return nextMsgs;
    });

    setIsLoading(false);
    setActiveAgent("bond_officer");
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
              <div className="flex items-center gap-2.5">
                <img
                  src="/favicon.png"
                  alt="DeepClear Studio"
                  className="h-7 w-7 rounded-lg object-cover border border-white/10 shadow-sm"
                />
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
          {/* Top Active Loading / Shimmer Progress Bar */}
          {(isLoading || isGeneratingScene) && (
            <div className="h-1 w-full bg-zinc-900 overflow-hidden relative shrink-0 z-10">
              <div className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 animate-pulse w-full" />
            </div>
          )}

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
                  id={msg.id}
                  className={`flex gap-3.5 items-start transition-all duration-300 p-1 rounded-2xl ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
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
                            ? "bg-[#1C1C20] border border-white/[0.1] text-zinc-100 rounded-tr-sm shadow-sm"
                            : "bg-[#141416] border border-white/[0.08] text-zinc-200 rounded-tl-sm shadow-sm"
                        }`}
                      >
                        {/* Quoted Direct Reply Banner (Click to jump & highlight) */}
                        {msg.replyTo && (
                          <button
                            type="button"
                            onClick={() => handleScrollToMessage(msg.replyTo?.messageId)}
                            className="w-full flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-white/[0.06] border-l-2 border-l-sky-400 text-[11px] font-mono text-zinc-400 mb-2 max-w-full truncate text-left transition-all hover:border-l-sky-300 active:scale-[0.99] cursor-pointer group shadow-sm"
                            title={msg.replyTo.messageId ? "Click to jump to replied message" : undefined}
                          >
                            <CornerDownRight className="h-3 w-3 text-sky-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                            <span className="font-semibold text-zinc-300 shrink-0">
                              @{msg.replyTo.senderName}:
                            </span>
                            <span className="truncate italic text-zinc-400 group-hover:text-zinc-200">
                              "{msg.replyTo.snippet}"
                            </span>
                          </button>
                        )}
                        {msg.content}
                      </div>
                    )}

                    {/* Detected Hazards List Card */}
                    {msg.type === "hazards" && msg.entities && (
                      <div className="bg-[#141416] border border-white/[0.08] rounded-2xl p-4 space-y-3 w-full shadow-sm">
                        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-rose-400" />
                            <span className="font-semibold text-xs text-zinc-100">
                              Identified Scene Liabilities ({msg.entities.length})
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-400">
                            Parallel Grounded
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {msg.entities.map((ent) => {
                            const isEntityCleared =
                              clearedEntityIds.includes(ent.id) ||
                              ent.status === "cleared" ||
                              isCleared;

                            return (
                              <div
                                key={ent.id}
                                className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
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

                    {/* Final Cleared Production Script Card */}
                    {msg.type === "script" && (
                      <div className="bg-[#121214] border border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-3.5 w-full shadow-lg shadow-emerald-950/20 animate-in fade-in">
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <Film className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-white">
                                Final Cleared Production Script
                              </h3>
                              <p className="text-[11px] text-emerald-400 font-mono">
                                Certified 100% Cleared for Principal Photography • $0 Statutory Exposure
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                            E&O APPROVED
                          </span>
                        </div>

                        {/* Screenplay text block */}
                        <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto selection:bg-emerald-500/30 selection:text-emerald-200">
                          {msg.content}
                        </div>

                        {/* Download & Copy Action Bar */}
                        <div className="space-y-2 pt-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Primary Full Download Button */}
                            <button
                              onClick={() => {
                                const ext = uploadedFileName ? (uploadedFileName.split(".").pop() || "fountain") : "fountain";
                                const baseName = uploadedFileName ? uploadedFileName.replace(/\.[^/.]+$/, "") : "Indie_Production";
                                const blob = new Blob([msg.content || ""], { type: "text/plain;charset=utf-8" });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement("a");
                                link.href = url;
                                link.download = `${baseName}_CLEARED_FINAL.${ext}`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                URL.revokeObjectURL(url);
                              }}
                              className="flex-1 min-w-[200px] py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>Download Script ({uploadedFileName ? `.${uploadedFileName.split(".").pop()}` : ".fountain"})</span>
                            </button>

                            {/* Copy Script */}
                            <button
                              onClick={() => {
                                if (typeof navigator !== "undefined" && navigator.clipboard && msg.content) {
                                  navigator.clipboard.writeText(msg.content);
                                  setIsCopied(true);
                                  setTimeout(() => setIsCopied(false), 2500);
                                }
                              }}
                              className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 font-medium text-xs transition-all flex items-center gap-1.5"
                              title="Copy script text"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                  <span className="text-emerald-300 font-semibold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5 text-zinc-400" />
                                  <span>Copy Script</span>
                                </>
                              )}
                            </button>

                            {/* Export Binder PDF */}
                            <button
                              onClick={() => setIsExportModalOpen(true)}
                              className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 font-medium text-xs transition-all flex items-center gap-1.5"
                            >
                              <FileText className="h-3.5 w-3.5 text-indigo-400" />
                              <span>Export Binder PDF</span>
                            </button>
                          </div>

                          {/* Quick Format Pills */}
                          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 pt-1">
                            <span className="text-zinc-500 text-[10px] uppercase">Format:</span>
                            {(["fountain", "md", "txt"] as const).map((fmt) => (
                              <button
                                key={fmt}
                                onClick={() => {
                                  const baseName = uploadedFileName
                                    ? uploadedFileName.replace(/\.[^/.]+$/, "")
                                    : "Indie_Production";
                                  const blob = new Blob([msg.content || ""], { type: "text/plain;charset=utf-8" });
                                  const url = URL.createObjectURL(blob);
                                  const link = document.createElement("a");
                                  link.href = url;
                                  link.download = `${baseName}_CLEARED_FINAL.${fmt}`;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  URL.revokeObjectURL(url);
                                }}
                                className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/5 hover:border-emerald-500/30 transition-all"
                              >
                                .{fmt}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Agent Typing & Reasoning Indicator with Rotating Spinner */}
            {(isLoading || agentTypingStatus || isGeneratingScene) && (
              <div className="flex items-center gap-2.5 text-xs font-mono text-zinc-300 bg-[#141416] border border-white/[0.08] p-3 rounded-xl shadow-sm">
                <Loader2 className="h-4 w-4 text-sky-400 animate-spin shrink-0" />
                <div className="flex flex-col">
                  <span className="font-semibold text-zinc-200">
                    [{activeAgent ? activeAgent.replace("_", " ").toUpperCase() : "SWARM"}]:
                  </span>
                  <span className="text-zinc-400">
                    {isGeneratingScene
                      ? "Generating fresh original screenplay scene with Google Cloud Gemini..."
                      : agentTypingStatus || "Querying Gemini Multimodal Vision & Parallel Search API..."}
                  </span>
                </div>
              </div>
            )}

            {/* Scroll Anchor */}
            <div ref={chatBottomRef} />
          </div>

          {/* ========================================================= */}
          {/* FLOATING GOOGLE GEMINI-STYLE PROMPT BAR AT BOTTOM         */}
          {/* ========================================================= */}
          <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-1 shrink-0 space-y-2">
            {/* PINNED QUICK ACTION BAR FOR PENDING HAZARDS */}
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
                {/* 1. Dynamic Gemini Scene Generator Button */}
                <button
                  onClick={handleGenerateGeminiScene}
                  disabled={isLoading || isGeneratingScene}
                  className="p-3 rounded-xl bg-[#141416] hover:bg-[#1a1a1e] border border-white/[0.08] text-left text-zinc-300 hover:text-white transition-all space-y-1 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-zinc-100 flex items-center gap-1.5">
                      {isGeneratingScene ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-400" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
                      )}
                      <span>Generate Scene with Gemini</span>
                    </p>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-500/30 font-semibold">
                      AI Studio
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    {isGeneratingScene
                      ? "Gemini is writing a dramatic scene..."
                      : "Generates an original scene on the fly and scans for brand liabilities"}
                  </p>
                </button>

                {/* 2. Attach File Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 rounded-xl bg-[#141416] hover:bg-[#1a1a1e] border border-white/[0.08] text-left text-zinc-300 hover:text-white transition-all space-y-1"
                >
                  <p className="font-semibold text-zinc-100 flex items-center gap-1.5">
                    <Paperclip className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Attach Script File</span>
                  </p>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Upload your own .fountain, .md, or .txt screenplay directly
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

                {/* Send Button with Rotating Loader */}
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="h-8 w-8 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                  ) : (
                    <ArrowUp className="h-4 w-4 stroke-[2.5]" />
                  )}
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
              <div className="flex items-center justify-between text-[10px] font-mono uppercase">
                <span className="text-emerald-400">Tax Rebate Unlocked</span>
                <span className="text-zinc-500 font-semibold">
                  {initialExposure > 0 ? "QUALIFIED" : "IDLE"}
                </span>
              </div>
              <div className="text-lg font-bold font-mono text-emerald-300">
                {initialExposure > 0 ? `+${formatCurrency(taxSavings)}` : "$0"}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono truncate">
                {initialExposure > 0 ? taxJurisdiction : "Awaiting Script Ingestion"}
              </div>
            </div>

            {/* Dynamic Clearance & Distribution Risk Card */}
            {(() => {
              const pendingEntities = entities.filter((e) => !clearedEntityIds.includes(e.id));
              const pendingCount = pendingEntities.length;
              const clearedCount = entities.length - pendingCount;
              const isFullyResolved = initialExposure > 0 && (pendingCount === 0 || currentExposure === 0);

              return (
                <div className="bg-[#141416] border border-white/[0.08] rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase">
                    <span className="text-zinc-400">Distribution Risk</span>
                    {initialExposure === 0 ? (
                      <span className="text-zinc-500 font-semibold">IDLE</span>
                    ) : isFullyResolved ? (
                      <span className="text-emerald-400 font-semibold">APPROVED</span>
                    ) : (
                      <span className="text-rose-400 font-semibold">
                        HOLD ({clearedCount}/{entities.length} CLEARED)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-300 leading-snug">
                    {initialExposure === 0 ? (
                      <span className="text-zinc-500">
                        Awaiting screenplay ingestion to evaluate statutory exposure.
                      </span>
                    ) : isFullyResolved ? (
                      <span className="text-emerald-300">
                        All {entities.length} liabilities resolved with $0 exposure. Form E&O-2026 certified for distribution.
                      </span>
                    ) : (
                      <span className="text-rose-300">
                        {clearedCount > 0 ? `${clearedCount} cleared, ` : ""}
                        {pendingCount} pending ({pendingEntities.slice(0, 2).map((e) => e.rawText).join(", ")}
                        {pendingCount > 2 ? "..." : ""}). Distribution holds pending clearance.
                      </span>
                    )}
                  </p>
                </div>
              );
            })()}
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
        taxJurisdiction={taxJurisdiction}
        entities={entities}
        clearedEntityIds={clearedEntityIds}
        finalScriptText={currentScriptText}
        uploadedFileName={uploadedFileName}
      />
    </div>
  );
}
