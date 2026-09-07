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
  | "licensed"
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
  trademarkClass?: string;
  registrationStatus?: string;
  extractedStatute?: string;
  searchId?: string;
  searchLatencyMs?: number;
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
  taxJurisdiction?: string;
  entities: ExtractedEntity[];
  clearedEntityIds?: string[];
  licensedEntityIds?: string[];
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

export interface ClearedAssetRecord {
  originalText: string;
  clearedAs?: string;
  category: string;
  status: "cleared" | "licensed";
  licenseRef?: string;
  parallelVerified: boolean;
}

export interface ClearancePassportData {
  version: string;
  merkleRoot: string;
  productionTitle: string;
  policyStatus: "APPROVED" | "PENDING_REMEDY";
  bondPolicyId: string;
  timestamp: string;
  assets: ClearedAssetRecord[];
}

export interface DeepClearSessionData {
  version: "1.0";
  type: "deepclear_session";
  exportedAt: string;
  productionTitle: string;
  uploadedFileName: string | null;
  currentScriptText: string;
  initialExposure: number;
  currentExposure: number;
  taxSavings: number;
  taxJurisdiction: string;
  entities: ExtractedEntity[];
  clearedEntityIds: string[];
  licensedEntityIds: string[];
  messages: Array<{
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
  }>;
  passportData?: ClearancePassportData | null;
}

export type ClearanceMode = "auto" | "manual";

export interface AutoClearanceStep {
  hazardId: string;
  entityName: string;
  decision: "licensed" | "mutated";
  reasoning: string;
  parallelVerified: boolean;
  exposureSaved: number;
  disputed?: boolean;
}
