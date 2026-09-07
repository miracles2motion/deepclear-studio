import { ExtractedEntity } from "@/types";

export interface SwarmDecision {
  route: "license" | "mutate";
  confidence: number;
  statutoryReasoning: string;
  recommendedPropSubstitute?: string;
}

// In-memory deduplication cache for Parallel Search queries to conserve credits & rate limits
const parallelCache = new Map<string, { timestamp: number; data: unknown }>();

/**
 * Intelligent Swarm Decision Matrix:
 * Autonomously evaluates an entity's category, narrative prominence,
 * and statutory risk to determine whether to License or Mutate.
 */
export function determineHazardResolutionRoute(entity: ExtractedEntity): SwarmDecision {
  const textLower = entity.rawText.toLowerCase();
  const descLower = entity.description.toLowerCase();
  const category = entity.category;

  // 1. Municipal Locations, Historic Sites & Permits -> AUTO-LICENSE (Route: license)
  // Reason: Locations tied to state tax rebates (e.g. Georgia 30%, California 25%) are vital
  // and routinely cleared via city filming permits ($500-$2,500) rather than changing real-world locations.
  const isLocationOrPermit =
    category === "permit" ||
    textLower.includes("park") ||
    textLower.includes("fountain") ||
    textLower.includes("street") ||
    textLower.includes("lab") ||
    textLower.includes("district") ||
    textLower.includes("bridge") ||
    textLower.includes("historic") ||
    descLower.includes("permit") ||
    descLower.includes("ordinance") ||
    descLower.includes("municipal") ||
    descLower.includes("faa");

  if (isLocationOrPermit) {
    return {
      route: "license",
      confidence: 0.96,
      statutoryReasoning:
        "Municipal location / filming permit. Standard local filming permit or location release protects the production's statutory eligibility for state film tax credits without disrupting screenplay continuity.",
    };
  }

  // 2. Commercial Consumer Trademarks -> AUTO-NEGOTIATE / MUTATE (Route: mutate)
  // Reason: Brands rarely grant zero-cost product placement without extensive sponsorship deals.
  // Lanham Act § 43(a) risk is defused by creative substitution verified on USPTO by Parallel Search.
  if (category === "trademark") {
    return {
      route: "mutate",
      confidence: 0.94,
      statutoryReasoning:
        "Incidental commercial trademark. Standard studio clearance practice avoids Lanham Act § 43(a) trademark dilution claims by substituting with a genre-authentic fictional prop verified conflict-free on USPTO registries.",
    };
  }

  // 3. Commercial Music Sync & Copyrights -> AUTO-NEGOTIATE / MUTATE (Route: mutate)
  // Reason: Master and publishing sync fees for famous commercial recordings often exceed $100k-$500k.
  // Unless pre-licensed, defusing into an original atmospheric score cue eliminates 17 U.S.C. § 504 statutory damages.
  if (category === "copyright") {
    return {
      route: "mutate",
      confidence: 0.92,
      statutoryReasoning:
        "Copyrighted sound recording or artwork. Master synchronization licensing exceeds standard production bond reserves. Defusing into an authentic original musical cue or public domain motif preserves dramatic tension with $0 exposure.",
    };
  }

  // 4. Living Person Defamation & Right of Publicity -> AUTO-NEGOTIATE / MUTATE (Route: mutate)
  // Reason: Fictitious characters colliding with living professionals risk California Civil Code § 3344 and defamation claims.
  // Defusing into a phonetically distinct, conflict-free fictional surname protects the production with $0 liability.
  if (category === "defamation") {
    return {
      route: "mutate",
      confidence: 0.95,
      statutoryReasoning:
        "Living person collision under Cal. Civ. Code § 3344. Standard studio practice replaces full name with a verified fictitious surname grounded against public registries.",
    };
  }

  // 5. Fictional Phone Numbers & Web Domains -> AUTO-NEGOTIATE / MUTATE (Route: mutate)
  // Reason: Phone numbers outside the 555-0100 through 555-0199 safe reserve harass real citizens.
  // Unregistered or third-party web domains risk cybersquatting and adult redirects.
  if (category === "domain") {
    return {
      route: "mutate",
      confidence: 0.97,
      statutoryReasoning:
        "Telecom / WHOIS domain conflict. Defusing into the official Hollywood 555 fictitious reserve or a studio-cleared URL eliminates harassment and cybersquatting liability.",
    };
  }

  // Default fallback
  return {
    route: "mutate",
    confidence: 0.88,
    statutoryReasoning:
      "Statutory liability defused via creative narrative compromise, verified clean by Parallel Search.",
  };
}

/**
 * Checks in-memory cache before executing Parallel Search queries.
 * Prevents redundant API calls and rate-limiting when the same brand or location appears across scenes.
 */
export function getCachedParallelQuery<T>(key: string): T | null {
  const normalized = key.trim().toLowerCase();
  const cached = parallelCache.get(normalized);
  if (!cached) return null;

  // Cache valid for 30 minutes in active session
  if (Date.now() - cached.timestamp > 30 * 60 * 1000) {
    parallelCache.delete(normalized);
    return null;
  }

  return cached.data as T;
}

export function setCachedParallelQuery(key: string, data: unknown): void {
  const normalized = key.trim().toLowerCase();
  parallelCache.set(normalized, { timestamp: Date.now(), data });
}

/**
 * Pacing delay between sequential autonomous turns (1500ms).
 * Keeps human-readable cadence in the UI and prevents Google/Parallel 429 RPM spikes.
 */
export function delayPace(ms: number = 1500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
