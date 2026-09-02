import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, GEMINI_MODEL_NAME } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL_NAME,
      generationConfig: {
        temperature: 0.8,
      },
    });

    const prompt = `You are an acclaimed Hollywood screenwriter.
Generate a high-stakes, cinematic screenplay scene excerpt (15-20 lines in standard Fountain screenplay format) featuring vivid dramatic tension.
Naturally include 2 to 3 real-world production elements that require legal clearance (such as a recognizable luxury brand prop, a commercial background song cue, or a complex municipal stunt/location like a bridge or aerial drone).

Output ONLY the formatted screenplay scene text in Fountain format without any markdown code fences, greetings, or extra explanations.`;

    const result = await model.generateContent(prompt);
    const sceneText = result.response.text().trim();

    return NextResponse.json({ sceneText });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
