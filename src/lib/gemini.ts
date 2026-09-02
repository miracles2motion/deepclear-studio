import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

// Initialize Google Generative AI client
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function analyzeScreenplayWithGemini(
  scriptText: string,
  imagePartBase64?: { data: string; mimeType: string }
) {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not configured in .env.local");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const prompt = `You are the Lead Script Supervisor and Multimodal Clearance Inspector for DeepClear Studio.
Analyze the following screenplay excerpt and visual scene elements for legal, trademark, copyright, municipal permit, and insurance risks.

For each risk found, return a structured JSON object with this schema:
{
  "entities": [
    {
      "id": string,
      "sceneNumber": number,
      "rawText": string,
      "category": "trademark" | "copyright" | "permit" | "caselaw" | "tax" | "safety",
      "description": string,
      "status": "hazard",
      "originalExposure": number (estimated potential statutory liability in USD, e.g. 150000),
      "clearedExposure": 0,
      "defusedText": string (creative, copyright-safe alternative),
      "searchKeywords": string[] (3-4 keywords to search in USPTO, Case Law, or Municipal Permitting databases)
    }
  ],
  "overallRiskSummary": string,
  "totalInitialLiabilityUsd": number
}

Screenplay to analyze:
${scriptText}`;

  const contents: Array<string | { inlineData: { data: string; mimeType: string } }> = [prompt];
  if (imagePartBase64) {
    contents.push({
      inlineData: imagePartBase64,
    });
  }

  const result = await model.generateContent(contents);
  const response = result.response;
  const text = response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      entities: [],
      overallRiskSummary: "Parsing fallback",
      totalInitialLiabilityUsd: 0,
    };
  }
}

export async function generateDialecticTurn(params: {
  scriptText: string;
  hazardDescription: string;
  speaker: "director" | "legal_counsel";
  conversationHistory: Array<{ speaker: string; text: string }>;
}) {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not configured in .env.local");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: params.speaker === "director" ? 0.7 : 0.2,
    },
  });

  const personaPrompt =
    params.speaker === "director"
      ? `You are "The Director" (Persona: Passionate, visual, protective of artistic vision and character authenticity).
You defend the creative choices in the script against overly cautious legal objections, citing Fair Use or dramatic necessity.
Keep your response concise, punchy, and cinematic (1-2 sentences maximum).`
      : `You are "Studio Legal Counsel" (Persona: Pragmatic, statutory-focused, risk-averse entertainment attorney).
You explain Lanham Act / Copyright / Permit liabilities clearly and offer a copyright-safe production compromise that preserves the director's visual intent without triggering lawsuits.
Keep your response concise, professional, and solutions-oriented (1-2 sentences maximum).`;

  const prompt = `${personaPrompt}

Script context:
${params.scriptText}

Specific hazard under debate:
${params.hazardDescription}

Dialogue so far:
${params.conversationHistory.map((h) => `${h.speaker.toUpperCase()}: "${h.text}"`).join("\n")}

Respond in character as ${params.speaker.toUpperCase()}:`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
