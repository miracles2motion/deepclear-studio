"use client";

import React, { useState, useEffect, useRef } from "react";
import { PRESET_SCENARIOS, MOCK_EXTRACTED_ENTITIES } from "@/lib/scenarios";
import { PresetScenario, ExtractedEntity, DebateTurn, AgentRole } from "@/types";
import { LinearHeader } from "@/components/LinearHeader";
import { ConversationalFeed, FeedMessage } from "@/components/ConversationalFeed";
import { PromptBar } from "@/components/PromptBar";
import { InspectorSidebar } from "@/components/InspectorSidebar";
import { ExportModal } from "@/components/ExportModal";
import { ScriptUploadModal } from "@/components/ScriptUploadModal";

export default function DeepClearStudioPage() {
  const [selectedScenario, setSelectedScenario] = useState<PresetScenario>(PRESET_SCENARIOS[0]);
  const [entities, setEntities] = useState<ExtractedEntity[]>(MOCK_EXTRACTED_ENTITIES["scifi-nightmare"]);
  const [clearedEntityIds, setClearedEntityIds] = useState<string[]>([]);
  const [initialExposure, setInitialExposure] = useState<number>(2840000);
  const [currentExposure, setCurrentExposure] = useState<number>(2840000);
  const [taxSavings, setTaxSavings] = useState<number>(42000);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isDebating, setIsDebating] = useState<boolean>(false);
  const [isDefused, setIsDefused] = useState<boolean>(false);
  const [activeAgent, setActiveAgent] = useState<AgentRole | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Conversational message feed state
  const [messages, setMessages] = useState<FeedMessage[]>([
    {
      id: "msg-welcome",
      sender: "system",
      senderName: "DeepClear Swarm",
      timestamp: "Just now",
      type: "text",
      content:
        "Welcome to DeepClear Studio. I am your autonomous crew swarm for film clearance, trademark defusal, and Form E&O-2026 underwriting.\n\nSelect a preset scenario above or use the prompt bar below to paste a script, upload .md/.fountain files, or command the agents.",
    },
    {
      id: "msg-init-script",
      sender: "script_supervisor",
      senderName: "Script Supervisor",
      timestamp: "Just now",
      type: "script_card",
      content: PRESET_SCENARIOS[0].scriptText,
    },
    {
      id: "msg-init-hazards",
      sender: "legal_counsel",
      senderName: "Studio Legal Counsel",
      timestamp: "Just now",
      type: "hazard_list",
    },
    {
      id: "msg-init-storyboard",
      sender: "script_supervisor",
      senderName: "Script Supervisor",
      timestamp: "Just now",
      type: "storyboard_card",
    },
  ]);

  // Play audio speech
  const speakText = (text: string, speaker: "director" | "legal_counsel" | "bond_officer") => {
    if (isAudioMuted || !synthRef.current) return;
    try {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (speaker === "director") {
        utterance.pitch = 1.15;
        utterance.rate = 1.05;
      } else {
        utterance.pitch = 0.9;
        utterance.rate = 1.0;
      }
      synthRef.current.speak(utterance);
    } catch {
      // Ignore audio synthesis errors
    }
  };

  // Scenario Switch
  const handleSelectScenario = (scenario: PresetScenario) => {
    setSelectedScenario(scenario);
    setInitialExposure(scenario.initialRiskUsd);
    setCurrentExposure(scenario.initialRiskUsd);
    setIsDefused(scenario.id === "cleared-masterpiece");
    setClearedEntityIds(scenario.id === "cleared-masterpiece" ? ["ent-1", "ent-2", "ent-3"] : []);

    const loadedEntities = MOCK_EXTRACTED_ENTITIES[scenario.id] || [];
    setEntities(loadedEntities);

    setMessages([
      {
        id: `msg-load-${Date.now()}`,
        sender: "system",
        senderName: "DeepClear Swarm",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
        content: `Loaded preset "${scenario.title}" (${scenario.genre}). Statutory Exposure: $${scenario.initialRiskUsd.toLocaleString()}.`,
      },
      {
        id: `msg-script-${Date.now()}`,
        sender: "script_supervisor",
        senderName: "Script Supervisor",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "script_card",
        content: scenario.scriptText,
      },
      {
        id: `msg-hazards-${Date.now()}`,
        sender: "legal_counsel",
        senderName: "Studio Legal Counsel",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "hazard_list",
      },
      {
        id: `msg-storyboard-${Date.now()}`,
        sender: "script_supervisor",
        senderName: "Script Supervisor",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "storyboard_card",
      },
    ]);
  };

  // Custom Ingested Script
  const handleIngestCustomScript = (data: {
    title: string;
    scriptText: string;
    imageBase64?: string;
  }) => {
    const customScenario: PresetScenario = {
      id: `custom-${Date.now()}`,
      title: data.title,
      genre: "Custom Production Script",
      description: "User uploaded screenplay for autonomous multimodal clearance.",
      initialRiskUsd: 1500000,
      scriptText: data.scriptText,
    };

    setSelectedScenario(customScenario);
    setInitialExposure(1500000);
    setCurrentExposure(1500000);
    setIsDefused(false);
    setClearedEntityIds([]);
    setEntities([]);

    setMessages([
      {
        id: `msg-custom-${Date.now()}`,
        sender: "user",
        senderName: "You",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
        content: `Uploaded screenplay: "${data.title}"`,
      },
      {
        id: `msg-script-${Date.now()}`,
        sender: "script_supervisor",
        senderName: "Script Supervisor",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "script_card",
        content: data.scriptText,
      },
      {
        id: `msg-agent-ready-${Date.now()}`,
        sender: "bond_officer",
        senderName: "Completion Bond Officer",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
        content: `Screenplay "${data.title}" received. Click "Execute Swarm Scan" in the prompt bar to perform full multimodal clearance and Parallel search grounding.`,
      },
    ]);
  };

  // Run Full Multimodal Scan
  const handleRunScan = async () => {
    setIsScanning(true);
    setActiveAgent("script_supervisor");

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-scan-start-${Date.now()}`,
        sender: "script_supervisor",
        senderName: "Script Supervisor",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
        content: "Executing Gemini 2.0 Multimodal clearance scan & Parallel 4D Search grounding...",
      },
    ]);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scriptText: selectedScenario.scriptText,
          scenarioId: selectedScenario.id,
        }),
      });

      if (response.ok) {
        const loadedEntities = MOCK_EXTRACTED_ENTITIES[selectedScenario.id] || MOCK_EXTRACTED_ENTITIES["scifi-nightmare"];
        setEntities(loadedEntities);

        setMessages((prev) => [
          ...prev,
          {
            id: `msg-scan-results-${Date.now()}`,
            sender: "legal_counsel",
            senderName: "Studio Legal Counsel",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "hazard_list",
          },
          {
            id: `msg-bond-risk-${Date.now()}`,
            sender: "bond_officer",
            senderName: "Completion Bond Officer",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "text",
            content: `Underwriting analysis complete. Identified ${loadedEntities.length} statutory liabilities totaling $${initialExposure.toLocaleString()}. Click "Negotiate" or type a command to begin dialectic compromise.`,
          },
        ]);
      }
    } catch {
      // Fallback completed
    } finally {
      setIsScanning(false);
      setActiveAgent("bond_officer");
    }
  };

  // Dialectic Negotiation for a specific hazard
  const handleStartDebate = async (entity: ExtractedEntity) => {
    setIsDebating(true);
    setActiveAgent("legal_counsel");

    const counselArg = `Under Lanham Act § 43(a), featuring "${entity.rawText}" prominently creates unapproved commercial endorsement exposure estimated at $${entity.originalExposure.toLocaleString()}. We must defuse this prop.`;
    const directorArg = `This prop is vital to the protagonist's identity! It grounds the scene in gritty realism — this is protected artistic Fair Use!`;
    const compromiseText = entity.defusedText || "custom cleared narrative prop";
    const counselCompromise = `Compromise: Substitute "${entity.rawText}" with "${compromiseText}". This preserves visual tone while eliminating 100% of trademark liability.`;
    const directorAccept = `Agreed. If the art department can match the texture on "${compromiseText}", we have a deal. Script mutated.`;

    // 1. Legal Counsel Opening
    speakText(counselArg, "legal_counsel");
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-deb-counsel-${Date.now()}`,
        sender: "legal_counsel",
        senderName: "Studio Legal Counsel",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
        content: counselArg,
      },
    ]);

    // 2. Director Response
    setTimeout(() => {
      setActiveAgent("director");
      speakText(directorArg, "director");
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-deb-dir-${Date.now()}`,
          sender: "director",
          senderName: "The Director",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
          content: directorArg,
        },
      ]);
    }, 1200);

    // 3. Negotiated Compromise
    setTimeout(() => {
      setActiveAgent("legal_counsel");
      speakText(counselCompromise, "legal_counsel");
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-deb-comp-${Date.now()}`,
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
      speakText(directorAccept, "director");
      setClearedEntityIds((prev) => [...prev, entity.id]);
      setCurrentExposure((prev) => Math.max(0, prev - entity.originalExposure));
      setIsDefused(true);

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-deb-acc-${Date.now()}`,
          sender: "director",
          senderName: "The Director",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
          content: directorAccept,
        },
        {
          id: `msg-mutated-${Date.now()}`,
          sender: "script_supervisor",
          senderName: "Script Supervisor",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
          content: `✍️ Script Mutated: "${entity.rawText}" ➔ "${compromiseText}". Liability reduced by $${entity.originalExposure.toLocaleString()}.`,
        },
      ]);

      setIsDebating(false);
      setActiveAgent("bond_officer");
    }, 3800);
  };

  // Conversational Prompt Bar Handler
  const handleUserPrompt = (text: string) => {
    // 1. Add User Message
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-user-${Date.now()}`,
        sender: "user",
        senderName: "You",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
        content: text,
      },
    ]);

    const lower = text.toLowerCase();

    if (lower.includes("scan") || lower.includes("clear") || lower.includes("analyze")) {
      handleRunScan();
    } else if (lower.includes("rolex") || lower.includes("trademark") || lower.includes("negotiate") || lower.includes("debate")) {
      const targetEntity = entities.find((e) => e.category === "trademark") || entities[0];
      if (targetEntity) handleStartDebate(targetEntity);
    } else if (lower.includes("tax") || lower.includes("rebate") || lower.includes("georgia")) {
      setActiveAgent("location_manager");
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-tax-${Date.now()}`,
          sender: "location_manager",
          senderName: "Location Manager",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
          content:
            "Location Tax Arbitrage Analysis:\n• Georgia: 30% base + entertainment promotion uplift unlocked (+$42,000 savings).\n• New Mexico: 25% qualified expenditure tier.\n• California: 0% tier (exhausted). Recommendation: Relocate bridge scene to Georgia private stage.",
        },
      ]);
    } else if (lower.includes("binder") || lower.includes("pdf") || lower.includes("export") || lower.includes("insurance")) {
      setIsExportModalOpen(true);
    } else {
      // General agent intelligence response
      setActiveAgent("legal_counsel");
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-ai-${Date.now()}`,
          sender: "legal_counsel",
          senderName: "Studio Legal Counsel",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
          content: `Understood. I am cross-referencing Parallel Search legal databases and Completion Bond parameters for "${text}". Ready to execute dialectic negotiation or defuse props whenever commanded.`,
        },
      ]);
    }
  };

  const isFullyCleared = currentExposure === 0 || clearedEntityIds.length === entities.length;

  return (
    <div className="min-h-screen bg-[#0C0C0E] text-zinc-100 flex flex-col antialiased selection:bg-blue-600/30 selection:text-blue-200">
      {/* 1. Linear/Apple Minimalist Header */}
      <LinearHeader
        selectedScenario={selectedScenario}
        onSelectScenario={handleSelectScenario}
        onRunScan={handleRunScan}
        isScanning={isScanning}
        isCleared={isFullyCleared}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* 2. Main Body: Center Feed + Right Inspector Sidebar */}
      <div className="flex-1 flex overflow-hidden max-h-[calc(100vh-53px)]">
        {/* Center Workspace (Conversational Feed + Floating Prompt Bar) */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Scrollable Conversation Stream */}
          <ConversationalFeed
            messages={messages}
            entities={entities}
            clearedEntityIds={clearedEntityIds}
            onStartDebate={handleStartDebate}
            isDebating={isDebating}
            isDefused={isDefused}
            onToggleDefuse={() => {
              setIsDefused(!isDefused);
              if (!isDefused) {
                setCurrentExposure(0);
                setClearedEntityIds(entities.map((e) => e.id));
              }
            }}
            isAudioMuted={isAudioMuted}
            onToggleAudio={() => setIsAudioMuted(!isAudioMuted)}
          />

          {/* Floating Bottom Prompt Bar */}
          <PromptBar
            onSendMessage={handleUserPrompt}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onRunScan={handleRunScan}
            isScanning={isScanning}
            isCleared={isFullyCleared}
          />
        </div>

        {/* Right Collapsible Inspector Sidebar */}
        {isSidebarOpen && (
          <InspectorSidebar
            initialExposure={initialExposure}
            currentExposure={currentExposure}
            taxSavings={taxSavings}
            isCleared={isFullyCleared}
            activeAgent={activeAgent}
            isAudioMuted={isAudioMuted}
            onToggleAudio={() => setIsAudioMuted(!isAudioMuted)}
          />
        )}
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        productionTitle={selectedScenario.title}
        initialExposure={initialExposure}
        currentExposure={currentExposure}
        taxSavings={taxSavings}
        entities={entities}
      />

      <ScriptUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onIngestScript={handleIngestCustomScript}
      />
    </div>
  );
}
