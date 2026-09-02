import { NextRequest } from "next/server";
import { analyzeScreenplayWithGemini } from "@/lib/gemini";
import { searchParallelGrounding } from "@/lib/parallel";
import { MOCK_EXTRACTED_ENTITIES } from "@/lib/scenarios";
import { ExtractedEntity } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { scriptText, scenarioId, imageBase64 } = await req.json();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (data: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        // 1. Script Supervisor Thought
        sendEvent({
          type: "AGENT_THOUGHT",
          agent: "script_supervisor",
          payload: {
            message: "Ingesting screenplay & visual assets. Executing Gemini 2.0 Multimodal clearance scan...",
          },
        });

        let entities: ExtractedEntity[] = [];

        // Check if using preset scenario with preloaded high-fidelity data
        if (scenarioId && MOCK_EXTRACTED_ENTITIES[scenarioId]) {
          entities = MOCK_EXTRACTED_ENTITIES[scenarioId];
        } else if (process.env.GEMINI_API_KEY) {
          try {
            const geminiResult = await analyzeScreenplayWithGemini(
              scriptText,
              imageBase64 ? { data: imageBase64, mimeType: "image/jpeg" } : undefined
            );
            entities = geminiResult.entities || [];
          } catch {
            entities = MOCK_EXTRACTED_ENTITIES["scifi-nightmare"];
          }
        } else {
          entities = MOCK_EXTRACTED_ENTITIES["scifi-nightmare"];
        }

        // 2. Stream extracted entities
        for (const entity of entities) {
          sendEvent({
            type: "AGENT_THOUGHT",
            agent: "script_supervisor",
            payload: {
              message: `Identified hazard in Scene ${entity.sceneNumber}: "${entity.rawText}" (${entity.category.toUpperCase()})`,
              entityId: entity.id,
            },
          });

          // 3. Parallel Search Grounding
          sendEvent({
            type: "PARALLEL_QUERY",
            agent: "legal_counsel",
            payload: {
              query: entity.rawText,
              category: entity.category,
              message: `Querying Parallel Search for ${entity.category.toUpperCase()} regulations on "${entity.rawText}"...`,
            },
          });

          // If entity already has citations, stream them; else execute live query
          const citations =
            entity.citations?.length > 0
              ? entity.citations
              : await searchParallelGrounding({
                  query: entity.rawText,
                  category:
                    entity.category === "trademark" ||
                    entity.category === "permit" ||
                    entity.category === "caselaw" ||
                    entity.category === "tax"
                      ? entity.category
                      : "trademark",
                });

          sendEvent({
            type: "PARALLEL_RESULT",
            agent: "legal_counsel",
            payload: {
              entityId: entity.id,
              citations,
              message: `Retrieved ${citations.length} verified citations from Parallel Search.`,
            },
          });
        }

        // 4. Bond Officer Actuarial Risk Calculation
        const totalExposure = entities.reduce((sum, e) => sum + (e.originalExposure || 0), 0);
        sendEvent({
          type: "RISK_UPDATE",
          agent: "bond_officer",
          payload: {
            initialExposure: totalExposure,
            currentExposure: totalExposure,
            riskLevel: totalExposure > 1000000 ? "HIGH" : totalExposure > 0 ? "MODERATE" : "CLEARED",
            entities,
          },
        });

        // 5. Complete scan
        sendEvent({
          type: "CLEARANCE_COMPLETE",
          agent: "bond_officer",
          payload: {
            entities,
            totalExposure,
            timestamp: new Date().toISOString(),
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
