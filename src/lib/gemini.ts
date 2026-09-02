import { GoogleGenerativeAI } from "@google/generative-ai";
import { ExtractedEntity } from "@/types";

// Priority list of Gemini model candidates for automatic self-healing fallback
const MODEL_CANDIDATES = [
  "gemini-3.6-flash",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-2.0-flash",
  "gemini-pro",
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
 * Self-healing model invoker: Tries the cached working model first,
 * then cascades through all available Gemini models if Google updates or deprecates an alias.
 */
async function generateContentWithCascade(
  genAI: GoogleGenerativeAI,
  contents: Parameters<ReturnType<GoogleGenerativeAI["getGenerativeModel"]>["generateContent"]>[0],
  config?: { responseMimeType?: string; temperature?: number }
) {
  const modelsToTry = cachedWorkingModel
    ? [cachedWorkingModel, ...MODEL_CANDIDATES.filter((m) => m !== cachedWorkingModel)]
    : MODEL_CANDIDATES;

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

  throw lastError || new Error("All Gemini model candidates failed to respond.");
}

export async function analyzeScreenplayWithGemini(
  scriptText: string,
  imagePartBase64?: { data: string; mimeType: string }
) {
  const genAI = getGeminiClient();

  const prompt = `You are the Lead Script Supervisor and Legal Clearance Inspector for DeepClear Studio.
Analyze the following screenplay excerpt and visual scene elements for legal liabilities:
1. Trademark violations (commercial brand marks, logos, watches, cars, drinks, electronics)
2. Copyright risks (unlicensed sync music, songs, lyrics, copyrighted artwork/tattoos)
3. Municipal filming permits & safety hazards (unpermitted drones over traffic, high-speed bridge/highway stunts, explosions, SAG-AFTRA overtime)
4. State tax incentive eligibility (e.g. Georgia 30%, New York 30%, New Mexico 25%)

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

  const defaultPrompt = `You are an acclaimed Hollywood screenwriter.
Generate a high-stakes, cinematic screenplay scene excerpt (15-20 lines in standard Fountain screenplay format) featuring vivid dramatic tension.
Naturally include 2 to 3 real-world production elements that require legal clearance (such as a recognizable luxury brand prop, a commercial background song cue, or a complex municipal stunt/location like a bridge or aerial drone).

Output ONLY the formatted screenplay scene text in Fountain format without any markdown code fences, greetings, or extra explanations.`;

  const result = await generateContentWithCascade(genAI, customPrompt || defaultPrompt, {
    temperature: 0.8,
  });

  return result.response.text().trim();
}

/**
 * Generates dynamic, context-specific, cinematic debate turns for a specific hazard
 * ensuring no two negotiations ever sound repetitive or templated.
 */
export async function generateDynamicDebateTurns(params: {
  scriptText: string;
  entity: ExtractedEntity;
}) {
  const genAI = getGeminiClient();

  const prompt = `You are the lead dialogue supervisor for a Hollywood film clearance war room.
Generate a dynamic, authentic, high-stakes 4-turn dialectic debate between Legal Counsel and The Director over a detected scene hazard.

Scene Context:
${params.scriptText}

Specific Liability Under Debate:
- Asset: "${params.entity.rawText}" (${params.entity.category.toUpperCase()})
- Legal Issue: ${params.entity.description}
- Proposed Substitution: "${params.entity.defusedText || "custom cleared prop"}"
- Statutory Financial Exposure: $${params.entity.originalExposure.toLocaleString()}

Requirements for the 4 turns:
1. counselObjection: Legal Counsel raises a sharp, statutory legal objection specific to this exact asset and category (Lanham Act for trademarks, 17 U.S.C. 504 sync licensing for music, municipal MOME safety for locations/stunts). (1-2 sentences)
2. directorDefense: The Director passionately defends why this exact asset or location is essential for character motivation, tone, or visual realism. (1-2 sentences)
3. counselCompromise: Legal Counsel proposes substituting "${params.entity.rawText}" with "${params.entity.defusedText || "a cleared alternative"}", explaining how it protects the film's E&O policy while retaining dramatic tension. (1-2 sentences)
4. directorAcceptance: The Director accepts the compromise and issues a practical instruction to the art, sound, or location department. (1 sentence)

Return ONLY a JSON object with this schema:
{
  "counselObjection": string,
  "directorDefense": string,
  "counselCompromise": string,
  "directorAcceptance": string
}`;

  const result = await generateContentWithCascade(genAI, prompt, {
    responseMimeType: "application/json",
    temperature: 0.7,
  });

  return JSON.parse(result.response.text());
}
