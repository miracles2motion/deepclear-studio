export type AgentRole =
  | "script_supervisor"
  | "legal_counsel"
  | "location_manager"
  | "director"
  | "bond_officer";

export type HazardCategory =
  | "trademark"
  | "copyright"
  | "permit"
  | "caselaw"
  | "tax"
  | "sag_overtime"
  | "safety";

export type ClearanceStatus =
  | "hazard"
  | "under_review"
  | "debating"
  | "cleared"
  | "mitigated"
  | "rejected";

export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
  label: string;
  confidence: number;
}

export interface ParallelGroundingCitation {
  id: string;
  category: "trademark" | "permit" | "caselaw" | "tax";
  title: string;
  sourceUrl: string;
  snippet: string;
  publishedDate?: string;
  verified: boolean;
}

export interface ExtractedEntity {
  id: string;
  sceneNumber: number;
  rawText: string;
  category: HazardCategory;
  description: string;
  status: ClearanceStatus;
  originalExposure: number;
  clearedExposure: number;
  boundingBox?: BoundingBox;
  defusedText?: string;
  defusedImageUrl?: string;
  originalImageUrl?: string;
  citations: ParallelGroundingCitation[];
}

export interface DebateTurn {
  id: string;
  speaker: "director" | "legal_counsel" | "bond_officer";
  speakerName: string;
  argument: string;
  timestamp: string;
  proposedCompromise?: string;
  tone: "passionate" | "analytical" | "authoritative";
}

export interface TaxIncentive {
  stateOrCountry: string;
  rebatePercent: number;
  estimatedSavings: number;
  requirements: string;
}

export interface ClearanceReport {
  id: string;
  productionTitle: string;
  totalScenes: number;
  initialExposureUsd: number;
  finalExposureUsd: number;
  potentialTaxRebateUsd: number;
  entities: ExtractedEntity[];
  debateTurns: DebateTurn[];
  merkleRootHash: string;
  onChainTxHash?: string;
  generatedAt: string;
  eandOPolicyStatus: "APPROVED" | "PENDING_REMEDY" | "DECLINED";
}

export interface PresetScenario {
  id: string;
  title: string;
  genre: string;
  description: string;
  initialRiskUsd: number;
  scriptText: string;
  storyboardImageUrl?: string;
  defusedImageUrl?: string;
}

export type SSETargetType =
  | "AGENT_THOUGHT"
  | "PARALLEL_QUERY"
  | "PARALLEL_RESULT"
  | "SCRIPT_MUTATION"
  | "RISK_UPDATE"
  | "AUDIO_TRIGGER"
  | "CLEARANCE_COMPLETE";

export interface SSEMessage {
  type: SSETargetType;
  agent: AgentRole;
  payload: Record<string, unknown>;
}
