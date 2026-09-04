import { NextRequest, NextResponse } from "next/server";
import { generateDynamicDebateTurns } from "@/lib/gemini";
import {
  verifySubstitutePropWithParallel,
  verifyLicensingFrameworkWithParallel,
} from "@/lib/parallel";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { scriptText, entity, isLicenseRoute } = await req.json();

    if (!entity) {
      return NextResponse.json({ error: "No entity provided for debate." }, { status: 400 });
    }

    // 1. Generate authentic 5-agent dialectic debate turns via Gemini self-healing cascade
    const debateTurns = await generateDynamicDebateTurns({
      scriptText: scriptText || "",
      entity,
      isLicenseRoute: !!isLicenseRoute,
    });

    const targetProp =
      debateTurns.proposedReplacement ||
      entity.defusedText ||
      entity.rawText ||
      "Narrative Prop";

    // 2. Execute LIVE Parallel Search verification (Centerpiece for Parallel Track)
    const parallelVerification = isLicenseRoute
      ? await verifyLicensingFrameworkWithParallel(entity.rawText, entity.category)
      : await verifySubstitutePropWithParallel(targetProp, entity.category);

    return NextResponse.json({
      ...debateTurns,
      parallelVerification,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
