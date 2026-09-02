import { GoogleGenerativeAI } from "@google/generative-ai";

export const GEMINI_MODEL_NAME = "gemini-3.6-flash";

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY is not set or invalid. Please configure your API key in .env.local or Vercel Environment Variables."
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

export async function analyzeScreenplayWithGemini(
  scriptText: string,
  imagePartBase64?: { data: string; mimeType: string }
) {
  const genAI = getGeminiClient();

  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const prompt = `You are the Lead Script Supervisor and Legal Clearance Inspector for DeepClear Studio.
Analyze the following screenplay excerpt and visual scene elements for legal liabilities:
1. Trademark violations (commercial brand marks, logos, watches, cars, drinks, electronics)
2. Copyright risks (unlicensed sync music, songs, lyrics, copyrighted artwork/tattoos)
3. Municipal filming permits & safety hazards (unpermitted drones over traffic, high-speed bridge/highway stunts, explosions, SAG-AFTRA overtime)
4. State tax incentive eligibility (e.g. Georgia 30%, New Mexico 25%)

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

  const result = await model.generateContent(contents);
  const text = result.response.text();

  return JSON.parse(text);
}

export async function generateDialecticTurn(params: {
  scriptText: string;
  hazardDescription: string;
  speaker: "director" | "legal_counsel";
  conversationHistory: Array<{ speaker: string; text: string }>;
}) {
  const genAI = getGeminiClient();

  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL_NAME,
    generationConfig: {
      temperature: params.speaker === "director" ? 0.7 : 0.2,
    },
  });

  const personaPrompt =
    params.speaker === "director"
      ? `You are "The Director" (Passionate, artistic, defending dramatic authenticity and Fair Use).
Keep your response concise, punchy, and cinematic (1-2 sentences).`
      : `You are "Studio Legal Counsel" (Pragmatic entertainment clearance attorney, citing statutory liability).
Keep your response concise, professional, and proposing a creative compromise (1-2 sentences).`;

  const prompt = `${personaPrompt}

Script context:
${params.scriptText}

Hazard under debate:
${params.hazardDescription}

Dialogue history:
${params.conversationHistory.map((h) => `${h.speaker.toUpperCase()}: "${h.text}"`).join("\n")}

Respond as ${params.speaker.toUpperCase()}:`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
