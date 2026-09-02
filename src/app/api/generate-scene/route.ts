import { NextRequest, NextResponse } from "next/server";
import { generateScreenplayScene } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const sceneText = await generateScreenplayScene();
    return NextResponse.json({ sceneText });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
