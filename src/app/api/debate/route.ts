import { NextRequest, NextResponse } from "next/server";
import { generateDynamicDebateTurns } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { scriptText, entity } = await req.json();

    if (!entity) {
      return NextResponse.json({ error: "No entity provided for debate." }, { status: 400 });
    }

    const debateTurns = await generateDynamicDebateTurns({
      scriptText: scriptText || "",
      entity,
    });

    return NextResponse.json(debateTurns);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
