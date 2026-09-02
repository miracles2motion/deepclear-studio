import { NextRequest } from "next/server";
import { generateDialecticTurn } from "@/lib/gemini";
import { DebateTurn } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { scriptText, entity } = await req.json();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (data: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        const turns: DebateTurn[] = [];

        // Turn 1: Legal Counsel opening objection
        const counselTurn1: DebateTurn = {
          id: `turn-1-${Date.now()}`,
          speaker: "legal_counsel",
          speakerName: "Studio Legal Counsel",
          argument: `Under Lanham Act § 43(a), featuring "${entity.rawText}" prominently without a clearance release creates catastrophic statutory trademark exposure estimated at $${entity.originalExposure.toLocaleString()}. We recommend defusing to an original prop.`,
          timestamp: new Date().toLocaleTimeString(),
          tone: "analytical",
        };
        turns.push(counselTurn1);
        sendEvent({
          type: "AGENT_THOUGHT",
          agent: "legal_counsel",
          payload: { turn: counselTurn1 },
        });

        // Turn 2: Director Counter-Argument
        let directorArg = `This prop is vital to the protagonist's overclocked coder identity! It grounds the scene in gritty realism — this falls squarely within Fair Use!`;
        if (process.env.GEMINI_API_KEY) {
          try {
            directorArg = await generateDialecticTurn({
              scriptText,
              hazardDescription: entity.description,
              speaker: "director",
              conversationHistory: [{ speaker: "legal_counsel", text: counselTurn1.argument }],
            });
          } catch {
            // Keep high-fidelity fallback
          }
        }

        const directorTurn: DebateTurn = {
          id: `turn-2-${Date.now()}`,
          speaker: "director",
          speakerName: "The Director",
          argument: directorArg,
          timestamp: new Date().toLocaleTimeString(),
          tone: "passionate",
        };
        turns.push(directorTurn);
        sendEvent({
          type: "AGENT_THOUGHT",
          agent: "director",
          payload: { turn: directorTurn },
        });

        // Turn 3: Negotiated Compromise
        const compromiseText = entity.defusedText || "custom cleared narrative prop";
        const counselTurn2: DebateTurn = {
          id: `turn-3-${Date.now()}`,
          speaker: "legal_counsel",
          speakerName: "Studio Legal Counsel",
          argument: `Compromise proposed: We substitute "${entity.rawText}" with "${compromiseText}". This preserves your visual tone while eliminating 100% of trademark liability.`,
          proposedCompromise: compromiseText,
          timestamp: new Date().toLocaleTimeString(),
          tone: "analytical",
        };
        turns.push(counselTurn2);
        sendEvent({
          type: "AGENT_THOUGHT",
          agent: "legal_counsel",
          payload: { turn: counselTurn2 },
        });

        // Turn 4: Director Accepts & Mutates Script
        const directorAccept: DebateTurn = {
          id: `turn-4-${Date.now()}`,
          speaker: "director",
          speakerName: "The Director",
          argument: `Agreed. If the art department can match the texture on "${compromiseText}", we have a deal. Mutating script now.`,
          timestamp: new Date().toLocaleTimeString(),
          tone: "passionate",
        };
        turns.push(directorAccept);
        sendEvent({
          type: "AGENT_THOUGHT",
          agent: "director",
          payload: { turn: directorAccept },
        });

        // Script Mutation Event
        sendEvent({
          type: "SCRIPT_MUTATION",
          agent: "script_supervisor",
          payload: {
            entityId: entity.id,
            originalText: entity.rawText,
            defusedText: compromiseText,
            exposureReduced: entity.originalExposure,
          },
        });

        // Completion Bond Signoff
        sendEvent({
          type: "RISK_UPDATE",
          agent: "bond_officer",
          payload: {
            entityId: entity.id,
            clearedExposure: 0,
            status: "cleared",
          },
        });

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
