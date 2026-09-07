import { NextRequest, NextResponse } from "next/server";
import { AgentRole } from "@/types";
import { generateConversationalAgentResponse } from "@/lib/gemini";
import { searchParallelGrounding } from "@/lib/parallel";

export const runtime = "nodejs";

const AGENT_NAMES: Record<AgentRole, string> = {
  legal_counsel: "Studio Legal Counsel",
  director: "The Director",
  location_manager: "Location & Art Department Manager",
  script_supervisor: "Script Supervisor",
  bond_officer: "Completion Bond Officer",
};

/**
 * Intelligent Agent Intent Resolver:
 * Infers target agent if not explicitly tagged by user.
 */
function inferTargetAgent(message: string): AgentRole {
  const lower = message.toLowerCase();

  // Location / Art Manager (permits, filming locations, state tax credits, rebates)
  if (/@?location_manager\b|\blocation manager\b|\blocation\b|\bpermit\b|\bpermits\b|\bforsyth\b|\bpark\b|\bstreet\b|\bsoundstage\b|\bgeorgia\b|\bsavannah\b|\brebate\b|\btax credit\b/i.test(lower)) {
    return "location_manager";
  }
  // Legal Counsel (trademark, copyright, lawsuits, Lanham Act, fair use, licensing)
  if (/@?legal_counsel\b|\blegal advisor\b|\blegal counsel\b|\battorney\b|\blawyer\b|\bcopyright\b|\btrademark\b|\blanham\b|\binfringement\b|\bpatent\b|\bfair use\b|\blicense\b|\blicensing\b/i.test(lower)) {
    return "legal_counsel";
  }
  // Director (creative vision, aesthetics, cinematography, casting, actors, drama)
  if (/@?director\b|\baesthetic\b|\bcinematography\b|\bgrit\b|\bcharacter motivation\b|\bvision\b|\bdrama\b|\bactor\b|\bactors\b/i.test(lower)) {
    return "director";
  }
  // Script Supervisor (sluglines, formatting, fountain, continuity, scenes)
  if (/@?script_supervisor\b|\bscript supervisor\b|\bslugline\b|\bparenthetical\b|\bdialogue\b|\bformatting\b|\bfountain\b|\bcontinuity\b/i.test(lower)) {
    return "script_supervisor";
  }
  // Completion Bond Officer (underwriting, E&O, insurance, exposure, bond)
  if (/@?bond_officer\b|\bbond officer\b|\bunderwriter\b|\bcompletion bond\b|\be&o\b|\binsurance\b|\bstatutory exposure\b|\bliability\b/i.test(lower)) {
    return "bond_officer";
  }

  // Default to Legal Counsel for general studio questions
  return "legal_counsel";
}

export async function POST(req: NextRequest) {
  try {
    const { message, targetAgent: requestedAgent, scriptContext, entitiesContext } = await req.json();

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const cleanMessage = message.replace(/^@\w+\s*/, "").trim();
    const resolvedAgent: AgentRole = requestedAgent || inferTargetAgent(message);

    // 1. Live Parallel Web Systems Grounding
    // Ground user questions against live statutory, trademark, or entertainment clearance resources
    let groundingSnippet = "";
    let parallelCitations: any[] = [];

    try {
      const category =
        resolvedAgent === "location_manager" ? "permit" :
        resolvedAgent === "legal_counsel" ? "caselaw" :
        "trademark";

      const citations = await searchParallelGrounding({
        query: cleanMessage.slice(0, 150),
        category,
        maxResults: 2,
      });

      if (citations && citations.length > 0) {
        parallelCitations = citations;
        groundingSnippet = citations
          .map((c) => `[${c.title}] (${c.sourceUrl}): ${c.snippet}`)
          .join("\n\n");
      }
    } catch (parallelErr) {
      console.warn("Parallel search grounding warning (using fallback):", parallelErr);
    }

    // 2. Generate agent response in authentic Hollywood persona
    const responseData = await generateConversationalAgentResponse({
      userMessage: cleanMessage,
      targetAgent: resolvedAgent,
      scriptContext,
      entitiesContext,
      parallelGroundingSnippet: groundingSnippet,
    });

    return NextResponse.json({
      sender: resolvedAgent,
      senderName: AGENT_NAMES[resolvedAgent] || "DeepClear Studio Agent",
      content: responseData.reply,
      citations: parallelCitations,
      consultedAgent: responseData.consultedAgent
        ? {
            role: responseData.consultedAgent,
            name: AGENT_NAMES[responseData.consultedAgent] || responseData.consultedAgent,
            comment: responseData.consultedAgentComment,
          }
        : null,
      suggestedActions: responseData.suggestedActions || [],
    });
  } catch (error) {
    console.error("Agent chat route error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to generate agent response." },
      { status: 500 }
    );
  }
}
