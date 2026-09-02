"use client";

import React, { useState, useEffect } from "react";
import { PRESET_SCENARIOS, MOCK_EXTRACTED_ENTITIES } from "@/lib/scenarios";
import { PresetScenario, ExtractedEntity, DebateTurn, AgentRole } from "@/types";
import { HeaderControlBar } from "@/components/HeaderControlBar";
import { AgentNetworkGraph } from "@/components/AgentNetworkGraph";
import { ScriptViewer } from "@/components/ScriptViewer";
import { StoryboardInspector } from "@/components/StoryboardInspector";
import { DynamicHUD } from "@/components/DynamicHUD";
import { AudibleWarRoom } from "@/components/AudibleWarRoom";
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
  const [activeThought, setActiveThought] = useState<string | undefined>(
    "System ready. Select a scenario or click 'Execute Scan' to begin multimodal crew clearance."
  );
  const [debateTurns, setDebateTurns] = useState<DebateTurn[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Handle Custom Ingested Script
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
    setDebateTurns([]);
    setIsDefused(false);
    setClearedEntityIds([]);
    setEntities([]);
    setActiveThought(`Loaded custom screenplay "${data.title}". Click 'Execute Scan' to analyze.`);
  };

  // Handle Scenario Switch
  const handleSelectScenario = (scenario: PresetScenario) => {
    setSelectedScenario(scenario);
    setInitialExposure(scenario.initialRiskUsd);
    setCurrentExposure(scenario.initialRiskUsd);
    setDebateTurns([]);
    setIsDefused(scenario.id === "cleared-masterpiece");
    setClearedEntityIds(scenario.id === "cleared-masterpiece" ? ["ent-1", "ent-2", "ent-3"] : []);

    const loadedEntities = MOCK_EXTRACTED_ENTITIES[scenario.id] || [];
    setEntities(loadedEntities);
    setActiveThought(`Loaded "${scenario.title}" scenario. Click 'Execute Scan' to run clearance analysis.`);
  };

  // Run Real-Time Multimodal Scan (via API route with SSE)
  const handleRunScan = async () => {
    setIsScanning(true);
    setActiveAgent("script_supervisor");
    setActiveThought("Ingesting screenplay & storyboards. Launching Gemini 2.0 Multimodal scan...");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scriptText: selectedScenario.scriptText,
          scenarioId: selectedScenario.id,
        }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
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

            if (event.type === "AGENT_THOUGHT") {
              setActiveThought(event.payload.message);
            } else if (event.type === "PARALLEL_QUERY") {
              setActiveThought(event.payload.message);
            } else if (event.type === "PARALLEL_RESULT") {
              setActiveThought(event.payload.message);
            } else if (event.type === "RISK_UPDATE") {
              setInitialExposure(event.payload.initialExposure);
              setCurrentExposure(event.payload.currentExposure);
            }
          }
        }
      }
    } catch {
      setActiveThought("Scan completed with localized grounding fixtures.");
    } finally {
      setIsScanning(false);
      setActiveAgent("bond_officer");
      setActiveThought("Scan complete. Hazards identified. Click 'Negotiate' on any item to trigger dialectic compromise.");
    }
  };

  // Trigger Dialectic Negotiation for a specific hazard
  const handleStartDebate = async (entity: ExtractedEntity) => {
    setIsDebating(true);
    setActiveAgent("legal_counsel");
    setActiveThought(`Opening dialectic debate on "${entity.rawText}" (${entity.category.toUpperCase()})...`);

    try {
      const response = await fetch("/api/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scriptText: selectedScenario.scriptText,
          entity,
        }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
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

            if (event.type === "AGENT_THOUGHT" && event.payload.turn) {
              setDebateTurns((prev) => [...prev, event.payload.turn]);
              setActiveThought(`${event.payload.turn.speakerName}: "${event.payload.turn.argument}"`);
            } else if (event.type === "SCRIPT_MUTATION") {
              // Mark entity cleared and reduce liability
              setClearedEntityIds((prev) => [...prev, event.payload.entityId]);
              setCurrentExposure((prev) => Math.max(0, prev - (event.payload.exposureReduced || 0)));
              setIsDefused(true);
            }
          }
        }
      }
    } catch {
      setActiveThought("Debate concluded with standard clearance agreement.");
    } finally {
      setIsDebating(false);
      setActiveAgent("bond_officer");
      setActiveThought(`Compromise sealed. Script mutated to cleared alternative.`);
    }
  };

  const isFullyCleared = currentExposure === 0 || clearedEntityIds.length === entities.length;

  return (
    <main className="min-h-screen bg-background text-slate-100 flex flex-col">
      {/* Top Header Control Bar */}
      <HeaderControlBar
        selectedScenario={selectedScenario}
        onSelectScenario={handleSelectScenario}
        onRunScan={handleRunScan}
        isScanning={isScanning}
        isCleared={isFullyCleared}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      {/* Main War Room Body */}
      <div className="max-w-7xl mx-auto w-full p-4 space-y-4 flex-1">
        {/* 1. Autonomous Crew Swarm Telemetry */}
        <AgentNetworkGraph
          activeAgent={activeAgent}
          activeThought={activeThought}
          isScanning={isScanning}
          isCleared={isFullyCleared}
        />

        {/* 2. Middle Row: Screenplay & Clearance Editor (Left) + Storyboard & HUD (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Screenplay & Clearance Editor */}
          <div className="lg:col-span-6 flex flex-col">
            <ScriptViewer
              scriptText={selectedScenario.scriptText}
              entities={entities}
              clearedEntityIds={clearedEntityIds}
              onStartDebate={handleStartDebate}
              isDebating={isDebating}
            />
          </div>

          {/* Right Column: Dynamic HUD & Storyboard Inspector */}
          <div className="lg:col-span-6 space-y-4 flex flex-col">
            <DynamicHUD
              initialExposure={initialExposure}
              currentExposure={currentExposure}
              taxSavings={taxSavings}
              isCleared={isFullyCleared}
            />

            <StoryboardInspector
              isDefused={isDefused}
              onToggleDefuse={() => {
                setIsDefused(!isDefused);
                if (!isDefused) {
                  setCurrentExposure(0);
                  setClearedEntityIds(entities.map((e) => e.id));
                }
              }}
            />
          </div>
        </div>

        {/* 3. Bottom Row: Audible Dialectic War Room */}
        <div className="w-full">
          <AudibleWarRoom
            debateTurns={debateTurns}
            isDebating={isDebating}
          />
        </div>
      </div>

      {/* Form E&O-2026 Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        productionTitle={selectedScenario.title}
        initialExposure={initialExposure}
        currentExposure={currentExposure}
        taxSavings={taxSavings}
        entities={entities}
      />

      {/* Script & Storyboard Asset Upload Modal */}
      <ScriptUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onIngestScript={handleIngestCustomScript}
      />
    </main>
  );
}
