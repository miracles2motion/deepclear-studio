import { GoogleGenerativeAI } from "@google/generative-ai";
import { ExtractedEntity } from "@/types";

// Priority list of verified active Gemini models with automatic cascade fallback
const MODEL_CANDIDATES = [
  "gemini-flash-latest",
  "gemini-3.5-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-pro-preview",
  "gemini-pro-latest",
];

let cachedWorkingModel: string | null = null;

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY is not set or invalid. Please configure your API key in .env.local or Vercel Environment Variables."
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Dynamically queries Google's active model registry if all local candidates fail.
 * Guarantees zero downtime even if Google deprecates or releases new models in the future.
 */
async function discoverLiveGoogleModels(apiKey: string): Promise<string[]> {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models || [])
      .filter((m: { supportedGenerationMethods?: string[] }) =>
        m.supportedGenerationMethods?.includes("generateContent")
      )
      .map((m: { name: string }) => m.name.replace("models/", ""))
      .filter((name: string) => name.includes("flash") || name.includes("pro"));
  } catch {
    return [];
  }
}

/**
 * Self-healing model invoker: Tries the cached working model first,
 * cascades through all priority models, and dynamically discovers live models
 * directly from Google if endpoints change in the future.
 */
async function generateContentWithCascade(
  genAI: GoogleGenerativeAI,
  contents: Parameters<ReturnType<GoogleGenerativeAI["getGenerativeModel"]>["generateContent"]>[0],
  config?: { responseMimeType?: string; temperature?: number }
) {
  const modelsToTry = cachedWorkingModel
    ? [cachedWorkingModel, ...MODEL_CANDIDATES.filter((m) => m !== cachedWorkingModel)]
    : [...MODEL_CANDIDATES];

  let lastError: Error | null = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: config,
      });

      const result = await model.generateContent(contents);
      cachedWorkingModel = modelName; // Cache working model for future fast calls
      return result;
    } catch (err) {
      lastError = err as Error;
      // If 404 / model deprecated or unavailable, smoothly continue to next candidate
      continue;
    }
  }

  // Future-Proof Dynamic Fallback: Query Google's live ModelService
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    const liveDiscoveredModels = await discoverLiveGoogleModels(apiKey);
    for (const dynamicModel of liveDiscoveredModels) {
      if (modelsToTry.includes(dynamicModel)) continue;
      try {
        const model = genAI.getGenerativeModel({
          model: dynamicModel,
          generationConfig: config,
        });
        const result = await model.generateContent(contents);
        cachedWorkingModel = dynamicModel;
        return result;
      } catch (err) {
        lastError = err as Error;
        continue;
      }
    }
  }

  throw lastError || new Error("All Gemini model candidates failed to respond.");
}

export async function analyzeScreenplayWithGemini(
  scriptText: string,
  imagePartBase64?: { data: string; mimeType: string },
  safeHarborAssets?: Array<{ originalText: string; clearedAs?: string; status: string }>
) {
  const genAI = getGeminiClient();

  const safeHarborSection =
    safeHarborAssets && safeHarborAssets.length > 0
      ? `\nIMMUTABLE SAFE-HARBOR CLEARANCE REGISTRY (DO NOT FLAG AS HAZARDS):
The following production assets have ALREADY completed full dialectic debate, received verified Parallel Search registry clearance, or hold valid commercial/sync licenses:
${safeHarborAssets
  .map(
    (a, i) =>
      `${i + 1}. "${a.clearedAs || a.originalText}" (Original: "${a.originalText}", Status: ${a.status.toUpperCase()})`
  )
  .join("\n")}

STRICT RULE: DO NOT flag any of the above pre-cleared or pre-licensed assets as legal liabilities or hazards. Omit them completely from the entities list. If an asset is already cleared, statutory exposure is $0.\n`
      : "";

  const prompt = `You are the Lead Script Supervisor and Legal Clearance Inspector for DeepClear Studio.
Analyze the following screenplay excerpt and visual scene elements for legal liabilities:
1. Trademark violations (commercial brand marks, logos, watches, cars, drinks, electronics)
2. Copyright risks (unlicensed sync music, songs, lyrics, copyrighted artwork/tattoos)
3. Municipal filming permits & safety hazards (unpermitted drones over traffic, high-speed bridge/highway stunts, explosions, SAG-AFTRA overtime)
4. State tax incentive eligibility (e.g. Georgia 30%, New York 30%, New Mexico 25%)
${safeHarborSection}
For each risk found, return a JSON object with this exact schema:
{
  "entities": [
    {
      "id": "ent-1",
      "sceneNumber": 1,
      "rawText": "exact string from script",
      "category": "trademark" | "copyright" | "permit" | "caselaw" | "tax",
      "description": "precise explanation of statutory liability",
      "status": "hazard",
      "originalExposure": 350000 (realistic statutory liability exposure in USD),
      "clearedExposure": 0,
      "defusedText": "fictionalized, copyright-safe production alternative",
      "searchKeywords": ["keyword1", "keyword2"]
    }
  ],
  "overallRiskSummary": "Summary of production liabilities",
  "totalInitialLiabilityUsd": 350000
}

Screenplay Text to Analyze:
${scriptText}`;

  const contents: Array<string | { inlineData: { data: string; mimeType: string } }> = [prompt];
  if (imagePartBase64) {
    contents.push({
      inlineData: imagePartBase64,
    });
  }

  const result = await generateContentWithCascade(genAI, contents, {
    responseMimeType: "application/json",
    temperature: 0.2,
  });

  const text = result.response.text();
  return JSON.parse(text);
}

export async function generateScreenplayScene(customPrompt?: string) {
  const genAI = getGeminiClient();

  // Diverse real-world cinematic premises, locations, and varied legal clearance elements
  const sceneThemes = [
    {
      genre: "Silicon Valley Cyber Heist",
      setting: "INT. PALO ALTO BIOTECH LAB - NIGHT",
      location: "San Francisco / Silicon Valley, California",
      hazards: "Apple Vision Pro headset, a high-end Tesla Cybertruck, or a Radiohead soundtrack cue",
    },
    {
      genre: "Savannah Southern Gothic Noir",
      setting: "EXT. FORSYTH PARK - SAVANNAH, GEORGIA - DUSK",
      location: "Savannah, Georgia (Historic District MOME permit zone)",
      hazards: "a bottle of Macallan 25 Scotch, a vintage 1968 Ford Mustang Fastback, or an Otis Redding vinyl playing",
    },
    {
      genre: "Tokyo Underground Espionage",
      setting: "EXT. SHIBUYA CROSSING - RAIN - NIGHT",
      location: "Tokyo, Japan (Public street crowd filming permit)",
      hazards: "a neon billboard of Sony PlayStation, a customized Ducati Panigale, or a Daft Punk electronic beat",
    },
    {
      genre: "Albuquerque Desert Drug Smuggling Standoff",
      setting: "EXT. ROUTE 66 DESERT JUNKYARD - NEW MEXICO - DAY",
      location: "Bernalillo County, New Mexico (Film Tax Incentive Zone)",
      hazards: "a DJI Matrice Thermal Surveillance Drone, a Patagonia tactical jacket, or a classic Johnny Cash song playing",
    },
    {
      genre: "Chicago Art Gallery Heist",
      setting: "INT. RIVER NORTH CONTEMPORARY GALLERY - CHICAGO - NIGHT",
      location: "Chicago, Illinois (Public museum & architectural copyright zone)",
      hazards: "a prominent Jeff Koons balloon sculpture on display, a Leica M11 Rangefinder camera, or a Miles Davis jazz cue",
    },
    {
      genre: "Miami High-Speed Harbor Pursuit",
      setting: "EXT. BISCAYNE BAY - SPEEDBOAT COCKPIT - MIDNIGHT",
      location: "Miami-Dade, Florida (Coast Guard maritime filming permit)",
      hazards: "a Midnight Express 430 powerboat with triple Mercury Racing engines, a Hermès travel duffel, or a Bad Bunny reggaeton track",
    },
    {
      genre: "London Financial District Thriller",
      setting: "INT. CANARY WHARF PENTHOUSE - LONDON - SUNRISE",
      location: "Greater London, UK (City of London filming & airspace clearance)",
      hazards: "a Bloomberg Terminal display with proprietary financial feeds, a pair of bespoke Savile Row suits, or a David Bowie background track",
    },
  ];

  const selectedTheme = sceneThemes[Math.floor(Math.random() * sceneThemes.length)];

  const defaultPrompt = `You are an Oscar-nominated Hollywood screenwriter.
Write an original, gripping, hyper-realistic cinematic scene excerpt (16 to 22 lines in standard professional Fountain screenplay format).

Genre & Mood: ${selectedTheme.genre}
Setting Header: ${selectedTheme.setting}
Geographic Location: ${selectedTheme.location}

Rules for Real-World Clearance Authenticity:
1. Ground the scene in natural, razor-sharp cinematic dialogue and visceral visual action.
2. Naturally integrate 2 to 3 distinct real-world production elements that an E&O insurance underwriter would inspect (e.g., ${selectedTheme.hazards}, copyrighted brand props, municipal municipal stunt permits, fine art, or commercial music cues).
3. Do NOT repeat the same cliché brands (avoid relying on Rolex or Queensboro bridge unless specifically requested). Be creative, versatile, and modern.
4. Output ONLY the raw Fountain screenplay text (no markdown triple backticks, no introductions, no title cards).`;

  const result = await generateContentWithCascade(genAI, customPrompt || defaultPrompt, {
    temperature: 0.9,
  });

  return result.response.text().trim().replace(/^```(?:fountain|markdown)?\n?/, "").replace(/\n?```$/, "");
}

/**
 * Generates dynamic, context-specific, cinematic 5-agent debate turns for a specific hazard
 * ensuring authentic dialectic exchange with active participation from Legal Counsel,
 * The Director, Location / Art Manager, Script Supervisor, and Completion Bond Officer.
 */
export async function generateDynamicDebateTurns(params: {
  scriptText: string;
  entity: ExtractedEntity;
  isLicenseRoute?: boolean;
}) {
  const genAI = getGeminiClient();
  const isLicense = !!params.isLicenseRoute;

  const prompt = `You are the lead dialogue supervisor for a Hollywood film clearance war room.
Generate a dynamic, authentic, high-stakes dialectic debate between ALL 5 crew agents over a detected scene hazard.

Scene Context:
${params.scriptText}

Specific Liability Under Debate:
- Asset: "${params.entity.rawText}" (${params.entity.category.toUpperCase()})
- Legal Issue: ${params.entity.description}
- Proposed Substitution: "${params.entity.defusedText || "custom cleared prop"}"
- Statutory Financial Exposure: $${params.entity.originalExposure.toLocaleString()}
- Resolution Route: ${isLicense ? "PRODUCTION HOLDS ACTIVE COMMERCIAL/SYNC LICENSE OR PERMIT" : "CREATIVE COMPROMISE & NARRATIVE PROP SUBSTITUTION"}

Crew Roles to Include:
1. counselObjection: Legal Counsel raises a sharp statutory legal objection (Lanham Act § 43(a), 17 U.S.C. § 504 sync license, MOME permit). (1-2 sentences)
2. directorDefense: The Director defends why this element is essential for artistic character motivation, visual realism, or Fair Use under Rogers v. Grimaldi. (1-2 sentences)
3. locationManagerProposal: Location / Art Department Manager steps in:
   - ${isLicense ? "Affirms production license documentation or municipal filming permit filed with local film commission." : `Proposes an aesthetically matched narrative substitute "${params.entity.defusedText || "bespoke prop"}" or relocating to a 30% tax-rebate qualified soundstage.`} (1-2 sentences)
4. parallelSearchQuery: Targeted query formulated for live Parallel Search registry verification to check for zero commercial conflicts. (e.g. "${params.entity.defusedText || params.entity.rawText} trademark clearance USPTO")
5. directorAcceptance: The Director accepts the solution and confirms aesthetic alignment with the crew. (1 sentence)
6. bondOfficerSignOff: Completion Bond Officer evaluates Parallel Search grounding, underwrites the policy rider, and issues official E&O Safe Harbor clearance. (1 sentence)

Return ONLY a JSON object with this schema:
{
  "counselObjection": string,
  "directorDefense": string,
  "locationManagerProposal": string,
  "parallelSearchQuery": string,
  "directorAcceptance": string,
  "bondOfficerSignOff": string,
  "proposedReplacement": string
}`;

  const result = await generateContentWithCascade(genAI, prompt, {
    responseMimeType: "application/json",
    temperature: 0.7,
  });

  return JSON.parse(result.response.text());
}
