import { NextRequest } from "next/server";
import { analyzeScreenplayWithGemini } from "@/lib/gemini";
import { searchParallelGrounding } from "@/lib/parallel";
import { extractClearancePassport } from "@/lib/passport";
import { ExtractedEntity } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { scriptText, imageBase64, safeHarborAssets } = await req.json();

    if (!scriptText || !scriptText.trim()) {
      return new Response(
        JSON.stringify({ error: "No screenplay text provided for analysis." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { cleanedScript, passport } = extractClearancePassport(scriptText);
    const combinedSafeHarbor = [
      ...(safeHarborAssets || []),
      ...(passport?.assets?.map((a) => ({
        originalText: a.originalText,
        clearedAs: a.clearedAs,
        status: a.status,
      })) || []),
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (data: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        try {
          if (passport) {
            sendEvent({
              type: "AGENT_THOUGHT",
              agent: "bond_officer",
              payload: {
                message: `🛡️ Verified DeepClear Passport detected (${passport.merkleRoot.slice(0, 12)}...). Loading ${passport.assets.length} pre-cleared safe harbor exemptions into E&O ledger.`,
              },
            });
          }

          // 1. Script Supervisor Thought
          sendEvent({
            type: "AGENT_THOUGHT",
            agent: "script_supervisor",
            payload: {
              message: "Ingesting screenplay & visual assets. Calling live Google Cloud Gemini engine...",
            },
          });

          // 2. Direct live Gemini Analysis with Safe Harbor Exemptions
          const geminiResult = await analyzeScreenplayWithGemini(
            cleanedScript,
            imageBase64 ? { data: imageBase64, mimeType: "image/jpeg" } : undefined,
            combinedSafeHarbor
          );

          const entities: ExtractedEntity[] = geminiResult.entities || [];

          // 3. Process each detected entity with live Parallel Search
          for (const entity of entities) {
            sendEvent({
              type: "AGENT_THOUGHT",
              agent: "script_supervisor",
              payload: {
                message: `Identified liability: "${entity.rawText}" (${entity.category.toUpperCase()}) - ${entity.description}`,
                entityId: entity.id,
              },
            });

            sendEvent({
              type: "PARALLEL_QUERY",
              agent: "legal_counsel",
              payload: {
                query: entity.rawText,
                category: entity.category,
                message: `Executing live Parallel Search query for "${entity.rawText}" in ${entity.category.toUpperCase()} registry...`,
              },
            });

            try {
              const citations = await searchParallelGrounding({
                query: entity.rawText,
                category:
                  entity.category === "trademark" ||
                  entity.category === "permit" ||
                  entity.category === "caselaw" ||
                  entity.category === "tax" ||
                  entity.category === "defamation" ||
                  entity.category === "domain"
                    ? entity.category
                    : "trademark",
              });

              entity.citations = citations;

              sendEvent({
                type: "PARALLEL_RESULT",
                agent: "legal_counsel",
                payload: {
                  entityId: entity.id,
                  citations,
                  message: `Retrieved ${citations.length} verified live citations from Parallel Search.`,
                },
              });
            } catch (parallelErr) {
              sendEvent({
                type: "AGENT_THOUGHT",
                agent: "legal_counsel",
                payload: {
                  message: `Parallel Search note: ${(parallelErr as Error).message}`,
                },
              });
            }
          }

          // 4. Bond Officer Risk Calculation & Underwriting Thought
          const totalExposure = entities.reduce((sum, e) => sum + (e.originalExposure || 0), 0);
          sendEvent({
            type: "AGENT_THOUGHT",
            agent: "bond_officer",
            payload: {
              message: `Underwriting completion bond: evaluating ${entities.length} detected liabilities totaling $${totalExposure.toLocaleString()}...`,
            },
          });

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
        } catch (innerErr) {
          sendEvent({
            type: "AGENT_ERROR",
            agent: "bond_officer",
            payload: {
              error: (innerErr as Error).message,
              message: `API Error: ${(innerErr as Error).message}`,
            },
          });
        } finally {
          controller.close();
        }
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
